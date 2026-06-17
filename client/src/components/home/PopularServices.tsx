import { Scissors, Sparkles, Flower2, Hand, Footprints, Brush, Zap, Heart } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const services = [
  { icon: Scissors, name: 'Haircut & Style', count: '42 salons', color: '#C9A84C' },
  { icon: Sparkles, name: 'Bridal Makeup', count: '28 salons', color: '#E8A0A0' },
  { icon: Zap, name: 'Hair Spa', count: '36 salons', color: '#9b59b6' },
  { icon: Flower2, name: 'Facial & Skin', count: '33 salons', color: '#27ae60' },
  { icon: Hand, name: 'Manicure', count: '29 salons', color: '#e74c3c' },
  { icon: Footprints, name: 'Pedicure', count: '27 salons', color: '#3498db' },
  { icon: Brush, name: 'Keratin', count: '19 salons', color: '#f39c12' },
  { icon: Heart, name: 'Waxing', count: '38 salons', color: '#e91e63' },
];

export default function PopularServices() {
  const navigate = useNavigate();

  return (
    <section className="py-20 px-4" style={{ background: 'linear-gradient(180deg, #faf5ff 0%, #fff5f8 100%)' }}>
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <h2 className="section-title">Popular Services</h2>
          <p className="section-subtitle mx-auto">
            Everything you need — from everyday cuts to luxury bridal packages
          </p>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          {services.map(({ icon: Icon, name, count, color }) => (
            <button
              key={name}
              onClick={() => navigate(`/salons?service=${encodeURIComponent(name)}`)}
              className="group flex flex-col items-center gap-3 p-6 bg-white rounded-2xl shadow-card border border-gray-100 hover:shadow-card-hover hover:-translate-y-1 transition-all duration-300"
            >
              <div className="w-14 h-14 rounded-2xl flex items-center justify-center transition-transform group-hover:scale-110"
                   style={{ backgroundColor: `${color}15` }}>
                <Icon className="w-7 h-7" style={{ color }} />
              </div>
              <div className="text-center">
                <p className="font-semibold text-dark text-sm">{name}</p>
                <p className="text-xs text-gray-400 mt-0.5">{count}</p>
              </div>
            </button>
          ))}
        </div>
      </div>
    </section>
  );
}
