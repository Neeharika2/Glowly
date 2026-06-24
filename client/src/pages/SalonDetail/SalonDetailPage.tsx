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

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="w-6 h-6 border border-dark/15 border-t-dark rounded-full animate-spin" />
    </div>
  );

  if (!salon) return (
    <div className="text-center py-20 text-dark/50">Salon not found</div>
  );

  const tags: string[] = salon.tags ? JSON.parse(salon.tags) : [];
  const hasStylists = salon.stylists && salon.stylists.length > 0;

  return (
    <div className="min-h-screen pb-20">

      {/* ── Hero ── */}
      <section className="py-16 md:py-20">
        <div className="gl-container">
          <div className="grid md:grid-cols-2 gap-10 md:gap-14 items-start">
            <div className="g-mirror">
              <img
                src={salon.image || 'https://images.unsplash.com/photo-1560066984-138dadb4c035?w=800&q=85'}
                alt={salon.name}
                className="w-full h-[420px] md:h-[560px] object-cover"
              />
            </div>
            <div className="pt-0 md:pt-4">
              <div className="flex flex-wrap gap-2 mb-5">
                <span className="font-mono text-xs text-gold/70 border border-gold/20 px-2 py-1">{salon.priceRange}</span>
                {tags.map((t: string) => (
                  <span key={t} className="text-xs text-dark/40 border border-dark/10 px-2 py-1 capitalize">{t}</span>
                ))}
              </div>

              <h1 className="font-display text-4xl md:text-5xl lg:text-6xl text-dark leading-[1.06] mb-4">
                {salon.name}
              </h1>

              <div className="flex items-center gap-1 text-sm text-dark/50 mb-1">
                <MapPin className="w-4 h-4 text-dark/30 flex-shrink-0" />
                <span>{salon.address}</span>
              </div>

              <div className="flex items-center gap-3 text-sm text-dark/50 mb-6">
                <span className="font-mono text-dark">{Number(salon.rating).toFixed(1)}</span>
                <span className="w-px h-3 bg-dark/10" />
                <span>{salon.reviewCount} reviews</span>
              </div>

              <hr className="border-dark/[0.06] mb-6" />

              <p className="text-dark/60 text-sm leading-relaxed mb-8">
                {salon.description}
              </p>

              <Link to={`/book/${salon.id}`}
                className="gl-btn-primary px-8 py-3 text-sm inline-flex items-center gap-2">
                Book Appointment <span aria-hidden="true">&rarr;</span>
              </Link>

              <div className="flex items-center gap-6 mt-8 pt-6 border-t border-dark/[0.06] text-sm text-dark/50">
                <div className="flex items-center gap-2">
                  <Clock className="w-4 h-4 text-clay" />
                  <span>{salon.openHours}</span>
                </div>
                {salon.phone && (
                  <>
                    <span className="w-px h-3 bg-dark/10" />
                    <div className="flex items-center gap-2">
                      <Phone className="w-4 h-4 text-clay" />
                      <span>{salon.phone}</span>
                    </div>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── Services ── */}
      <section className="py-16 md:py-20 bg-blush/30">
        <div className="gl-container">
          <div className="g-mirror p-6 md:p-8 md:p-10 bg-white">
            <div className="flex items-center justify-between mb-8">
              <h2 className="font-display text-2xl md:text-3xl text-dark">Services</h2>
              <span className="font-mono text-xs text-dark/40">{salon.services?.length || 0} treatments</span>
            </div>
            <div className="divide-y divide-dark/[0.06]">
              {salon.services?.map(s => (
                <div key={s.id} className="flex items-center justify-between py-4 md:py-5 first:pt-0 last:pb-0">
                  <div className="flex-1 min-w-0 mr-4">
                    <h4 className="font-medium text-dark">{s.name}</h4>
                    {s.duration && (
                      <p className="text-xs text-dark/40 mt-0.5">{s.duration} min</p>
                    )}
                  </div>
                  <div className="flex items-center gap-4 md:gap-6 flex-shrink-0">
                    <span className="font-mono text-lg md:text-xl text-dark">₹{s.price}</span>
                    <Link to={`/book/${salon.id}?service=${s.id}`}
                      className="gl-btn text-xs py-1.5 px-4">
                      Book <span aria-hidden="true">&rarr;</span>
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── Stylists + AI Summary ── */}
      {(hasStylists || (reviews.length > 0)) && (
        <section className="py-16 md:py-20">
          <div className="gl-container">
            <div className={`grid ${hasStylists && reviews.length > 0 ? 'md:grid-cols-2 gap-8' : ''} items-stretch`}>
              {hasStylists && (
                <div className="flex flex-col h-full">
                  <h2 className="font-display text-2xl text-dark mb-6">Stylists</h2>
                  <div className="flex flex-wrap gap-4">
                    {salon.stylists!.map((stylist) => (
                      <div key={stylist.id} className="g-mirror p-4 text-center flex-1 min-w-[140px] max-w-[180px]">
                        <img
                          src={stylist.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&q=85'}
                          alt={stylist.name}
                          className="w-16 h-16 rounded-full object-cover mx-auto mb-3"
                        />
                        <p className="font-medium text-dark text-xs truncate">{stylist.name}</p>
                        <p className="text-[10px] text-dark/40 truncate mt-0.5">{stylist.specialization}</p>
                        <div className="flex items-center justify-center gap-1 mt-2">
                          <Star className="w-3 h-3 fill-dark/20 text-dark/20" />
                          <span className="font-mono text-xs text-dark/50">{Number(stylist.rating).toFixed(1)}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {reviews.length > 0 && (
                <div className={`flex flex-col h-full ${hasStylists ? 'mt-8 md:mt-0' : ''}`}>
                  <h2 className="font-display text-2xl text-dark mb-6">AI Summary</h2>
                  <div className="g-mirror bg-blush/30 flex-1 flex flex-col">
                    <div className="border-b border-dark/[0.06] p-5 md:p-6 flex items-center gap-3">
                      <Sparkles className="w-5 h-5 text-clay flex-shrink-0" />
                      <div>
                        <p className="text-xs text-dark/50 font-medium">Analyzed from {reviews.length} reviews</p>
                      </div>
                    </div>
                    <div className="p-5 md:p-6 flex-1 flex flex-col justify-between">
                      {summaryLoading ? (
                        <div className="flex-1 flex items-center justify-center gap-3 py-8">
                          <div className="w-4 h-4 border border-clay/30 border-t-clay rounded-full animate-spin" />
                          <p className="text-xs text-dark/40">{summaryPhrases[summaryLoaderIndex]}</p>
                        </div>
                      ) : summary ? (
                        <div className="space-y-5 flex-1 flex flex-col justify-between">
                          <div className="space-y-4">
                            {summary.pros.length > 0 && (
                              <div>
                                <p className="text-[10px] font-semibold uppercase tracking-widest text-dark/50 mb-2">Pros</p>
                                <ul className="space-y-1.5">
                                  {summary.pros.map((p, i) => (
                                    <li key={i} className="text-xs text-dark/60 flex gap-2">
                                      <span className="w-1.5 h-1.5 rounded-full bg-gold/60 mt-1.5 flex-shrink-0" />
                                      {p}
                                    </li>
                                  ))}
                                </ul>
                              </div>
                            )}
                            {summary.cons.length > 0 && (
                              <div>
                                <p className="text-[10px] font-semibold uppercase tracking-widest text-dark/50 mb-2">Cons</p>
                                <ul className="space-y-1.5">
                                  {summary.cons.map((c, i) => (
                                    <li key={i} className="text-xs text-dark/60 flex gap-2">
                                      <span className="w-1.5 h-1.5 rounded-full bg-dark/20 mt-1.5 flex-shrink-0" />
                                      {c}
                                    </li>
                                  ))}
                                </ul>
                              </div>
                            )}
                          </div>
                          <div className="pt-3 border-t border-dark/[0.06] flex items-center justify-between mt-auto">
                            <span className="text-xs text-dark/50">Sentiment</span>
                            <span className="font-mono text-sm text-dark">{summary.sentiment} &middot; {summary.score}/5</span>
                          </div>
                        </div>
                      ) : (
                        <div className="flex-1 flex items-center justify-center text-xs text-dark/40 py-8">
                          Unable to load review insights
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </section>
      )}

      {/* ── Reviews + Map ── */}
      <section className="py-16 md:py-20 bg-blush/30">
        <div className="gl-container">
          <div className="grid md:grid-cols-5 gap-8">
            <div className="md:col-span-3">
              <div className="g-mirror p-6 md:p-8 bg-white">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="font-display text-2xl text-dark">Reviews</h2>
                  {user ? (
                    <button className="text-sm text-gold hover:text-dark transition-colors">Write a Review</button>
                  ) : (
                    <Link to="/login" className="text-sm text-dark/40 hover:text-dark transition-colors">Login to review</Link>
                  )}
                </div>
                {reviews.length === 0 ? (
                  <p className="text-dark/40 text-center py-8">No reviews yet.</p>
                ) : (
                  <div className="space-y-5">
                    {reviews.map(r => (
                      <div key={r.id} className="border-b border-dark/[0.06] last:border-0 pb-5 last:pb-0">
                        <div className="flex items-center gap-3 mb-2">
                          <div className="w-8 h-8 bg-dark text-white flex items-center justify-center text-xs font-medium flex-shrink-0">
                            {r.userName.charAt(0)}
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="font-medium text-dark text-xs">{r.userName}</p>
                            <div className="flex gap-0.5 mt-0.5">
                              {[...Array(5)].map((_, i) => (
                                <Star key={i} className={`w-2.5 h-2.5 ${i < r.rating ? 'text-dark/70 fill-dark/70' : 'text-dark/10 fill-dark/10'}`} />
                              ))}
                            </div>
                          </div>
                          <span className="text-[10px] text-dark/30 flex-shrink-0">
                            {new Date(r.createdAt).toLocaleDateString()}
                          </span>
                        </div>
                        <p className="text-sm text-dark/60 leading-relaxed">{r.comment}</p>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>

            <div className="md:col-span-2 space-y-6">
              <div className="g-mirror p-5 bg-white">
                <h3 className="font-display text-sm text-dark mb-3 flex items-center gap-2">
                  <MapPin className="w-4 h-4 text-gold" /> Location
                </h3>
                <p className="text-sm text-dark/60">{salon.address}</p>
                {salon.area && <p className="text-xs text-dark/40 mt-1">{salon.area}, Chennai</p>}
              </div>

              {salon.latitude && salon.longitude && (
                <div className="g-mirror overflow-hidden bg-white">
                  <div className="h-56">
                    <InteractiveMap
                      latitude={salon.latitude}
                      longitude={salon.longitude}
                      salonName={salon.name}
                      address={salon.address}
                    />
                  </div>
                </div>
              )}

              <div className="p-4 border border-dark/[0.06] flex gap-3 items-start bg-blush/50">
                <AlertCircle className="w-4 h-4 text-clay flex-shrink-0 mt-0.5" />
                <p className="text-xs text-dark/50 leading-relaxed">
                  Some reviews and slots shown here are AI-generated demo data for presentation purposes.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

    </div>
  );
}
