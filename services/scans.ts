// ============================================================
// DermaScan — Scan History Service
// ============================================================
import AsyncStorage from "@react-native-async-storage/async-storage";
import { supabase } from "@/lib/supabase";
import type { ScanHistoryItem, IngredientAnalysisWarning } from "@/types/domain";

async function getHistoryKey(): Promise<string> {
  const { data: { user } } = await supabase.auth.getUser();
  return user ? `dermascan:${user.id}:scan-history` : "dermascan:guest:scan-history";
}

// ── Row mapper ───────────────────────────────────────────────
function rowToScanItem(row: {
  id: string;
  product_id?: string | null;
  product_name: string;
  scan_method?: string;
  safety_score?: number | null;
  warnings?: IngredientAnalysisWarning[] | null;
  scanned_at: string;
}): ScanHistoryItem {
  return {
    id: row.id,
    productId: row.product_id ?? undefined,
    productName: row.product_name,
    scanMethod: (row.scan_method ?? "barcode") as ScanHistoryItem["scanMethod"],
    score: row.safety_score ?? undefined,
    warnings: row.warnings ?? [],
    scannedAt: row.scanned_at,
  };
}

// ── Read ─────────────────────────────────────────────────────
export async function getScanHistory(): Promise<ScanHistoryItem[]> {
  const { data: { user } } = await supabase.auth.getUser();
  const key = await getHistoryKey();
  if (user) {
    const { data, error } = await supabase
      .from("scan_history")
      .select("*")
      .eq("user_id", user.id)
      .order("scanned_at", { ascending: false })
      .limit(50);

    if (!error && data) {
      const items = data.map(rowToScanItem);
      await AsyncStorage.setItem(key, JSON.stringify(items));
      return items;
    }
  }

  // Offline fallback
  const cached = await AsyncStorage.getItem(key);
  return cached ? JSON.parse(cached) : [];
}

// ── Upsert (one row per user+product, latest scan wins) ──────
export async function recordScan(input: {
  productId?: string;
  productName: string;
  scanMethod?: ScanHistoryItem["scanMethod"];
  score?: number;
  warnings?: IngredientAnalysisWarning[];
}): Promise<ScanHistoryItem> {
  const { data: { user } } = await supabase.auth.getUser();

  const item: ScanHistoryItem = {
    id: `local-${Date.now()}`,
    productId: input.productId,
    productName: input.productName,
    scanMethod: input.scanMethod ?? "barcode",
    score: input.score,
    warnings: input.warnings ?? [],
    scannedAt: new Date().toISOString(),
  };

  if (user) {
    // Upsert: conflict on (user_id, product_id) → update timestamp
    const { data, error } = await supabase
      .from("scan_history")
      .upsert(
        {
          user_id: user.id,
          product_id: input.productId ?? null,
          product_name: input.productName,
          scan_method: item.scanMethod,
          safety_score: item.score ?? null,
          warnings: item.warnings,
          scanned_at: item.scannedAt,
        },
        { onConflict: "user_id,product_id" }
      )
      .select()
      .single();

    if (!error && data) return rowToScanItem(data);
    console.warn("[scans] upsert error:", error?.message);
  }

  // Offline: write to local cache
  const key = await getHistoryKey();
  const cached = await AsyncStorage.getItem(key);
  const history: ScanHistoryItem[] = cached ? JSON.parse(cached) : [];
  // Remove duplicate if same product
  const filtered = input.productId
    ? history.filter((h) => h.productId !== input.productId)
    : history;
  const updated = [item, ...filtered].slice(0, 50);
  await AsyncStorage.setItem(key, JSON.stringify(updated));
  return item;
}

// ── Clear history ────────────────────────────────────────────
export async function clearScanHistory(): Promise<void> {
  const { data: { user } } = await supabase.auth.getUser();
  if (user) {
    await supabase.from("scan_history").delete().eq("user_id", user.id);
  }
  const key = await getHistoryKey();
  await AsyncStorage.removeItem(key);
}

export const scanTips = [
  "Place the product label inside the frame.",
  "Use bright, even lighting for clearer text.",
  "Avoid glare on reflective packaging.",
  "Hold the camera steady until the scan completes.",
];
