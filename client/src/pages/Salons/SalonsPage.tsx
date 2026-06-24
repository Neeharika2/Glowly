import { useEffect, useState } from 'react';
import { useLocation, useSearchParams, Link, useNavigate } from 'react-router-dom';
import { Search, SlidersHorizontal, MapPin, Heart, Sparkles } from 'lucide-react';
import api from '../../lib/api';
import { useAuth } from '../../context/AuthContext';
import { Salon } from '../../types';

const AREAS = ['All', 'Anna Nagar', 'T Nagar', 'Adyar', 'Nungambakkam', 'Velachery', 'OMR', 'Teynampet', 'Kodambakkam', 'Porur'];
const PRICE_RANGES = ['All', '₹', '₹₹', '₹₹₹'];
const SORT_OPTIONS = [
  { value: 'rating', label: 'Top Rated' },
  { value: 'reviews', label: 'Most Reviewed' },
  { value: 'price_asc', label: 'Price: Low to High' },
  { value: 'price_desc', label: 'Price: High to Low' },
];

function SalonCard({ salon, initialFav }: { salon: Salon; initialFav: boolean }) {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [fav, setFav] = useState(initialFav);
  const [favLoading, setFavLoading] = useState(false);

  const handleFavToggle = async (e: React.MouseEvent) => {
    e.preventDefault();
    if (!user) { navigate('/login'); return; }
    setFav(!fav);
    setFavLoading(true);
    try {
      await api.post('/favourites', { salonId: salon.id });
    } catch {
      setFav(fav);
    } finally {
      setFavLoading(false);
    }
  };

  return (
    <Link to={`/salons/${salon.id}`} className="g-mirror group block">
      <div className="relative overflow-hidden h-52">
        <img src={salon.image || 'https://images.unsplash.com/photo-1560066984-138dadb4c035?w=600&q=80'}
             alt={salon.name}
             className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
        <button onClick={handleFavToggle} disabled={favLoading}
          className="absolute top-3 right-3 w-8 h-8 bg-white flex items-center justify-center border border-dark/[0.06] hover:bg-blush transition-colors z-10">
          <Heart className={`w-4 h-4 transition-colors ${fav ? 'fill-rose text-rose' : 'text-dark/30'}`} />
        </button>
        <span className="absolute top-3 left-3 font-mono text-[10px] text-dark/50 bg-white px-2 py-1 border border-dark/[0.06]">
          {salon.priceRange}
        </span>
      </div>
      <div className="p-5 space-y-2.5">
        <div className="flex items-start justify-between">
          <h3 className="font-display text-lg text-dark">{salon.name}</h3>
        </div>
        <div className="flex items-center gap-1">
          <MapPin className="w-3 h-3 text-dark/30" />
          <span className="text-xs text-dark/50">{salon.address || salon.area}</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="font-mono text-sm text-dark">{Number(salon.rating).toFixed(1)}</span>
          <span className="text-xs text-dark/40">({salon.reviewCount} reviews)</span>
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
        <div className="pt-2 flex gap-2">
          <Link to={`/book/${salon.id}`} onClick={(e) => e.stopPropagation()}
            className="text-xs font-medium text-gold group-hover:opacity-100 opacity-60 transition-opacity">
            Book now &rarr;
          </Link>
        </div>
      </div>
    </Link>
  );
}

export default function SalonsPage() {
  const { user } = useAuth();
  const [salons, setSalons] = useState<Salon[]>([]);
  const [favouriteIds, setFavouriteIds] = useState<Set<number>>(new Set());
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [area, setArea] = useState('All');
  const [priceRange, setPriceRange] = useState('All');
  const [sort, setSort] = useState('rating');
  const [showFilters, setShowFilters] = useState(false);
  const location = useLocation();
  const [searchParams] = useSearchParams();

  useEffect(() => {
    if (!user) return;
    api.get('/favourites/me')
      .then(res => {
        const ids = new Set<number>((res.data.favourites as Salon[]).map(s => s.id));
        setFavouriteIds(ids);
      })
      .catch(() => {});
  }, [user]);

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
    <div className="min-h-screen bg-blush/30">
      <div className="border-b border-dark/[0.06] bg-white sticky top-16 z-30">
        <div className="gl-container py-4">
          <form onSubmit={handleSearch} className="flex gap-3 items-center">
            <div className="flex-1 flex items-center gap-2 border border-dark/15 px-4 py-2.5 focus-within:border-gold transition-colors bg-blush/30">
              <Search className="w-4 h-4 text-dark/30 flex-shrink-0" />
              <input value={search} onChange={(e) => setSearch(e.target.value)}
                placeholder="Search salons, areas, services..."
                className="flex-1 bg-transparent text-sm text-dark placeholder-dark/30 outline-none" />
            </div>
            <button type="submit" className="gl-btn-primary py-2.5 px-5 text-xs">
              <Search className="w-3.5 h-3.5" /> Search
            </button>
            <button type="button" onClick={() => setShowFilters(!showFilters)}
              className="gl-btn py-2.5 px-4 text-xs">
              <SlidersHorizontal className="w-3.5 h-3.5" /> Filters
            </button>
          </form>

          {showFilters && (
            <div className="mt-3 flex flex-wrap gap-3 pt-3 border-t border-dark/[0.06]">
              <div className="flex items-center gap-2">
                <span className="text-xs text-dark/40 font-medium">Area:</span>
                <div className="flex gap-1 flex-wrap">
                  {AREAS.map((a) => (
                    <button key={a} onClick={() => setArea(a)}
                      className={`px-3 py-1 text-xs font-medium transition-colors border ${
                        area === a ? 'bg-dark text-white border-dark' : 'text-dark/50 border-dark/10 hover:border-dark/30'
                      }`}>
                      {a}
                    </button>
                  ))}
                </div>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-xs text-dark/40 font-medium">Price:</span>
                {PRICE_RANGES.map((p) => (
                  <button key={p} onClick={() => setPriceRange(p)}
                    className={`px-3 py-1 text-xs font-medium transition-colors border ${
                      priceRange === p ? 'bg-dark text-white border-dark' : 'text-dark/50 border-dark/10 hover:border-dark/30'
                    }`}>
                    {p}
                  </button>
                ))}
              </div>
              <div className="flex items-center gap-2">
                <span className="text-xs text-dark/40 font-medium">Sort:</span>
                <select value={sort} onChange={(e) => setSort(e.target.value)}
                  className="text-xs border border-dark/10 px-2 py-1 outline-none focus:border-gold bg-white">
                  {SORT_OPTIONS.map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}
                </select>
              </div>
            </div>
          )}
        </div>
      </div>

      <div className="gl-container py-8">
        {aiResults && (
          <div className="flex items-center gap-2 mb-6 p-3 border border-gold/20 bg-gold/[0.03]">
            <Sparkles className="w-4 h-4 text-gold" />
            <span className="text-sm text-dark/60">AI-powered results for your query</span>
          </div>
        )}

        <div className="flex items-center justify-between mb-6">
          <p className="text-sm text-dark/40">
            {loading ? 'Loading...' : `${salons.length} salons found`}
          </p>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="h-80 bg-dark/[0.03] animate-pulse" />
            ))}
          </div>
        ) : salons.length === 0 ? (
          <div className="text-center py-20">
            <p className="text-dark/40 text-lg">No salons found. Try adjusting your filters.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {salons.map((s) => <SalonCard key={s.id} salon={s} initialFav={favouriteIds.has(s.id)} />)}
          </div>
        )}
      </div>
    </div>
  );
}
