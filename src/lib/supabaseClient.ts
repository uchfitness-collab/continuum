import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: true,
  },
});

// On the client, listen for auth errors and clear stale tokens automatically.
// This prevents the "Invalid Refresh Token: Refresh Token Not Found" console
// error that fires when localStorage has a leftover token from a previous session.
if (typeof window !== 'undefined') {
  supabase.auth.onAuthStateChange((event, session) => {
    if (event === 'SIGNED_OUT' || (!session && event === 'TOKEN_REFRESHED')) {
      // Clear any stale Supabase keys from localStorage
      Object.keys(localStorage).forEach((key) => {
        if (key.startsWith('sb-')) {
          localStorage.removeItem(key);
        }
      });
    }
  });
}