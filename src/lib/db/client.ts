import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  console.warn('Missing Supabase environment variables. Database client is unavailable.');
}

// Client for public operations and browser environments
export const supabaseClient = createClient(
  supabaseUrl || 'http://localhost:8000',
  supabaseAnonKey || 'dummy_key'
);

// Client strictly for server-side secure operations (bypasses RLS)
export const supabaseAdmin = createClient(
  supabaseUrl || 'http://localhost:8000',
  supabaseServiceKey || 'dummy_service_key'
);

// Function to generate a client dynamically bound to a user's JWT
// This enforces RLS and prevents IDOR (as per Hostile Review Architecture updates)
export const createAuthenticatedClient = (jwt: string) => {
  return createClient(
    supabaseUrl || 'http://localhost:8000',
    supabaseAnonKey || 'dummy_key',
    {
      global: {
        headers: {
          Authorization: `Bearer ${jwt}`,
        },
      },
    }
  );
};

