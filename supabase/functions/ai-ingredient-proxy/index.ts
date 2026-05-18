// ============================================================
// DermaScan — Supabase Edge Function: ai-ingredient-proxy
// Handles two actions via Google Gemini 1.5 Flash (FREE):
//
//  action: "ocr"      → photo (base64) → ingredient list text
//  action: "research" → ingredient name → structured JSON
//
// Deploy:  supabase functions deploy ai-ingredient-proxy
// Secrets: supabase secrets set GEMINI_API_KEY=AIza...
// Free key: https://aistudio.google.com/app/apikey
// Free tier: 15 req/min, 1M tokens/day — $0
// ============================================================
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const CORS_HEADERS = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
};

const DEFAULT_GEMINI_MODEL = "gemini-2.5-flash";
const OCR_FALLBACK_MODELS = ["gemini-2.0-flash", "gemini-1.5-flash"];
const GEMINI_API_BASE = "https://generativelanguage.googleapis.com/v1beta/models";
const GOOGLE_VISION_API_URL = "https://vision.googleapis.com/v1/images:annotate";

async function fetchWithTimeout(
  input: string,
  init: RequestInit,
  timeoutMs: number
): Promise<Response> {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), timeoutMs);

  try {
    return await fetch(input, { ...init, signal: controller.signal });
  } finally {
    clearTimeout(timeoutId);
  }
}

// ── Rate limiting ─────────────────────────────────────────────
// Gemini free: 15 req/min globally. Cap per user at 12/min.
const rateLimitMap = new Map<string, { count: number; windowStart: number }>();
const RATE_WINDOW_MS = 60_000;
const RATE_MAX = 12;

function checkRateLimit(userId: string): { allowed: boolean; remaining: number } {
  const now = Date.now();
  const entry = rateLimitMap.get(userId);
  if (!entry || now - entry.windowStart > RATE_WINDOW_MS) {
    rateLimitMap.set(userId, { count: 1, windowStart: now });
    return { allowed: true, remaining: RATE_MAX - 1 };
  }
  if (entry.count >= RATE_MAX) return { allowed: false, remaining: 0 };
  entry.count++;
  return { allowed: true, remaining: RATE_MAX - entry.count };
}

// ── Validation ────────────────────────────────────────────────
const ALLOWED_CHARS = /^[a-zA-Z0-9\s\-(),.'&/]+$/;

function validateIngredientName(name: unknown): { valid: boolean; error?: string } {
  if (typeof name !== "string") return { valid: false, error: "name must be a string" };
  const t = name.trim();
  if (!t.length) return { valid: false, error: "name cannot be empty" };
  if (t.length > 120) return { valid: false, error: "name too long" };
  if (!ALLOWED_CHARS.test(t)) return { valid: false, error: "name contains invalid characters" };
  return { valid: true };
}

function validateBase64Image(b64: unknown): { valid: boolean; error?: string } {
  if (typeof b64 !== "string") return { valid: false, error: "image must be a base64 string" };
  if (b64.length < 100) return { valid: false, error: "image too small" };
  // ~10MB limit (base64 is ~33% larger than raw)
  if (b64.length > 13_500_000) return { valid: false, error: "image too large (max ~10MB)" };
  return { valid: true };
}

function stripCodeFence(raw: string): string {
  return raw.replace(/```json|```/gi, "").trim();
}

function extractJsonObject(raw: string): string | null {
  const cleaned = stripCodeFence(raw);
  const start = cleaned.indexOf("{");
  const end = cleaned.lastIndexOf("}");
  if (start === -1 || end === -1 || end <= start) return null;
  return cleaned.slice(start, end + 1);
}

function splitIngredientText(raw: string): string[] {
  const withoutHeading = raw
    .replace(/^[\s\S]*?\b(ingredients?|komposisi|bahan)\s*[:：-]\s*/i, "")
    .replace(/\s+/g, " ")
    .trim();

  return withoutHeading
    .split(/\s*,\s*/)
    .map((item) => item.trim().replace(/[.;:]+$/g, ""))
    .filter((item) => item.length > 1);
}

function cleanIngredientToken(value: string): string {
  return value
    .replace(/^[\s\d.)\-:;]+/g, "")
    .replace(/[.;:,\s]+$/g, "")
    .replace(/\s+/g, " ")
    .trim();
}

function isIngredientToken(value: string): boolean {
  if (value.length < 2 || value.length > 140) return false;
  if (!/[a-z]/i.test(value)) return false;

  const lower = value.toLowerCase();
  if (["ingredients", "ingredient", "komposisi", "bahan"].includes(lower)) return false;
  if (/^(directions?|how to use|cara pakai|warning|caution|perhatian|batch|bpom|netto)\b/i.test(value)) return false;

  return true;
}

