import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { 
  LayoutDashboard, 
  Calendar, 
  Users, 
  Mic2, 
  MessageSquare, 
  BarChart3,
  Settings,
  LogOut,
  UserCircle,
  ClipboardList,
  CalendarDays,
  Home
} from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { canAccessRoute } from '../../utils/permissions';

const Sidebar: React.FC = () => {
  const { logout, user } = useAuth();
  const navigate = useNavigate();

  const allNavItems = [
    { icon: Home, label: 'Home', path: '/home', roles: ['Participant'] },
    { icon: LayoutDashboard, label: 'Dashboard', path: '/dashboard', roles: ['Admin', 'Organizer', 'Speaker'] },
    { icon: Calendar, label: 'Events', path: '/events', roles: ['Admin', 'Organizer', 'Speaker', 'Participant'] },
    { icon: CalendarDays, label: 'Schedule Board', path: '/schedule', roles: ['Admin', 'Organizer', 'Speaker', 'Participant'] },
    { icon: ClipboardList, label: 'Registration', path: '/registration', roles: ['Admin', 'Organizer'] },
    { icon: Mic2, label: 'Speakers', path: '/speakers', roles: ['Admin', 'Organizer'] },
    { icon: Users, label: 'Participants', path: '/participants', roles: ['Admin', 'Organizer'] },
    { icon: MessageSquare, label: 'Communications', path: '/communications', roles: ['Admin', 'Organizer'] },
    { icon: BarChart3, label: 'Analytics', path: '/analytics', roles: ['Admin', 'Organizer'] },
    { icon: UserCircle, label: 'Profile', path: '/profile', roles: ['Admin', 'Organizer', 'Speaker', 'Participant'] },
    { icon: Settings, label: 'Settings', path: '/settings', roles: ['Admin'] },
  ];

  const navItems = user 
    ? allNavItems.filter(item => 
        item.roles.includes(user.role) && canAccessRoute(user.role, item.path)
      )
    : [];

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <aside className="fixed left-0 top-0 h-screen w-64 bg-white dark:bg-gray-900 border-r border-gray-200 dark:border-gray-800 transition-colors duration-300 z-20">
      <div className="flex flex-col h-full">
        {/* Logo - Worldline Style */}
        <div className="h-16 flex items-center px-6 border-b border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900">
          <div className="flex items-center space-x-2">
            {/* Worldline-style icon */}
            <div className="relative w-10 h-10">
              <div className="absolute inset-0 bg-gradient-to-br from-primary-500 to-primary-600 rounded-lg flex items-center justify-center">
                <Calendar className="w-6 h-6 text-white" />
              </div>
              {/* Teal wave accent */}
              <div className="absolute -right-1 -bottom-1 w-4 h-4">
                <svg viewBox="0 0 16 16" className="w-full h-full">
                  <path d="M0,8 Q4,4 8,8 T16,8" stroke="#5BC0BE" strokeWidth="2" fill="none"/>
                </svg>
              </div>
            </div>
            <div>
              <span className="text-lg font-bold text-gray-900 dark:text-white">
                EVENT<span className="font-normal">TRACK</span>
              </span>
              <p className="text-xs text-primary-600 dark:text-primary-400">by Worldline</p>
            </div>
          </div>
        </div>

        {/* User Info */}
        <div className="px-4 py-4 border-b border-gray-200 dark:border-gray-800 bg-primary-50 dark:bg-primary-900/10">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary-500 to-primary-600 flex items-center justify-center text-white font-semibold ring-2 ring-primary-200 dark:ring-primary-800">
              {user?.name.charAt(0).toUpperCase()}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-semibold text-gray-900 dark:text-gray-100 truncate">
                {user?.name}
              </p>
              <p className="text-xs text-primary-600 dark:text-primary-400 font-medium">
                {user?.role}
              </p>
            </div>
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 px-4 py-6 space-y-1 overflow-y-auto">
          {navItems.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              className={({ isActive }) =>
                `flex items-center space-x-3 px-4 py-3 rounded-lg transition-all duration-200 ${
                  isActive
                    ? 'bg-primary-500 text-white shadow-lg shadow-primary-500/30'
                    : 'text-gray-700 dark:text-gray-300 hover:bg-primary-50 dark:hover:bg-primary-900/20 hover:text-primary-700 dark:hover:text-primary-400'
                }`
              }
            >
              <item.icon className="w-5 h-5" />
              <span className="font-medium">{item.label}</span>
            </NavLink>
          ))}
        </nav>

        {/* Logout */}
        <div className="p-4 border-t border-gray-200 dark:border-gray-800">
          <button 
            onClick={handleLogout}
            className="flex items-center space-x-3 px-4 py-3 w-full rounded-lg text-error-600 dark:text-error-400 hover:bg-error-50 dark:hover:bg-error-900/20 transition-colors duration-200"
          >
            <LogOut className="w-5 h-5" />
            <span className="font-medium">Logout</span>
          </button>
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;