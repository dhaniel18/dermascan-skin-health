// ============================================================
// DermaScan — OCR Service
// Uses string literal "base64" instead of FileSystem.EncodingType.Base64
// to avoid the iOS crash: "Cannot read property 'Base64' of undefined"
// ============================================================
import * as FileSystem from "expo-file-system";
import { supabase } from "@/lib/supabase";

function getProxyUrl(): string {
  return `${process.env.EXPO_PUBLIC_SUPABASE_URL}/functions/v1/ai-ingredient-proxy`;
}

export type OcrResult = {
  rawText: string;
  ingredients: string[];
};

export async function extractIngredientsFromPhoto(photoUri: string): Promise<OcrResult> {
  // Use string literal "base64" — FileSystem.EncodingType.Base64 is undefined on iOS
  const base64 = await FileSystem.readAsStringAsync(photoUri, {
    encoding: "base64" as FileSystem.EncodingType,
  });

  const { data: { session } } = await supabase.auth.getSession();
  if (!session) throw new Error("Must be signed in to use OCR.");

  const response = await fetch(getProxyUrl(), {
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
    signal: AbortSignal.timeout(30_000),
  });

  if (response.status === 429) throw new Error("Too many scans. Please wait a minute.");
  if (!response.ok) {
    const err = await response.json().catch(() => ({ error: "Unknown error" }));
    throw new Error(err.error ?? "OCR failed");
  }

  const data = await response.json() as OcrResult & { source: string };
  if (!data.ingredients || data.ingredients.length === 0) {
    throw new Error("No ingredient list found. Move closer to the label and try again.");
  }
  return { rawText: data.rawText, ingredients: data.ingredients };
}