function extractIngredientSection(raw: string): string {
  const text = raw
    .replace(/\r/g, "\n")
    .replace(/\u00a0/g, " ")
    .replace(/[：]/g, ":")
    .replace(/[•·]/g, ",")
    .trim();

  const heading = /\b(ingredients?|komposisi|bahan)\b\s*[:\-]?\s*/i.exec(text);
  let section = heading ? text.slice(heading.index + heading[0].length) : text;

  const stop = /\n\s*(directions?|how to use|cara pakai|usage|warning|caution|perhatian|avoid direct|manufactured|distributed|bpom|batch|exp(?:iry|iration)?|net\s*wt|netto|storage|simpan)\b/i.exec(section);
  if (stop && stop.index > 20) section = section.slice(0, stop.index);

  return section.trim();
}

function parseIngredientText(raw: string): string[] {
  const section = extractIngredientSection(raw);
  const normalized = section
    .replace(/\b(ingredients?|komposisi|bahan)\b\s*[:\-]?/gi, " ")
    .replace(/\s*,\s*/g, ", ")
    .replace(/[ \t]+/g, " ")
    .trim();

  const commaParts = normalized
    .replace(/\n+/g, " ")
    .split(/\s*[,;]\s*/)
    .map(cleanIngredientToken)
    .filter(isIngredientToken);

  if (commaParts.length > 1) return commaParts;

  const lineParts = normalized
    .split(/\n+/)
    .map(cleanIngredientToken)
    .filter(isIngredientToken);

  return lineParts.length > 1 ? lineParts : commaParts;
}

function makeFallbackIngredient(ingredientName: string) {
  const cleanName = ingredientName.trim().replace(/\s+/g, " ");
  return {
    id: `ING-AI-${cleanName
      .toUpperCase().replace(/[^A-Z0-9]/g, "-").replace(/-+/g, "-").slice(0, 20)}`,
    name: cleanName,
    aliases: [],
    is_comedogenic: false,
    allergen_risk: "Low",
    unsuitable_for: ["None"],
    category: "Additive",
  };
}

// ── Allowed values ────────────────────────────────────────────
const VALID_CATEGORIES = [
  "Active - Exfoliant","Active - Anti-aging","Active - Brightening","Active - Antioxidant",
  "Active - Anti-acne","Hydrator","Emollient","Emulsifier","Surfactant","Preservative",
  "Soothing Agent","Botanical - Soothing","Botanical - Antioxidant","Botanical - Brightening",
  "Botanical - Anti-acne","UV Filter","Silicone","Solvent","Additive","Colorant",
  "pH Adjuster","Chelating Agent","Texture Enhancer","Absorbent",
];
const VALID_RISK = ["Low", "Medium", "High"];
const VALID_UNSUITABLE = [
  "Sensitive","Acne-Prone","Dry","Extremely Dry","Oily","Pregnant","Rosacea","Eczema","None",
];

// ── Gemini helpers ────────────────────────────────────────────

async function callGemini(
  geminiKey: string,
  model: string,
  payload: object,
  timeoutMs = 25_000
): Promise<string | null> {
  const res = await fetchWithTimeout(`${GEMINI_API_BASE}/${model}:generateContent?key=${geminiKey}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  }, timeoutMs);

  if (!res.ok) {
    console.error("[gemini] API error:", res.status, await res.text());
    return null;
  }

  const data = await res.json();
  return data?.candidates?.[0]?.content?.parts?.[0]?.text ?? null;
}

async function callGeminiWithFallback(
  geminiKey: string,
  primaryModel: string,
  payload: object,
  timeoutMs = 45_000
): Promise<{ raw: string; model: string } | null> {
  const models = [primaryModel, ...OCR_FALLBACK_MODELS.filter((model) => model !== primaryModel)];

  for (const model of models) {
    try {
      const raw = await callGemini(geminiKey, model, payload, timeoutMs);
      if (raw) return { raw, model };
    } catch (error) {
      console.error("[gemini] fallback error:", model, error);
    }
  }

  return null;
}

// ── ACTION: OCR — photo → ingredient list ─────────────────────
async function callGoogleVisionOcr(
  visionKey: string,
  imageBase64: string,
  timeoutMs = 30_000
): Promise<string | null> {
  const res = await fetchWithTimeout(`${GOOGLE_VISION_API_URL}?key=${visionKey}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      requests: [{
        image: { content: imageBase64 },
        features: [{ type: "DOCUMENT_TEXT_DETECTION", maxResults: 1 }],
        imageContext: { languageHints: ["en", "id"] },
      }],
    }),
  }, timeoutMs);

  if (!res.ok) {
    console.error("[google-vision] API error:", res.status, await res.text());
    return null;
  }

  const data = await res.json();
  const first = data?.responses?.[0];
  if (first?.error) {
    console.error("[google-vision] OCR error:", first.error);
    return null;
  }

  const rawText =
    first?.fullTextAnnotation?.text ??
    first?.textAnnotations?.[0]?.description ??
    "";

  return typeof rawText === "string" && rawText.trim().length > 0
    ? rawText.trim()
    : null;
}

