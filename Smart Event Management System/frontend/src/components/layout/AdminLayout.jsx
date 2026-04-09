import { Outlet, useLocation } from 'react-router-dom';
import { Bell, Search } from 'lucide-react';
import Sidebar from './Sidebar';
import { useAuth } from '../../hooks/useAuth';

// Map paths to page titles
const getTitleFromPath = (path) => {
  const titleMap = {
    '/admin': 'Dashboard',
    '/admin/events': 'Event Management',
    '/admin/events/create': 'Create Event',
    '/admin/attendees': 'Attendee Management',
    '/admin/check-in': 'Check-in Scanner',
    '/admin/analytics': 'Analytics & Reports',
    '/admin/feedback': 'Feedback Overview',
  };
  return titleMap[path] || 'Admin Panel';
};

const AdminLayout = () => {
  const location = useLocation();
  const { currentUser } = useAuth();
  const pageTitle = getTitleFromPath(location.pathname);

  return (
    <div className="flex h-screen overflow-hidden bg-[#F8F9FA]">
      <Sidebar />

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Top Header Bar */}
        <header className="bg-white border-b border-gray-100 px-6 py-4 flex items-center justify-between flex-shrink-0 shadow-sm">
          <div>
            <h1 className="text-xl font-bold text-[#1A1A2E]">{pageTitle}</h1>
            <p className="text-xs text-gray-400">
              {new Date().toLocaleDateString('en-IN', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })}
            </p>
          </div>
          <div className="flex items-center gap-3">
            {/* Search */}
            <div className="hidden md:flex items-center gap-2 bg-gray-100 rounded-xl px-3 py-2">
              <Search className="w-4 h-4 text-gray-400" />
              <input
                type="text"
                placeholder="Quick search..."
                className="bg-transparent text-sm text-gray-600 placeholder-gray-400 outline-none w-40"
              />
            </div>
            {/* Notifications */}
            <button className="relative w-9 h-9 flex items-center justify-center rounded-xl bg-gray-100 hover:bg-gray-200 transition-colors">
              <Bell className="w-4 h-4 text-gray-600" />
              <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-[#E8441A] rounded-full"></span>
            </button>
            {/* Avatar */}
            <img
              src={currentUser?.avatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(currentUser?.name || 'Admin')}&background=E8441A&color=fff`}
              alt={currentUser?.name}
              className="w-9 h-9 rounded-full object-cover border-2 border-[#E8441A]"
            />
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 overflow-y-auto p-6 scrollbar-thin">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;
