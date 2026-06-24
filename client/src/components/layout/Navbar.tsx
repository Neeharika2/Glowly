import { useState } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { Menu, X, User, LogOut, Heart } from 'lucide-react';
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
    { to: '/ai-concierge', label: 'Concierge' },
  ];

  return (
    <nav className="sticky top-0 z-50 bg-white border-b border-dark/[0.06]">
      <div className="gl-container">
        <div className="flex items-center justify-between h-16">
          <Link to="/" className="flex items-center gap-2">
            <span className="font-display text-xl text-dark tracking-tight">
              Glowly<span className="text-gold">.</span>
            </span>
          </Link>

          <div className="hidden md:flex items-center gap-1">
            {navLinks.map((l) => (
              <NavLink
                key={l.to}
                to={l.to}
                className={({ isActive }) =>
                  `px-4 py-2 text-sm font-medium transition-colors duration-200 ${
                    isActive ? 'text-gold' : 'text-dark/60 hover:text-dark'
                  }`
                }
              >
                {l.label}
              </NavLink>
            ))}
          </div>

          <div className="hidden md:flex items-center gap-3">
            {user ? (
              <div className="relative">
                <button
                  onClick={() => setDropOpen(!dropOpen)}
                  className="flex items-center gap-2 px-3 py-2 text-sm"
                >
                  <div className="w-7 h-7 bg-dark text-white flex items-center justify-center text-xs font-medium">
                    {user.name.charAt(0).toUpperCase()}
                  </div>
                  <span className="text-sm text-dark">{user.name.split(' ')[0]}</span>
                </button>
                {dropOpen && (
                  <div className="absolute right-0 top-full mt-2 w-48 bg-white border border-dark/[0.06] shadow-card-hover">
                    <Link to="/dashboard" onClick={() => setDropOpen(false)}
                      className="flex items-center gap-3 px-4 py-3 text-sm text-dark/70 hover:text-dark hover:bg-dark/[0.02] transition-colors">
                      <User className="w-4 h-4" /> Dashboard
                    </Link>
                    <Link to="/dashboard?tab=favourites" onClick={() => setDropOpen(false)}
                      className="flex items-center gap-3 px-4 py-3 text-sm text-dark/70 hover:text-dark hover:bg-dark/[0.02] transition-colors">
                      <Heart className="w-4 h-4" /> Favourites
                    </Link>
                    <hr className="border-dark/[0.06]" />
                    <button onClick={handleLogout}
                      className="w-full flex items-center gap-3 px-4 py-3 text-sm text-dark/50 hover:text-dark transition-colors">
                      <LogOut className="w-4 h-4" /> Sign Out
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <>
                <Link to="/login" className="gl-btn text-xs">Sign In</Link>
                <Link to="/register" className="gl-btn-primary text-xs">Get Started</Link>
              </>
            )}
          </div>

          <button className="md:hidden p-2" onClick={() => setMenuOpen(!menuOpen)}>
            {menuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {menuOpen && (
        <div className="md:hidden border-t border-dark/[0.06] bg-white px-6 py-4 space-y-1">
          {navLinks.map((l) => (
            <NavLink key={l.to} to={l.to} onClick={() => setMenuOpen(false)}
              className="block px-3 py-2.5 text-sm font-medium text-dark/60 hover:text-dark">
              {l.label}
            </NavLink>
          ))}
          <hr className="border-dark/[0.06] my-2" />
          {user ? (
            <>
              <Link to="/dashboard" onClick={() => setMenuOpen(false)}
                className="flex items-center gap-2 px-3 py-2.5 text-sm text-dark/60 hover:text-dark">
                <User className="w-4 h-4" /> Dashboard
              </Link>
              <button onClick={handleLogout}
                className="flex items-center gap-2 px-3 py-2.5 text-sm text-dark/60 hover:text-dark">
                <LogOut className="w-4 h-4" /> Sign Out
              </button>
            </>
          ) : (
            <div className="flex gap-2 pt-2">
              <Link to="/login" onClick={() => setMenuOpen(false)}
                className="gl-btn text-sm flex-1 justify-center">Sign In</Link>
              <Link to="/register" onClick={() => setMenuOpen(false)}
                className="gl-btn-primary text-sm flex-1 justify-center">Register</Link>
            </div>
          )}
        </div>
      )}
    </nav>
  );
}
