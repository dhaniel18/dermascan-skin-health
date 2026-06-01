import { analyseIngredients, analyseRoutine, resolveIngredientIds } from "@/lib/analysisEngine";
import { getSkinProfile } from "@/services/profile";
import { supabase } from "@/lib/supabase";
import type { Product, RoutineProduct, SkinProfile } from "@/types/domain";

export type RoutineRecommendation = {
  productId: string;
  productName: string;
  brand?: string;
  category?: string;
  score: number;
  reason: string;
  suggestedTimeOfDay: RoutineProduct["timeOfDay"];
  stepRole?: "Facial Wash" | "Moisturizer" | "Sunscreen" | "Serum" | "Treatment";
};

export type RoutineBatch = {
  id: string;
  name: string;
  description: string;
  products: RoutineRecommendation[];
};

export type RoutineRecommendationsResponse = {
  morning: RoutineBatch[];
  evening: RoutineBatch[];
};

const ACTIVE_CATEGORIES = new Set([
  "Active - Anti-acne",
  "Active - Anti-aging",
  "Active - Antioxidant",
  "Active - Brightening",
  "Active - Exfoliant",
]);

function productCategories(product: Product) {
  return new Set(resolveIngredientIds(product.ingredientIds).map((ingredient) => ingredient.category));
}

function hasAny(categories: Set<string>, values: string[]) {
  return values.some((value) => categories.has(value));
}

function suggestedTimeOfDay(categories: Set<string>): RoutineProduct["timeOfDay"] {
  if (categories.has("UV Filter") || categories.has("Active - Antioxidant")) return "morning";
  if (categories.has("Active - Anti-aging") || categories.has("Active - Exfoliant")) return "evening";
  return "any";
}

function profileTags(profile: SkinProfile | null) {
  return new Set([profile?.skinType, ...(profile?.conditions ?? [])].filter(Boolean) as string[]);
}

function profileMatchScore(product: Product, profile: SkinProfile | null, categories: Set<string>) {
  const tags = profileTags(profile);
  let score = 0;

  if (tags.has("oily") || tags.has("acne")) {
    if (categories.has("Active - Anti-acne")) score += 5;
    if (categories.has("Hydrator")) score += 2;
    if (categories.has("Emollient")) score -= 1;
  }

  if (tags.has("dry")) {
    if (categories.has("Hydrator")) score += 5;
    if (categories.has("Emollient")) score += 3;
    if (categories.has("Active - Anti-acne") || categories.has("Active - Exfoliant")) score -= 2;
  }

  if (tags.has("combination")) {
    if (categories.has("Hydrator")) score += 3;
    if (categories.has("Active - Anti-acne")) score += 2;
    if (categories.has("Emollient")) score += 1;
  }

  if (tags.has("sensitive") || tags.has("rosacea") || tags.has("eczema")) {
    if (categories.has("Hydrator") || categories.has("Emollient")) score += 4;
    ACTIVE_CATEGORIES.forEach((category) => {
      if (categories.has(category)) score -= 2;
    });
  }

  if (tags.has("aging")) {
    if (categories.has("Active - Anti-aging")) score += 5;
    if (categories.has("Active - Antioxidant") || categories.has("Active - Brightening")) score += 2;
    if (categories.has("Hydrator")) score += 2;
  }

  if (tags.has("normal") || tags.size === 0) {
    if (categories.has("Hydrator")) score += 2;
    if (categories.has("UV Filter")) score += 2;
    if (categories.has("Active - Antioxidant")) score += 2;
  }

  if (product.category?.toLowerCase().includes("sunscreen")) score += 1;
  return score;
}

function recommendationReason(profile: SkinProfile | null, categories: Set<string>) {
  const tags = profileTags(profile);

  if (tags.has("sensitive") || tags.has("rosacea") || tags.has("eczema")) {
    return "Low-warning pick for a reactive skin profile.";
  }
  if ((tags.has("oily") || tags.has("acne")) && categories.has("Active - Anti-acne")) {
    return "Matches acne-prone or oily skin needs.";
  }
  if (tags.has("dry") && hasAny(categories, ["Hydrator", "Emollient"])) {
    return "Hydrating option for dry skin.";
  }
  if (tags.has("aging") && categories.has("Active - Anti-aging")) {
    return "Better suited for an evening repair routine.";
  }
  if (categories.has("UV Filter")) {
    return "Useful as a morning routine starter.";
  }
  return "Good starter option for your skin profile.";
}

