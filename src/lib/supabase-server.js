import { createClient } from '@supabase/supabase-js';

/**
 * Server-side Supabase client.
 * Used in getStaticProps / API routes only — never exposed to the browser.
 * Falls back to NEXT_PUBLIC_ vars for environments where server-only vars aren't set.
 */
export const supabaseServer = createClient(
  process.env.SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_ANON_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
);