async function handleOcr(
  imageBase64: string,
  mimeType: string,
  geminiKey: string | null,
  visionKey: string | null,
  geminiModel: string
): Promise<{ ingredients: string[]; rawText: string; source: string } | null> {
  if (visionKey) {
    try {
      const rawText = await callGoogleVisionOcr(visionKey, imageBase64);
      if (rawText) {
        const ingredients = parseIngredientText(rawText);
        if (ingredients.length > 0) {
          return { rawText, ingredients, source: "google-vision" };
        }
        console.error("[ocr] Google Vision read text but ingredient parser found no list:", rawText);
      }
    } catch (error) {
      console.error("[google-vision] fallback to Gemini:", error);
    }
  }

  if (!geminiKey) return null;

  const payload = {
    contents: [{
      parts: [
        {
          inline_data: {
            mime_type: mimeType,   // "image/jpeg" | "image/png" | "image/webp"
            data: imageBase64,
          },
        },
        {
          text: `Look at this photo of a skincare/cosmetic product label or a photo of text from a product page.
Find the cosmetic ingredient list. It may be labelled "Ingredients:", "Komposisi:", or "Bahan:", but it may also appear as a plain INCI list without any heading.
Extract EVERY ingredient name exactly as written on the visible label/list.
If the text is a little blurry, tilted, cropped, or shown on another phone/screen but readable, make the best possible transcription.

Respond ONLY with a JSON object in this exact format, nothing else:
{
  "rawText": "the full ingredient list text as it appears on the label",
  "ingredients": ["Ingredient One", "Ingredient Two", "Ingredient Three"]
}

Rules:
- ingredients array must contain each individual ingredient as a separate string
- Split ingredients by commas, semicolons, line breaks, or bullet-like separators
- Keep ingredient names intact, including botanical names in parentheses
- If you cannot find an ingredient list, return: {"rawText": "", "ingredients": []}
- Do not return an empty list when a list of cosmetic/INCI ingredients is visible, even if there is no heading
- Do NOT add any explanation, markdown, or extra text — ONLY the JSON`,
        },
      ],
    }],
    generationConfig: {
      temperature: 0.1,
      maxOutputTokens: 4096,
      responseMimeType: "application/json",
    },
  };

  const geminiResult = await callGeminiWithFallback(geminiKey, geminiModel, payload);
  if (!geminiResult) return null;
  const raw = geminiResult.raw;

  try {
    const parsed = JSON.parse(extractJsonObject(raw) ?? stripCodeFence(raw));
    const rawText = typeof parsed.rawText === "string" ? parsed.rawText : "";
    const parsedIngredients = Array.isArray(parsed.ingredients)
      ? parsed.ingredients.filter((item: unknown): item is string => typeof item === "string" && item.trim().length > 1)
      : parseIngredientText(rawText);
    const ingredients = parsedIngredients.length > 0 ? parsedIngredients : parseIngredientText(rawText);

    return {
      rawText,
      ingredients,
      source: "gemini",
    };
  } catch {
    console.error("[ocr] JSON parse failed:", raw);
    const ingredients = parseIngredientText(raw);
    if (ingredients.length === 0) return null;
    return {
      rawText: raw,
      ingredients,
      source: "gemini",
    };
  }
}

