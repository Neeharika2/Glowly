import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Sparkles } from 'lucide-react';
import api from '../../lib/api';

export default function HeroSection() {
  const [query, setQuery] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!query.trim()) return;
    if (query.split(' ').length > 2) {
      setLoading(true);
      try {
        const res = await api.post('/ai/search', { query });
        navigate('/salons', { state: { aiResults: res.data.salons, query } });
      } catch {
        navigate(`/salons?search=${encodeURIComponent(query)}`);
      } finally {
        setLoading(false);
      }
    } else {
      navigate(`/salons?search=${encodeURIComponent(query)}`);
    }
  };

  const suggestions = [
    'Bridal makeup near T Nagar',
    'Hair spa in Anna Nagar',
    'Luxury salon under ₹3000',
  ];

  return (
    <section className="gl-section pt-10 md:pt-14 pb-0 md:pb-0 overflow-hidden">
      <div className="gl-container">
        <div className="grid md:grid-cols-2 gap-10 md:gap-14 items-center min-h-[70vh]">
          <div>
            <p className="font-body text-xs text-gold/50 tracking-[0.3em] uppercase mb-8">
              Glowly · Chennai
            </p>

            <h1 className="font-display text-5xl md:text-7xl lg:text-7xl leading-[1.08] text-dark mb-6">
              <span className="block">Find the salon</span>
              <span className="block">that gets</span>
              <span className="block text-gold">you.</span>
            </h1>

            <div className="flex flex-col items-start mb-8">
              <span className="w-16 h-[2px] bg-gold origin-left scale-x-0 animate-underscore" />
              <span className="text-gold/40 text-xs tracking-[0.5em] mt-1.5 opacity-0 animate-fade-up"
                    style={{ animationDelay: '0.8s', animationFillMode: 'forwards' }}>
                · · ·
              </span>
            </div>

            <form onSubmit={handleSearch} className="max-w-md mb-5">
              <div className="flex border border-dark/15 focus-within:border-gold transition-colors duration-200">
                <input
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder='Try "Bridal makeup under ₹5000 in Anna Nagar"'
                  className="gl-input border-0 flex-1"
                />
                <button type="submit" disabled={loading}
                  className="gl-btn-primary rounded-none text-xs px-5 flex-shrink-0">
                  {loading ? (
                    <span className="w-4 h-4 border border-white/30 border-t-white rounded-full animate-spin" />
                  ) : (
                    <><Sparkles className="w-3.5 h-3.5" /> Search</>
                  )}
                </button>
              </div>
            </form>

            <div className="flex flex-wrap gap-2 mb-10">
              {suggestions.map((s) => (
                <button key={s} onClick={() => setQuery(s)}
                  className="px-3 py-1.5 text-xs text-dark/40 border border-dark/10
                             hover:border-gold hover:text-gold transition-colors duration-200">
                  {s}
                </button>
              ))}
            </div>

            <div className="flex items-center gap-8 md:gap-10">
              {[
                { val: '50+', label: 'Salons' },
                { val: '4.6', label: 'Avg Rating' },
                { val: '4', label: 'AI Features' },
              ].map(({ val, label }) => (
                <div key={label}>
                  <div className="font-mono text-xl md:text-2xl text-dark">{val}</div>
                  <div className="text-[10px] text-dark/40 mt-0.5 uppercase tracking-wider">{label}</div>
                </div>
              ))}
            </div>
          </div>

          <div className="hidden md:block">
            <div className="g-mirror">
              <img
                src="https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?w=800&q=85"
                alt="Salon hairstyling"
                className="w-full h-[550px] lg:h-[650px] object-cover"
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
