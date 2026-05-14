// ============================================================
// DermaScan — Routine / Layering Service
// ============================================================
import { supabase } from "@/lib/supabase";
import { analyseRoutine } from "@/lib/analysisEngine";
import type { RoutineProduct, RoutineCompatibilityResult } from "@/types/domain";

// ── Row mapper ───────────────────────────────────────────────
function rowToRoutineProduct(row: {
  product_id: string;
  time_of_day: string;
  products: {
    name: string;
    ingredient_ids: string[];
  };
}): RoutineProduct {
  return {
    productId: row.product_id,
    productName: row.products.name,
    ingredientIds: row.products.ingredient_ids ?? [],
    timeOfDay: (row.time_of_day ?? "any") as RoutineProduct["timeOfDay"],
  };
}

// ── Read routine ─────────────────────────────────────────────
export async function getUserRoutine(): Promise<RoutineProduct[]> {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return [];

  const { data, error } = await supabase
    .from("user_routine")
    .select("product_id, time_of_day, products(name, ingredient_ids)")
    .eq("user_id", user.id);

  if (error) {
    console.warn("[routine] fetch error:", error.message);
    return [];
  }
  return (data ?? []).map(rowToRoutineProduct);
}

// ── Add product to routine ────────────────────────────────────
export async function addToRoutine(
  productId: string,
  timeOfDay: RoutineProduct["timeOfDay"] = "any"
): Promise<void> {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error("Must be signed in.");

  const { error } = await supabase.from("user_routine").upsert(
    { user_id: user.id, product_id: productId, time_of_day: timeOfDay },
    { onConflict: "user_id,product_id" }
  );
  if (error) throw new Error(`[routine] add error: ${error.message}`);
}

// ── Remove product from routine ───────────────────────────────
export async function removeFromRoutine(productId: string): Promise<void> {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return;

  await supabase
    .from("user_routine")
    .delete()
    .eq("user_id", user.id)
    .eq("product_id", productId);
}

// ── Check compatibility across entire routine ─────────────────
export async function checkRoutineCompatibility(): Promise<RoutineCompatibilityResult> {
  const routine = await getUserRoutine();
  return analyseRoutine(routine);
}
