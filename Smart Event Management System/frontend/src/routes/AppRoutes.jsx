import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';

// Layouts
import PublicLayout from '../components/layout/PublicLayout';
import AdminLayout from '../components/layout/AdminLayout';

// Auth Pages
import Login from '../pages/auth/Login';
import Register from '../pages/auth/Register';
import ForgotPassword from '../pages/auth/ForgotPassword';

// Public Pages
import Landing from '../pages/public/Landing';
import EventListing from '../pages/public/EventListing';
import EventDetail from '../pages/public/EventDetail';
import Registration from '../pages/public/Registration';
import TicketConfirmation from '../pages/public/TicketConfirmation';
import MyTickets from '../pages/public/MyTickets';
import Feedback from '../pages/public/Feedback';
import Profile from '../pages/public/Profile';
import About from '../pages/public/About';

// Admin Pages
import Dashboard from '../pages/admin/Dashboard';
import CreateEditEvent from '../pages/admin/CreateEditEvent';
import EventManagement from '../pages/admin/EventManagement';
import AttendeeManagement from '../pages/admin/AttendeeManagement';
import CheckInScanner from '../pages/admin/CheckInScanner';
import AnalyticsReports from '../pages/admin/AnalyticsReports';
import FeedbackOverview from '../pages/admin/FeedbackOverview';

// Protected Route Wrapper
const ProtectedRoute = ({ children, requireAdmin = false }) => {
  const { isAuthenticated, userRole, loading } = useAuth();
  
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#F8F9FA]">
        <div className="w-10 h-10 border-4 border-[#E8441A] border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  if (requireAdmin && userRole !== 'admin' && userRole !== 'organizer') {
    return <Navigate to="/" replace />;
  }

  return children;
};

const AppRoutes = () => {
  return (
    <Routes>
      {/* Auth Routes (No layout) */}
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/forgot-password" element={<ForgotPassword />} />

      {/* Public Routes (With Header/Footer) */}
      <Route element={<PublicLayout />}>
        <Route path="/" element={<Landing />} />
        <Route path="/events" element={<EventListing />} />
        <Route path="/events/:id" element={<EventDetail />} />
        <Route path="/about" element={<About />} />
        <Route 
          path="/events/:id/register" 
          element={
            <ProtectedRoute>
              <Registration />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/events/:eventId/feedback" 
          element={
            <ProtectedRoute>
              <Feedback />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/ticket-confirmation" 
          element={
            <ProtectedRoute>
              <TicketConfirmation />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/my-tickets" 
          element={
            <ProtectedRoute>
              <MyTickets />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/profile" 
          element={
            <ProtectedRoute>
              <Profile />
            </ProtectedRoute>
          }
        />
      </Route>

      {/* Admin Routes (With Sidebar/Header) */}
      <Route 
        path="/admin" 
        element={
          <ProtectedRoute requireAdmin>
            <AdminLayout />
          </ProtectedRoute>
        }
      >
        <Route index element={<Dashboard />} />
        <Route path="events" element={<EventManagement />} />
        <Route path="events/create" element={<CreateEditEvent />} />
        <Route path="events/:id/edit" element={<CreateEditEvent />} />
        <Route path="attendees" element={<AttendeeManagement />} />
        <Route path="check-in" element={<CheckInScanner />} />
        <Route path="analytics" element={<AnalyticsReports />} />
        <Route path="feedback" element={<FeedbackOverview />} />
      </Route>

      {/* Fallback 404 Route */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
};

export default AppRoutes;
