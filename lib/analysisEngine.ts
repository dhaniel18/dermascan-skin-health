// ============================================================
// DermaScan — Analysis Engine
// ============================================================
import type {
  Ingredient, SkinProfile, AnalysisResult,
  IngredientAnalysisWarning, RoutineProduct, RoutineCompatibilityResult,
} from "@/types/domain";
import { getIngredientById, getIngredientByName, getWarningBetween } from "./ingredientDatabase";

// ── 1. Sync parse (bundled DB only, offline) ─────────────────
export function parseIngredientText(raw: string): Ingredient[] {
  const found: Ingredient[] = [];
  const seen = new Set<string>();
  const tokens = raw
    .replace(/\([^)]*\)/g, " ").replace(/[;\/]/g, ",")
    .split(",").map((s) => s.trim()).filter(Boolean);
  for (const token of tokens) {
    const ing = getIngredientByName(token);
    if (ing && !seen.has(ing.id)) { seen.add(ing.id); found.push(ing); }
  }
  return found;
}

// ── 2. Full async parse — 4-layer resolution ─────────────────
/**
 * Given a list of ingredient name tokens (from OCR or text):
 *   Layer 1: session cache          (instant, free)
 *   Layer 2: bundled DB             (instant, free, offline)
 *   Layer 3: Supabase cloud DB      (fast, free — prior AI results)
 *   Layer 4: Gemini AI via proxy    (only for truly unknown)
 *
 * onProgress receives human-readable status at each step.
 */
export async function parseIngredientTextWithAI(
  rawOrTokens: string | string[],
  onProgress?: (status: string) => void
): Promise<{
  ingredients: Ingredient[];
  aiResearched: string[];
  cloudResolved: string[];
  failed: string[];
}> {
  const { batchResolveIngredients } = await import("./ingredientAI");

  // Accept either a comma string or pre-split array (from OCR)
  const tokens: string[] = Array.isArray(rawOrTokens)
    ? rawOrTokens.map((s) => s.trim()).filter(Boolean)
    : rawOrTokens
        .replace(/\([^)]*\)/g, " ").replace(/[;\/]/g, ",")
        .split(",").map((s) => s.trim()).filter(Boolean);

  if (tokens.length === 0) {
    return { ingredients: [], aiResearched: [], cloudResolved: [], failed: [] };
  }

  onProgress?.(`Checking ${tokens.length} ingredients...`);

  const resolved = await batchResolveIngredients(
    tokens,
    // Forward progress from the resolver to the UI
    (msg) => onProgress?.(msg)
  );

  const ingredients: Ingredient[] = [];
  const aiResearched: string[] = [];
  const cloudResolved: string[] = [];
  const failed: string[] = [];
  const seen = new Set<string>();

  for (const token of tokens) {
    const ing = resolved.get(token);
    if (ing && !seen.has(ing.id)) {
      seen.add(ing.id);
      ingredients.push(ing);

      // Determine source for UI labelling
      const isInBundled = Boolean(getIngredientByName(token));
      if (!isInBundled) {
        // Was it already in Supabase cloud, or freshly AI-researched?
        // We detect this by checking if the ID has the AI prefix
        if (ing.id.startsWith("ING-AI-")) {
          aiResearched.push(ing.name);
        } else {
          cloudResolved.push(ing.name);
        }
      }
    } else if (!ing) {
      failed.push(token);
    }
  }

  return { ingredients, aiResearched, cloudResolved, failed };
}

// ── 3. Resolve ING-xxx IDs ────────────────────────────────────
export function resolveIngredientIds(ids: string[]): Ingredient[] {
  return ids.flatMap((id) => { const i = getIngredientById(id); return i ? [i] : []; });
}

// ── 4. Safety scoring ─────────────────────────────────────────
const DEDUCTIONS: Record<string, number> = { High: 25, Medium: 12, Low: 5 };
function deduct(base: number, sev: string) { return Math.max(0, base - (DEDUCTIONS[sev] ?? 0)); }

