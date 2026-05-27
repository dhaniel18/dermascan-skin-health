import { analyseIngredients, resolveIngredientIds } from "@/lib/analysisEngine";
import { getSkinProfile } from "@/services/profile";
import { getDiscoverFeed } from "@/services/products";
import type { Product, RoutineProduct, SkinProfile } from "@/types/domain";

export type RoutineRecommendation = {
  productId: string;
  productName: string;
  brand?: string;
  category?: string;
  score: number;
  reason: string;
  suggestedTimeOfDay: RoutineProduct["timeOfDay"];
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

export async function getLayeringRecommendations(limit = 4): Promise<RoutineRecommendation[]> {
  const [profile, products] = await Promise.all([getSkinProfile(), getDiscoverFeed()]);

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

  return scored.slice(0, limit).map(({ product, analysis, categories }) => ({
    productId: product.id,
    productName: product.name,
    brand: product.brand,
    category: product.category,
    score: analysis.score,
    reason: recommendationReason(profile, categories),
    suggestedTimeOfDay: suggestedTimeOfDay(categories),
  }));
}
