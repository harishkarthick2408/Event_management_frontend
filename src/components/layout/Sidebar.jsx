import { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import {
  LayoutDashboard, Calendar, Users, QrCode, BarChart2,
  MessageSquare, Zap, LogOut, ChevronLeft, ChevronRight,
} from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';

const navItems = [
  { label: 'Dashboard', path: '/admin', icon: LayoutDashboard },
  { label: 'Events', path: '/admin/events', icon: Calendar },
  { label: 'Attendees', path: '/admin/attendees', icon: Users },
  { label: 'Check-in', path: '/admin/checkin', icon: QrCode },
  { label: 'Analytics', path: '/admin/analytics', icon: BarChart2 },
  { label: 'Feedback', path: '/admin/feedback', icon: MessageSquare },
];

const Sidebar = () => {
  const [collapsed, setCollapsed] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const { currentUser, logout } = useAuth();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const isActive = (path) => {
    if (path === '/admin') return location.pathname === '/admin';
    return location.pathname.startsWith(path);
  };

  return (
    <aside
      className={`
        relative flex flex-col h-screen bg-[#1A1A2E] text-white
        transition-all duration-300 ease-in-out flex-shrink-0
        ${collapsed ? 'w-20' : 'w-64'}
      `}
    >
      {/* Logo */}
      <div className="flex items-center gap-3 px-5 py-5 border-b border-white/10">
        <div className="w-9 h-9 rounded-xl bg-[#E8441A] flex items-center justify-center flex-shrink-0">
          <Zap className="w-5 h-5 text-white" />
        </div>
        {!collapsed && (
          <div>
            <p className="font-bold text-base leading-tight">EventPro</p>
            <p className="text-xs text-gray-400">Admin Panel</p>
          </div>
        )}
      </div>

      {/* Nav Items */}
      <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto scrollbar-thin">
        <p className={`text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3 px-2 ${collapsed ? 'hidden' : ''}`}>
          Navigation
        </p>
        {navItems.map(({ label, path, icon: Icon }) => (
          <Link
            key={path}
            to={path}
            title={collapsed ? label : ''}
            className={`
              flex items-center gap-3 px-3 py-3 rounded-xl transition-all duration-200 font-medium text-sm
              ${isActive(path)
                ? 'bg-[#E8441A] text-white shadow-lg'
                : 'text-gray-300 hover:bg-white/10 hover:text-white'
              }
              ${collapsed ? 'justify-center' : ''}
            `}
          >
            <Icon className="w-5 h-5 flex-shrink-0" />
            {!collapsed && <span>{label}</span>}
          </Link>
        ))}
      </nav>

      {/* User Profile */}
      <div className="border-t border-white/10 p-3">
        <div className={`flex items-center gap-3 px-2 py-3 rounded-xl mb-2 ${collapsed ? 'justify-center' : ''}`}>
          <img
            src={currentUser?.avatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(currentUser?.name || 'Admin')}&background=E8441A&color=fff`}
            alt={currentUser?.name}
            className="w-9 h-9 rounded-full object-cover flex-shrink-0"
          />
          {!collapsed && (
            <div className="min-w-0">
              <p className="text-sm font-semibold truncate">{currentUser?.name || 'Admin'}</p>
              <p className="text-xs text-gray-400 capitalize">{currentUser?.role || 'admin'}</p>
            </div>
          )}
        </div>
        <button
          onClick={handleLogout}
          className={`
            w-full flex items-center gap-3 px-3 py-2.5 rounded-xl
            text-gray-300 hover:bg-red-500/20 hover:text-red-400
            transition-all duration-200 text-sm font-medium
            ${collapsed ? 'justify-center' : ''}
          `}
          title={collapsed ? 'Logout' : ''}
        >
          <LogOut className="w-4 h-4 flex-shrink-0" />
          {!collapsed && <span>Logout</span>}
        </button>
      </div>

      {/* Collapse Toggle */}
      <button
        onClick={() => setCollapsed(!collapsed)}
        className="absolute -right-3 top-20 w-6 h-6 bg-[#E8441A] rounded-full flex items-center justify-center shadow-lg hover:bg-[#C73A15] transition-colors z-10"
      >
        {collapsed ? <ChevronRight className="w-3 h-3 text-white" /> : <ChevronLeft className="w-3 h-3 text-white" />}
      </button>
    </aside>
  );
};

export default Sidebar;