export function analyseIngredients(
  ingredients: Ingredient[],
  profile: SkinProfile | null
): AnalysisResult {
  const warnings: IngredientAnalysisWarning[] = [];
  const safeIngredients: Ingredient[] = [];
  let score = 100;
  const ids = ingredients.map((i) => i.id);

  // Pass 1: Combination warnings
  for (let a = 0; a < ids.length; a++) {
    for (let b = a + 1; b < ids.length; b++) {
      const warn = getWarningBetween(ids[a], ids[b]);
      if (warn) {
        warnings.push({
          type: "combination",
          severity: warn.severity as IngredientAnalysisWarning["severity"],
          title: warn.title, message: warn.message,
          ingredientNames: [ingredients[a].name, ingredients[b].name],
        });
        score = deduct(score, warn.severity);
      }
    }
  }

  // Pass 2: Profile checks
  if (profile) {
    const LABELS: Record<string, string[]> = {
      sensitive: ["Sensitive"], acne: ["Acne-Prone","Acne"],
      oily: ["Oily"], dry: ["Dry","Extremely Dry"],
      rosacea: ["Rosacea","Sensitive"], eczema: ["Eczema","Sensitive"],
    };
    const attribs = new Set<string>();
    if (profile.skinType) attribs.add(profile.skinType.toLowerCase());
    profile.conditions.forEach((c) => {
      attribs.add(c.toLowerCase());
      (LABELS[c.toLowerCase()] ?? []).forEach((l) => attribs.add(l.toLowerCase()));
    });

    for (const ing of ingredients) {
      let warned = false;

      // 2a. Unsuitable for skin type
      for (const u of ing.unsuitableFor) {
        if (u === "None") continue;
        if (attribs.has(u.toLowerCase())) {
          warnings.push({ type: "unsuitableForSkin", severity: "Medium",
            title: `${ing.name} may not suit your skin`,
            message: `${ing.name} is not recommended for ${u} skin types.`,
            ingredientNames: [ing.name] });
          score = deduct(score, "Medium"); warned = true; break;
        }
      }

      // 2b. Allergen risk
      if (!warned) {
        const sens = attribs.has("sensitive") || profile.conditions.includes("eczema") || profile.conditions.includes("rosacea");
        if (sens && ing.allergenRisk === "High") {
          warnings.push({ type: "allergen", severity: "High",
            title: `High-allergen: ${ing.name}`,
            message: `${ing.name} has a high allergen risk. Patch-test carefully.`,
            ingredientNames: [ing.name] });
          score = deduct(score, "High"); warned = true;
        } else if (sens && ing.allergenRisk === "Medium") {
          warnings.push({ type: "allergen", severity: "Low",
            title: `Moderate allergen: ${ing.name}`,
            message: `${ing.name} occasionally triggers reactions in sensitive skin.`,
            ingredientNames: [ing.name] });
          score = deduct(score, "Low"); warned = true;
        }
      }

      // 2c. Comedogenic
      if (!warned && ing.isComedogenic && (profile.skinType === "oily" || profile.conditions.includes("acne"))) {
        warnings.push({ type: "comedogenic", severity: "Medium",
          title: `Pore-clogging: ${ing.name}`,
          message: `${ing.name} is comedogenic and may cause breakouts.`,
          ingredientNames: [ing.name] });
        score = deduct(score, "Medium"); warned = true;
      }

      if (!warned) safeIngredients.push(ing);
    }
  } else {
    const warnedNames = new Set(warnings.flatMap((w) => w.ingredientNames ?? []));
    ingredients.forEach((i) => { if (!warnedNames.has(i.name)) safeIngredients.push(i); });
  }

  return { score: Math.max(0, Math.min(100, Math.round(score))), warnings, detectedIngredients: ingredients, safeIngredients };
}

// ── 5. Routine / Layering ────────────────────────────────────
const AM_ORDER = ["Cleanser","Toner","Active - Antioxidant","Active - Brightening","Active - Anti-acne","Hydrator","Emollient","UV Filter"];
const PM_ORDER = ["Cleanser","Toner","Active - Exfoliant","Active - Anti-aging","Active - Brightening","Hydrator","Emollient"];

function sortByRoutine(products: RoutineProduct[], order: string[]): string[] {
  return products.slice().sort((a, b) => {
    const rank = (p: RoutineProduct) => Math.min(...p.ingredientIds.map((id) => {
      const idx = order.indexOf(getIngredientById(id)?.category ?? ""); return idx === -1 ? 999 : idx;
    }));
    return rank(a) - rank(b);
  }).map((p) => p.productName);
}

export function analyseRoutine(routine: RoutineProduct[]): RoutineCompatibilityResult {
  const conflicts: RoutineCompatibilityResult["conflicts"] = [];
  const seen = new Set<string>();
  for (let pi = 0; pi < routine.length; pi++) {
    for (let pj = pi + 1; pj < routine.length; pj++) {
      for (const idA of routine[pi].ingredientIds) {
        for (const idB of routine[pj].ingredientIds) {
          const key = [idA, idB].sort().join("|");
          if (seen.has(key)) continue;
          const warn = getWarningBetween(idA, idB);
          if (warn) {
            seen.add(key);
            conflicts.push({ warning: warn,
              ingredient1Name: getIngredientById(idA)?.name ?? idA,
              ingredient2Name: getIngredientById(idB)?.name ?? idB,
              product1Name: routine[pi].productName,
              product2Name: routine[pj].productName });
          }
        }
      }
    }
  }
  return {
    conflicts,
    morningOrder: sortByRoutine(routine.filter((p) => p.timeOfDay !== "evening"), AM_ORDER),
    eveningOrder: sortByRoutine(routine.filter((p) => p.timeOfDay !== "morning"), PM_ORDER),
  };
}
