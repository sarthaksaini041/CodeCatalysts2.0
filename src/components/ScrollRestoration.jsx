import { useEffect, useRef } from 'react';
import { useRouter } from 'next/router';

/**
 * ScrollRestoration Component
 * Handles seamless scroll restoration across sessions and navigations.
 */

const STORAGE_KEY_PREFIX = 'scroll-pos:';

const ScrollRestoration = () => {
  const router = useRouter();
  const scrollTimeout = useRef(null);
  const activeObserver = useRef(null);
  const isRestoring = useRef(false);
  const currentPath = useRef('');

  // Update current path ref on every route change
  useEffect(() => {
    currentPath.current = router.asPath || (window.location.pathname + window.location.search);
  }, [router.asPath]);

  useEffect(() => {
    if (typeof window === 'undefined') return;

    // 1. Take control of native scroll restoration
    if ('scrollRestoration' in window.history) {
      window.history.scrollRestoration = 'manual';
    }

    // 2. Storage Helpers
    const savePos = (url) => {
      if (isRestoring.current || !url) return;
      try {
        const data = {
          y: Math.max(0, window.scrollY),
          ts: Date.now()
        };
        sessionStorage.setItem(`${STORAGE_KEY_PREFIX}${url}`, JSON.stringify(data));
      } catch (e) {
        console.warn('ScrollRestoration: Failed to save position', e);
      }
    };

    const getSavedPos = (url) => {
      try {
        const item = sessionStorage.getItem(`${STORAGE_KEY_PREFIX}${url}`);
        return item ? JSON.parse(item) : null;
      } catch (e) {
        return null;
      }
    };

    // 3. Restoration Logic
    const restorePos = (url, forceTop = false) => {
      if (!url) return;

      const savedItem = getSavedPos(url);
      const targetY = (savedItem && !forceTop) ? savedItem.y : 0;

      // Start restoration process
      isRestoring.current = true;

      // Disconnect existing observer if any
      if (activeObserver.current) {
        activeObserver.current.disconnect();
        activeObserver.current = null;
      }

      // 3.1. Instant Masking to prevent jump flicker
      // Only mask if we are actually about to jump a significant distance
      const shouldMask = targetY > 100;
      if (shouldMask) {
        document.documentElement.style.visibility = 'hidden';
      }

      const executeScroll = () => {
        const docHeight = document.documentElement.scrollHeight;
        const viewportHeight = window.innerHeight;
        const maxScroll = Math.max(0, docHeight - viewportHeight);
        const safeY = Math.min(targetY, maxScroll);
        
        window.scrollTo({ top: safeY, behavior: 'auto' });

        // Unmask immediately after the first successful jump attempt
        if (shouldMask) {
          requestAnimationFrame(() => {
            document.documentElement.style.visibility = '';
          });
        }
      };

      // Micro-task restoration initiation
      executeScroll();

      // Mutation observer to handle dynamic content loading
      let attempts = 0;
      const maxAttempts = 20;

      const observer = new MutationObserver(() => {
        attempts++;
        executeScroll();
        
        // If we've reached the target or max attempts, stop observing
        const currentY = window.scrollY;
        if (Math.abs(currentY - targetY) < 5 || attempts >= maxAttempts) {
          observer.disconnect();
          if (activeObserver.current === observer) activeObserver.current = null;
          setTimeout(() => { isRestoring.current = false; }, 100);
        }
      });

      observer.observe(document.body, {
        childList: true,
        subtree: true,
        attributes: true // Listen for style changes that might affect height
      });
      activeObserver.current = observer;

      // Fail-safe unlock
      setTimeout(() => {
        if (activeObserver.current === observer) {
          observer.disconnect();
          activeObserver.current = null;
        }
        isRestoring.current = false;
      }, 2000);
    };

    // 4. Event Handlers
    const handleScroll = () => {
      if (isRestoring.current) return;
      
      if (scrollTimeout.current) clearTimeout(scrollTimeout.current);
      scrollTimeout.current = setTimeout(() => {
        savePos(currentPath.current);
      }, 150);
    };

    const handleBeforeUnload = () => {
      savePos(currentPath.current);
    };

    // 5. Router Listeners
    const handleRouteChangeStart = () => {
      savePos(currentPath.current);
    };

    const handleRouteChangeComplete = (url) => {
      // Small delay to let React render the new page
      requestAnimationFrame(() => {
        restorePos(url);
      });
    };

    // Attach listeners
    window.addEventListener('scroll', handleScroll, { passive: true });
    window.addEventListener('beforeunload', handleBeforeUnload);
    router.events.on('routeChangeStart', handleRouteChangeStart);
    router.events.on('routeChangeComplete', handleRouteChangeComplete);

    // 6. Initial Load Restoration
    const navEntries = performance.getEntriesByType('navigation');
    const isRefresh = navEntries.length > 0 && navEntries[0].type === 'reload';
    const isBackForward = navEntries.length > 0 && navEntries[0].type === 'back_forward';
    
    // Detect if we are returning from an internal page or external
    const isInternalNavigation = typeof document !== 'undefined' && 
                                 document.referrer && 
                                 document.referrer.includes(window.location.host);

    // Force top ONLY if it's a truly fresh opening (not a refresh, back/forward, or internal navigation)
    // This perfectly aligns with: New URL paste/tab = TOP, Refresh/Back/Internal Return = RESTORE
    const forceTop = !(isRefresh || isBackForward || isInternalNavigation);
    
    const initialUrl = router.asPath || (window.location.pathname + window.location.search);
    
    // Special case: If the URL has a hash, prioritze hash scrolling unless it's a back/forward
    const hasHash = initialUrl.includes('#');
    if (hasHash && !isBackForward && !isRefresh) {
      // Let the browser/page handle the hash naturally
      isRestoring.current = false;
    } else {
      restorePos(initialUrl, forceTop);
    }

    // Cleanup
    return () => {
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('beforeunload', handleBeforeUnload);
      router.events.off('routeChangeStart', handleRouteChangeStart);
      router.events.off('routeChangeComplete', handleRouteChangeComplete);
      
      if (activeObserver.current) activeObserver.current.disconnect();
      if (scrollTimeout.current) clearTimeout(scrollTimeout.current);
    };
  }, [router]);

  return null;
};

export default ScrollRestoration;
