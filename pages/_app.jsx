import React, { useEffect } from 'react';
import { useRouter } from 'next/router';
import dynamic from 'next/dynamic';

// Styles
import '../src/index.css';
import '../src/App.css';
import '../src/components/Navbar.css';
import '../src/pages/TeamPage.css';

// Static components (no SSR issues)
const GlobalBackground = dynamic(() => import('../src/components/GlobalBackground'), { ssr: false });
const Navbar = dynamic(() => import('../src/components/Navbar'), { ssr: false });
const SmoothScroll = dynamic(() => import('../src/components/SmoothScroll'), { ssr: false });
const CustomCursor = dynamic(() => import('../src/components/CustomCursor'), { ssr: false });

const PageLoader = () => (
  <div className="min-h-screen bg-black flex items-center justify-center fixed inset-0 z-[1000]">
    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
  </div>
);

export default function App({ Component, pageProps }) {
  const router = useRouter();
  const isAdminRoute = router.pathname.startsWith('/admin') || router.pathname === '/apply';

  // Disable browser's native scroll restoration so Lenis can manage it via sessionStorage
  useEffect(() => {
    if ('scrollRestoration' in window.history) {
      window.history.scrollRestoration = 'manual';
    }
  }, []);

  return (
    <>
      <GlobalBackground />
      <CustomCursor />

      {/* Floating glow orbs */}
      <div className="world-orb world-orb-purple" aria-hidden="true" />
      <div className="world-orb world-orb-orange" aria-hidden="true" />
      <div className="world-orb world-orb-cyan" aria-hidden="true" />

      {/* Navbar (hidden on admin pages) */}
      {!isAdminRoute && <Navbar />}

      <SmoothScroll>
        <div className="app-container">
          <Component {...pageProps} />
        </div>
      </SmoothScroll>
    </>
  );
}