export async function getLayeringRecommendations(): Promise<RoutineRecommendationsResponse> {
  const [profile, productsRes] = await Promise.all([
    getSkinProfile(),
    supabase.from("products")
      .select("*")
      .in("verification_status", ["Pending", "Verified"])
      .order("created_at", { ascending: false })
      .limit(100),
  ]);

  const products: Product[] = (productsRes.data ?? []).map((row) => ({
    id: row.id,
    barcode: row.barcode ?? undefined,
    name: row.name,
    brand: row.brand ?? undefined,
    category: row.category ?? undefined,
    image: row.image_url ?? undefined,
    ingredientIds: row.ingredient_ids ?? [],
    rawIngredientText: row.raw_ingredient_text ?? undefined,
    verificationStatus: row.verification_status as Product["verificationStatus"],
    uploadedBy: row.uploaded_by ?? undefined,
  }));

  const scored = products
    .map((product) => {
      const ingredients = resolveIngredientIds(product.ingredientIds);
      const analysis = analyseIngredients(ingredients, profile);
      const categories = productCategories(product);
      const hasHighWarning = analysis.warnings.some((warning) => warning.severity === "High");

      return {
        product,
        analysis,
        categories,
        hasHighWarning,
        fit: profileMatchScore(product, profile, categories),
      };
    })
    .filter((item) => item.analysis.detectedIngredients.length > 0)
    .filter((item) => item.analysis.score >= 70)
    .filter((item) => !item.hasHighWarning)
    .sort((a, b) => (b.fit + b.analysis.score / 10) - (a.fit + a.analysis.score / 10));

  // 1. Categorise
  const cleansers = scored.filter((item) => {
    const name = item.product.name.toLowerCase();
    const cat = (item.product.category ?? "").toLowerCase();
    return cat.includes("cleanser") || name.includes("cleanser") || name.includes("wash") || name.includes("soap") || name.includes("foam");
  });

  const moisturizers = scored.filter((item) => {
    const name = item.product.name.toLowerCase();
    const cat = (item.product.category ?? "").toLowerCase();
    return cat.includes("moisturizer") || cat.includes("hydrator") || cat.includes("emollient") || name.includes("moisturizer") || name.includes("cream") || name.includes("lotion") || name.includes("moisturize") || name.includes("gel");
  });

  const sunscreens = scored.filter((item) => {
    const name = item.product.name.toLowerCase();
    const cat = (item.product.category ?? "").toLowerCase();
    return cat.includes("sunscreen") || cat.includes("uv filter") || name.includes("sunscreen") || name.includes("spf") || name.includes("sunblock") || name.includes("sun block") || item.categories.has("UV Filter");
  });

  const serums = scored.filter((item) => {
    const name = item.product.name.toLowerCase();
    const cat = (item.product.category ?? "").toLowerCase();
    const isCleanser = cat.includes("cleanser") || name.includes("cleanser") || name.includes("wash") || name.includes("soap") || name.includes("foam");
    const isMoisturizer = cat.includes("moisturizer") || cat.includes("hydrator") || cat.includes("emollient") || name.includes("moisturizer") || name.includes("cream") || name.includes("lotion") || name.includes("moisturize") || name.includes("gel");
    const isSunscreen = cat.includes("sunscreen") || cat.includes("uv filter") || name.includes("sunscreen") || name.includes("spf") || name.includes("sunblock") || name.includes("sun block");
    if (isCleanser || isMoisturizer || isSunscreen) return false;
    return cat.includes("serum") || cat.includes("exfoliant") || cat.includes("toner") || cat.includes("active") || cat.includes("treatment") || name.includes("serum") || name.includes("ampoule") || name.includes("essence") || name.includes("toner") || name.includes("peeling") || name.includes("treatment");
  });

  // Helper function to check compatibility within a set of products
  const checkBatchCompatibility = (candidateProducts: Product[]): boolean => {
    const routineProducts: RoutineProduct[] = candidateProducts.map((p) => ({
      productId: p.id,
      productName: p.name,
      ingredientIds: p.ingredientIds,
      timeOfDay: "any",
    }));
    const compat = analyseRoutine(routineProducts);
    return compat.conflicts.length === 0;
  };

  const toRec = (item: typeof scored[number], role: RoutineRecommendation["stepRole"], time: RoutineProduct["timeOfDay"]): RoutineRecommendation => ({
    productId: item.product.id,
    productName: item.product.name,
    brand: item.product.brand ?? undefined,
    category: item.product.category ?? undefined,
    score: item.analysis.score,
    reason: recommendationReason(profile, item.categories),
    suggestedTimeOfDay: time,
    stepRole: role,
  });

  const morningBatches: RoutineBatch[] = [];
  const eveningBatches: RoutineBatch[] = [];

  const morningConfig = [
    { name: "Daily Hydration & Glow", desc: "An ultra-hydrating 3-step routine designed to wake up, plump, and protect your skin all day." },
    { name: "Skin Barrier Defense", desc: "A soothing, nourishing starter routine focused on strengthening your natural skin barrier against external stressors." },
    { name: "Clarifying Protection", desc: "A lightweight, shine-control routine optimized to balance oil production while keeping your skin hydrated and protected." },
  ];

  const eveningConfig = [
    { name: "Nighttime Barrier Repair", desc: "A deeply comforting 3-step evening routine to cleanse, restore, and replenish your skin barrier while you sleep." },
    { name: "Anti-Aging & Renewal", desc: "A potent overnight regimen that aids cell turnover, smooths fine lines, and nourishes skin deeply." },
    { name: "Calming & Clarifying Night", desc: "A soothing evening routine to calm redness, clear pores, and balance skin tone overnight." },
  ];

  // Unique selection algorithm tracking assigned IDs across all batches
  const usedProductIds = new Set<string>();

  const selectUniqueProduct = (
    candidates: typeof scored,
    batchProducts: Product[] = []
  ): typeof scored[number] | null => {
    // 1. Try to find a candidate that is unused and compatible
    for (const item of candidates) {
      if (!usedProductIds.has(item.product.id)) {
        if (checkBatchCompatibility([...batchProducts, item.product])) {
          usedProductIds.add(item.product.id);
          return item;
        }
      }
    }

    // 2. Fallback to any compatible candidate (allowing reuse if we run out of unique products)
    for (const item of candidates) {
      if (checkBatchCompatibility([...batchProducts, item.product])) {
        return item;
      }
    }

    // 3. Absolute fallback
    return candidates[0] || null;
  };

  // Build 3 Morning Batches
  for (let i = 0; i < 3; i++) {
    if (cleansers.length === 0 || moisturizers.length === 0 || sunscreens.length === 0) break;

    const cleanser = selectUniqueProduct(cleansers, []);
    if (!cleanser) break;

    const moisturizer = selectUniqueProduct(moisturizers, [cleanser.product]);
    if (!moisturizer) break;

    const sunscreen = selectUniqueProduct(sunscreens, [cleanser.product, moisturizer.product]);
    if (!sunscreen) break;

    morningBatches.push({
      id: `morning-batch-${i + 1}`,
      name: morningConfig[i].name,
      description: morningConfig[i].desc,
      products: [
        toRec(cleanser, "Facial Wash", "any"),
        toRec(moisturizer, "Moisturizer", "any"),
        toRec(sunscreen, "Sunscreen", "morning"),
      ],
    });
  }

  // Reset used IDs for evening routine to allow same cleansers/moisturizers in evening if needed
  usedProductIds.clear();

  // Build 3 Evening Batches
  for (let i = 0; i < 3; i++) {
    if (cleansers.length === 0 || moisturizers.length === 0) break;

    const cleanser = selectUniqueProduct(cleansers, []);
    if (!cleanser) break;

    const moisturizer = selectUniqueProduct(moisturizers, [cleanser.product]);
    if (!moisturizer) break;

    let evening3rd: typeof scored[number] | null = null;
    if (serums.length > 0) {
      evening3rd = selectUniqueProduct(serums, [cleanser.product, moisturizer.product]);
    }
    if (!evening3rd) {
      evening3rd = selectUniqueProduct(moisturizers, [cleanser.product, moisturizer.product]);
    }
    if (!evening3rd) break;

    eveningBatches.push({
      id: `evening-batch-${i + 1}`,
      name: eveningConfig[i].name,
      description: eveningConfig[i].desc,
      products: [
        toRec(cleanser, "Facial Wash", "any"),
        toRec(moisturizer, "Moisturizer", "any"),
        toRec(evening3rd, evening3rd.product.category?.includes("Serum") ? "Serum" : "Treatment", "evening"),
      ],
    });
  }

  return {
    morning: morningBatches,
    evening: eveningBatches,
  };
}
