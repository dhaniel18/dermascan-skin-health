// ============================================================
// DermaScan — Product Research Service
// When a barcode isn't in our Supabase DB, we:
//   1. Try Open Food Facts API (free, 3M+ products, no key)
//   2. If found: extract ingredients, run analysis, save to DB
//   3. If not found: return null (UI then offers OCR label scan)
// ============================================================
import { supabase } from "@/lib/supabase";
import { analyseIngredients, parseIngredientTextWithAI } from "@/lib/analysisEngine";
import { getSkinProfile } from "./profile";
import type { Product, AnalysisResult } from "@/types/domain";

// Open Food Facts — completely free, no API key, 3M+ products
const OFF_API = "https://world.openfoodfacts.org/api/v2/product";

type OFFProduct = {
  product?: {
    product_name?: string;
    brands?: string;
    categories?: string;
    ingredients_text?: string;
    ingredients_text_en?: string;
    image_url?: string;
  };
  status: number;
};

async function fetchFromOpenFoodFacts(barcode: string): Promise<OFFProduct | null> {
  try {
    const res = await fetch(
      `${OFF_API}/${barcode}?fields=product_name,brands,categories,ingredients_text,ingredients_text_en`,
      { signal: AbortSignal.timeout(8_000) }
    );
    if (!res.ok) return null;
    return await res.json();
  } catch {
    return null;
  }
}

/**
 * Research a barcode that wasn't found in our DB:
 * 1. Query Open Food Facts
 * 2. Parse & analyse ingredients via our AI pipeline
 * 3. Save product to Supabase as Pending (crowdsource)
 * 4. Return product + analysis result
 *
 * Returns null if barcode not found anywhere.
 */
export async function researchProductByBarcode(
  barcode: string,
  onProgress?: (msg: string) => void
): Promise<{ product: Product; analysis: AnalysisResult } | null> {
  onProgress?.("Searching product database...");

  const offData = await fetchFromOpenFoodFacts(barcode);

  if (!offData || offData.status !== 1 || !offData.product) {
    return null; // Not found anywhere
  }

  const p = offData.product;
  const name = p.product_name?.trim() || "Unknown Product";
  const brand = p.brands?.split(",")[0]?.trim() ?? undefined;
  const category = p.categories?.split(",")[0]?.trim() ?? undefined;
  const rawText = p.ingredients_text_en || p.ingredients_text || "";

  onProgress?.(`Found: ${name}. Analysing ingredients...`);

  // Parse ingredients through our 4-layer AI pipeline
  const { ingredients, aiResearched, failed } = await parseIngredientTextWithAI(
    rawText,
    onProgress
  );

  const profile = await getSkinProfile();
  const analysis = analyseIngredients(ingredients, profile);

  // Build product object
  const product: Product = {
    id: `off-${barcode}`,
    barcode,
    name,
    brand,
    category,
    ingredientIds: ingredients.map((i) => i.id),
    rawIngredientText: rawText,
    verificationStatus: "Pending",
  };

  // Save to Supabase in background (don't block result)
  const { data: { user } } = await supabase.auth.getUser();
  if (user && rawText) {
    supabase.from("products").upsert({
      barcode,
      name,
      brand: brand ?? null,
      category: category ?? null,
      ingredient_ids: ingredients.map((i) => i.id),
      raw_ingredient_text: rawText,
      verification_status: "Pending",
      uploaded_by: user.id,
    }, { onConflict: "barcode" }).then(() => {}).catch(() => {});
  }

  return { product, analysis };
}
