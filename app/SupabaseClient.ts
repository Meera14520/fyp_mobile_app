// supabaseClient.ts
import { createClient } from '@supabase/supabase-js';

// Put these values in environment variables (do NOT commit them)
const SUPABASE_URL = process.env.SUPABASE_URL ?? 'https://your-project-ref.supabase.co';
const SUPABASE_ANON_KEY = process.env.SUPABASE_ANON_KEY ?? 'your-anon-key';

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
  auth: {
    // On React Native / Expo we often need a redirect URL for OAuth flows
    // We'll set redirect to the Expo auth redirect at runtime where needed.
  }
});
