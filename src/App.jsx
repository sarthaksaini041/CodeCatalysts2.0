import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import SmoothScroll from './components/SmoothScroll';
import LandingPage from './pages/LandingPage';
import TeamPage from './pages/TeamPage';
import ApplyPage from './pages/ApplyPage';
import AdminLogin from './pages/AdminLogin';
import AdminDashboard from './pages/AdminDashboard';
import ProtectedRoute from './components/ProtectedRoute';

import './App.css';

const AppContent = () => {
  return (
    <>
      <div className="noise-overlay" />
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
