import { useEffect, useState } from 'react';
import { useLocation, useSearchParams, Link } from 'react-router-dom';
import { Search, SlidersHorizontal, Star, MapPin, Heart, Sparkles } from 'lucide-react';
import api from '../../lib/api';
import { Salon } from '../../types';

const AREAS = ['All', 'Anna Nagar', 'T Nagar', 'Adyar', 'Nungambakkam', 'Velachery', 'OMR', 'Teynampet', 'Kodambakkam', 'Porur'];
const PRICE_RANGES = ['All', '₹', '₹₹', '₹₹₹'];
const SORT_OPTIONS = [
  { value: 'rating', label: 'Top Rated' },
  { value: 'reviews', label: 'Most Reviewed' },
  { value: 'price_asc', label: 'Price: Low to High' },
  { value: 'price_desc', label: 'Price: High to Low' },
];

function SalonCard({ salon }: { salon: Salon }) {
  const [fav, setFav] = useState(false);
  const priceColor: Record<string, string> = { '₹': 'bg-green-100 text-green-700', '₹₹': 'bg-amber-100 text-amber-700', '₹₹₹': 'bg-rose-100 text-rose-700' };

  return (
    <div className="card overflow-hidden group flex flex-col">
      <div className="relative overflow-hidden h-48">
        <img src={salon.image || 'https://images.unsplash.com/photo-1560066984-138dadb4c035?w=600&q=80'}
             alt={salon.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
        <button onClick={(e) => { e.preventDefault(); setFav(!fav); }}
          className="absolute top-3 right-3 w-8 h-8 rounded-full bg-white/90 flex items-center justify-center shadow hover:scale-110 transition-transform">
          <Heart className={`w-4 h-4 ${fav ? 'fill-rose text-rose' : 'text-gray-400'}`} />
        </button>
        <div className="absolute top-3 left-3">
          <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${priceColor[salon.priceRange] || 'bg-gray-100 text-gray-600'}`}>
            {salon.priceRange}
          </span>
        </div>
      </div>
      <div className="p-5 flex flex-col flex-1">
        <h3 className="font-semibold text-dark text-base mb-1">{salon.name}</h3>
        <div className="flex items-center gap-1 mb-2">
          <MapPin className="w-3 h-3 text-gray-400" />
          <span className="text-xs text-gray-500">{salon.address || salon.area}</span>
        </div>
        <div className="flex items-center gap-2 mb-3">
          <div className="flex items-center gap-1">
            <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
            <span className="text-sm font-semibold text-dark">{Number(salon.rating).toFixed(1)}</span>
          </div>
          <span className="text-xs text-gray-400">({salon.reviewCount} reviews)</span>
        </div>
        <div className="flex flex-wrap gap-1 mb-4">
          {salon.services?.slice(0, 3).map((s) => (
            <span key={s.name} className="text-[10px] px-2 py-0.5 rounded-full bg-pink-50 text-pink-600 border border-pink-100">
              {s.name}
            </span>
          ))}
          {(salon.services?.length || 0) > 3 && (
            <span className="text-[10px] px-2 py-0.5 rounded-full bg-gray-100 text-gray-500">
              +{salon.services.length - 3}
            </span>
          )}
        </div>
        <div className="flex gap-2 mt-auto">
          <Link to={`/salons/${salon.id}`}
            className="flex-1 text-center py-2.5 rounded-xl border border-gray-200 text-sm font-medium text-dark hover:border-gold hover:text-gold transition-all">
            View Details
          </Link>
          <Link to={`/book/${salon.id}`}
            className="flex-1 text-center py-2.5 rounded-xl text-sm font-semibold text-white transition-all hover:opacity-90"
            style={{ background: 'linear-gradient(90deg, #C9A84C 0%, #E8A0A0 100%)' }}>
            Book Now
          </Link>
        </div>
      </div>
    </div>
  );
}

export default function SalonsPage() {
  const [salons, setSalons] = useState<Salon[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [area, setArea] = useState('All');
  const [priceRange, setPriceRange] = useState('All');
  const [sort, setSort] = useState('rating');
  const [showFilters, setShowFilters] = useState(false);
  const location = useLocation();
  const [searchParams] = useSearchParams();

  // Handle AI search results passed via router state
  const aiResults = (location.state as { aiResults?: Salon[]; query?: string })?.aiResults;

  useEffect(() => {
    if (aiResults) { setSalons(aiResults); setLoading(false); return; }
    fetchSalons();
  }, [area, priceRange, sort]);

  useEffect(() => {
    const q = searchParams.get('search');
    if (q) setSearch(q);
    const s = searchParams.get('service');
    if (s) fetchWithService(s);
  }, [searchParams]);

  const fetchSalons = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (area !== 'All') params.set('area', area);
      if (priceRange !== 'All') params.set('priceRange', priceRange);
      if (sort) params.set('sort', sort);
      if (search) params.set('search', search);
      const res = await api.get(`/salons?${params}`);
      setSalons(res.data.salons);
    } finally {
      setLoading(false);
    }
  };

  const fetchWithService = async (service: string) => {
    setLoading(true);
    try {
      const res = await api.get(`/salons?service=${encodeURIComponent(service)}`);
      setSalons(res.data.salons);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (e: React.FormEvent) => { e.preventDefault(); fetchSalons(); };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-100 sticky top-16 z-30">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <form onSubmit={handleSearch} className="flex gap-3 items-center">
            <div className="flex-1 flex items-center gap-2 bg-gray-50 border border-gray-200 rounded-xl px-4 py-2.5 focus-within:ring-2 focus-within:ring-gold/40 focus-within:border-gold transition-all">
              <Search className="w-4 h-4 text-gray-400 flex-shrink-0" />
              <input value={search} onChange={(e) => setSearch(e.target.value)}
                placeholder="Search salons, areas, services..."
                className="flex-1 bg-transparent text-sm text-dark placeholder-gray-400 outline-none" />
            </div>
            <button type="submit" className="btn-primary py-2.5 px-5 text-sm">
              <Search className="w-4 h-4" /> Search
            </button>
            <button type="button" onClick={() => setShowFilters(!showFilters)}
              className="flex items-center gap-2 px-4 py-2.5 rounded-xl border border-gray-200 text-sm font-medium hover:border-gold hover:text-gold transition-all">
              <SlidersHorizontal className="w-4 h-4" /> Filters
            </button>
          </form>

          {showFilters && (
            <div className="mt-3 flex flex-wrap gap-3 pt-3 border-t border-gray-100">
              {/* Area */}
              <div className="flex items-center gap-2">
                <span className="text-xs text-gray-500 font-medium">Area:</span>
                <div className="flex gap-1 flex-wrap">
                  {AREAS.map((a) => (
                    <button key={a} onClick={() => setArea(a)}
                      className={`px-3 py-1 rounded-full text-xs font-medium transition-all ${area === a ? 'bg-plum-900 text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}
                      style={area === a ? { background: '#1a0533' } : {}}>
                      {a}
                    </button>
                  ))}
                </div>
              </div>
              {/* Price */}
              <div className="flex items-center gap-2">
                <span className="text-xs text-gray-500 font-medium">Price:</span>
                {PRICE_RANGES.map((p) => (
                  <button key={p} onClick={() => setPriceRange(p)}
                    className={`px-3 py-1 rounded-full text-xs font-medium transition-all ${priceRange === p ? 'bg-gold text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}>
                    {p}
                  </button>
                ))}
              </div>
              {/* Sort */}
              <div className="flex items-center gap-2">
                <span className="text-xs text-gray-500 font-medium">Sort:</span>
                <select value={sort} onChange={(e) => setSort(e.target.value)}
                  className="text-xs border border-gray-200 rounded-lg px-2 py-1 outline-none focus:border-gold">
                  {SORT_OPTIONS.map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}
                </select>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Grid */}
      <div className="max-w-7xl mx-auto px-4 py-8">
        {aiResults && (
          <div className="flex items-center gap-2 mb-6 p-3 rounded-xl bg-ai-card border border-pink-100">
            <Sparkles className="w-4 h-4 text-gold" />
            <span className="text-sm text-dark/70">AI-powered results for your query</span>
          </div>
        )}

        <div className="flex items-center justify-between mb-6">
          <p className="text-sm text-gray-500">
            {loading ? 'Loading...' : `${salons.length} salons found`}
          </p>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="rounded-2xl bg-gray-200 h-80 animate-pulse" />
            ))}
          </div>
        ) : salons.length === 0 ? (
          <div className="text-center py-20">
            <p className="text-gray-400 text-lg">No salons found. Try adjusting your filters.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {salons.map((s) => <SalonCard key={s.id} salon={s} />)}
          </div>
        )}
      </div>
    </div>
  );
}
