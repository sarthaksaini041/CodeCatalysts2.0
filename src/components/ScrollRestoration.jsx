import { useEffect, useRef } from 'react';
import { useRouter } from 'next/router';

/**
 * Global Persistent Scroll Restoration System
 * 
 * Requirements:
 * - Save scroll position per route (route + query params)
 * - Restore on: back/forward, internal links, page reload, same-session revisit
 * - Page B opens at top (0) if never visited, otherwise restores
 * - Use persistent localStorage
 * - Handle dynamic content via MutationObserver
 * - Performance: debounced saving, lightweight listeners
 * - Cleanup: Keep only most recent 50 entries
 */

const STORAGE_KEY_PREFIX = 'scroll:';
const MAX_ENTRIES = 50;

const ScrollRestoration = () => {
  const router = useRouter();
  const scrollTimeout = useRef(null);
  const activeObserver = useRef(null);
  
  // Use a ref to track the current path because the scroll/unload listener 
  // runs in a stale closure inside an empty dependency useEffect.
  const currentPath = useRef('');
  
  // Track if we are actively restoring scroll position so we don't 
  // accidentally save incorrect scroll offsets (like 0) while the DOM jumps.
  const isRestoring = useRef(false);

  // Maintain fresh copy of current location.
  useEffect(() => {
    currentPath.current = router.asPath || (window.location.pathname + window.location.search);
  }, [router.asPath]);

  useEffect(() => {
    if (typeof window === 'undefined') return;

    // Guarantee initial path
    currentPath.current = router.asPath || (window.location.pathname + window.location.search);

    // 1. Take control of native browser scroll restoration
    if ('scrollRestoration' in window.history) {
      window.history.scrollRestoration = 'manual';
    }

    // 2. Storage operations
    const savePos = (url) => {
      // Do not save a position if we are currently force-jumping to a target
      if (isRestoring.current || !url) return;
      try {
        const data = {
          y: Math.max(0, window.scrollY),
          ts: Date.now()
        };
        localStorage.setItem(`${STORAGE_KEY_PREFIX}${url}`, JSON.stringify(data));
      } catch (e) {
        // Handle quota issues gracefully
        if (e.name === 'QuotaExceededError') {
          localStorage.clear();
        }
      }
    };

    const getSavedPos = (url) => {
      try {
        const item = localStorage.getItem(`${STORAGE_KEY_PREFIX}${url}`);
        return item ? JSON.parse(item) : null;
      } catch (e) {
        return null;
      }
    };

    // 3. Keep localStorage clean and fast
    const performCleanup = () => {
      try {
        const keys = [];
        for (let i = 0; i < localStorage.length; i++) {
          const key = localStorage.key(i);
          if (key?.startsWith(STORAGE_KEY_PREFIX)) {
            const item = localStorage.getItem(key);
            try {
              const parsed = JSON.parse(item);
              keys.push({ key, ts: parsed.ts || 0 });
            } catch (err) {
              keys.push({ key, ts: 0 });
            }
          }
        }

        if (keys.length > MAX_ENTRIES) {
          keys.sort((a, b) => a.ts - b.ts);
          const toDelete = keys.slice(0, keys.length - MAX_ENTRIES);
          toDelete.forEach(k => localStorage.removeItem(k.key));
        }
      } catch (e) {
        // Fail silently
      }
    };

    // 4. Listeners (using refs to avoid stale closures!)
    const handleScroll = () => {
      if (scrollTimeout.current || isRestoring.current) return;
      
      // Debounce saving to prevent heavy write operations
      scrollTimeout.current = setTimeout(() => {
        savePos(currentPath.current);
        scrollTimeout.current = null;
      }, 150);
    };

    const handleBeforeUnload = () => {
      // Always store exact position right before refresh / navigation exit
      savePos(currentPath.current);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    window.addEventListener('beforeunload', handleBeforeUnload);

    // 5. Intelligent Restoration
    const restorePos = (url) => {
      if (!url) return;
      
      if (activeObserver.current) {
        activeObserver.current.disconnect();
        activeObserver.current = null;
      }

      const savedItem = getSavedPos(url);
      
      // Lock saving mechanism during restore
      isRestoring.current = true;
      const targetY = savedItem ? savedItem.y : 0;

      const executeScroll = () => {
        const docHeight = document.documentElement.scrollHeight;
        const viewportHeight = window.innerHeight;
        const maxScroll = Math.max(0, docHeight - viewportHeight);
        
        // If content is smaller than saved pos (e.g., deleted), bind to max
        const safeY = Math.min(targetY, maxScroll);
        window.scrollTo({ top: safeY, behavior: 'auto' }); // 'auto' is instant
      };

      // Firing early helps mask load jumps
      executeScroll();

      // Guard against infinite polling edge cases
      let rafId;
      let attempts = 0;
      const maxAttempts = 15;

      const checkAndScroll = () => {
        const currentHeight = document.documentElement.scrollHeight;
        executeScroll();
        
        // Target achieved, or we've attempted sufficiently
        if (currentHeight >= (targetY - 50) || attempts >= maxAttempts) {
          if (activeObserver.current) {
            activeObserver.current.disconnect();
            activeObserver.current = null;
          }
          // Release the lock safely after DOM layout settles
          setTimeout(() => { isRestoring.current = false; }, 100);
        }
      };

      // Ensure that as async content loads (images, suspended boundaries), scroll corrects
      const observer = new MutationObserver(() => {
        if (rafId) cancelAnimationFrame(rafId);
        rafId = requestAnimationFrame(() => {
          attempts++;
          checkAndScroll();
        });
      });

      observer.observe(document.body, { 
        childList: true, 
        subtree: true,
        attributes: false 
      });
      activeObserver.current = observer;

      // Fail-safe unlock (e.g. page doesn't reach target height and stops mutating)
      setTimeout(() => {
        if (activeObserver.current === observer) {
          observer.disconnect();
          activeObserver.current = null;
        }
        isRestoring.current = false;
      }, 1500);
    };

    // 6. Router Lifecycle
    const handleRouteChangeStart = () => {
      savePos(currentPath.current);
    };

    const handleRouteChangeComplete = (url) => {
      // Delay to ensure the new page components have mounted
      requestAnimationFrame(() => {
        restorePos(url);
        performCleanup();
      });
    };

    router.events.on('routeChangeStart', handleRouteChangeStart);
    router.events.on('routeChangeComplete', handleRouteChangeComplete);

    // 7. Execute initial load restoration
    // We do not wait for Next.js router.isReady because the client HTML is heavily cached,
    // and using window locations immediately is faster and prevents screen flashes
    restorePos(currentPath.current);
    performCleanup();

    // Cleanup
    return () => {
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('beforeunload', handleBeforeUnload);
      
      router.events.off('routeChangeStart', handleRouteChangeStart);
      router.events.off('routeChangeComplete', handleRouteChangeComplete);
      
      if (activeObserver.current) {
        activeObserver.current.disconnect();
      }
      if (scrollTimeout.current) clearTimeout(scrollTimeout.current);
      
      isRestoring.current = false;
    };
  }, [router.events]); // Dependency array relies only on stable router.events

  return null;
};

export default ScrollRestoration;
