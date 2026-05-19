// ============================================================
// DermaScan — Domain Types
// ============================================================

// ── Auth / User ──────────────────────────────────────────────
export type User = {
  id: string;
  name: string;
  email: string;
};

// ── Skin Profile ─────────────────────────────────────────────
export type SkinProfile = {
  skinType: string | null;
  conditions: string[];
  concerns: string[];
};

// ── Ingredients ──────────────────────────────────────────────
export type Ingredient = {
  id: string;
  name: string;
  aliases: string[];
  isComedogenic: boolean;
  allergenRisk: "Low" | "Medium" | "High";
  unsuitableFor: string[];
  category: string;
};

// ── Combination Warning ──────────────────────────────────────
export type CombinationWarning = {
  ruleId: string;
  ingredient1: string;
  ingredient2: string;
  severity: "Low" | "Medium" | "High";
  title: string;
  message: string;
};

// ── Products ─────────────────────────────────────────────────
export type Product = {
  id: string;
  barcode?: string | null;
  name: string;
  brand?: string;
  price?: string;
  score?: number;
  image?: string;
  category?: string;
  ingredientIds: string[];
  rawIngredientText?: string;
  verificationStatus: "Pending" | "Verified" | "Rejected";
  uploadedBy?: string;
};

// ── Scan ─────────────────────────────────────────────────────
export type ScanHistoryItem = {
  id: string;
  productId?: string;
  productName: string;
  scannedAt: string;
  score?: number;
  warnings?: IngredientAnalysisWarning[];
  scanMethod?: "barcode" | "ocr" | "manual";
};

// ── Analysis Result ──────────────────────────────────────────
export type IngredientAnalysisWarning = {
  type: "combination" | "allergen" | "comedogenic" | "unsuitableForSkin";
  severity: "Low" | "Medium" | "High";
  title: string;
  message: string;
  ingredientNames?: string[];
};

export type AnalysisResult = {
  score: number;
  warnings: IngredientAnalysisWarning[];
  detectedIngredients: Ingredient[];
  safeIngredients: Ingredient[];
};

// ── Routine ──────────────────────────────────────────────────
export type RoutineProduct = {
  productId: string;
  productName: string;
  ingredientIds: string[];
  timeOfDay: "morning" | "evening" | "any";
};

export type RoutineCompatibilityResult = {
  conflicts: {
    warning: CombinationWarning;
    ingredient1Name: string;
    ingredient2Name: string;
    product1Name: string;
    product2Name: string;
  }[];
  morningOrder: string[];
  eveningOrder: string[];
};
