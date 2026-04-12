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
  const lastSavedUrl = useRef('');

  useEffect(() => {
    if (typeof window === 'undefined') return;

    // 1. Take control of scroll restoration
    if ('scrollRestoration' in window.history) {
      window.history.scrollRestoration = 'manual';
    }

    // 2. Storage Helper Functions
    const savePos = (url, y) => {
      if (!url) return;
      try {
        const data = {
          y: Math.max(0, y),
          ts: Date.now()
        };
        localStorage.setItem(`${STORAGE_KEY_PREFIX}${url}`, JSON.stringify(data));
        lastSavedUrl.current = url;
      } catch (e) {
        // Handle storage quota issues (e.g., clear all and try again)
        if (e.name === 'QuotaExceededError') {
          localStorage.clear();
        }
      }
    };

    const getSavedPos = (url) => {
      try {
        const item = localStorage.getItem(`${STORAGE_KEY_PREFIX}${url}`);
        if (!item) return null;
        return JSON.parse(item);
      } catch (e) {
        return null;
      }
    };

    // 3. Cleanup Logic
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
        // Ignore cleanup errors
      }
    };

    // 4. Scroll Listener (Debounced)
    const handleScroll = () => {
      if (scrollTimeout.current) return;
      scrollTimeout.current = setTimeout(() => {
        savePos(router.asPath, window.scrollY);
        scrollTimeout.current = null;
      }, 150);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });

    // 5. Page Refresh Protection (Save before unload)
    const handleBeforeUnload = () => {
      savePos(router.asPath, window.scrollY);
    };
    window.addEventListener('beforeunload', handleBeforeUnload);

    // 6. Restoration Logic
    const restorePos = (url) => {
      if (activeObserver.current) {
        activeObserver.current.disconnect();
        activeObserver.current = null;
      }

      const savedItem = getSavedPos(url);
      if (!savedItem) {
        window.scrollTo({ top: 0, behavior: 'auto' });
        return;
      }

      const targetY = savedItem.y;
      
      const executeScroll = () => {
        const docHeight = document.documentElement.scrollHeight;
        const viewportHeight = window.innerHeight;
        const safeY = Math.min(targetY, docHeight - viewportHeight);
        window.scrollTo({ top: Math.max(0, safeY), behavior: 'auto' });
      };

      // Initial jump
      executeScroll();

      // Observer with debounced check to avoid layout thrashing
      let rafId;
      let attempts = 0;
      const maxAttempts = 15; // Sufficient for most dynamic content

      const checkAndScroll = () => {
        const currentHeight = document.documentElement.scrollHeight;
        executeScroll();
        
        // If we've reached the target or the page is stable, we can stop
        if (currentHeight >= (targetY - 50) || attempts >= maxAttempts) {
          if (activeObserver.current) {
            activeObserver.current.disconnect();
            activeObserver.current = null;
          }
        }
      };

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

      // Fail-safe cleanup (shorter timeout)
      setTimeout(() => {
        if (activeObserver.current === observer) {
          observer.disconnect();
          activeObserver.current = null;
        }
      }, 1000);
    };

    // 7. Router Event Integration
    const handleRouteChangeStart = () => {
      savePos(router.asPath, window.scrollY);
    };

    const handleRouteChangeComplete = (url) => {
      // Immediate restoration attempt
      restorePos(url);
      performCleanup();
    };

    router.events.on('routeChangeStart', handleRouteChangeStart);
    router.events.on('routeChangeComplete', handleRouteChangeComplete);

    if (router.isReady) {
      restorePos(router.asPath);
      performCleanup();
    }

    return () => {
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('beforeunload', handleBeforeUnload);
      router.events.off('routeChangeStart', handleRouteChangeStart);
      router.events.off('routeChangeComplete', handleRouteChangeComplete);
      if (activeObserver.current) {
        activeObserver.current.disconnect();
      }
      if (scrollTimeout.current) clearTimeout(scrollTimeout.current);
    };
  }, [router.asPath, router.isReady]);

  return null;
};

export default ScrollRestoration;

