// ============================================================
// DermaScan — Ingredients Service
// Primary source: bundled ingredientDatabase (offline-first).
// Optional enrichment: HuggingFace cosmetic-ingredients dataset
// (yavuzyilmaz/cosmetic-ingredients, MIT licence) fetched at
// runtime via the Hugging Face Datasets Server API when online.
// ============================================================
import { supabase } from "@/lib/supabase";
import {
  INGREDIENTS,
  getIngredientById,
  getIngredientByName,
  parseIngredientText,
} from "@/lib/ingredientDatabase";
import type { Ingredient } from "@/types/domain";

// Re-export for convenience
export { getIngredientById, getIngredientByName, parseIngredientText };

// ── Local search (always available) ─────────────────────────
export function searchIngredients(query: string): Ingredient[] {
  const q = query.toLowerCase().trim();
  if (!q) return INGREDIENTS.slice(0, 20);
  return INGREDIENTS.filter(
    (i) =>
      i.name.toLowerCase().includes(q) ||
      i.aliases.some((a) => a.toLowerCase().includes(q)) ||
      i.category.toLowerCase().includes(q)
  );
}

// ── Cloud sync: push unknown ingredient to Supabase ──────────
export async function upsertIngredientToCloud(
  ing: Omit<Ingredient, "id"> & { id?: string }
): Promise<void> {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return;

  await supabase.from("ingredients").upsert({
    id: ing.id ?? `ING-USR-${Date.now()}`,
    name: ing.name,
    aliases: ing.aliases,
    is_comedogenic: ing.isComedogenic,
    allergen_risk: ing.allergenRisk,
    unsuitable_for: ing.unsuitableFor,
    category: ing.category,
  });
}

// ── HuggingFace enrichment (optional, online-only) ───────────
// Dataset: yavuzyilmaz/cosmetic-ingredients (MIT licence)
// API: https://datasets-server.huggingface.co/rows
// We query for extra INCI names not in our bundled list and use
// them to expand alias matching during OCR parsing.

const HF_API =
  "https://datasets-server.huggingface.co/rows" +
  "?dataset=yavuzyilmaz%2Fcosmetic-ingredients" +
  "&config=default&split=train";

type HFRow = {
  row: {
    ingredient_name?: string;
    inci_name?: string;
    function?: string;
    description?: string;
  };
};

/**
 * Fetch a page of the HuggingFace cosmetic-ingredients dataset
 * and return rows as lightweight alias records.
 * Silently returns [] on network failure (offline resilience).
 */
export async function fetchHuggingFaceIngredients(
  offset = 0,
  length = 100
): Promise<Array<{ name: string; inci: string; fn: string }>> {
  try {
    const url = `${HF_API}&offset=${offset}&length=${length}`;
    const res = await fetch(url, { signal: AbortSignal.timeout(8000) });
    if (!res.ok) return [];
    const json = (await res.json()) as { rows?: HFRow[] };
    return (json.rows ?? []).map((r) => ({
      name: r.row.ingredient_name ?? "",
      inci: r.row.inci_name ?? "",
      fn: r.row.function ?? "",
    }));
  } catch {
    return [];
  }
}

/**
 * Augment local ingredient matching with HuggingFace alias data.
 * Call once at app start when online; results are ephemeral (not
 * persisted — the bundled DB is the source of truth).
 */
export async function enrichAliasesFromHuggingFace(): Promise<number> {
  const rows = await fetchHuggingFaceIngredients(0, 100);
  let matched = 0;
  for (const row of rows) {
    if (!row.inci) continue;
    const existing = getIngredientByName(row.inci) ?? getIngredientByName(row.name);
    if (existing && !existing.aliases.includes(row.inci)) {
      // Mutate in-memory alias list — won't affect bundled JSON file
      existing.aliases.push(row.inci);
      matched++;
    }
  }
  return matched;
}
