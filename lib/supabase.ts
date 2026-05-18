// ============================================================
// DermaScan — Supabase Client
// ============================================================
import "react-native-url-polyfill/auto";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { createClient, type SupabaseClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.EXPO_PUBLIC_SUPABASE_URL ?? "";
const supabaseAnonKey = process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY ?? "";

export const isSupabaseConfigured = Boolean(supabaseUrl && supabaseAnonKey);

function missingSupabaseConfig(): never {
  throw new Error(
    "Supabase environment variables are missing. Make sure EXPO_PUBLIC_SUPABASE_URL and EXPO_PUBLIC_SUPABASE_ANON_KEY are set in .env.local, then restart Expo with `npx expo start -c`."
  );
}

const missingSupabaseClient = new Proxy(
  {},
  {
    get: missingSupabaseConfig,
  }
) as SupabaseClient;

export const supabase = isSupabaseConfigured
  ? createClient(supabaseUrl, supabaseAnonKey, {
      auth: {
        storage: AsyncStorage,
        autoRefreshToken: true,
        persistSession: true,
        detectSessionInUrl: false,
      },
    })
  : missingSupabaseClient;

// Helper: throw on Supabase error
export function assertNoError<T>(
  result: { data: T | null; error: unknown },
  label: string
): T {
  if (result.error) throw new Error(`[${label}] ${JSON.stringify(result.error)}`);
  if (result.data === null) throw new Error(`[${label}] No data returned`);
  return result.data;
}
