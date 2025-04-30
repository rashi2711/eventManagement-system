import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { ThemeProvider } from './context/ThemeContext';
import PrivateRoute from './components/PrivateRoute';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import ErrorBoundary from './components/ErrorBoundary';
import Home from './pages/Home';
import Events from './pages/Events';
import EventDetails from './pages/EventDetails';
import RSVPForm from './pages/RSVPForm';
import FacultyDashboard from './pages/FacultyDashboard';
import Dashboard from './pages/Dashboard';
import Signup from './pages/Signup';
import VerifyOTP from './pages/VerifyOTP';
import Login from './pages/Login';
import Profile from './pages/Profile';
import ChangePassword from './pages/ChangePassword';
import ResetPassword from './pages/ResetPassword';
import VerifyResetOTP from './pages/VerifyResetOTP';
import AboutUs from './pages/AboutUs';
import ContactUs from './pages/ContactUs';
import PrivacyPolicy from './pages/PrivacyPolicy';
import Tickets from './pages/Tickets';
import Payments from './pages/Payments';
import PaymentReceipt from './pages/PaymentReceipt';
import PaymentHistory from './pages/PaymentHistory';

function App() {
  return (
    <AuthProvider>
      <ThemeProvider>
        <Router>
          <ErrorBoundary>
            <div className="flex flex-col min-h-screen">
              <Navbar />
              <main className="flex-grow">
                <Routes>
                  <Route path="/" element={<Home />} />
                  <Route path="/about" element={<AboutUs />} />
                  <Route path="/contact" element={<ContactUs />} />
                  <Route path="/privacy-policy" element={<PrivacyPolicy />} />
                  <Route path="/events" element={<Events />} />
                  <Route path="/events/:id" element={<PrivateRoute><EventDetails /></PrivateRoute>} />
                  <Route path="/rsvp/:eventId" element={<PrivateRoute roles={['Student']}><RSVPForm /></PrivateRoute>} />
                  <Route path="/dashboard" element={<PrivateRoute><Dashboard /></PrivateRoute>} />
                  <Route path="/faculty-dashboard/:eventId" element={<PrivateRoute roles={['Faculty']}><FacultyDashboard /></PrivateRoute>} />
                  <Route path="/tickets" element={<PrivateRoute roles={['Student']}><Tickets /></PrivateRoute>} />
                  <Route path="/payments" element={<PrivateRoute><Payments /></PrivateRoute>} />
                  <Route path="/payment-receipt" element={<PrivateRoute><PaymentReceipt /></PrivateRoute>} />
                  <Route path="/payment-history" element={<PrivateRoute><PaymentHistory /></PrivateRoute>} />
                  <Route path="/signup" element={<Signup />} />
                  <Route path="/verify-otp" element={<VerifyOTP />} />
                  <Route path="/login" element={<Login />} />
                  <Route path="/profile" element={<PrivateRoute><Profile /></PrivateRoute>} />
                  <Route path="/change-password" element={<PrivateRoute><ChangePassword /></PrivateRoute>} />
                  <Route path="/reset-password" element={<ResetPassword />} />
                  <Route path="/verify-reset-otp" element={<VerifyResetOTP />} />
                </Routes>
              </main>
              <Footer />
            </div>
          </ErrorBoundary>
        </Router>
      </ThemeProvider>
    </AuthProvider>
  );
}

export default App;