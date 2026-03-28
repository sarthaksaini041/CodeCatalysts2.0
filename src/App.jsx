import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import SmoothScroll from './components/SmoothScroll';
import LandingPage from './pages/LandingPage';
import TeamPage from './pages/TeamPage';
import ApplyPage from './pages/ApplyPage';
import AdminPage from './pages/AdminPage';

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
            <Route path="/admin/*" element={<AdminPage />} />
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
