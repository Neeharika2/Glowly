import { Router, Request, Response } from 'express';
import anthropic from '../lib/claude';
import prisma from '../lib/prisma';

const router = Router();

// ─────────────────────────────────────────────────────────
// Helper: get all salons as compact context string
// ─────────────────────────────────────────────────────────
async function getSalonContext(): Promise<string> {
  const salons = await prisma.salon.findMany({ include: { services: true } });
  return salons
    .map(
      (s) =>
        `- ${s.name} | ${s.area} | ${s.priceRange} | Rating: ${s.rating} | Services: ${s.services.map((sv) => `${sv.name}(₹${sv.price})`).join(', ')}`
    )
    .join('\n');
}

// ─────────────────────────────────────────────────────────
// POST /api/ai/concierge — Beauty Concierge Chat
// ─────────────────────────────────────────────────────────
router.post('/concierge', async (req: Request, res: Response) => {
  try {
    const { messages } = req.body; // [{role, content}]
    const salonContext = await getSalonContext();

    const systemPrompt = `You are Glow, a luxury AI beauty concierge for Chennai BeautyHub — a premium beauty salon discovery platform in Chennai, Tamil Nadu.

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

    const response = await anthropic.messages.create({
      model: 'claude-sonnet-4-5',
      max_tokens: 1024,
      system: systemPrompt,
      messages: messages.map((m: { role: string; content: string }) => ({
        role: m.role,
        content: m.content,
      })),
    });

    const content = response.content[0];
    if (content.type !== 'text') throw new Error('Unexpected response type');

    res.json({ reply: content.text });
  } catch (err) {
    console.error('Concierge error:', err);
    res.status(500).json({ error: 'AI service error' });
  }
});

// ─────────────────────────────────────────────────────────
// POST /api/ai/salon-match — Personalized Salon Match
// ─────────────────────────────────────────────────────────
router.post('/salon-match', async (req: Request, res: Response) => {
  try {
    const { occasion, hairType, skinType, budget, area } = req.body;
    const salons = await prisma.salon.findMany({ include: { services: true } });
    const salonContext = salons
      .map(
        (s) =>
          `ID:${s.id} | ${s.name} | ${s.area} | ${s.priceRange} | Rating:${s.rating} | Services: ${s.services.map((sv) => sv.name).join(', ')}`
      )
      .join('\n');

    const prompt = `A user is looking for the perfect salon. Here is their profile:
- Occasion: ${occasion}
- Hair Type: ${hairType}
- Skin Type: ${skinType}
- Budget: ${budget}
- Preferred Area in Chennai: ${area}

Available salons:
${salonContext}

Based on this profile, return the top 3 matching salons as a JSON array. Each object must have:
{
  "salonId": number,
  "matchScore": number (0-100),
  "reason": "2-3 sentence explanation of why this salon is perfect for this user",
  "recommendedServices": ["service1", "service2"]
}

Return ONLY the JSON array, no other text.`;

    const response = await anthropic.messages.create({
      model: 'claude-sonnet-4-5',
      max_tokens: 1024,
      messages: [{ role: 'user', content: prompt }],
    });

    const content = response.content[0];
    if (content.type !== 'text') throw new Error('Unexpected response type');

    const matches = JSON.parse(content.text);
    const results = await Promise.all(
      matches.map(async (m: { salonId: number; matchScore: number; reason: string; recommendedServices: string[] }) => {
        const salon = await prisma.salon.findUnique({
          where: { id: m.salonId },
          include: { services: true },
        });
        return { salon, matchScore: m.matchScore, reason: m.reason, recommendedServices: m.recommendedServices };
      })
    );

    res.json({ results });
  } catch (err) {
    console.error('Salon match error:', err);
    res.status(500).json({ error: 'AI service error' });
  }
});

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

Return ONLY this JSON structure, no other text:
{
  "pros": ["pro1", "pro2", "pro3"],
  "cons": ["con1", "con2"],
  "sentiment": "Highly Positive | Positive | Mixed | Negative",
  "score": 4.5
}`;

    const response = await anthropic.messages.create({
      model: 'claude-sonnet-4-5',
      max_tokens: 512,
      messages: [{ role: 'user', content: prompt }],
    });

    const content = response.content[0];
    if (content.type !== 'text') throw new Error('Unexpected response type');

    const summary = JSON.parse(content.text);
    res.json(summary);
  } catch (err) {
    console.error('Review summary error:', err);
    res.status(500).json({ error: 'AI service error' });
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

Extract structured search filters from this query and return ONLY this JSON (use null for fields not mentioned):
{
  "area": "Anna Nagar" | null,
  "priceRange": "₹" | "₹₹" | "₹₹₹" | null,
  "minRating": 4.0 | null,
  "services": ["haircut", "facial"] | null,
  "occasion": "bridal" | "casual" | "party" | null,
  "keywords": "any remaining keywords" | null
}`;

    const response = await anthropic.messages.create({
      model: 'claude-sonnet-4-5',
      max_tokens: 256,
      messages: [{ role: 'user', content: prompt }],
    });

    const content = response.content[0];
    if (content.type !== 'text') throw new Error('Unexpected response type');

    const filters = JSON.parse(content.text);

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
      include: { services: true },
      orderBy: { rating: 'desc' },
    });

    res.json({ salons, filters });
  } catch (err) {
    console.error('AI search error:', err);
    res.status(500).json({ error: 'AI service error' });
  }
});

// ─────────────────────────────────────────────────────────
// GET /api/ai/beauty-tip — Daily Beauty Tip
// ─────────────────────────────────────────────────────────
router.get('/beauty-tip', async (_req: Request, res: Response) => {
  try {
    const response = await anthropic.messages.create({
      model: 'claude-sonnet-4-5',
      max_tokens: 150,
      messages: [
        {
          role: 'user',
          content:
            'Give me one practical, expert beauty tip for today. Make it specific, useful, and relevant to Indian climate and beauty practices. Keep it to 2-3 sentences max. No intro or outro — just the tip.',
        },
      ],
    });

    const content = response.content[0];
    if (content.type !== 'text') throw new Error('Unexpected response type');

    res.json({ tip: content.text });
  } catch (err) {
    console.error('Beauty tip error:', err);
    res.status(500).json({ error: 'AI service error' });
  }
});

export default router;
