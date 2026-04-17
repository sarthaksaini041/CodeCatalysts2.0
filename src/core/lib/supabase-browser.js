import { createClient } from '@supabase/supabase-js';

/**
 * Client-side Supabase client.
 * Used in admin panel, auth flows, and client-side interactive features.
 * Uses NEXT_PUBLIC_ env vars so it's safe to bundle into the browser.
 */
export const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
);
