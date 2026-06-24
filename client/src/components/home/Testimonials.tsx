import { useState } from 'react';
import { Quote } from 'lucide-react';

const testimonials = [
  {
    name: 'Priya Krishnamurthy',
    role: 'Bride · T Nagar',
    text: 'Glow found me the perfect bridal salon within seconds. I described exactly what I wanted and it matched me to Lakme T Nagar. The makeup was stunning.',
    image: 'https://images.unsplash.com/photo-1524508762098-fd966ffb6ef9?w=400&q=85',
  },
  {
    name: 'Ranjith Subramanian',
    role: 'Professional · OMR',
    text: "I asked for men's grooming salons in OMR and got exactly the right recommendations with prices. Booked in under 2 minutes.",
    image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&q=85',
  },
  {
    name: 'Kavitha Ramasamy',
    role: 'Student · Anna Nagar',
    text: 'Used the AI Match quiz for a party makeover. It suggested Green Trends with a 94% match score — and it was perfect.',
    image: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400&q=85',
  },
];

export default function Testimonials() {
  const [current, setCurrent] = useState(0);
  const t = testimonials[current];

  return (
    <section className="gl-section">
      <div className="gl-container-narrow">
        <div className="g-mirror p-8 md:p-10">
          <div className="grid md:grid-cols-5 gap-8 md:gap-10 items-center">
            <div className="md:col-span-3">
              <Quote className="w-6 h-6 text-clay/40 mb-4" />
              <blockquote className="font-display text-xl md:text-2xl leading-relaxed text-dark mb-6">
                &ldquo;{t.text}&rdquo;
              </blockquote>
              <p className="font-medium text-dark text-sm">{t.name}</p>
              <p className="text-xs text-dark/40 mt-1">{t.role}</p>
            </div>
            <div className="hidden md:block md:col-span-2">
              <div className="aspect-[3/4] overflow-hidden">
                <img src={t.image} alt={t.name} className="w-full h-full object-cover" />
              </div>
            </div>
          </div>
          <div className="flex items-center justify-center gap-2 mt-8">
            {testimonials.map((_, i) => (
              <button
                key={i}
                onClick={() => setCurrent(i)}
                className={`h-2 rounded-full transition-all duration-300 ${
                  i === current ? 'bg-gold w-6' : 'bg-dark/15 w-2'
                }`}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
