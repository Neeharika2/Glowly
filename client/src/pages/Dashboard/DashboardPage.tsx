import { useEffect, useState } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { Calendar as CalendarIcon, Clock, MapPin, Heart, LayoutDashboard, User as UserIcon } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import api from '../../lib/api';
import { Booking, Salon } from '../../types';

export default function DashboardPage() {
  const { user } = useAuth();
  const [searchParams, setSearchParams] = useSearchParams();
  const tab = searchParams.get('tab') || 'bookings';

  const [bookings, setBookings] = useState<Booking[]>([]);
  const [favourites, setFavourites] = useState<Salon[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [bRes, fRes] = await Promise.all([
          api.get('/bookings/me'),
          api.get('/favourites/me'),
        ]);
        setBookings(bRes.data.bookings);
        setFavourites(fRes.data.favourites);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const handleCancel = async (id: number) => {
    if (!confirm('Cancel this booking?')) return;
    try {
      await api.delete(`/bookings/${id}`);
      setBookings(bookings.map(b => b.id === id ? { ...b, status: 'cancelled' } : b));
    } catch (err) {
      alert('Failed to cancel');
    }
  };

  const activeBookings = bookings.filter(b => b.status === 'confirmed');
  const pastBookings = bookings.filter(b => b.status !== 'confirmed');

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-3xl font-bold font-display mb-8">Hello, {user?.name.split(' ')[0]} 👋</h1>

        <div className="grid md:grid-cols-4 gap-8">
          {/* Sidebar */}
          <div className="space-y-2">
            <button onClick={() => setSearchParams({ tab: 'bookings' })}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl font-medium transition-colors ${tab === 'bookings' ? 'bg-plum-900 text-white' : 'text-gray-600 hover:bg-gray-100'}`}>
              <LayoutDashboard className="w-5 h-5" /> My Bookings
            </button>
            <button onClick={() => setSearchParams({ tab: 'favourites' })}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl font-medium transition-colors ${tab === 'favourites' ? 'bg-plum-900 text-white' : 'text-gray-600 hover:bg-gray-100'}`}>
              <Heart className="w-5 h-5" /> Favourites
            </button>
            <button onClick={() => setSearchParams({ tab: 'profile' })}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl font-medium transition-colors ${tab === 'profile' ? 'bg-plum-900 text-white' : 'text-gray-600 hover:bg-gray-100'}`}>
              <UserIcon className="w-5 h-5" /> Profile
            </button>
          </div>

          {/* Content */}
          <div className="md:col-span-3">
            {loading ? (
              <div className="h-64 bg-white rounded-2xl animate-pulse"></div>
            ) : tab === 'bookings' ? (
              <div className="space-y-8 animate-fade-in">
                {/* Upcoming */}
                <div>
                  <h2 className="text-xl font-bold mb-4 font-display">Upcoming Appointments ({activeBookings.length})</h2>
                  {activeBookings.length === 0 ? (
                    <div className="card p-8 text-center text-gray-500">No upcoming appointments. <Link to="/salons" className="text-gold font-medium ml-1">Find a salon</Link></div>
                  ) : (
                    <div className="grid gap-4">
                      {activeBookings.map(b => (
                        <div key={b.id} className="card p-5 flex flex-col md:flex-row md:items-center justify-between gap-4 border-l-4 border-l-gold">
                          <div className="flex items-center gap-4">
                            <div className="w-16 h-16 rounded-xl bg-gray-100 overflow-hidden flex-shrink-0">
                              <img src={b.salon?.image} alt={b.salon?.name} className="w-full h-full object-cover" />
                            </div>
                            <div>
                              <h3 className="font-bold text-dark">{b.salon?.name}</h3>
                              <p className="text-sm text-gray-500">{b.service?.name}</p>
                              <div className="flex gap-3 mt-2 text-xs font-medium text-gray-600">
                                <span className="flex items-center gap-1"><CalendarIcon className="w-3.5 h-3.5 text-gold"/> {new Date(b.date).toLocaleDateString()}</span>
                                <span className="flex items-center gap-1"><Clock className="w-3.5 h-3.5 text-gold"/> {b.time}</span>
                              </div>
                            </div>
                          </div>
                          <div className="flex items-center gap-3 md:flex-col md:items-end">
                            <span className="badge badge-gold">Confirmed</span>
                            <button onClick={() => handleCancel(b.id)} className="text-xs text-red-500 font-medium hover:underline">Cancel</button>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {/* Past */}
                {pastBookings.length > 0 && (
                  <div>
                    <h2 className="text-xl font-bold mb-4 font-display">History</h2>
                    <div className="grid gap-4 opacity-70">
                      {pastBookings.map(b => (
                        <div key={b.id} className="card p-5 flex flex-col md:flex-row md:items-center justify-between gap-4">
                          <div className="flex items-center gap-4">
                            <div className="w-16 h-16 rounded-xl bg-gray-200 overflow-hidden flex-shrink-0 opacity-50">
                              <img src={b.salon?.image} alt={b.salon?.name} className="w-full h-full object-cover grayscale" />
                            </div>
                            <div>
                              <h3 className="font-bold text-dark">{b.salon?.name}</h3>
                              <p className="text-sm text-gray-500">{b.service?.name}</p>
                              <div className="text-xs text-gray-400 mt-1">{new Date(b.date).toLocaleDateString()} at {b.time}</div>
                            </div>
                          </div>
                          <div>
                            <span className={`badge ${b.status === 'completed' ? 'badge-green' : 'bg-gray-100 text-gray-500'}`}>{b.status}</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            ) : tab === 'favourites' ? (
              <div className="animate-fade-in">
                <h2 className="text-xl font-bold mb-4 font-display">Saved Salons ({favourites.length})</h2>
                {favourites.length === 0 ? (
                  <div className="card p-8 text-center text-gray-500">No saved salons yet.</div>
                ) : (
                  <div className="grid sm:grid-cols-2 gap-6">
                    {favourites.map(s => (
                      <div key={s.id} className="card p-4 flex gap-4">
                        <img src={s.image} className="w-20 h-20 rounded-xl object-cover" />
                        <div className="flex-1">
                          <h3 className="font-semibold text-sm truncate">{s.name}</h3>
                          <p className="text-xs text-gray-500 flex items-center gap-1 my-1"><MapPin className="w-3 h-3"/> {s.area}</p>
                          <Link to={`/salons/${s.id}`} className="text-gold text-xs font-medium hover:underline mt-2 inline-block">View Details</Link>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            ) : (
              <div className="card p-8 animate-fade-in max-w-lg">
                <h2 className="text-xl font-bold mb-6 font-display">Profile Details</h2>
                <div className="space-y-4">
                  <div><label className="text-xs text-gray-500 font-medium uppercase tracking-wide">Name</label><p className="font-medium text-lg">{user?.name}</p></div>
                  <div><label className="text-xs text-gray-500 font-medium uppercase tracking-wide">Email</label><p className="font-medium">{user?.email}</p></div>
                  <div><label className="text-xs text-gray-500 font-medium uppercase tracking-wide">Member Since</label><p className="text-gray-600">{new Date(user?.createdAt || '').toLocaleDateString()}</p></div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
