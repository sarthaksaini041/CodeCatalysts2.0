/**
 * Animated shimmer blur placeholder for Next.js <Image> components.
 *
 * Usage:
 *   import { shimmerDataURL } from '../utils/imageUtils';
 *
 *   <Image
 *     src={url}
 *     placeholder="blur"
 *     blurDataURL={shimmerDataURL(700, 475)}
 *   />
 *
 * Works for any image URL including Supabase storage.
 * No extra HTTP requests — purely generated SVG→base64.
 */

const toBase64 = (str) =>
  typeof window === 'undefined'
    ? Buffer.from(str).toString('base64')
    : window.btoa(str);

/**
 * Returns an animated shimmer SVG as a base64 data URL.
 * @param {number} w - width of the shimmer (use aspect-ratio proportional values)
 * @param {number} h - height of the shimmer
 * @returns {string} data:image/svg+xml;base64,... string for blurDataURL
 */
export const shimmerDataURL = (w = 700, h = 475) => {
  const svg = `<svg width="${w}" height="${h}" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink">
  <defs>
    <linearGradient id="g" x1="0%" y1="0%" x2="100%" y2="0%">
      <stop stop-color="#111111" offset="0%" />
      <stop stop-color="#1e1e1e" offset="50%" />
      <stop stop-color="#111111" offset="100%" />
    </linearGradient>
  </defs>
  <rect width="${w}" height="${h}" fill="#0d0d0d" />
  <rect id="r" width="${w}" height="${h}" fill="url(#g)" />
</svg>`;
  return `data:image/svg+xml;base64,${toBase64(svg)}`;
};

/** Pre-computed common aspect ratios — avoids calling shimmerDataURL() on each render */
export const SHIMMER_16_10 = shimmerDataURL(800, 500);  // Projects / Genesis / Journey images
export const SHIMMER_1_1   = shimmerDataURL(200, 200);  // Avatar circles (team page)
export const SHIMMER_3_4   = shimmerDataURL(300, 400);  // Tall portrait cards (builder cards)
