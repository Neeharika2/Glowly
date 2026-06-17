import { Link } from 'react-router-dom';
import { Sparkles, MessageCircle, Zap, Star } from 'lucide-react';

export default function AIConciergeCTA() {
  return (
    <section className="py-20 px-4" style={{ background: 'linear-gradient(135deg, #1a0533 0%, #3d0d6b 50%, #6b1a4a 100%)' }}>
      <div className="max-w-6xl mx-auto grid md:grid-cols-2 gap-12 items-center">
        {/* Left */}
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/10 border border-white/20 text-white/80 text-xs mb-6">
            <Sparkles className="w-3 h-3 text-gold" /> Powered by Claude AI
          </div>
          <h2 className="font-display text-4xl md:text-5xl font-bold text-white leading-tight mb-5">
            Meet Your AI Beauty Concierge
          </h2>
          <p className="text-white/70 text-lg mb-8">
            Just describe what you need in plain English — bridal makeup, hair spa, budget, area — and our AI instantly recommends the perfect salon.
          </p>
          <div className="flex flex-col sm:flex-row gap-4">
            <Link to="/ai-concierge"
              className="flex items-center justify-center gap-2 px-7 py-4 rounded-full font-semibold text-dark transition-all hover:opacity-90"
              style={{ background: 'linear-gradient(90deg, #C9A84C 0%, #E8A0A0 100%)' }}>
              <MessageCircle className="w-5 h-5" /> Start Chatting
            </Link>
            <Link to="/salon-match"
              className="flex items-center justify-center gap-2 px-7 py-4 rounded-full font-semibold text-white border-2 border-white/30 hover:bg-white/10 transition-all">
              <Zap className="w-5 h-5" /> Take AI Quiz
            </Link>
          </div>
        </div>

        {/* Right — chat preview */}
        <div className="relative">
          <div className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-3xl p-6 space-y-4">
            <div className="flex items-center gap-3 mb-5 pb-4 border-b border-white/10">
              <div className="w-9 h-9 rounded-full flex items-center justify-center"
                   style={{ background: 'linear-gradient(135deg, #C9A84C, #E8A0A0)' }}>
                <Sparkles className="w-5 h-5 text-white" />
              </div>
              <div>
                <p className="text-white text-sm font-semibold">Glow AI</p>
                <div className="flex items-center gap-1"><div className="w-1.5 h-1.5 bg-green-400 rounded-full" /><p className="text-white/50 text-xs">Online</p></div>
              </div>
            </div>

            {/* Messages */}
            <div className="flex justify-end">
              <div className="bg-white/20 text-white text-sm px-4 py-2.5 rounded-2xl rounded-tr-sm max-w-[80%]">
                I need bridal makeup under ₹8000 in T Nagar 💍
              </div>
            </div>
            <div className="flex gap-2.5">
              <div className="w-7 h-7 rounded-full flex-shrink-0 flex items-center justify-center"
                   style={{ background: 'linear-gradient(135deg, #C9A84C, #E8A0A0)' }}>
                <Sparkles className="w-3.5 h-3.5 text-white" />
              </div>
              <div className="bg-white text-dark text-sm px-4 py-3 rounded-2xl rounded-tl-sm max-w-[80%] shadow-sm">
                <p className="font-medium text-dark mb-2">Here are my top picks for you! 💕</p>
                <p className="text-gray-600 text-xs">
                  <strong>Lakme Salon, T Nagar</strong> — ₹₹₹ · 4.6★ — Expert bridal team, stunning looks<br />
                  <strong>Femina Beauty, Adyar</strong> — ₹₹ · 4.5★ — Within your budget, great saree draping<br />
                  <strong>Naturals, Teynampet</strong> — ₹₹ · 4.5★ — Full bridal package available
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2 pt-2">
              {[<Star className="w-3 h-3" />, <Zap className="w-3 h-3" />].map((icon, i) => (
                <div key={i} className="flex items-center gap-1 px-2 py-1 rounded-full bg-white/10 text-white/60 text-xs">
                  {icon} {['Real-time AI', 'Instant match'][i]}
                </div>
              ))}
            </div>
          </div>
          {/* Float glow */}
          <div className="absolute -bottom-6 -right-6 w-32 h-32 rounded-full blur-2xl opacity-30"
               style={{ background: '#C9A84C' }} />
        </div>
      </div>
    </section>
  );
}
