import React, { Suspense, lazy } from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import SmoothScroll from './components/SmoothScroll';
import GlobalBackground from './components/GlobalBackground';
import Navbar from './components/Navbar';
import ProtectedRoute from './components/ProtectedRoute';

import './App.css';

const LandingPage = lazy(() => import('./pages/LandingPage'));
const TeamPage = lazy(() => import('./pages/TeamPage'));
const ApplyPage = lazy(() => import('./pages/ApplyPage'));
const AdminLogin = lazy(() => import('./pages/AdminLogin'));
const AdminDashboard = lazy(() => import('./pages/AdminDashboard'));

const PageLoader = () => (
  <div className="min-h-screen bg-black flex items-center justify-center fixed inset-0 z-[1000]">
    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
  </div>
);

const AppContent = () => {
  // Disable browser scroll restoration to prevent jumps on reload
  React.useEffect(() => {
    if ('scrollRestoration' in window.history) {
      window.history.scrollRestoration = 'manual';
    }
  }, []);

  const location = useLocation();
  const isAdminRoute = location.pathname.startsWith('/admin') || location.pathname === '/apply';

  return (
    <>
      <GlobalBackground />

      {/* ── Floating glow orbs ── */}
      <div className="world-orb world-orb-purple"  aria-hidden="true" />
      <div className="world-orb world-orb-orange"  aria-hidden="true" />
      <div className="world-orb world-orb-cyan"    aria-hidden="true" />

      {/* ── Navbar (hidden on admin pages) ── */}
      {!isAdminRoute && <Navbar />}

      <SmoothScroll>
        <div className="app-container">
          <Suspense fallback={<PageLoader />}>
            <Routes>
              <Route path="/" element={<LandingPage />} />
              <Route path="/team" element={<TeamPage />} />
              <Route path="/apply" element={<ApplyPage />} />
              <Route path="/admin/login" element={<AdminLogin />} />
              <Route path="/admin/*" element={
                <ProtectedRoute>
                  <AdminDashboard />
                </ProtectedRoute>
              } />
            </Routes>
          </Suspense>
        </div>
      </SmoothScroll>
    </>
  );
};

function App() {
  return (
    <Router>
      <AppContent />
    </Router>
  );
}

export default App;
