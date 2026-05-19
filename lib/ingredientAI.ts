// ============================================================
// DermaScan — AI Ingredient Researcher (Production)
//
// Resolution order for EVERY ingredient token:
//   1. Session memory cache        (instant, free)
//   2. Bundled database (100 ings) (instant, free, offline)
//   3. Supabase cloud DB           (fast, free — prior AI results)
//   4. Gemini 1.5 Flash via proxy  (only for truly unknown ings)
//
// Gemini is ONLY called when layers 1–3 all miss.
// The Gemini API key never exists in the mobile app.
// ============================================================
import { supabase } from "@/lib/supabase";
import { fetchWithTimeout } from "@/lib/fetchWithTimeout";
import { getIngredientByName } from "@/lib/ingredientDatabase";
import type { Ingredient } from "@/types/domain";

// In-memory cache — survives the session, resets on app restart
const _sessionCache = new Map<string, Ingredient>();
const MAX_AI_RESEARCH_PER_BATCH = 0;
const AI_RESEARCH_DELAY_MS = 0;

// ── Edge Function URL ─────────────────────────────────────────
function getProxyUrl(): string {
  return `${process.env.EXPO_PUBLIC_SUPABASE_URL}/functions/v1/ai-ingredient-proxy`;
}

// ── DB row → Ingredient ───────────────────────────────────────
function rowToIngredient(row: {
  id: string;
  name: string;
  aliases?: string[];
  is_comedogenic?: boolean;
  allergen_risk?: string;
  unsuitable_for?: string[];
  category: string;
}): Ingredient {
  return {
    id: row.id,
    name: row.name,
    aliases: row.aliases ?? [],
    isComedogenic: row.is_comedogenic ?? false,
    allergenRisk: (row.allergen_risk ?? "Low") as Ingredient["allergenRisk"],
    unsuitableFor: row.unsuitable_for ?? ["None"],
    category: row.category,
  };
}

// ── Layer 3: Supabase cloud DB lookup ─────────────────────────
// Checks the cloud ingredients table for any previously
// AI-researched ingredient. Called before hitting Gemini.
async function lookupInCloudDB(name: string): Promise<Ingredient | null> {
  try {
    const { data } = await supabase
      .from("ingredients")
      .select("*")
      .or(`name.ilike.${name},aliases.cs.{${name}}`)
      .maybeSingle();
    return data ? rowToIngredient(data) : null;
  } catch {
    return null; // offline — skip silently
  }
}

