import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import Navbar from './components/layout/Navbar';
import Footer from './components/layout/Footer';
import HomePage from './pages/Home/HomePage';
import SalonsPage from './pages/Salons/SalonsPage';
import SalonDetailPage from './pages/SalonDetail/SalonDetailPage';
import BookingPage from './pages/Booking/BookingPage';
import LoginPage from './pages/Auth/LoginPage';
import RegisterPage from './pages/Auth/RegisterPage';
import DashboardPage from './pages/Dashboard/DashboardPage';
import ConciergePage from './pages/AI/ConciergePage';
import SalonMatchPage from './pages/AI/SalonMatchPage';
import ProtectedRoute from './components/auth/ProtectedRoute';
import VoiceAssistant from './components/ai/VoiceAssistant';

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <div className="min-h-screen flex flex-col">
          <Navbar />
          <main className="flex-1">
            <Routes>
              <Route path="/" element={<HomePage />} />
              <Route path="/salons" element={<SalonsPage />} />
              <Route path="/salons/:id" element={<SalonDetailPage />} />
              <Route path="/book/:salonId" element={
                <ProtectedRoute><BookingPage /></ProtectedRoute>
              } />
              <Route path="/ai-concierge" element={<ConciergePage />} />
              <Route path="/salon-match" element={<SalonMatchPage />} />
              <Route path="/login" element={<LoginPage />} />
              <Route path="/register" element={<RegisterPage />} />
              <Route path="/dashboard" element={
                <ProtectedRoute><DashboardPage /></ProtectedRoute>
              } />
            </Routes>
          </main>
          <Footer />
          <VoiceAssistant />
        </div>
      </BrowserRouter>
    </AuthProvider>
  );
}
