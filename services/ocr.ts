// ============================================================
// DermaScan — OCR Service
// Sends a captured photo to the Gemini Vision proxy and returns
// the extracted ingredient list. No extra library needed.
// ============================================================
import * as FileSystem from "expo-file-system/legacy";
import { fetchWithTimeout } from "@/lib/fetchWithTimeout";
import { supabase } from "@/lib/supabase";

function getProxyUrl(): string {
  return `${process.env.EXPO_PUBLIC_SUPABASE_URL}/functions/v1/ai-ingredient-proxy`;
}

export type OcrResult = {
  rawText: string;
  ingredients: string[];
};

function splitVisibleIngredientText(raw: string): string[] {
  const clean = raw
    .replace(/^[\s\S]*?\b(ingredients?|komposisi|bahan)\s*[:：-]\s*/i, "")
    .replace(/\s+/g, " ")
    .trim();

  const splitByComma = clean
    .split(/\s*[,;]\s*/)
    .map((item) => item.trim().replace(/[.;:]+$/g, ""))
    .filter((item) => item.length > 1);

  if (splitByComma.length > 1) return splitByComma;

  return clean
    .split(/\s{2,}|\n+/)
    .map((item) => item.trim().replace(/[.;:]+$/g, ""))
    .filter((item) => item.length > 1);
}

/**
 * Take a photo URI (from CameraView.takePictureAsync),
 * convert it to base64, and send to the Gemini OCR proxy.
 * Returns the extracted ingredient list.
 */
export async function extractIngredientsFromPhoto(
  photoUri: string
): Promise<OcrResult> {
  // 1. Read photo as base64
  const base64 = await FileSystem.readAsStringAsync(photoUri, {
    encoding: FileSystem.EncodingType.Base64,
  });

  // 2. Get current session token
  const { data: { session } } = await supabase.auth.getSession();
  if (!session) throw new Error("Must be signed in to use OCR.");

  // 3. Send to proxy
  const response = await fetchWithTimeout(getProxyUrl(), {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${session.access_token}`,
      "apikey": process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY ?? "",
    },
    body: JSON.stringify({
      action: "ocr",
      imageBase64: base64,
      mimeType: "image/jpeg",
    }),
  }, 40_000);

  if (response.status === 429) {
    throw new Error("Too many scans. Please wait a minute before scanning again.");
  }

  if (!response.ok) {
    const err = await response.json().catch(() => ({ error: "Unknown error" }));
    throw new Error(err.error ?? "OCR failed");
  }

  const data = await response.json() as OcrResult & { source: string };
  const ingredients = data.ingredients?.length ? data.ingredients : splitVisibleIngredientText(data.rawText ?? "");

  if (!ingredients || ingredients.length === 0) {
    throw new Error("No ingredient list found in the photo. Try moving closer or improving lighting.");
  }

  return { rawText: data.rawText, ingredients };
}
