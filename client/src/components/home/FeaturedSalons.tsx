import { useEffect, useState, useRef } from 'react';
import { Link } from 'react-router-dom';
import { Star, MapPin, ChevronLeft, ChevronRight, ArrowRight } from 'lucide-react';
import api from '../../lib/api';
import { Salon } from '../../types';

function SalonCard({ salon }: { salon: Salon }) {
  const priceClass: Record<string, string> = { '₹': 'price-1', '₹₹': 'price-2', '₹₹₹': 'price-3' };
  return (
    <Link to={`/salons/${salon.id}`}
      className="flex-shrink-0 w-72 card overflow-hidden group cursor-pointer">
      <div className="relative overflow-hidden h-44">
        <img src={salon.image || 'https://images.unsplash.com/photo-1560066984-138dadb4c035?w=600&q=80'}
             alt={salon.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
        <div className="absolute top-3 right-3">
          <span className={priceClass[salon.priceRange] || 'price-2'}>{salon.priceRange}</span>
        </div>
      </div>
      <div className="p-4">
        <h3 className="font-semibold text-dark text-sm truncate">{salon.name}</h3>
        <div className="flex items-center gap-1 mt-1">
          <MapPin className="w-3 h-3 text-gray-400" />
          <span className="text-xs text-gray-500">{salon.area}</span>
        </div>
        <div className="flex items-center gap-1 mt-2">
          <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
          <span className="text-sm font-medium text-dark">{Number(salon.rating).toFixed(1)}</span>
          <span className="text-xs text-gray-400">({salon.reviewCount} reviews)</span>
        </div>
        <div className="flex flex-wrap gap-1 mt-3">
          {salon.services?.slice(0, 2).map((s) => (
            <span key={s.name} className="badge badge-rose text-[10px]">{s.name}</span>
          ))}
          {(salon.services?.length || 0) > 2 && (
            <span className="badge bg-gray-100 text-gray-500 text-[10px]">+{salon.services.length - 2}</span>
          )}
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
    <section className="py-20 px-4 bg-white">
      <div className="max-w-7xl mx-auto">
        <div className="flex items-end justify-between mb-10">
          <div>
            <h2 className="section-title">Featured Salons</h2>
            <p className="section-subtitle">Top-rated picks across Chennai</p>
          </div>
          <div className="flex items-center gap-3">
            <button onClick={() => scroll('left')}
              className="w-10 h-10 rounded-full border border-gray-200 flex items-center justify-center hover:border-gold hover:text-gold transition-all">
              <ChevronLeft className="w-5 h-5" />
            </button>
            <button onClick={() => scroll('right')}
              className="w-10 h-10 rounded-full border border-gray-200 flex items-center justify-center hover:border-gold hover:text-gold transition-all">
              <ChevronRight className="w-5 h-5" />
            </button>
            <Link to="/salons" className="flex items-center gap-1 text-sm font-medium text-gold hover:underline">
              View all <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>

        {loading ? (
          <div className="flex gap-5 overflow-hidden">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="flex-shrink-0 w-72 rounded-2xl bg-gray-100 h-64 animate-pulse" />
            ))}
          </div>
        ) : (
          <div ref={scrollRef} className="flex gap-5 overflow-x-auto pb-3 scrollbar-hide" style={{ scrollbarWidth: 'none' }}>
            {salons.map((s) => <SalonCard key={s.id} salon={s} />)}
          </div>
        )}
      </div>
    </section>
  );
}
