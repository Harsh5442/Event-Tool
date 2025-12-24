import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { ThemeProvider } from './contexts/ThemeContext';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import MainLayout from './components/Layout/MainLayout';
import Login from './pages/Login';

//Azure AD Callback
import AzureAdCallback from './pages/AzureAdCallback';

// Participant
import ParticipantHome from './pages/ParticipantHome';
import ParticipantProfile from './pages/ParticipantProfile';

// Speaker
import SpeakerDashboard from './pages/SpeakerDashboard';
import SpeakerProfile from './pages/SpeakerProfile';
import SpeakerEvents from './pages/SpeakerEvents';

// Organizer
import OrganizerDashboard from './pages/OrganizerDashboard';
import OrganizerProfile from './pages/OrganizerProfile';

// Admin
import AdminEvents from './pages/AdminEvents';
import AdminScheduleBoard from './pages/AdminScheduleBoard';
import AdminProfile from './pages/AdminProfile';

// Shared
import Dashboard from './pages/Dashboard';
import Events from './pages/Events';
import ScheduleBoard from './pages/ScheduleBoard';
import Registration from './pages/Registration';
import Speakers from './pages/Speakers';
import Participants from './pages/Participants';
import Communications from './pages/Communications';
import Analytics from './pages/Analytics';
// ❌ REMOVE THIS LINE: import Profile from './pages/Profile';
import Settings from './pages/Settings';
import PublicEventPage from './pages/PublicEventPage';

import './index.css';

const PrivateRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { isAuthenticated } = useAuth();
  return isAuthenticated ? <>{children}</> : <Navigate to="/login" replace />;
};

const RoleBasedRoute: React.FC<{ children: React.ReactNode; allowedRoles: string[] }> = ({ children, allowedRoles }) => {
  const { user } = useAuth();
  
  if (!user || !allowedRoles.includes(user.role)) {
    return <Navigate to="/dashboard" replace />;
  }
  
  return <>{children}</>;
};

const AppRoutes: React.FC = () => {
  const { user } = useAuth();

  // Determine default home route based on role
  const getDefaultRoute = () => {
    if (!user) return '/login';
    if (user.role === 'Participant') return '/home';
    return '/dashboard';
  };

  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route path="/" element={<Navigate to={getDefaultRoute()} replace />} />
      <Route path="/azure-ad-callback" element={<AzureAdCallback />} />
      
      {/* Public Event Page */}

      
      <Route
        path="/public/event/:eventId"
        element={
          <PrivateRoute>
            <MainLayout>
              <PublicEventPage />
            </MainLayout>
          </PrivateRoute>
        }
      />

      {/* Protected Routes */}
      <Route
        path="/*"
        element={
          <PrivateRoute>
            <MainLayout>
              <Routes>
                {/* Participant Routes */}
                <Route 
                  path="/home" 
                  element={
                    <RoleBasedRoute allowedRoles={['Participant']}>
                      <ParticipantHome />
                    </RoleBasedRoute>
                  } 
                />

                {/* Dashboard - Role specific */}
                <Route 
                  path="/dashboard" 
                  element={
                    user?.role === 'Speaker' ? <SpeakerDashboard /> :
                    user?.role === 'Organizer' ? <OrganizerDashboard /> :
                    <Dashboard />
                  } 
                />

                {/* Events - Different views for different roles */}
                <Route 
                  path="/events" 
                  element={
                    user?.role === 'Admin' ? <AdminEvents /> :
                    user?.role === 'Speaker' ? <SpeakerEvents /> :
                    <Events />
                  } 
                />

                {/* Schedule - Different for Admin */}
                <Route 
                  path="/schedule" 
                  element={
                    user?.role === 'Admin' ? <AdminScheduleBoard /> :
                    <ScheduleBoard />
                  } 
                />

                {/* Profile - Different for each role */}
                <Route 
                  path="/profile" 
                  element={
                    user?.role === 'Participant' ? <ParticipantProfile /> :
                    user?.role === 'Speaker' ? <SpeakerProfile /> :
                    user?.role === 'Organizer' ? <OrganizerProfile /> :
                    user?.role === 'Admin' ? <AdminProfile /> :
                    <Navigate to="/login" replace />
                  } 
                />

                {/* Admin & Organizer Only Routes */}
                <Route 
                  path="/registration" 
                  element={
                    <RoleBasedRoute allowedRoles={['Admin', 'Organizer']}>
                      <Registration />
                    </RoleBasedRoute>
                  } 
                />
                <Route 
                  path="/speakers" 
                  element={
                    <RoleBasedRoute allowedRoles={['Admin', 'Organizer']}>
                      <Speakers />
                    </RoleBasedRoute>
                  } 
                />
                <Route 
                  path="/participants" 
                  element={
                    <RoleBasedRoute allowedRoles={['Admin', 'Organizer']}>
                      <Participants />
                    </RoleBasedRoute>
                  } 
                />
                <Route 
                  path="/communications" 
                  element={
                    <RoleBasedRoute allowedRoles={['Admin', 'Organizer']}>
                      <Communications />
                    </RoleBasedRoute>
                  } 
                />
                <Route 
                  path="/analytics" 
                  element={
                    <RoleBasedRoute allowedRoles={['Admin', 'Organizer']}>
                      <Analytics />
                    </RoleBasedRoute>
                  } 
                />

                {/* Admin Only Routes */}
                <Route 
                  path="/settings" 
                  element={
                    <RoleBasedRoute allowedRoles={['Admin']}>
                      <Settings />
                    </RoleBasedRoute>
                  } 
                />
              </Routes>
            </MainLayout>
          </PrivateRoute>
        }
      />
    </Routes>
  );
};

const App: React.FC = () => {
  return (
    <ThemeProvider>
      <AuthProvider>
        <Router>
          <AppRoutes />
        </Router>
      </AuthProvider>
    </ThemeProvider>
  );
};

export default App;