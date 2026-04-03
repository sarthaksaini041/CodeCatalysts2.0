import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import SmoothScroll from './components/SmoothScroll';
import GlobalBackground from './components/GlobalBackground';
import LandingPage from './pages/LandingPage';
import TeamPage from './pages/TeamPage';
import ApplyPage from './pages/ApplyPage';
import AdminLogin from './pages/AdminLogin';
import AdminDashboard from './pages/AdminDashboard';
import ProtectedRoute from './components/ProtectedRoute';

import './App.css';

const AppContent = () => {
  // Disable browser scroll restoration to prevent jumps on reload
  React.useEffect(() => {
    if ('scrollRestoration' in window.history) {
      window.history.scrollRestoration = 'manual';
    }
  }, []);

  return (
    <>
      <GlobalBackground />

      {/* ── Floating glow orbs ── */}
      <div className="world-orb world-orb-purple"  aria-hidden="true" />
      <div className="world-orb world-orb-orange"  aria-hidden="true" />
      <div className="world-orb world-orb-cyan"    aria-hidden="true" />

      <SmoothScroll>
        <div className="app-container">
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
