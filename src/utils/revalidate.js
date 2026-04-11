/**
 * Triggers on-demand ISR revalidation for specific paths or the entire site.
 * 
 * @param {string} [path] - Optional path to revalidate (e.g. '/team'). 
 *                         If omitted, both root ('/') and '/team' are refreshed.
 */
export const triggerRevalidation = async (path = '') => {
  const secret = process.env.NEXT_PUBLIC_REVALIDATION_SECRET;
  
  if (!secret) {
    console.warn('REVALIDATION_SECRET is not configured in environment variables. Instant refresh will not work.');
    return;
  }

  try {
    const response = await fetch('/api/revalidate', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        secret,
        path,
      }),
    });

    const result = await response.json();
    
    if (response.ok) {
      console.log(`Revalidation successful:`, result);
    } else {
      console.error(`Revalidation failed:`, result);
    }
  } catch (error) {
    console.error('Error triggering revalidation:', error);
  }
};
