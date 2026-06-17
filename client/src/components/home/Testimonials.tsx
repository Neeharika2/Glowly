import { Star, Quote } from 'lucide-react';

const testimonials = [
  {
    name: 'Priya Krishnamurthy',
    role: 'Bride · T Nagar',
    avatar: 'P',
    rating: 5,
    text: 'Glow AI found me the perfect bridal salon within seconds! I described exactly what I wanted and it matched me to Lakme T Nagar. The makeup was stunning. Highly recommend!',
    color: '#C9A84C',
  },
  {
    name: 'Ranjith Subramanian',
    role: 'Professional · OMR',
    avatar: 'R',
    rating: 5,
    text: "The AI concierge is genuinely impressive. I asked for men's grooming salons in OMR and got exactly the right recommendations with prices. Booked in under 2 minutes.",
    color: '#E8A0A0',
  },
  {
    name: 'Kavitha Ramasamy',
    role: 'Student · Anna Nagar',
    avatar: 'K',
    rating: 5,
    text: 'Used the AI Match quiz for a party makeover. It suggested Green Trends in Anna Nagar with a 94% match score — and it was perfect! Love this app.',
    color: '#9b59b6',
  },
];

export default function Testimonials() {
  return (
    <section className="py-20 px-4 bg-white">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <h2 className="section-title">What Chennai Says</h2>
          <p className="section-subtitle mx-auto">Real users, real results — powered by AI</p>
        </div>
        <div className="grid md:grid-cols-3 gap-6">
          {testimonials.map((t) => (
            <div key={t.name} className="card p-6 relative">
              <Quote className="w-8 h-8 text-gray-100 absolute top-5 right-5" />
              <div className="flex items-center gap-3 mb-4">
                <div className="w-11 h-11 rounded-full flex items-center justify-center text-white font-bold text-lg"
                     style={{ background: t.color }}>
                  {t.avatar}
                </div>
                <div>
                  <p className="font-semibold text-dark text-sm">{t.name}</p>
                  <p className="text-xs text-gray-400">{t.role}</p>
                </div>
              </div>
              <div className="flex gap-0.5 mb-3">
                {[...Array(t.rating)].map((_, i) => (
                  <Star key={i} className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                ))}
              </div>
              <p className="text-gray-600 text-sm leading-relaxed">{t.text}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
