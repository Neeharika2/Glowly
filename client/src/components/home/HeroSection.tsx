import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, Sparkles, ArrowRight, Star } from 'lucide-react';
import api from '../../lib/api';

export default function HeroSection() {
  const [query, setQuery] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!query.trim()) return;
    if (query.split(' ').length > 2) {
      // AI search
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
    'Men\'s grooming Velachery',
  ];

  return (
    <section
      className="relative min-h-[92vh] flex items-center justify-center overflow-hidden"
      style={{ background: 'linear-gradient(135deg, #1a0533 0%, #3d0d6b 50%, #6b1a4a 100%)' }}
    >
      {/* Decorative circles */}
      <div className="absolute top-20 left-10 w-72 h-72 rounded-full opacity-10 blur-3xl"
           style={{ background: 'radial-gradient(circle, #C9A84C, transparent)' }} />
      <div className="absolute bottom-20 right-10 w-96 h-96 rounded-full opacity-10 blur-3xl"
           style={{ background: 'radial-gradient(circle, #E8A0A0, transparent)' }} />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full opacity-5 blur-3xl"
           style={{ background: 'radial-gradient(circle, #ffffff, transparent)' }} />

      <div className="relative z-10 max-w-4xl mx-auto px-4 text-center">
        {/* Badge */}
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 border border-white/20 text-white/80 text-sm mb-6 animate-fade-in">
          <Sparkles className="w-4 h-4 text-gold" />
          AI-Powered Beauty Concierge · Chennai
        </div>

        {/* Headline */}
        <h1 className="font-display text-5xl md:text-7xl font-bold text-white leading-tight mb-6 animate-slide-up">
          Find Your
          <span className="block" style={{
            background: 'linear-gradient(90deg, #C9A84C 0%, #E8A0A0 100%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            backgroundClip: 'text',
          }}>
            Perfect Salon
          </span>
        </h1>

        <p className="text-white/70 text-lg md:text-xl max-w-2xl mx-auto mb-10 animate-slide-up delay-100">
          Tell our AI what you need — bridal, casual, luxury or budget — and we'll find the perfect match in Chennai.
        </p>

        {/* Search bar */}
        <form onSubmit={handleSearch} className="relative max-w-2xl mx-auto mb-6 animate-slide-up delay-200">
          <div className="flex items-center gap-3 bg-white rounded-2xl p-2 shadow-2xl">
            <Search className="w-5 h-5 text-gray-400 ml-3 flex-shrink-0" />
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder='Try "Bridal makeup under ₹5000 in Anna Nagar"'
              className="flex-1 py-3 text-dark placeholder-gray-400 outline-none text-sm md:text-base bg-transparent"
            />
            <button type="submit" disabled={loading}
              className="flex items-center gap-2 px-6 py-3 rounded-xl font-semibold text-white text-sm transition-all hover:opacity-90 active:scale-95 disabled:opacity-60 flex-shrink-0"
              style={{ background: 'linear-gradient(90deg, #C9A84C 0%, #E8A0A0 100%)' }}>
              {loading ? (
                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                <><Sparkles className="w-4 h-4" /> AI Search</>
              )}
            </button>
          </div>
        </form>

        {/* Suggestions */}
        <div className="flex flex-wrap gap-2 justify-center mb-12 animate-slide-up delay-300">
          {suggestions.map((s) => (
            <button key={s} onClick={() => setQuery(s)}
              className="px-3 py-1.5 rounded-full bg-white/10 border border-white/20 text-white/70 text-xs hover:bg-white/20 hover:text-white transition-all">
              {s}
            </button>
          ))}
        </div>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-6 max-w-sm mx-auto animate-slide-up delay-400">
          {[['50+', 'Salons'], ['4.6', <><Star className="w-3 h-3 inline fill-gold text-gold" /> Avg Rating</>], ['4', 'AI Features']].map(([val, label], i) => (
            <div key={i} className="text-center">
              <div className="text-2xl font-bold text-white">{val}</div>
              <div className="text-xs text-white/50 mt-1">{label}</div>
            </div>
          ))}
        </div>

        {/* CTA buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center mt-10 animate-slide-up delay-400">
          <button onClick={() => navigate('/salons')}
            className="flex items-center justify-center gap-2 px-8 py-4 rounded-full border-2 border-white/30 text-white font-semibold hover:bg-white/10 transition-all">
            Browse All Salons <ArrowRight className="w-4 h-4" />
          </button>
          <button onClick={() => navigate('/ai-concierge')}
            className="flex items-center justify-center gap-2 px-8 py-4 rounded-full font-semibold text-dark transition-all hover:opacity-90"
            style={{ background: 'linear-gradient(90deg, #C9A84C 0%, #E8A0A0 100%)' }}>
            <Sparkles className="w-4 h-4" /> Talk to AI Concierge
          </button>
        </div>
      </div>
    </section>
  );
}
