import React from 'react';
import { useRouter } from 'next/router';
import { Analytics } from '@vercel/analytics/react';
import { SpeedInsights } from '@vercel/speed-insights/react';

// Styles
import '../index.css';
import '../App.css';
import '../components/Navbar.css';
import '../styles/team.css';

// Components
import Navbar from '../components/Navbar';
import StaticBackground from '../components/StaticBackground';
import ScrollRestoration from '../components/ScrollRestoration';
import { CMSProvider } from '../hooks/useCMS';

export default function App({ Component, pageProps }) {
  const router = useRouter();
  const isAdminRoute = router.pathname.startsWith('/admin') || router.pathname === '/apply';

  return (
    <div className="font-sans">
      <ScrollRestoration />
      <StaticBackground />

      {/* Navbar (hidden on admin pages) */}
      {!isAdminRoute && <Navbar />}

      <CMSProvider initialData={pageProps}>
        <div className="app-container">
          <Component {...pageProps} />
        </div>
      </CMSProvider>

      {/* Vercel Monitoring */}
      <Analytics />
      <SpeedInsights />
    </div>
  );
}

