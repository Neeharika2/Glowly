import { useNavigate } from 'react-router-dom';

const services = [
  { name: 'Hair', description: 'Precision cuts, color & styling', count: 42, startingPrice: 300 },
  { name: 'Bridal', description: 'Complete packages for your special day', count: 28, startingPrice: 5000 },
  { name: 'Hair Spa', description: 'Deep conditioning & scalp treatments', count: 36, startingPrice: 800 },
  { name: 'Skin', description: 'Facials, peels & rejuvenation', count: 33, startingPrice: 600 },
  { name: 'Nails', description: 'Manicure, pedicure & nail art', count: 29, startingPrice: 350 },
  { name: 'Makeup', description: 'Professional makeup for every occasion', count: 27, startingPrice: 1500 },
  { name: 'Body', description: 'Waxing, threading & grooming', count: 38, startingPrice: 200 },
  { name: 'Spa', description: 'Relaxing massages & body treatments', count: 20, startingPrice: 1200 },
];

export default function PopularServices() {
  const navigate = useNavigate();

  return (
    <section className="gl-section">
      <div className="gl-container">
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-px bg-dark/[0.06]">
          {services.map(({ name, description, count, startingPrice }) => (
            <button
              key={name}
              onClick={() => navigate(`/salons?service=${encodeURIComponent(name)}`)}
              className="bg-white p-7 md:p-8 text-left group hover:bg-blush transition-colors duration-200"
            >
              <p className="font-mono text-xs text-gold/60 mb-4 tracking-widest uppercase">{name}</p>
              <p className="font-display text-lg text-dark mb-2 leading-snug">{description}</p>
              <div className="flex items-center gap-3 text-xs text-dark/40 mb-5">
                <span>{count} salons</span>
                <span className="w-px h-3 bg-dark/10" />
                <span>from ₹{startingPrice}</span>
              </div>
              <span className="text-xs text-gold group-hover:opacity-100 opacity-0 transition-opacity duration-200">
                Browse &rarr;
              </span>
            </button>
          ))}
        </div>
      </div>
    </section>
  );
}
