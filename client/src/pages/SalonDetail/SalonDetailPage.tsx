import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Star, MapPin, Clock, Phone, Sparkles, AlertCircle } from 'lucide-react';
import api from '../../lib/api';
import { Salon, Review, ReviewSummary } from '../../types';
import { useAuth } from '../../context/AuthContext';
import InteractiveMap from '../../components/map/InteractiveMap';

export default function SalonDetailPage() {
  const { id } = useParams();
  const { user } = useAuth();
  const [salon, setSalon] = useState<Salon | null>(null);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [summary, setSummary] = useState<ReviewSummary | null>(null);
  const [loading, setLoading] = useState(true);
  const [summaryLoading, setSummaryLoading] = useState(false);
  const [summaryLoaderIndex, setSummaryLoaderIndex] = useState(0);

  const summaryPhrases = [
    "Reading customer reviews...",
    "Analyzing customer feedback pros and cons...",
    "Evaluating aggregate customer sentiment...",
    "Synthesizing overall review summary scorecard..."
  ];

  useEffect(() => {
    let interval: any;
    if (summaryLoading) {
      setSummaryLoaderIndex(0);
      interval = setInterval(() => {
        setSummaryLoaderIndex((prev) => (prev + 1) % summaryPhrases.length);
      }, 3000);
    }
    return () => clearInterval(interval);
  }, [summaryLoading]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [salonRes, reviewRes] = await Promise.all([
          api.get(`/salons/${id}`),
          api.get(`/salons/${id}/reviews`),
        ]);
        setSalon(salonRes.data.salon);
        setReviews(reviewRes.data.reviews);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [id]);

  useEffect(() => {
    if (salon && reviews.length > 0 && !summary) {
      setSummaryLoading(true);
      api.post('/ai/review-summary', { salonId: id })
        .then(r => setSummary(r.data))
        .catch(console.error)
        .finally(() => setSummaryLoading(false));
    }
  }, [salon, reviews, id, summary]);

  if (loading) return <div className="min-h-screen flex items-center justify-center"><div className="w-8 h-8 border-4 border-gold/30 border-t-gold rounded-full animate-spin" /></div>;
  if (!salon) return <div className="text-center py-20 text-xl text-gray-500">Salon not found</div>;

  return (
    <div className="bg-gray-50 min-h-screen pb-20">
      {/* Hero */}
      <div className="relative h-64 md:h-96">
        <img src={salon.image || 'https://images.unsplash.com/photo-1560066984-138dadb4c035?w=1200&q=80'}
             alt={salon.name} className="w-full h-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent" />
        <div className="absolute bottom-0 left-0 w-full p-6 md:p-12">
          <div className="max-w-6xl mx-auto flex flex-col md:flex-row md:items-end justify-between gap-6">
            <div className="text-white">
              <div className="flex gap-2 mb-3">
                <span className="badge bg-white/20 text-white backdrop-blur border-none">{salon.priceRange}</span>
                {salon.tags && JSON.parse(salon.tags).map((t: string) => (
                  <span key={t} className="badge bg-white/20 text-white backdrop-blur border-none capitalize">{t}</span>
                ))}
              </div>
              <h1 className="font-display text-4xl md:text-5xl font-bold mb-2">{salon.name}</h1>
              <div className="flex flex-wrap items-center gap-4 text-sm text-white/80">
                <div className="flex items-center gap-1"><MapPin className="w-4 h-4" /> {salon.address}</div>
                <div className="flex items-center gap-1"><Star className="w-4 h-4 fill-amber-400 text-amber-400" /> {Number(salon.rating).toFixed(1)} ({salon.reviewCount} reviews)</div>
              </div>
            </div>
            <Link to={`/book/${salon.id}`}
              className="btn-primary text-lg px-8 py-4 shadow-xl whitespace-nowrap">
              Book Appointment
            </Link>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 py-8 grid md:grid-cols-3 gap-8">
        {/* Left Col */}
        <div className="md:col-span-2 space-y-8">
          {/* About */}
          <div className="card p-6 md:p-8">
            <h2 className="text-xl font-bold mb-4 font-display">About</h2>
            <p className="text-gray-600 leading-relaxed">{salon.description}</p>
            <div className="grid sm:grid-cols-2 gap-4 mt-6 pt-6 border-t border-gray-100">
              <div className="flex items-center gap-3 text-sm text-gray-600">
                <div className="w-10 h-10 rounded-full bg-gray-50 flex items-center justify-center"><Clock className="w-5 h-5 text-gray-400" /></div>
                <div><p className="font-medium text-dark">Open Hours</p><p>{salon.openHours}</p></div>
              </div>
              <div className="flex items-center gap-3 text-sm text-gray-600">
                <div className="w-10 h-10 rounded-full bg-gray-50 flex items-center justify-center"><Phone className="w-5 h-5 text-gray-400" /></div>
                <div><p className="font-medium text-dark">Contact</p><p>{salon.phone}</p></div>
              </div>
            </div>
          </div>

          {/* Services */}
          <div className="card p-6 md:p-8">
            <h2 className="text-xl font-bold mb-6 font-display">Services Menu</h2>
            <div className="space-y-4">
              {salon.services?.map(s => (
                <div key={s.id} className="flex items-center justify-between p-4 rounded-xl hover:bg-gray-50 transition-colors border border-transparent hover:border-gray-100">
                  <div>
                    <h4 className="font-semibold text-dark">{s.name}</h4>
                    {s.duration && <p className="text-sm text-gray-500 mt-1">{s.duration} mins</p>}
                  </div>
                  <div className="flex items-center gap-4">
                    <span className="font-bold text-dark">₹{s.price}</span>
                    <Link to={`/book/${salon.id}?service=${s.id}`} className="btn-outline text-sm py-1.5 px-4 border-gray-200">Book</Link>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* AI Summary */}
          {reviews.length > 0 && (
            <div className="card overflow-hidden">
              <div className="bg-ai-card border-b border-pink-100 p-6 flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-white flex items-center justify-center shadow-sm">
                  <Sparkles className="w-5 h-5 text-rose" />
                </div>
                <div>
                  <h3 className="font-bold text-dark font-display">AI Review Summary</h3>
                  <p className="text-sm text-gray-600">Analyzed by Gemini AI based on {reviews.length} reviews</p>
                </div>
              </div>
              <div className="p-6 md:p-8">
                {summaryLoading ? (
                  <div className="flex flex-col items-center justify-center py-6 text-center animate-pulse gap-3">
                    <div className="w-6 h-6 border-2 border-rose border-t-transparent rounded-full animate-spin" />
                    <p className="text-xs text-gray-500 font-medium tracking-wide">
                      {summaryPhrases[summaryLoaderIndex]}
                    </p>
                  </div>
                ) : summary ? (
                  <div className="grid sm:grid-cols-2 gap-6">
                    <div>
                      <h4 className="text-sm font-bold text-green-700 uppercase tracking-wide mb-3 flex items-center gap-2">
                        <div className="w-2 h-2 rounded-full bg-green-500"/> Pros
                      </h4>
                      <ul className="space-y-2 text-sm text-gray-600">
                        {summary.pros.map((p, i) => <li key={i}>• {p}</li>)}
                      </ul>
                    </div>
                    <div>
                      <h4 className="text-sm font-bold text-amber-700 uppercase tracking-wide mb-3 flex items-center gap-2">
                        <div className="w-2 h-2 rounded-full bg-amber-500"/> Cons
                      </h4>
                      <ul className="space-y-2 text-sm text-gray-600">
                        {summary.cons.map((c, i) => <li key={i}>• {c}</li>)}
                      </ul>
                    </div>
                    <div className="sm:col-span-2 pt-4 border-t border-gray-100">
                      <p className="text-sm text-gray-600"><strong>Overall Sentiment:</strong> <span className="text-dark font-medium">{summary.sentiment} ({summary.score}/5)</span></p>
                    </div>
                  </div>
                ) : null}
              </div>
            </div>
          )}

          {/* Reviews */}
          <div className="card p-6 md:p-8">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold font-display">Customer Reviews</h2>
              {user ? (
                <button className="text-gold font-medium text-sm hover:underline">Write a Review</button>
              ) : (
                <Link to="/login" className="text-gray-500 text-sm hover:text-dark">Login to review</Link>
              )}
            </div>
            {reviews.length === 0 ? (
              <p className="text-gray-500 text-center py-6">No reviews yet.</p>
            ) : (
              <div className="space-y-6">
                {reviews.map(r => (
                  <div key={r.id} className="border-b border-gray-100 last:border-0 pb-6 last:pb-0">
                    <div className="flex items-center gap-3 mb-3">
                      <div className="w-10 h-10 rounded-full bg-gradient-to-br from-gold to-rose flex items-center justify-center text-white font-bold text-sm">
                        {r.userName.charAt(0)}
                      </div>
                      <div>
                        <p className="font-semibold text-dark text-sm">{r.userName}</p>
                        <div className="flex gap-0.5 mt-0.5">
                          {[...Array(5)].map((_, i) => (
                            <Star key={i} className={`w-3 h-3 ${i < r.rating ? 'fill-amber-400 text-amber-400' : 'text-gray-200 fill-gray-200'}`} />
                          ))}
                        </div>
                      </div>
                      <span className="ml-auto text-xs text-gray-400">
                        {new Date(r.createdAt).toLocaleDateString()}
                      </span>
                    </div>
                    <p className="text-sm text-gray-600 leading-relaxed">{r.comment}</p>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Right Col */}
        <div className="space-y-6">
          <div className="card p-4 overflow-hidden sticky top-24 space-y-4">
            {/* Location Info */}
            <div className="rounded-xl bg-gray-50 border border-gray-100 p-5">
              <h3 className="font-semibold text-dark text-sm mb-3 flex items-center gap-2">
                <MapPin className="w-4 h-4 text-gold" /> Location
              </h3>
              <p className="text-sm text-gray-600">{salon.address}</p>
              {salon.area && <p className="text-sm text-gray-500 mt-1">{salon.area}, Chennai</p>}
            </div>

            {/* Interactive map */}
            {salon.latitude && salon.longitude && (
              <div className="h-60 rounded-xl overflow-hidden">
                <InteractiveMap
                  latitude={salon.latitude}
                  longitude={salon.longitude}
                  salonName={salon.name}
                  address={salon.address}
                />
              </div>
            )}

            {/* Stylists Team Card */}
            {salon.stylists && salon.stylists.length > 0 && (
              <div className="rounded-xl border border-gray-100 p-5 space-y-4">
                <h3 className="font-semibold text-dark text-sm flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-rose" /> Meet our Experts
                </h3>
                <div className="space-y-3.5">
                  {salon.stylists.map((stylist) => (
                    <div key={stylist.id} className="flex items-center gap-3">
                      <img 
                        src={stylist.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&q=80'} 
                        alt={stylist.name} 
                        className="w-9 h-9 rounded-full object-cover border border-gold/20"
                      />
                      <div className="flex-1 min-w-0">
                        <p className="text-xs font-semibold text-dark truncate">{stylist.name}</p>
                        <p className="text-[10px] text-gray-500 truncate">{stylist.specialization}</p>
                      </div>
                      <div className="flex items-center gap-0.5 text-[10px] font-bold text-amber-600 bg-amber-50 px-2 py-0.5 rounded-full border border-amber-200">
                        <Star className="w-2.5 h-2.5 fill-amber-500 text-amber-500" />
                        <span>{Number(stylist.rating).toFixed(1)}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            <div className="p-4 rounded-xl bg-blue-50 flex gap-3 items-start">
              <AlertCircle className="w-5 h-5 text-blue-500 flex-shrink-0" />
              <p className="text-xs text-blue-800 leading-relaxed">
                Some reviews and slots are AI-generated demo data for presentation purposes.
              </p>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