// ── ACTION: Research — name → structured ingredient ───────────
async function handleResearch(
  ingredientName: string,
  geminiKey: string,
  geminiModel: string,
  adminClient: ReturnType<typeof createClient>
): Promise<{ ingredient: object; source: string } | null> {
  // Check DB first — skip Gemini if already known
  const { data: existing } = await adminClient
    .from("ingredients")
    .select("*")
    .ilike("name", ingredientName)
    .maybeSingle();

  if (existing) return { ingredient: existing, source: "database" };

  const payload = {
    contents: [{
      parts: [{
        text: `You are a cosmetic chemistry expert. Research this cosmetic ingredient and respond ONLY with a valid JSON object.

Ingredient: "${ingredientName}"

Required JSON format:
{
  "name": "official INCI name in Title Case",
  "aliases": ["common name", "trade name"],
  "isComedogenic": false,
  "allergenRisk": "Low",
  "unsuitableFor": ["None"],
  "category": "Hydrator"
}

allergenRisk: "Low" | "Medium" | "High"
unsuitableFor values from: ["Sensitive","Acne-Prone","Dry","Extremely Dry","Oily","Pregnant","Rosacea","Eczema","None"]
category from: ${VALID_CATEGORIES.join(", ")}

Base your answer on CosIng database, EWG Skin Deep, and peer-reviewed dermatology.
Return ONLY the JSON — no markdown, no explanation.`,
      }],
    }],
    generationConfig: {
      temperature: 0.1,
      maxOutputTokens: 512,
      responseMimeType: "application/json",
    },
  };

  const geminiResult = await callGeminiWithFallback(geminiKey, geminiModel, payload);
  const raw = geminiResult?.raw;
  if (!raw) {
    const ingredient = makeFallbackIngredient(ingredientName);
    await adminClient.from("ingredients").upsert(ingredient, { onConflict: "id" });
    return { ingredient, source: "fallback" };
  }

  let parsed: Record<string, unknown>;
  try {
    parsed = JSON.parse(extractJsonObject(raw) ?? stripCodeFence(raw));
  } catch {
    console.error("[research] JSON parse failed:", raw);
    const ingredient = makeFallbackIngredient(ingredientName);
    await adminClient.from("ingredients").upsert(ingredient, { onConflict: "id" });
    return { ingredient, source: "fallback" };
  }

  if (!parsed.name || typeof parsed.name !== "string") {
    const ingredient = makeFallbackIngredient(ingredientName);
    await adminClient.from("ingredients").upsert(ingredient, { onConflict: "id" });
    return { ingredient, source: "fallback" };
  }
  if (!VALID_CATEGORIES.includes(parsed.category as string)) parsed.category = "Additive";

  const ingId = `ING-AI-${(parsed.name as string)
    .toUpperCase().replace(/[^A-Z0-9]/g, "-").replace(/-+/g, "-").slice(0, 20)}`;

  const ingredient = {
    id: ingId,
    name: parsed.name as string,
    aliases: (Array.isArray(parsed.aliases) ? parsed.aliases as unknown[] : [])
      .filter((a): a is string => typeof a === "string").slice(0, 10),
    is_comedogenic: Boolean(parsed.isComedogenic),
    allergen_risk: VALID_RISK.includes(parsed.allergenRisk as string) ? parsed.allergenRisk : "Low",
    unsuitable_for: (Array.isArray(parsed.unsuitableFor) ? parsed.unsuitableFor as unknown[] : ["None"])
      .filter((u): u is string => VALID_UNSUITABLE.includes(u as string)).slice(0, 8),
    category: parsed.category as string,
  };

  // Persist
  const { error } = await adminClient.from("ingredients").upsert(ingredient, { onConflict: "id" });
  if (error) console.error("[research] DB upsert error:", error.message);

  return { ingredient, source: "ai" };
}

