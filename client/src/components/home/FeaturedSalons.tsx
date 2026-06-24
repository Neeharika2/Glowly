import { useEffect, useState, useRef } from 'react';
import { Link } from 'react-router-dom';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import api from '../../lib/api';
import { Salon } from '../../types';

function SalonCard({ salon }: { salon: Salon }) {
  return (
    <Link to={`/salons/${salon.id}`}
      className="flex-shrink-0 w-72 g-mirror group">
      <div className="overflow-hidden h-52">
        <img src={salon.image || 'https://images.unsplash.com/photo-1560066984-138dadb4c035?w=600&q=80'}
             alt={salon.name}
             className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
      </div>
      <div className="p-5 space-y-2.5">
        <div className="flex items-start justify-between">
          <h3 className="font-display text-lg text-dark">{salon.name}</h3>
          <span className="font-mono text-[10px] text-dark/40">{salon.priceRange}</span>
        </div>
        <p className="text-xs text-dark/50">{salon.area}</p>
        <div className="flex items-center gap-2">
          <span className="font-mono text-sm text-dark">{Number(salon.rating).toFixed(1)}</span>
          <span className="text-xs text-dark/40">({salon.reviewCount})</span>
        </div>
        {salon.services && salon.services.length > 0 && (
          <>
            <p className="text-[10px] text-dark/30 uppercase tracking-wider pt-1">Known for</p>
            <div className="flex flex-wrap gap-1.5">
              {salon.services.slice(0, 3).map((s) => (
                <span key={s.name} className="gl-tag text-[10px]">{s.name}</span>
              ))}
              {salon.services.length > 3 && (
                <span className="gl-tag text-[10px] text-dark/30">+{salon.services.length - 3}</span>
              )}
            </div>
          </>
        )}
        <div className="pt-1">
          <span className="text-xs font-medium text-gold group-hover:opacity-100 opacity-60 transition-opacity">
            Book now &rarr;
          </span>
        </div>
      </div>
    </Link>
  );
}

export default function FeaturedSalons() {
  const [salons, setSalons] = useState<Salon[]>([]);
  const [loading, setLoading] = useState(true);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    api.get('/salons?featured=true').then((r) => setSalons(r.data.salons)).finally(() => setLoading(false));
  }, []);

  const scroll = (dir: 'left' | 'right') => {
    if (scrollRef.current) scrollRef.current.scrollBy({ left: dir === 'right' ? 300 : -300, behavior: 'smooth' });
  };

  return (
    <section className="gl-section bg-blush">
      <div className="gl-container">
        <div className="flex items-end justify-between mb-10">
          <div>
            <p className="font-display text-3xl md:text-4xl">Featured Salons</p>
            <p className="text-dark/50 text-sm mt-2">Top-rated picks across Chennai</p>
          </div>
          <div className="flex items-center gap-3">
            <button onClick={() => scroll('left')}
              className="w-8 h-8 border border-dark/10 flex items-center justify-center hover:border-gold hover:text-gold transition-all duration-200">
              <ChevronLeft className="w-4 h-4" />
            </button>
            <button onClick={() => scroll('right')}
              className="w-8 h-8 border border-dark/10 flex items-center justify-center hover:border-gold hover:text-gold transition-all duration-200">
              <ChevronRight className="w-4 h-4" />
            </button>
            <Link to="/salons" className="text-sm font-medium text-dark/50 hover:text-gold transition-colors ml-2">
              View all &rarr;
            </Link>
          </div>
        </div>

        {loading ? (
          <div className="flex gap-5 overflow-hidden">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="flex-shrink-0 w-72 h-80 bg-dark/[0.03] animate-pulse" />
            ))}
          </div>
        ) : (
          <div ref={scrollRef} className="flex gap-5 overflow-x-auto pb-3" style={{ scrollbarWidth: 'none' }}>
            {salons.map((s) => <SalonCard key={s.id} salon={s} />)}
          </div>
        )}
      </div>
    </section>
  );
}
