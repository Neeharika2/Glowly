import { useEffect, useState } from 'react';
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
      .catch(() => setTip("Apply a light SPF moisturiser before stepping out — Chennai's sun can be harsh on skin!"))
      .finally(() => setLoading(false));
  }, []);

  return (
    <section className="py-12 border-y border-dark/[0.06]">
      <div className="gl-container-narrow text-center">
        <p className="text-xs font-medium text-gold uppercase tracking-widest mb-3">
          Today's Tip
        </p>
        {loading ? (
          <div className="h-5 bg-dark/5 animate-pulse w-3/4 mx-auto" />
        ) : (
          <p className="text-sm text-dark/60 leading-relaxed max-w-lg mx-auto">{tip}</p>
        )}
      </div>
    </section>
  );
}
