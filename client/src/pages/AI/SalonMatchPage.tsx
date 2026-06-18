import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Sparkles, ChevronRight, CheckCircle2, ChevronLeft, MapPin } from 'lucide-react';
import api from '../../lib/api';
import { SalonMatchInput, SalonMatchResult } from '../../types';

const OCCASIONS = ['Casual', 'Bridal', 'Party', 'Special Event', 'Routine Grooming'];
const HAIR_TYPES = ['Straight', 'Wavy', 'Curly', 'Coily', 'Treated/Colored'];
const SKIN_TYPES = ['Normal', 'Oily', 'Dry', 'Combination', 'Sensitive'];
const BUDGETS = ['₹500 - ₹1500', '₹1500 - ₹3000', '₹3000 - ₹5000', '₹5000+'];
const AREAS = ['Anna Nagar', 'T Nagar', 'Adyar', 'Nungambakkam', 'OMR', 'Velachery', 'Anywhere'];

const LOADER_PHRASES = [
  "Gemini AI is analyzing salons across Chennai based on your profile...",
  "Consulting our top local beauty specialists...",
  "Filtering salons in your preferred areas...",
  "Matching services with your budget range...",
  "Comparing hair and skin type suitability scorecards...",
  "Almost there! Polishing your recommendations..."
];

