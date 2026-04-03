import React, { useEffect, useRef } from 'react';

/**
 * GlobalBackground
 * ─────────────────
 * Renders two layered elements:
 *  1. A giant CSS gradient "world map" behind the entire webpage
 *     (positioned on <body> via a fixed element that escapes stacking).
 *  2. A <canvas> grain layer that animates at ~12fps for a filmic roughness.
 */
const GlobalBackground = () => {
  const canvasRef = useRef(null);
  const rafRef    = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    let w, h;

    const resize = () => {
      w = canvas.width  = window.innerWidth;
      h = canvas.height = window.innerHeight;
    };

    const drawGrain = () => {
      const imageData = ctx.createImageData(w, h);
      const data = imageData.data;
      for (let i = 0; i < data.length; i += 4) {
        const v = Math.random() * 255 | 0;
        data[i]     = v;
        data[i + 1] = v;
        data[i + 2] = v;
        data[i + 3] = 18; // very low alpha → subtle grain
      }
      ctx.putImageData(imageData, 0, 0);
    };

    // Animate grain at ~12 fps so it shimmers without using too much CPU
    let last = 0;
    const loop = (ts) => {
      if (ts - last > 80) {
        drawGrain();
        last = ts;
      }
      rafRef.current = requestAnimationFrame(loop);
    };

    resize();
    window.addEventListener('resize', resize);
    rafRef.current = requestAnimationFrame(loop);

    return () => {
      window.removeEventListener('resize', resize);
      cancelAnimationFrame(rafRef.current);
    };
  }, []);

  return (
    <>
      {/* ── World background: tall gradient div fixed behind everything ──── */}
      <div className="world-bg" aria-hidden="true" />

      {/* ── Canvas grain overlay ─────────────────────────────────────────── */}
      <canvas
        ref={canvasRef}
        className="grain-canvas"
        aria-hidden="true"
      />
    </>
  );
};

export default GlobalBackground;
