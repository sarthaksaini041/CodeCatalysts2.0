import { useEffect, useRef } from 'react';
import { useRouter } from 'next/router';
import Lenis from 'lenis';

const SmoothScroll = ({ children }) => {
  const router = useRouter();
  const lenisRef = useRef(null);
  const currentPathRef = useRef(router.asPath);
  const isNavigatingRef = useRef(false); // true = inter-page nav, false = reload

  useEffect(() => {
    const lenis = new Lenis({
      duration: 1.5,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      orientation: 'vertical',
      gestureOrientation: 'vertical',
      smoothWheel: true,
      wheelMultiplier: 1.0,
      smoothTouch: true,
      touchMultiplier: 2.5,
      infinite: false,
      lerp: 0.08,
    });

    lenisRef.current = lenis;
    window.lenis = lenis;

    // Persist scroll position on every scroll event
    lenis.on('scroll', ({ scroll }) => {
      const key = currentPathRef.current;
      if (key) {
        sessionStorage.setItem(`scroll-pos:${key}`, String(Math.round(scroll)));
      }
    });

    function raf(time) {
      lenis.raf(time);
      requestAnimationFrame(raf);
    }
    requestAnimationFrame(raf);

    // --- Restore scroll position on initial page load / reload ---
    // On a reload, isNavigatingRef is still false (no routeChangeStart fired).
    // We wait for the page content to settle, then scroll to the saved position.
    const savedPosition = sessionStorage.getItem(`scroll-pos:${router.asPath}`);
    if (savedPosition !== null) {
      const targetY = parseInt(savedPosition, 10);

      // Attempt to restore immediately, then retry as content loads
      let attempts = 0;
      const tryRestore = () => {
        const maxScroll = document.documentElement.scrollHeight - window.innerHeight;
        if (maxScroll >= targetY || attempts > 20) {
          lenis.scrollTo(targetY, { immediate: true });
        } else {
          attempts++;
          setTimeout(tryRestore, 100);
        }
      };

      // Small initial delay to let Next.js hydration / images start loading
      setTimeout(tryRestore, 80);
    }

    return () => {
      lenis.destroy();
      window.lenis = null;
    };
  }, []);

  // Track router events to distinguish navigation from reload
  useEffect(() => {
    const handleRouteChangeStart = (url) => {
      isNavigatingRef.current = true;
      // Save scroll position of the current page before leaving
      if (lenisRef.current && currentPathRef.current) {
        const scroll = Math.round(lenisRef.current.scroll);
        sessionStorage.setItem(`scroll-pos:${currentPathRef.current}`, String(scroll));
      }
    };

    const handleRouteChangeComplete = (url) => {
      currentPathRef.current = url;

      if (lenisRef.current) {
        // Check if there's a saved position for the destination
        const savedPosition = sessionStorage.getItem(`scroll-pos:${url}`);

        if (savedPosition !== null && isNavigatingRef.current) {
          // Navigating back to a previously visited page — restore position
          const targetY = parseInt(savedPosition, 10);
          let attempts = 0;
          const tryRestore = () => {
            const maxScroll = document.documentElement.scrollHeight - window.innerHeight;
            if (maxScroll >= targetY || attempts > 20) {
              lenisRef.current?.scrollTo(targetY, { immediate: true });
            } else {
              attempts++;
              setTimeout(tryRestore, 100);
            }
          };
          setTimeout(tryRestore, 80);
        } else {
          // Fresh navigation to a new page — scroll to top
          lenisRef.current.scrollTo(0, { immediate: true });
        }
      }

      isNavigatingRef.current = false;
    };

    router.events.on('routeChangeStart', handleRouteChangeStart);
    router.events.on('routeChangeComplete', handleRouteChangeComplete);

    return () => {
      router.events.off('routeChangeStart', handleRouteChangeStart);
      router.events.off('routeChangeComplete', handleRouteChangeComplete);
    };
  }, [router]);

  return <>{children}</>;
};

export default SmoothScroll;
