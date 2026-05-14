// ============================================================
// DermaScan — Products Service
// analyseFromOcrTokens accepts a pre-split string[] directly
// from the OCR service — no re-tokenising needed.
// ============================================================
import AsyncStorage from "@react-native-async-storage/async-storage";
import { supabase } from "@/lib/supabase";
import {
  parseIngredientTextWithAI,
  analyseIngredients,
  resolveIngredientIds,
} from "@/lib/analysisEngine";
import {
  sanitizeProductName,
  sanitizeIngredientText,
  isValidBarcode,
} from "@/security/inputSanitizer";
import { getSkinProfile } from "./profile";
import type { Product, AnalysisResult } from "@/types/domain";

const SAVED_KEY = "dermascan:saved-products";

function rowToProduct(row: {
  id: string; barcode?: string | null; name: string; brand?: string | null;
  category?: string | null; ingredient_ids: string[];
  raw_ingredient_text?: string | null; verification_status: string;
  uploaded_by?: string | null;
}): Product {
  return {
    id: row.id, barcode: row.barcode ?? undefined, name: row.name,
    brand: row.brand ?? undefined, category: row.category ?? undefined,
    ingredientIds: row.ingredient_ids ?? [],
    rawIngredientText: row.raw_ingredient_text ?? undefined,
    verificationStatus: row.verification_status as Product["verificationStatus"],
    uploadedBy: row.uploaded_by ?? undefined,
  };
}

// ── Barcode lookup ────────────────────────────────────────────
export async function getProductByBarcode(barcode: string): Promise<Product | null> {
  if (!isValidBarcode(barcode)) return null;
  const { data, error } = await supabase
    .from("products").select("*")
    .eq("barcode", barcode).eq("verification_status", "Verified").maybeSingle();
  if (error) { console.warn("[products] barcode:", error.message); return null; }
  return data ? rowToProduct(data) : null;
}

// ── Search ────────────────────────────────────────────────────
export async function searchProducts(query: string): Promise<Product[]> {
  if (!query.trim()) return [];
  const { data, error } = await supabase.from("products").select("*")
    .ilike("name", `%${query.trim()}%`).eq("verification_status", "Verified").limit(20);
  if (error) { console.warn("[products] search:", error.message); return []; }
  return (data ?? []).map(rowToProduct);
}

// ── Discover feed ─────────────────────────────────────────────
export async function getDiscoverFeed(): Promise<Product[]> {
  const { data, error } = await supabase.from("products").select("*")
    .eq("verification_status", "Pending")
    .order("created_at", { ascending: false }).limit(30);
  if (error) { console.warn("[products] discover:", error.message); return []; }
  return (data ?? []).map(rowToProduct);
}

// ── Barcode scan + analysis ───────────────────────────────────
export async function scanAndAnalyse(
  barcode: string
): Promise<{ product: Product; analysis: AnalysisResult } | null> {
  const product = await getProductByBarcode(barcode);
  if (!product) return null;
  const profile = await getSkinProfile();
  const ingredients = resolveIngredientIds(product.ingredientIds);
  const analysis = analyseIngredients(ingredients, profile);
  return { product, analysis };
}

// ── OCR analysis (accepts token array from camera OCR) ────────
/**
 * Called after Gemini Vision extracts ingredient names from a photo.
 * Resolution order per token:
 *   1. Session cache   (instant, free)
 *   2. Bundled DB      (instant, free, offline)
 *   3. Supabase cloud  (fast, free)
 *   4. Gemini research (only truly unknown ingredients)
 */
export async function analyseFromOcrTokens(
  tokens: string[],
  onProgress?: (status: string) => void
): Promise<{
  analysis: AnalysisResult;
  aiResearched: string[];
  cloudResolved: string[];
  failed: string[];
}> {
  const profile = await getSkinProfile();
  // Pass the token array directly — no re-splitting
  const { ingredients, aiResearched, cloudResolved, failed } =
    await parseIngredientTextWithAI(tokens, onProgress);
  const analysis = analyseIngredients(ingredients, profile);
  return { analysis, aiResearched, cloudResolved, failed };
}

// ── Text analysis (for typed/pasted ingredient lists) ─────────
export async function analyseFromOcrText(
  rawText: string,
  onProgress?: (status: string) => void
): Promise<{
  analysis: AnalysisResult;
  aiResearched: string[];
  cloudResolved: string[];
  failed: string[];
}> {
  const profile = await getSkinProfile();
  const cleanText = sanitizeIngredientText(rawText);
  const { ingredients, aiResearched, cloudResolved, failed } =
    await parseIngredientTextWithAI(cleanText, onProgress);
  const analysis = analyseIngredients(ingredients, profile);
  return { analysis, aiResearched, cloudResolved, failed };
}

// ── Crowdsource submit ────────────────────────────────────────
export async function submitCrowdsourcedProduct(
  input: {
    barcode?: string; name: string; brand?: string;
    category?: string; rawIngredientText: string;
  },
  onProgress?: (status: string) => void
): Promise<{ product: Product; aiResearched: string[]; failed: string[] }> {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error("Must be signed in to submit a product.");

  const cleanName = sanitizeProductName(input.name);
  const cleanText = sanitizeIngredientText(input.rawIngredientText);

  onProgress?.("Parsing ingredients...");
  const { ingredients, aiResearched, failed } =
    await parseIngredientTextWithAI(cleanText, onProgress);
  const ingredientIds = ingredients.map((i) => i.id);

  onProgress?.("Saving product...");
  const { data, error } = await supabase.from("products").insert({
    barcode: input.barcode ?? null,
    name: cleanName,
    brand: input.brand ? sanitizeProductName(input.brand) : null,
    category: input.category ?? null,
    ingredient_ids: ingredientIds,
    raw_ingredient_text: cleanText,
    verification_status: "Pending",
    uploaded_by: user.id,
  }).select().single();

  if (error) throw new Error(`Submit failed: ${error.message}`);
  return { product: rowToProduct(data), aiResearched, failed };
}

// ── Saved products ────────────────────────────────────────────
export async function getSavedProducts(): Promise<Product[]> {
  const { data: { user } } = await supabase.auth.getUser();
  if (user) {
    const { data, error } = await supabase.from("saved_products")
      .select("products(*)").eq("user_id", user.id)
      .order("saved_at", { ascending: false });
    if (!error && data) {
      const products = data.flatMap((r: { products: unknown }) =>
        r.products ? [rowToProduct(r.products as Parameters<typeof rowToProduct>[0])] : []
      );
      await AsyncStorage.setItem(SAVED_KEY, JSON.stringify(products));
      return products;
    }
  }
  const cached = await AsyncStorage.getItem(SAVED_KEY);
  return cached ? JSON.parse(cached) : [];
}

export async function toggleSaveProduct(productId: string): Promise<boolean> {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error("Must be signed in.");
  const { data: existing } = await supabase.from("saved_products")
    .select("product_id").eq("user_id", user.id).eq("product_id", productId).maybeSingle();
  if (existing) {
    await supabase.from("saved_products").delete()
      .eq("user_id", user.id).eq("product_id", productId);
    return false;
  }
  await supabase.from("saved_products")
    .insert({ user_id: user.id, product_id: productId });
  return true;
}
