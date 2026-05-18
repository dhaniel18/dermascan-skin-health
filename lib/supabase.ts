// ============================================================
// DermaScan — Supabase Client
// Note: react-native-url-polyfill/auto is imported in
// app/_layout.tsx (root) — NOT here. Importing it in a non-root
// module causes silent crashes on iOS.
// ============================================================
import AsyncStorage from "@react-native-async-storage/async-storage";
import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.EXPO_PUBLIC_SUPABASE_URL ?? "";
const supabaseAnonKey = process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY ?? "";

export const isSupabaseConfigured = Boolean(supabaseUrl && supabaseAnonKey);

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    storage: AsyncStorage,
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: false,
  },
});

export function assertNoError<T>(
  result: { data: T | null; error: unknown },
  label: string
): T {
  if (result.error) throw new Error(`[${label}] ${JSON.stringify(result.error)}`);
  if (result.data === null) throw new Error(`[${label}] No data returned`);
  return result.data;
}