export default function SalonMatchPage() {
  const [step, setStep] = useState<number>(() => {
    const saved = sessionStorage.getItem('glowly_match_step');
    return saved ? parseInt(saved, 10) : 0;
  });
  const [data, setData] = useState<SalonMatchInput>(() => {
    const saved = sessionStorage.getItem('glowly_match_data');
    return saved ? JSON.parse(saved) : { occasion: '', hairType: '', skinType: '', budget: '', area: '' };
  });
  const [loading, setLoading] = useState(false);
  const [loaderTextIndex, setLoaderTextIndex] = useState(0);
  const [results, setResults] = useState<SalonMatchResult[] | null>(() => {
    const saved = sessionStorage.getItem('glowly_match_results');
    return saved ? JSON.parse(saved) : null;
  });
  const [error, setError] = useState<string | null>(null);

  const steps = [
    { title: 'What is the occasion?', key: 'occasion', options: OCCASIONS },
    { title: 'What is your hair type?', key: 'hairType', options: HAIR_TYPES },
    { title: 'What is your skin type?', key: 'skinType', options: SKIN_TYPES },
    { title: 'What is your budget?', key: 'budget', options: BUDGETS },
    { title: 'Preferred area in Chennai?', key: 'area', options: AREAS },
  ];

  useEffect(() => {
    let interval: any;
    if (loading) {
      setLoaderTextIndex(0);
      interval = setInterval(() => {
        setLoaderTextIndex((prev) => (prev + 1) % LOADER_PHRASES.length);
      }, 3500);
    }
    return () => clearInterval(interval);
  }, [loading]);

  useEffect(() => {
    sessionStorage.setItem('glowly_match_step', step.toString());
  }, [step]);

  useEffect(() => {
    sessionStorage.setItem('glowly_match_data', JSON.stringify(data));
  }, [data]);

  useEffect(() => {
    if (results) {
      sessionStorage.setItem('glowly_match_results', JSON.stringify(results));
    } else {
      sessionStorage.removeItem('glowly_match_results');
    }
  }, [results]);

  const handleRetake = () => {
    sessionStorage.removeItem('glowly_match_step');
    sessionStorage.removeItem('glowly_match_data');
    sessionStorage.removeItem('glowly_match_results');
    setResults(null);
    setStep(0);
    setData({ occasion: '', hairType: '', skinType: '', budget: '', area: '' });
  };

  const handleSelect = (val: string) => {
    const key = steps[step].key as keyof SalonMatchInput;
    setData({ ...data, [key]: val });
    if (step < steps.length - 1) {
      setTimeout(() => setStep(step + 1), 300);
    } else {
      submitQuiz({ ...data, [key]: val });
    }
  };

  const submitQuiz = async (finalData: SalonMatchInput) => {
    setLoading(true);
    setError(null);
    try {
      const res = await api.post('/ai/salon-match', finalData);
      setResults(res.data.results);
    } catch (err: any) {
      const status = err?.response?.status;
      if (status === 429) {
        setError('AI is experiencing high demand right now. Please wait a moment and try again.');
      } else {
        setError('Could not get AI recommendations. Please try again.');
      }
      setStep(0);
    } finally {
      setLoading(false);
    }
  };

  if (results) {
    return (
      <div className="min-h-screen bg-gray-50 py-12 px-4">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-10">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-ai-card border border-pink-100 text-pink-700 text-sm font-semibold mb-4">
              <Sparkles className="w-4 h-4" /> AI Perfect Match
            </div>
            <h1 className="font-display text-3xl md:text-4xl font-bold">Your Top 3 Recommended Salons</h1>
            <p className="text-gray-500 mt-2">Based on your {data.occasion} occasion and ₹{data.budget} budget.</p>
          </div>

          <div className="space-y-6">
            {results.map((r, i) => (
              <div key={r.salon.id} className="card p-6 flex flex-col md:flex-row gap-6 relative overflow-hidden animate-slide-up" style={{ animationDelay: `${i*150}ms` }}>
                {i === 0 && <div className="absolute top-0 right-0 bg-gold text-white text-xs font-bold px-3 py-1 rounded-bl-lg z-10">Best Match</div>}
                
                <img src={r.salon.image} className="w-full md:w-64 h-48 md:h-full object-cover rounded-xl shrink-0" />
                
                <div className="flex-1 flex flex-col">
                  <div className="flex justify-between items-start mb-2">
                    <div>
                      <h3 className="text-xl font-bold font-display">{r.salon.name}</h3>
                      <p className="text-gray-500 text-sm flex items-center gap-1 mt-1"><MapPin className="w-3.5 h-3.5"/> {r.salon.area}</p>
                    </div>
                    <div className="w-14 h-14 rounded-full border-4 border-green-100 flex items-center justify-center shrink-0">
                      <span className="font-bold text-green-600 text-lg">{r.matchScore}%</span>
                    </div>
                  </div>

                  <div className="bg-gray-50 rounded-xl p-4 my-4 flex-1">
                    <p className="text-sm text-gray-700 leading-relaxed italic">"{r.reason}"</p>
                  </div>

                  <div className="flex items-center justify-between mt-auto">
                    <div>
                      <p className="text-xs text-gray-400 font-medium uppercase tracking-wide mb-1">AI Recommends:</p>
                      <div className="flex gap-1 flex-wrap">
                        {r.recommendedServices.slice(0, 2).map((s, idx) => (
                          <span key={idx} className="badge bg-gold/10 text-gold-700 border border-gold/20 text-[10px]">{s}</span>
                        ))}
                      </div>
                    </div>
                    <Link to={`/salons/${r.salon.id}`} className="btn-primary py-2 px-5 text-sm">View Salon</Link>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="text-center mt-10">
            <button onClick={handleRetake}
              className="text-gray-500 hover:text-dark font-medium underline text-sm cursor-pointer">Retake Quiz</button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-[90vh] bg-gray-50 flex items-center justify-center py-12 px-4">
      <div className="max-w-xl w-full">
        {loading ? (
          <div className="card p-12 text-center border-gold/30">
            <div className="w-16 h-16 rounded-full bg-ai-card flex items-center justify-center mx-auto mb-6 shadow-rose border border-pink-100">
              <Sparkles className="w-8 h-8 text-rose animate-spin" style={{ animationDuration: '3s' }} />
            </div>
            <h2 className="text-2xl font-bold font-display mb-2">Finding your perfect match...</h2>
            <p className="text-gray-500 min-h-[40px] flex items-center justify-center text-sm font-medium transition-all duration-300">
              {LOADER_PHRASES[loaderTextIndex]}
            </p>
          </div>
        ) : (
          <div className="card p-8 bg-white relative overflow-hidden animate-slide-up">
            <div className="absolute top-0 left-0 h-1 bg-gold transition-all duration-500" style={{ width: `${(step / steps.length) * 100}%` }} />

            {/* Inline error banner */}
            {error && (
              <div className="mb-6 p-4 rounded-xl bg-rose-50 border border-rose-200 flex items-start gap-3">
                <span className="text-rose-500 text-lg">⚠️</span>
                <div>
                  <p className="text-sm font-semibold text-rose-800">Couldn't get recommendations</p>
                  <p className="text-xs text-rose-600 mt-0.5">{error}</p>
                </div>
                <button onClick={() => setError(null)} className="ml-auto text-rose-400 hover:text-rose-600 text-lg leading-none">×</button>
              </div>
            )}
            
            <div className="flex items-center gap-2 text-sm font-medium text-gold mb-8">
              {step > 0 && <button onClick={() => setStep(step-1)} className="hover:underline flex items-center"><ChevronLeft className="w-4 h-4"/> Back</button>}
              <span className={step > 0 ? 'ml-auto' : ''}>Step {step + 1} of {steps.length}</span>
            </div>

            <h2 className="text-3xl font-bold font-display mb-8 text-center">{steps[step].title}</h2>

            <div className="space-y-3">
              {steps[step].options.map((opt) => (
                <button key={opt} onClick={() => handleSelect(opt)}
                  className={`w-full text-left p-4 rounded-xl border-2 transition-all font-medium text-lg flex items-center justify-between group ${data[steps[step].key as keyof SalonMatchInput] === opt ? 'border-gold bg-amber-50 text-gold shadow-sm' : 'border-gray-100 text-gray-600 hover:border-gray-300 hover:bg-gray-50'}`}>
                  {opt}
                  {data[steps[step].key as keyof SalonMatchInput] === opt ? <CheckCircle2 className="w-5 h-5 text-gold" /> : <ChevronRight className="w-5 h-5 text-gray-300 opacity-0 group-hover:opacity-100 transition-opacity" />}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
