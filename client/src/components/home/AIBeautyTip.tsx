import { useEffect, useState } from 'react';
import { Sparkles } from 'lucide-react';
import api from '../../lib/api';

export default function AIBeautyTip() {
  const [tip, setTip] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const today = new Date().toDateString();
    const cached = localStorage.getItem('beauty_tip');
    const cachedDate = localStorage.getItem('beauty_tip_date');
    if (cached && cachedDate === today) {
      setTip(cached);
      setLoading(false);
      return;
    }
    api.get('/ai/beauty-tip')
      .then((r) => {
        setTip(r.data.tip);
        localStorage.setItem('beauty_tip', r.data.tip);
        localStorage.setItem('beauty_tip_date', today);
      })
      .catch(() => setTip('Apply a light SPF moisturiser before stepping out — Chennai\'s sun can be harsh on skin!'))
      .finally(() => setLoading(false));
  }, []);

  return (
    <section className="py-12 px-4" style={{ background: 'linear-gradient(135deg, #f5e6ff 0%, #ffe6f0 100%)' }}>
      <div className="max-w-3xl mx-auto text-center">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/60 border border-pink-200 text-pink-700 text-xs font-medium mb-4">
          <Sparkles className="w-3 h-3" /> Today's AI Beauty Tip
        </div>
        {loading ? (
          <div className="h-6 bg-white/50 rounded-full animate-pulse w-3/4 mx-auto" />
        ) : (
          <p className="text-dark/80 text-lg font-medium leading-relaxed">{tip}</p>
        )}
      </div>
    </section>
  );
}
