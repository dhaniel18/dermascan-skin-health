// ============================================================
// DermaScan — Profile Service
// Reads / writes user skin profile to Supabase.
// Falls back to AsyncStorage when offline.
// ============================================================
import AsyncStorage from "@react-native-async-storage/async-storage";
import { supabase } from "@/lib/supabase";
import type { SkinProfile } from "@/types/domain";

const LOCAL_KEY = "dermascan:skin-profile";

// ── Helpers ──────────────────────────────────────────────────
function rowToProfile(row: {
  skin_type: string | null;
  conditions: string[];
  concerns: string[];
}): SkinProfile {
  return {
    skinType: row.skin_type,
    conditions: row.conditions ?? [],
    concerns: row.concerns ?? [],
  };
}

// ── Read ─────────────────────────────────────────────────────
export async function getSkinProfile(): Promise<SkinProfile | null> {
  // 1. Try Supabase (authoritative)
  const { data: { user } } = await supabase.auth.getUser();
  if (user) {
    const { data, error } = await supabase
      .from("profiles")
      .select("skin_type, conditions, concerns")
      .eq("id", user.id)
      .single();

    if (!error && data) {
      const profile = rowToProfile(data);
      // Sync local cache
      await AsyncStorage.setItem(LOCAL_KEY, JSON.stringify(profile));
      return profile;
    }
  }

  // 2. Fall back to local cache (offline)
  const cached = await AsyncStorage.getItem(LOCAL_KEY);
  return cached ? (JSON.parse(cached) as SkinProfile) : null;
}

// ── Write ─────────────────────────────────────────────────────
export async function saveSkinProfile(profile: SkinProfile): Promise<SkinProfile> {
  // Always write locally first for instant feedback
  await AsyncStorage.setItem(LOCAL_KEY, JSON.stringify(profile));

  const { data: { user } } = await supabase.auth.getUser();
  if (user) {
    const { error } = await supabase.from("profiles").upsert({
      id: user.id,
      skin_type: profile.skinType,
      conditions: profile.conditions,
      concerns: profile.concerns,
      updated_at: new Date().toISOString(),
    });
    if (error) console.warn("[profile] Supabase upsert error:", error.message);
  }

  return profile;
}
