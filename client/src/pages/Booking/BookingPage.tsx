import { useState, useEffect } from 'react';
import { useParams, useNavigate, useSearchParams } from 'react-router-dom';
import { CheckCircle2, ChevronRight, Calendar, Clock, CreditCard } from 'lucide-react';
import api from '../../lib/api';
import { Salon, Service } from '../../types';

const STEPS = ['Service', 'Date & Time', 'Confirm'];

export default function BookingPage() {
  const { salonId } = useParams();
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  const [salon, setSalon] = useState<Salon | null>(null);
  const [step, setStep] = useState(0);
  const [loading, setLoading] = useState(true);

  const [selectedService, setSelectedService] = useState<Service | null>(null);
  const [date, setDate] = useState<string>('');
  const [time, setTime] = useState<string>('');
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    api.get(`/salons/${salonId}`).then(res => {
      setSalon(res.data.salon);
      const preselectedId = searchParams.get('service');
      if (preselectedId) {
        const s = res.data.salon.services?.find((sv: Service) => sv.id === parseInt(preselectedId));
        if (s) setSelectedService(s);
      }
      setLoading(false);
    });
  }, [salonId, searchParams]);

  const handleBook = async () => {
    if (!selectedService || !date || !time) return;
    setSubmitting(true);
    try {
      await api.post('/bookings', {
        salonId,
        serviceId: selectedService.id,
        date,
        time
      });
      setSuccess(true);
    } catch (err) {
      console.error(err);
      alert('Booking failed');
    } finally {
      setSubmitting(false);
    }
  };

  const getDates = () => {
    const dates = [];
    for(let i=1; i<=14; i++) {
      const d = new Date();
      d.setDate(d.getDate() + i);
      dates.push(d);
    }
    return dates;
  };

  const times = ['10:00 AM', '11:00 AM', '12:00 PM', '02:00 PM', '03:00 PM', '05:00 PM', '06:00 PM'];

  if (loading || !salon) return <div className="min-h-[60vh] flex items-center justify-center"><div className="w-8 h-8 border-4 border-gold/30 border-t-gold rounded-full animate-spin" /></div>;

  if (success) {
    return (
      <div className="min-h-[80vh] flex items-center justify-center bg-gray-50 px-4">
        <div className="card max-w-md w-full p-8 text-center animate-slide-up">
          <div className="w-20 h-20 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-6">
            <CheckCircle2 className="w-10 h-10" />
          </div>
          <h2 className="text-2xl font-bold font-display mb-2">Booking Confirmed!</h2>
          <p className="text-gray-600 mb-8">
            Your appointment at <strong>{salon.name}</strong> is set for {date} at {time}.
          </p>
          <button onClick={() => navigate('/dashboard')} className="btn-primary w-full justify-center">
            View My Bookings
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4">
      <div className="max-w-3xl mx-auto">
        <h1 className="text-3xl font-bold font-display text-center mb-8">Book Appointment</h1>
        
        {/* Stepper */}
        <div className="flex items-center justify-center mb-10">
          {STEPS.map((s, i) => (
            <div key={s} className="flex items-center">
              <div className={`flex items-center justify-center w-8 h-8 rounded-full text-sm font-bold ${step >= i ? 'bg-gold text-white shadow-gold' : 'bg-gray-200 text-gray-500'}`}>
                {i + 1}
              </div>
              <span className={`ml-2 text-sm font-medium hidden sm:block ${step >= i ? 'text-dark' : 'text-gray-400'}`}>{s}</span>
              {i < STEPS.length - 1 && <div className={`w-10 sm:w-20 h-1 mx-2 sm:mx-4 rounded ${step > i ? 'bg-gold' : 'bg-gray-200'}`} />}
            </div>
          ))}
        </div>

        <div className="card p-6 md:p-8 bg-white">
          {step === 0 && (
            <div className="animate-fade-in">
              <h2 className="text-xl font-bold mb-6 flex items-center gap-2"><ScissorsIcon /> Select a Service</h2>
              <div className="space-y-3">
                {salon.services.map(s => (
                  <button key={s.id} onClick={() => setSelectedService(s)}
                    className={`w-full text-left p-4 rounded-xl border-2 transition-all flex justify-between items-center ${selectedService?.id === s.id ? 'border-gold bg-amber-50/50' : 'border-gray-100 hover:border-gray-300'}`}>
                    <div>
                      <h3 className="font-semibold text-dark">{s.name}</h3>
                      <p className="text-sm text-gray-500">{s.duration} mins</p>
                    </div>
                    <span className="font-bold text-dark">₹{s.price}</span>
                  </button>
                ))}
              </div>
              <button disabled={!selectedService} onClick={() => setStep(1)}
                className="btn-primary w-full justify-center mt-8 disabled:opacity-50">
                Continue to Date <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          )}

          {step === 1 && (
            <div className="animate-fade-in">
              <h2 className="text-xl font-bold mb-6 flex items-center gap-2"><Calendar className="w-5 h-5 text-gold"/> Choose Date & Time</h2>
              
              <h3 className="text-sm font-medium text-gray-500 mb-3 uppercase tracking-wide">Available Dates</h3>
              <div className="flex gap-3 overflow-x-auto pb-4 scrollbar-hide">
                {getDates().map(d => {
                  const dStr = d.toISOString().split('T')[0];
                  return (
                    <button key={dStr} onClick={() => setDate(dStr)}
                      className={`flex-shrink-0 w-20 p-3 rounded-xl border-2 text-center transition-all ${date === dStr ? 'border-gold bg-amber-50/50 text-gold' : 'border-gray-100 hover:border-gray-300'}`}>
                      <div className="text-xs mb-1">{d.toLocaleDateString('en-US', { weekday: 'short' })}</div>
                      <div className="text-xl font-bold">{d.getDate()}</div>
                      <div className="text-xs">{d.toLocaleDateString('en-US', { month: 'short' })}</div>
                    </button>
                  );
                })}
              </div>

              <h3 className="text-sm font-medium text-gray-500 mt-6 mb-3 uppercase tracking-wide">Available Times</h3>
              <div className="grid grid-cols-3 sm:grid-cols-4 gap-3">
                {times.map(t => (
                  <button key={t} onClick={() => setTime(t)}
                    className={`py-3 rounded-xl border-2 text-sm font-medium transition-all ${time === t ? 'border-gold bg-amber-50/50 text-gold' : 'border-gray-100 hover:border-gray-300'}`}>
                    {t}
                  </button>
                ))}
              </div>

              <div className="flex gap-4 mt-10">
                <button onClick={() => setStep(0)} className="btn-outline flex-1 justify-center">Back</button>
                <button disabled={!date || !time} onClick={() => setStep(2)} className="btn-primary flex-1 justify-center disabled:opacity-50">
                  Review <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}

          {step === 2 && (
            <div className="animate-fade-in">
              <h2 className="text-xl font-bold mb-6">Confirm Details</h2>
              <div className="bg-gray-50 rounded-2xl p-6 mb-8 border border-gray-100">
                <div className="flex items-center gap-4 mb-6 pb-6 border-b border-gray-200">
                  <img src={salon.image} alt={salon.name} className="w-16 h-16 rounded-xl object-cover" />
                  <div>
                    <h3 className="font-bold text-lg">{salon.name}</h3>
                    <p className="text-sm text-gray-500">{salon.area}</p>
                  </div>
                </div>
                
                <div className="space-y-4">
                  <div className="flex justify-between">
                    <span className="text-gray-500 flex items-center gap-2"><ScissorsIcon className="w-4 h-4"/> Service</span>
                    <span className="font-medium">{selectedService?.name}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-500 flex items-center gap-2"><Calendar className="w-4 h-4"/> Date</span>
                    <span className="font-medium">{date && new Date(date).toLocaleDateString('en-US', { weekday:'long', month:'long', day:'numeric'})}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-500 flex items-center gap-2"><Clock className="w-4 h-4"/> Time</span>
                    <span className="font-medium">{time}</span>
                  </div>
                  <div className="pt-4 mt-4 border-t border-gray-200 flex justify-between items-center">
                    <span className="font-bold text-lg">Total Amount</span>
                    <span className="font-bold text-2xl text-gold">₹{selectedService?.price}</span>
                  </div>
                </div>
              </div>

              <div className="flex gap-2 items-center mb-8 text-sm text-gray-500">
                <CreditCard className="w-4 h-4" /> Pay at salon after service
              </div>

              <div className="flex gap-4">
                <button onClick={() => setStep(1)} className="btn-outline flex-1 justify-center" disabled={submitting}>Back</button>
                <button onClick={handleBook} disabled={submitting} className="btn-primary flex-1 justify-center shadow-gold">
                  {submitting ? 'Confirming...' : 'Confirm Booking'}
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

const ScissorsIcon = ({className='w-5 h-5 text-gold'}: {className?: string}) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><circle cx="6" cy="6" r="3"/><circle cx="6" cy="18" r="3"/><line x1="20" y1="4" x2="8.12" y2="15.88"/><line x1="14.47" y1="14.48" x2="20" y2="20"/><line x1="8.12" y1="8.12" x2="12" y2="12"/></svg>
);
