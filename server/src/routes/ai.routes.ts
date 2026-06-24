import { Router, Request, Response } from 'express';
import { SchemaType } from '@google/generative-ai';
import { gemini } from '../lib/gemini';
import prisma from '../lib/prisma';

const router = Router();

// ─────────────────────────────────────────────────────────
// Helper: get all salons as compact context string
// ─────────────────────────────────────────────────────────
async function getSalonContext(): Promise<string> {
  const salons = await prisma.salon.findMany({ include: { services: true, stylists: true } });
  return salons
    .map(
      (s) =>
        `- ${s.name} | ${s.area} | ${s.priceRange} | Rating: ${s.rating} | Services: ${s.services.map((sv) => `${sv.name}(₹${sv.price})`).join(', ')} | Stylists: ${s.stylists.map(st => `${st.name} (${st.specialization})`).join(', ')}`
    )
    .join('\n');
}

// ─────────────────────────────────────────────────────────
// Helper: parse JSON safely from Gemini response text
// (Gemini sometimes wraps JSON in ```json ... ``` fences)
// ─────────────────────────────────────────────────────────
function extractJSON(text: string): string {
  const fenced = text.match(/```(?:json)?\s*([\s\S]*?)```/);
  if (fenced) return fenced[1].trim();
  return text.trim();
}

// Forward Gemini 429 rate-limit errors back to the client
function handleAIError(err: unknown, label: string, res: import('express').Response) {
  console.error(`${label} error:`, err);
  const status = (err as any)?.status;
  if (status === 429) {
    res.status(429).json({ error: 'Rate limit reached. Please try again in a moment.' });
  } else {
    res.status(500).json({ error: 'AI service error' });
  }
}

// ─────────────────────────────────────────────────────────
// POST /api/ai/concierge — Beauty Concierge Chat
// ─────────────────────────────────────────────────────────
router.post('/concierge', async (req: Request, res: Response) => {
  try {
    const { messages } = req.body; // [{role, content}]
    const salonContext = await getSalonContext();

    const systemInstruction = `You are Glow, a luxury AI beauty concierge for Glowly — a premium beauty salon discovery platform in Chennai, Tamil Nadu.

Your role:
- Help users find the perfect salon based on their needs, budget, occasion, and location in Chennai
- Give warm, personalized, expert beauty advice
- Recommend specific salons from our database with reasons
- Suggest services and price guidance

Available salons in Chennai:
${salonContext}

Guidelines:
- Always recommend real salons from the list above
- Format salon recommendations as: **Salon Name** (Area) — ₹price range — "Why it's perfect for you"
- Be conversational, warm, and expert
- If asked about something outside beauty/salons, gently redirect
- Prices are in Indian Rupees (₹)`;

    // Build full prompt: system instruction + chat history + user message
    const historyText = messages
      .slice(0, -1)
      .map((m: { role: string; content: string }) => `${m.role === 'user' ? 'User' : 'Glow'}: ${m.content}`)
      .join('\n');

    const lastMessage = messages[messages.length - 1];

    const fullPrompt = `${systemInstruction}\n\n${historyText ? 'Conversation so far:\n' + historyText + '\n\n' : ''}User: ${lastMessage.content}\nGlow:`;

    const result = await gemini.generateContent(fullPrompt);
    const reply = result.response.text().trim();

    res.json({ reply });
  } catch (err) {
    handleAIError(err, 'Concierge', res);
  }
});

