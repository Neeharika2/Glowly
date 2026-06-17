import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Sparkles, Mail, Lock } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await login(email, password);
      navigate('/');
    } catch (err: any) {
      setError(err.response?.data?.error || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[85vh] flex items-center justify-center bg-gray-50 px-4 py-12">
      <div className="card w-full max-w-md p-8 bg-white animate-slide-up">
        <div className="text-center mb-8">
          <div className="w-12 h-12 mx-auto rounded-full bg-gold-rose flex items-center justify-center mb-4"
               style={{ background: 'linear-gradient(135deg, #C9A84C, #E8A0A0)' }}>
            <Sparkles className="w-6 h-6 text-white" />
          </div>
          <h1 className="text-2xl font-bold font-display text-dark">Welcome back</h1>
          <p className="text-gray-500 mt-2 text-sm">Sign in to book your next beauty appointment</p>
        </div>

        {error && (
          <div className="mb-6 p-3 bg-red-50 text-red-600 text-sm rounded-lg border border-red-100 text-center">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">Email Address</label>
            <div className="relative">
              <Mail className="absolute left-3 top-3.5 w-5 h-5 text-gray-400" />
              <input type="email" required value={email} onChange={(e) => setEmail(e.target.value)}
                className="input pl-10" placeholder="you@example.com" />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">Password</label>
            <div className="relative">
              <Lock className="absolute left-3 top-3.5 w-5 h-5 text-gray-400" />
              <input type="password" required value={password} onChange={(e) => setPassword(e.target.value)}
                className="input pl-10" placeholder="••••••••" />
            </div>
          </div>
          
          <button type="submit" disabled={loading} className="btn-primary w-full justify-center py-3.5 mt-2 shadow-gold">
            {loading ? 'Signing in...' : 'Sign In'}
          </button>
        </form>

        <div className="mt-8 text-center text-sm text-gray-500">
          Don't have an account? <Link to="/register" className="text-gold font-semibold hover:underline">Create one</Link>
        </div>
      </div>
    </div>
  );
}