// ── Layer 4: Gemini via Edge Function proxy ───────────────────
async function researchViaProxy(ingredientName: string): Promise<Ingredient | null> {
  const { data: { session } } = await supabase.auth.getSession();
  if (!session) {
    console.warn("[ingredientAI] No session — cannot call proxy");
    return null;
  }

  let response: Response;
  try {
    response = await fetchWithTimeout(getProxyUrl(), {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${session.access_token}`,
        "apikey": process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY ?? "",
      },
      body: JSON.stringify({ action: "research", ingredientName }),
    }, 25_000);
  } catch (err) {
    console.warn("[ingredientAI] Network error:", err);
    return null;
  }

  if (response.status === 429) {
    console.warn("[ingredientAI] Rate limited by proxy");
    return null;
  }
  if (!response.ok) {
    const error = await response.json().catch(() => null) as { error?: string } | null;
    console.warn("[ingredientAI] Proxy error:", response.status, error?.error ?? "");
    return null;
  }

  const data = await response.json() as {
    ingredient: Parameters<typeof rowToIngredient>[0];
    source: "database" | "ai";
  };
  if (!data.ingredient) return null;

  const ing = rowToIngredient(data.ingredient);
  console.info(`[ingredientAI] "${ing.name}" resolved via ${data.source}`);
  return ing;
}

// ── Register into runtime lookup maps ─────────────────────────
async function registerInMemory(ing: Ingredient): Promise<void> {
  try {
    const db = await import("@/lib/ingredientDatabase");
    if (!db.INGREDIENTS.find((i) => i.id === ing.id)) {
      db.INGREDIENTS.push(ing);
    }
    if (typeof (db as { registerIngredient?: (i: Ingredient) => void }).registerIngredient === "function") {
      (db as { registerIngredient: (i: Ingredient) => void }).registerIngredient(ing);
    }
  } catch { /* non-fatal */ }
}

// ── Public: resolve single ingredient (all 4 layers) ─────────
export async function resolveOrResearchIngredient(
  rawName: string
): Promise<{ ingredient: Ingredient | null; source: "cache" | "bundled" | "cloud" | "ai" | "unknown" }> {
  const key = rawName.toLowerCase().trim();
  if (!key) return { ingredient: null, source: "unknown" };

  // Layer 1: Session cache
  if (_sessionCache.has(key)) {
    return { ingredient: _sessionCache.get(key)!, source: "cache" };
  }

  // Layer 2: Bundled DB (offline, instant)
  const { getIngredientByName } = await import("@/lib/ingredientDatabase");
  const bundled = getIngredientByName(key);
  if (bundled) {
    _sessionCache.set(key, bundled);
    return { ingredient: bundled, source: "bundled" };
  }

  // Layer 3: Supabase cloud DB (previous AI results)
  const cloudResult = await lookupInCloudDB(rawName);
  if (cloudResult) {
    _sessionCache.set(key, cloudResult);
    _sessionCache.set(cloudResult.name.toLowerCase(), cloudResult);
    await registerInMemory(cloudResult);
    return { ingredient: cloudResult, source: "cloud" };
  }

  // Layer 4: Gemini AI via proxy (last resort)
  const researched = await researchViaProxy(rawName);
  if (researched) {
    _sessionCache.set(key, researched);
    _sessionCache.set(researched.name.toLowerCase(), researched);
    await registerInMemory(researched);
    return { ingredient: researched, source: "ai" };
  }

  return { ingredient: null, source: "unknown" };
}

// ── Public: batch resolve with detailed progress ──────────────
export async function batchResolveIngredients(
  names: string[],
  onProgress?: (msg: string, resolved: number, total: number) => void
): Promise<Map<string, Ingredient>> {
  const result = new Map<string, Ingredient>();
  const needsNetwork: string[] = [];

  // ── Pass 1: session cache + bundled DB (instant, no network) ──
  const { getIngredientByName } = await import("@/lib/ingredientDatabase");
  for (const name of names) {
    const key = name.toLowerCase().trim();
    if (_sessionCache.has(key)) {
      result.set(name, _sessionCache.get(key)!);
    } else {
      const found = getIngredientByName(key);
      if (found) {
        result.set(name, found);
        _sessionCache.set(key, found);
      } else {
        needsNetwork.push(name);
      }
    }
  }

  const bundledCount = result.size;
  if (bundledCount > 0) {
    onProgress?.(
      `✓ ${bundledCount} ingredient${bundledCount > 1 ? "s" : ""} found in local database`,
      bundledCount,
      names.length
    );
  }

  if (needsNetwork.length === 0) return result;

  // ── Pass 2: Supabase cloud DB (batch query — one network call) ──
  onProgress?.(
    `Checking cloud database for ${needsNetwork.length} unknown ingredient${needsNetwork.length > 1 ? "s" : ""}...`,
    result.size,
    names.length
  );

  const stillUnknown: string[] = [];
  try {
    // Batch query for all unknown names at once
    const { data: cloudRows } = await supabase
      .from("ingredients")
      .select("*")
      .in("name", needsNetwork);

    if (cloudRows && cloudRows.length > 0) {
      const cloudMap = new Map(cloudRows.map((r: { name: string }) => [r.name.toLowerCase(), r]));

      for (const name of needsNetwork) {
        const row = cloudMap.get(name.toLowerCase());
        if (row) {
          const ing = rowToIngredient(row as Parameters<typeof rowToIngredient>[0]);
          result.set(name, ing);
          _sessionCache.set(name.toLowerCase(), ing);
          await registerInMemory(ing);
        } else {
          stillUnknown.push(name);
        }
      }

      const cloudFound = needsNetwork.length - stillUnknown.length;
      if (cloudFound > 0) {
        onProgress?.(
          `✓ ${cloudFound} ingredient${cloudFound > 1 ? "s" : ""} found in cloud database`,
          result.size,
          names.length
        );
      }
    } else {
      stillUnknown.push(...needsNetwork);
    }
  } catch {
    // Offline — skip cloud, go straight to AI for unknowns
    stillUnknown.push(...needsNetwork);
  }

  if (stillUnknown.length === 0) return result;

  if (MAX_AI_RESEARCH_PER_BATCH <= 0) {
    onProgress?.(
      `${stillUnknown.length} uncommon ingredient${stillUnknown.length > 1 ? "s" : ""} kept for quick scan`,
      result.size,
      names.length
    );
    return result;
  }

  // ── Pass 3: Gemini AI via proxy (only truly unknown ingredients) ──
  onProgress?.(
    `🤖 Researching ${stillUnknown.length} new ingredient${stillUnknown.length > 1 ? "s" : ""} with AI...`,
    result.size,
    names.length
  );

  // Max 3 concurrent to respect Gemini free tier (15 req/min)
  const CHUNK = 1;
  for (let i = 0; i < Math.min(stillUnknown.length, MAX_AI_RESEARCH_PER_BATCH); i += CHUNK) {
    const chunk = stillUnknown.slice(i, i + CHUNK);
    const resolved = await Promise.all(chunk.map(resolveOrResearchIngredient));

    chunk.forEach((name, idx) => {
      const { ingredient, source } = resolved[idx];
      if (ingredient) {
        result.set(name, ingredient);
        if (source === "ai") {
          onProgress?.(
            `✓ AI researched: ${ingredient.name}`,
            result.size,
            names.length
          );
        }
      }
    });

    // Small pause between chunks to stay within rate limits
    if (i + CHUNK < Math.min(stillUnknown.length, MAX_AI_RESEARCH_PER_BATCH)) {
      await new Promise((r) => setTimeout(r, AI_RESEARCH_DELAY_MS));
    }
  }

  if (stillUnknown.length > MAX_AI_RESEARCH_PER_BATCH) {
    const skipped = stillUnknown.length - MAX_AI_RESEARCH_PER_BATCH;
    onProgress?.(
      `${skipped} uncommon ingredient${skipped > 1 ? "s" : ""} skipped to avoid AI rate limits`,
      result.size,
      names.length
    );
  }

  return result;
}

export function findUnknownIngredients(names: string[]): string[] {
  return names.filter((n) => !getIngredientByName(n.toLowerCase().trim()));
}