// ─────────────────────────────────────────────────────────
// POST /api/ai/salon-match — Personalized Salon Match
// ─────────────────────────────────────────────────────────
router.post('/salon-match', async (req: Request, res: Response) => {
  try {
    const { occasion, hairType, skinType, budget, area } = req.body;
    
    // Pre-filter salons to reduce context size and speed up Gemini response times
    let salons = await prisma.salon.findMany({
      where: area && area !== 'Anywhere' ? {
        OR: [
          { area: { contains: area } },
          { featured: true }
        ]
      } : {},
      include: { services: true, stylists: true },
      orderBy: { rating: 'desc' },
      take: 8
    });

    // Fallback in case area filter returns too few salons
    if (salons.length < 3) {
      salons = await prisma.salon.findMany({
        include: { services: true, stylists: true },
        orderBy: { rating: 'desc' },
        take: 8
      });
    }

    const salonContext = salons
      .map(
        (s) =>
          `ID:${s.id} | ${s.name} | ${s.area} | ${s.priceRange} | Rating:${s.rating} | Services: ${s.services.map((sv) => sv.name).join(', ')} | Stylists: ${s.stylists.map(st => `${st.id}:${st.name}(${st.specialization})`).join(', ')}`
      )
      .join('\n');

    const prompt = `A user is looking for the perfect salon. Here is their profile:
- Occasion: ${occasion}
- Hair Type: ${hairType}
- Skin Type: ${skinType}
- Budget: ${budget}
- Preferred Area in Chennai: ${area}

Available salons and stylists:
${salonContext}

Based on this profile, return the top 3 matching salons as a JSON array of objects.`;

    const result = await gemini.generateContent({
      contents: [{ role: 'user', parts: [{ text: prompt }] }],
      generationConfig: {
        responseMimeType: 'application/json',
        responseSchema: {
          type: SchemaType.ARRAY,
          items: {
            type: SchemaType.OBJECT,
            properties: {
              salonId: { type: SchemaType.INTEGER },
              matchScore: { type: SchemaType.INTEGER },
              reason: { type: SchemaType.STRING },
              recommendedServices: {
                type: SchemaType.ARRAY,
                items: { type: SchemaType.STRING }
              }
            },
            required: ['salonId', 'matchScore', 'reason', 'recommendedServices']
          }
        }
      }
    });

    const text = result.response.text();
    const matches = JSON.parse(text);

    const results = await Promise.all(
      matches.map(async (m: { salonId: number; matchScore: number; reason: string; recommendedServices: string[] }) => {
        const salon = await prisma.salon.findUnique({
          where: { id: m.salonId },
          include: { services: true, stylists: true },
        });
        return { salon, matchScore: m.matchScore, reason: m.reason, recommendedServices: m.recommendedServices };
      })
    );

    res.json({ results });
  } catch (err) {
    handleAIError(err, 'Salon match', res);
  }
});

// Fallback review summary generator when Gemini API quota is exceeded or fails
function generateFallbackSummary(reviews: any[]) {
  const validRatings = reviews.map(r => r.rating).filter(Boolean);
  const score = validRatings.length > 0 
    ? validRatings.reduce((sum, r) => sum + r, 0) / validRatings.length 
    : 4.0;
  
  const pros: string[] = [];
  const cons: string[] = [];
  
  const allCommentsText = reviews
    .map(r => r.comment || '')
    .join(' ')
    .toLowerCase();
  
  const checkKeywords = (keywords: string[]) => {
    return keywords.some(k => allCommentsText.includes(k));
  };
  
  // Pros extraction
  if (checkKeywords(['hair', 'cut', 'style', 'stylist'])) pros.push('Skilled stylists and professional hair care');
  if (checkKeywords(['makeup', 'bridal', 'wedding', 'bride'])) pros.push('Exceptional makeup artistry and bridal services');
  if (checkKeywords(['clean', 'hygiene', 'neat', 'spotless'])) pros.push('Highly clean, hygienic, and safe environment');
  if (checkKeywords(['friendly', 'staff', 'warm', 'hospitable', 'polite'])) pros.push('Courteous, welcoming, and supportive staff');
  if (checkKeywords(['value', 'reasonable', 'affordable', 'worth'])) pros.push('Excellent value for services offered');
  if (checkKeywords(['ambience', 'atmosphere', 'vibe', 'decor'])) pros.push('Premium, relaxing, and aesthetic ambience');
  
  // Cons extraction
  if (checkKeywords(['wait', 'delay', 'time', 'queue'])) cons.push('Slight waiting times during peak hours');
  if (checkKeywords(['expensive', 'pricey', 'cost'])) cons.push('Premium pricing for select treatments');
  if (checkKeywords(['parking', 'car', 'vehicle'])) cons.push('Limited parking slots available nearby');
  if (checkKeywords(['busy', 'crowd', 'crowded'])) cons.push('Can get busy on weekends, booking advised');

  // Fallbacks if lists are empty
  if (pros.length === 0) {
    if (score >= 4.0) {
      pros.push('High-quality personalized beauty treatments');
      pros.push('Experienced and attentive staff');
    } else {
      pros.push('Convenient location and prompt service');
    }
  }
  
  if (cons.length === 0) {
    if (score < 4.0) {
      cons.push('Consistency in service could be improved');
      cons.push('Longer waiting times reported');
    } else {
      cons.push('Prior appointment booking is highly recommended');
    }
  }
  
  let sentiment = 'Neutral';
  if (score >= 4.5) sentiment = 'Exceptional';
  else if (score >= 4.0) sentiment = 'Very Positive';
  else if (score >= 3.0) sentiment = 'Positive';
  else sentiment = 'Mixed';
  
  return {
    pros: pros.slice(0, 3),
    cons: cons.slice(0, 2),
    sentiment,
    score: Math.round(score * 10) / 10
  };
}

