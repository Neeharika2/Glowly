import { useState } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { Sparkles, Menu, X, User, LogOut, LayoutDashboard, Heart } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

export default function Navbar() {
  const { user, logout } = useAuth();
  const [menuOpen, setMenuOpen] = useState(false);
  const [dropOpen, setDropOpen] = useState(false);
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate('/');
  };

  const navLinks = [
    { to: '/salons', label: 'Find Salons' },
    { to: '/salon-match', label: 'AI Match' },
    { to: '/ai-concierge', label: 'AI Concierge' },
  ];

  return (
    <nav className="sticky top-0 z-50 bg-white/90 backdrop-blur-md border-b border-gray-100 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2 group">
            <div className="w-8 h-8 rounded-full bg-gold-rose flex items-center justify-center"
                 style={{ background: 'linear-gradient(135deg, #C9A84C, #E8A0A0)' }}>
              <Sparkles className="w-4 h-4 text-white" />
            </div>
            <span className="font-display font-bold text-xl text-dark">
              Glowly<span className="gradient-text">.</span>
            </span>
          </Link>

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center gap-1">
            {navLinks.map((l) => (
              <NavLink
                key={l.to}
                to={l.to}
                className={({ isActive }) =>
                  `px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 ${
                    isActive ? 'bg-plum-900 text-white' : 'text-gray-600 hover:bg-gray-100 hover:text-dark'
                  }`
                }
              >
                {l.label}
              </NavLink>
            ))}
          </div>

          {/* Auth */}
          <div className="hidden md:flex items-center gap-3">
            {user ? (
              <div className="relative">
                <button
                  onClick={() => setDropOpen(!dropOpen)}
                  className="flex items-center gap-2 px-3 py-2 rounded-full hover:bg-gray-100 transition-all"
                >
                  <div className="w-8 h-8 rounded-full bg-hero-gradient flex items-center justify-center text-white text-sm font-bold"
                       style={{ background: 'linear-gradient(135deg, #1a0533, #6b1a4a)' }}>
                    {user.name.charAt(0).toUpperCase()}
                  </div>
                  <span className="text-sm font-medium text-dark">{user.name.split(' ')[0]}</span>
                </button>
                {dropOpen && (
                  <div className="absolute right-0 top-full mt-2 w-52 bg-white rounded-2xl shadow-card-hover border border-gray-100 overflow-hidden">
                    <Link to="/dashboard" onClick={() => setDropOpen(false)}
                      className="flex items-center gap-3 px-4 py-3 hover:bg-gray-50 text-sm text-dark transition-colors">
                      <LayoutDashboard className="w-4 h-4 text-gold" /> Dashboard
                    </Link>
                    <Link to="/dashboard?tab=favourites" onClick={() => setDropOpen(false)}
                      className="flex items-center gap-3 px-4 py-3 hover:bg-gray-50 text-sm text-dark transition-colors">
                      <Heart className="w-4 h-4 text-rose" /> Favourites
                    </Link>
                    <hr className="border-gray-100" />
                    <button onClick={handleLogout}
                      className="w-full flex items-center gap-3 px-4 py-3 hover:bg-red-50 text-sm text-red-500 transition-colors">
                      <LogOut className="w-4 h-4" /> Sign Out
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <>
                <Link to="/login" className="btn-ghost text-sm">Sign In</Link>
                <Link to="/register" className="btn-primary text-sm py-2 px-5">Get Started</Link>
              </>
            )}
          </div>

          {/* Mobile toggle */}
          <button className="md:hidden p-2 rounded-lg hover:bg-gray-100" onClick={() => setMenuOpen(!menuOpen)}>
            {menuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      {menuOpen && (
        <div className="md:hidden border-t border-gray-100 bg-white px-4 py-3 space-y-1 animate-fade-in">
          {navLinks.map((l) => (
            <NavLink key={l.to} to={l.to} onClick={() => setMenuOpen(false)}
              className="block px-4 py-2.5 rounded-xl text-sm font-medium text-gray-700 hover:bg-gray-100">
              {l.label}
            </NavLink>
          ))}
          <hr className="border-gray-100 my-2" />
          {user ? (
            <>
              <Link to="/dashboard" onClick={() => setMenuOpen(false)}
                className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium text-gray-700 hover:bg-gray-100">
                <User className="w-4 h-4" /> Dashboard
              </Link>
              <button onClick={handleLogout}
                className="w-full flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium text-red-500 hover:bg-red-50">
                <LogOut className="w-4 h-4" /> Sign Out
              </button>
            </>
          ) : (
            <div className="flex gap-2 pt-1">
              <Link to="/login" onClick={() => setMenuOpen(false)} className="btn-outline text-sm flex-1 justify-center">Sign In</Link>
              <Link to="/register" onClick={() => setMenuOpen(false)} className="btn-primary text-sm flex-1 justify-center">Register</Link>
            </div>
          )}
        </div>
      )}
    </nav>
  );
}
