/**
 * On-demand ISR Revalidation API Route
 * 
 * Call this endpoint after editing content in the admin panel to instantly
 * regenerate static pages without waiting for the ISR timer.
 * 
 * Usage:
 *   POST /api/revalidate?secret=<REVALIDATION_SECRET>
 *   POST /api/revalidate?secret=<REVALIDATION_SECRET>&path=/team
 * 
 * Without a path param, both / and /team are revalidated.
 */
export default async function handler(req, res) {
  // Verify secret token
  const secret = req.query.secret || req.body?.secret;
  
  if (secret !== process.env.REVALIDATION_SECRET) {
    return res.status(401).json({ message: 'Invalid revalidation token' });
  }

  try {
    const path = req.query.path || req.body?.path;

    if (path) {
      // Revalidate specific path
      await res.revalidate(path);
      return res.json({ revalidated: true, path });
    }

    // Revalidate all content pages
    await Promise.all([
      res.revalidate('/'),
      res.revalidate('/team'),
    ]);

    return res.json({
      revalidated: true,
      paths: ['/', '/team'],
      timestamp: new Date().toISOString(),
    });
  } catch (err) {
    console.error('Revalidation error:', err);
    return res.status(500).json({ message: 'Error revalidating', error: err.message });
  }
}
