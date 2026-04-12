import React, { useEffect } from 'react';
import { useRouter } from 'next/router';
import dynamic from 'next/dynamic';
import { Analytics } from '@vercel/analytics/react';
import { SpeedInsights } from '@vercel/speed-insights/react';

// Styles
import '../src/index.css';
import '../src/App.css';
import '../src/components/Navbar.css';
import '../src/pages/TeamPage.css';

// Components
import Navbar from '../src/components/Navbar';
import StaticBackground from '../src/components/StaticBackground';
import ScrollRestoration from '../src/components/ScrollRestoration';
import { CMSProvider } from '../src/hooks/useCMS';

export default function App({ Component, pageProps }) {
  const router = useRouter();
  const isAdminRoute = router.pathname.startsWith('/admin') || router.pathname === '/apply';

  // --- Global Scroll Restoration ---
  // The logic is now encapsulated in a dedicated component for better maintenance

  return (
    <>
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
    </>
  );
}
