import { Link } from 'react-router-dom';
import { Sparkles, MapPin, Camera, MessageCircle, Share2 } from 'lucide-react';

export default function Footer() {
  return (
    <footer style={{ background: 'linear-gradient(135deg, #1a0533 0%, #0a0010 100%)' }} className="text-white/80">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10 mb-10">
          {/* Brand */}
          <div className="md:col-span-2">
            <Link to="/" className="flex items-center gap-2 mb-4">
              <div className="w-9 h-9 rounded-full flex items-center justify-center"
                   style={{ background: 'linear-gradient(135deg, #C9A84C, #E8A0A0)' }}>
                <Sparkles className="w-5 h-5 text-white" />
              </div>
              <span className="font-display font-bold text-2xl text-white">Glowly.</span>
            </Link>
            <p className="text-sm leading-relaxed max-w-xs text-white/60">
              Chennai's AI-powered beauty concierge. Discover, compare, and book the perfect salon — tailored to your style, budget, and occasion.
            </p>
            <div className="flex items-center gap-1 mt-4 text-xs text-white/40">
              <MapPin className="w-3 h-3" /> Chennai, Tamil Nadu
            </div>
            <div className="flex gap-3 mt-5">
              {[Camera, MessageCircle, Share2].map((Icon, i) => (
                <a key={i} href="#"
                   className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center hover:bg-gold/30 transition-colors">
                  <Icon className="w-4 h-4 text-white/70" />
                </a>
              ))}
            </div>
          </div>

          {/* Links */}
          <div>
            <h4 className="text-white font-semibold mb-4 text-sm uppercase tracking-wider">Discover</h4>
            <ul className="space-y-2 text-sm">
              {[['Find Salons', '/salons'], ['AI Match', '/salon-match'], ['AI Concierge', '/ai-concierge'], ['Featured', '/salons?featured=true']].map(([label, href]) => (
                <li key={label}>
                  <Link to={href} className="text-white/60 hover:text-gold transition-colors">{label}</Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="text-white font-semibold mb-4 text-sm uppercase tracking-wider">Account</h4>
            <ul className="space-y-2 text-sm">
              {[['Sign In', '/login'], ['Register', '/register'], ['Dashboard', '/dashboard'], ['My Bookings', '/dashboard']].map(([label, href]) => (
                <li key={label}>
                  <Link to={href} className="text-white/60 hover:text-gold transition-colors">{label}</Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="border-t border-white/10 pt-6 flex flex-col md:flex-row justify-between items-center gap-3 text-xs text-white/40">
          <p>© 2026 Glowly — Chennai BeautyHub AI. Built for AI Startup Buildathon 2026.</p>
          <p className="text-center text-white/30">
            ⚠️ Some reviews and booking availability are AI-generated demo data for demonstration purposes only.
          </p>
        </div>
      </div>
    </footer>
  );
}
