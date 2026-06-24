import { Link } from 'react-router-dom';

export default function Footer() {
  return (
    <footer className="bg-umber-900 text-white/60">
      <div className="gl-container py-14">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10 mb-10">
          <div className="md:col-span-2">
            <Link to="/" className="inline-block mb-4">
              <span className="font-display text-2xl text-white">
                Glowly<span className="text-gold">.</span>
              </span>
            </Link>
            <p className="text-sm leading-relaxed max-w-xs text-white/40">
              Chennai's AI-powered beauty concierge. Discover, compare, and book the perfect salon.
            </p>
            <p className="text-xs text-white/30 mt-4">
              Chennai, Tamil Nadu
            </p>
          </div>
          <div>
            <h4 className="text-white/80 text-xs font-semibold uppercase tracking-widest mb-4">
              Discover
            </h4>
            <ul className="space-y-2.5 text-sm">
              {[['Find Salons', '/salons'], ['AI Match', '/salon-match'], ['AI Concierge', '/ai-concierge']].map(([label, href]) => (
                <li key={label}>
                  <Link to={href} className="text-white/40 hover:text-gold transition-colors duration-200">{label}</Link>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <h4 className="text-white/80 text-xs font-semibold uppercase tracking-widest mb-4">
              Account
            </h4>
            <ul className="space-y-2.5 text-sm">
              {[['Sign In', '/login'], ['Register', '/register'], ['Dashboard', '/dashboard']].map(([label, href]) => (
                <li key={label}>
                  <Link to={href} className="text-white/40 hover:text-gold transition-colors duration-200">{label}</Link>
                </li>
              ))}
            </ul>
          </div>
        </div>
        <div className="h-px bg-white/10" />
        <div className="pt-6 flex flex-col md:flex-row justify-between items-center gap-3 text-xs text-white/30">
          <p>&copy; 2026 Glowly — Chennai BeautyHub AI. Built for AI Startup Buildathon 2026.</p>
          <p className="text-center">
            AI-generated demo data for presentation purposes.
          </p>
        </div>
      </div>
    </footer>
  );
}