// ─────────────────────────────────────────────────────────
// POST /api/ai/review-summary — Review Summarizer
// ─────────────────────────────────────────────────────────
router.post('/review-summary', async (req: Request, res: Response) => {
  try {
    const { salonId } = req.body;
    const reviews = await prisma.review.findMany({
      where: { salonId: parseInt(salonId) },
    });

    if (reviews.length === 0) {
      res.json({ pros: [], cons: [], sentiment: 'No reviews yet', score: 0 });
      return;
    }

    const reviewText = reviews
      .map((r) => `Rating: ${r.rating}/5 — "${r.comment}"`)
      .join('\n');

    const prompt = `Analyze these customer reviews for a beauty salon and return a structured summary as JSON:

${reviewText}

Please outline the main positive points, negative points, overall sentiment, and numerical score out of 5 based on customer comments.`;

    let summary;
    try {
      const result = await gemini.generateContent({
        contents: [{ role: 'user', parts: [{ text: prompt }] }],
        generationConfig: {
          responseMimeType: 'application/json',
          responseSchema: {
            type: SchemaType.OBJECT,
            properties: {
              pros: {
                type: SchemaType.ARRAY,
                items: { type: SchemaType.STRING }
              },
              cons: {
                type: SchemaType.ARRAY,
                items: { type: SchemaType.STRING }
              },
              sentiment: { type: SchemaType.STRING },
              score: { type: SchemaType.NUMBER }
            },
            required: ['pros', 'cons', 'sentiment', 'score']
          }
        }
      });

      const text = result.response.text();
      summary = JSON.parse(text);
    } catch (aiErr) {
      console.warn('AI review summary failed, using local fallback summary generator:', aiErr);
      summary = generateFallbackSummary(reviews);
    }

    res.json(summary);
  } catch (err) {
    handleAIError(err, 'Review summary', res);
  }
});

// ─────────────────────────────────────────────────────────
// POST /api/ai/search — Natural Language Search
// ─────────────────────────────────────────────────────────
router.post('/search', async (req: Request, res: Response) => {
  try {
    const { query } = req.body;

    const prompt = `A user typed this search query for finding beauty salons in Chennai:
"${query}"

Extract structured search filters from this query and return ONLY the JSON representation.`;

    const result = await gemini.generateContent({
      contents: [{ role: 'user', parts: [{ text: prompt }] }],
      generationConfig: {
        responseMimeType: 'application/json',
        responseSchema: {
          type: SchemaType.OBJECT,
          properties: {
            area: { type: SchemaType.STRING },
            priceRange: { type: SchemaType.STRING },
            minRating: { type: SchemaType.NUMBER },
            services: {
              type: SchemaType.ARRAY,
              items: { type: SchemaType.STRING }
            },
            occasion: { type: SchemaType.STRING },
            keywords: { type: SchemaType.STRING }
          }
        }
      }
    });

    const text = result.response.text();
    const filters = JSON.parse(text);

    // Build Prisma where clause from filters
    const where: Record<string, unknown> = {};
    if (filters.area) where.area = { contains: filters.area };
    if (filters.priceRange) where.priceRange = filters.priceRange;
    if (filters.minRating) where.rating = { gte: filters.minRating };
    if (filters.services?.length) {
      where.services = { some: { name: { in: filters.services } } };
    }
    if (filters.keywords) {
      where.OR = [
        { name: { contains: filters.keywords } },
        { description: { contains: filters.keywords } },
        { area: { contains: filters.keywords } },
      ];
    }

    const salons = await prisma.salon.findMany({
      where,
      include: { services: true, stylists: true },
      orderBy: { rating: 'desc' },
    });

    res.json({ salons, filters });
  } catch (err) {
    handleAIError(err, 'AI search', res);
  }
});

// ─────────────────────────────────────────────────────────
// GET /api/ai/beauty-tip — Daily Beauty Tip
// ─────────────────────────────────────────────────────────
router.get('/beauty-tip', async (_req: Request, res: Response) => {
  try {
    const prompt =
      'Give me one practical, expert beauty tip for today. Make it specific, useful, and relevant to Indian climate and beauty practices. Keep it to 2-3 sentences max. No intro or outro — just the tip.';

    const result = await gemini.generateContent(prompt);
    const tip = result.response.text().trim();

    res.json({ tip });
  } catch (err) {
    handleAIError(err, 'Beauty tip', res);
  }
});

export default router;