// ── Main handler ─────────────────────────────────────────────
Deno.serve(async (req: Request) => {
  if (req.method === "OPTIONS") return new Response(null, { status: 204, headers: CORS_HEADERS });
  if (req.method !== "POST") {
    return new Response(JSON.stringify({ error: "Method not allowed" }), {
      status: 405, headers: { ...CORS_HEADERS, "Content-Type": "application/json" },
    });
  }

  try {
    // 1. Auth
    const authHeader = req.headers.get("Authorization");
    if (!authHeader?.startsWith("Bearer ")) {
      return new Response(JSON.stringify({ error: "Missing authorization" }), {
        status: 401, headers: { ...CORS_HEADERS, "Content-Type": "application/json" },
      });
    }

    const userClient = createClient(
      Deno.env.get("SUPABASE_URL")!,
      Deno.env.get("SUPABASE_ANON_KEY")!,
      { global: { headers: { Authorization: authHeader } } }
    );
    const { data: { user }, error: authError } = await userClient.auth.getUser();
    if (authError || !user) {
      return new Response(JSON.stringify({ error: "Unauthorized" }), {
        status: 401, headers: { ...CORS_HEADERS, "Content-Type": "application/json" },
      });
    }

    // 2. Rate limit
    const rl = checkRateLimit(user.id);
    if (!rl.allowed) {
      return new Response(
        JSON.stringify({ error: "Rate limit reached. Please wait 60 seconds." }),
        { status: 429, headers: { ...CORS_HEADERS, "Content-Type": "application/json", "Retry-After": "60" } }
      );
    }

    // 3. Parse body
    let body: { action?: string; ingredientName?: unknown; imageBase64?: unknown; mimeType?: string };
    try { body = await req.json(); }
    catch {
      return new Response(JSON.stringify({ error: "Invalid JSON body" }), {
        status: 400, headers: { ...CORS_HEADERS, "Content-Type": "application/json" },
      });
    }

    const geminiKey = Deno.env.get("GEMINI_API_KEY") ?? null;
    const visionKey =
      Deno.env.get("GOOGLE_CLOUD_VISION_API_KEY") ??
      Deno.env.get("GOOGLE_VISION_API_KEY") ??
      null;
    const geminiModel = Deno.env.get("GEMINI_MODEL") ?? DEFAULT_GEMINI_MODEL;

    const adminClient = createClient(
      Deno.env.get("SUPABASE_URL")!,
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!
    );

    const rlHeader = { "X-RateLimit-Remaining": String(rl.remaining) };

    // 4. Route by action
    const action = body.action ?? "research";

    // ── OCR action ──────────────────────────────────────────
    if (action === "ocr") {
      const imgValidation = validateBase64Image(body.imageBase64);
      if (!imgValidation.valid) {
        return new Response(JSON.stringify({ error: imgValidation.error }), {
          status: 400, headers: { ...CORS_HEADERS, "Content-Type": "application/json" },
        });
      }

      if (!visionKey && !geminiKey) {
        return new Response(JSON.stringify({ error: "OCR service not configured" }), {
          status: 503, headers: { ...CORS_HEADERS, "Content-Type": "application/json" },
        });
      }

      const mimeType = body.mimeType ?? "image/jpeg";
      const result = await handleOcr(body.imageBase64 as string, mimeType, geminiKey, visionKey, geminiModel);

      if (!result) {
        return new Response(JSON.stringify({ error: "OCR failed — could not read the label" }), {
          status: 502, headers: { ...CORS_HEADERS, "Content-Type": "application/json" },
        });
      }

      // Audit log
      await adminClient.from("ai_research_log").insert({
        user_id: user.id,
        ingredient_name: `[OCR] ${result.ingredients.length} ingredients`,
        resolved_id: null,
        success: result.ingredients.length > 0,
      }).then(() => {}).catch(() => {});

      return new Response(JSON.stringify(result), {
        status: 200,
        headers: { ...CORS_HEADERS, "Content-Type": "application/json", ...rlHeader },
      });
    }

    // ── Research action ─────────────────────────────────────
    if (action === "research") {
      if (!geminiKey) {
        return new Response(JSON.stringify({ error: "AI service not configured" }), {
          status: 503, headers: { ...CORS_HEADERS, "Content-Type": "application/json" },
        });
      }

      const v = validateIngredientName(body.ingredientName);
      if (!v.valid) {
        return new Response(JSON.stringify({ error: v.error }), {
          status: 400, headers: { ...CORS_HEADERS, "Content-Type": "application/json" },
        });
      }

      const ingredientName = (body.ingredientName as string).trim();
      const result = await handleResearch(ingredientName, geminiKey, geminiModel, adminClient);

      if (!result) {
        return new Response(JSON.stringify({ error: "Research failed" }), {
          status: 502, headers: { ...CORS_HEADERS, "Content-Type": "application/json" },
        });
      }

      // Audit log
      await adminClient.from("ai_research_log").insert({
        user_id: user.id,
        ingredient_name: ingredientName,
        resolved_id: (result.ingredient as { id: string }).id,
        success: true,
      }).then(() => {}).catch(() => {});

      return new Response(JSON.stringify(result), {
        status: 200,
        headers: { ...CORS_HEADERS, "Content-Type": "application/json", ...rlHeader },
      });
    }

    return new Response(JSON.stringify({ error: `Unknown action: ${action}` }), {
      status: 400, headers: { ...CORS_HEADERS, "Content-Type": "application/json" },
    });

  } catch (err) {
    console.error("[ai-proxy] Unhandled:", err);
    return new Response(JSON.stringify({ error: "Internal server error" }), {
      status: 500, headers: { ...CORS_HEADERS, "Content-Type": "application/json" },
    });
  }
});
