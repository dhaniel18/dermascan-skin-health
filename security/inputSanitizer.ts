// ============================================================
// DermaScan — Input Sanitizer & Validator
// Used throughout the app before sending any user data to
// Supabase or the AI proxy.
// ============================================================

// Strip control characters and trim whitespace
export function sanitizeText(input: string, maxLength = 500): string {
  return input
    .replace(/[\u0000-\u001F\u007F-\u009F]/g, "") // control chars
    .replace(/[<>]/g, "")                           // basic XSS chars
    .trim()
    .slice(0, maxLength);
}

// Validate email format
export function isValidEmail(email: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim());
}

// Validate password strength
export function validatePassword(pw: string): { valid: boolean; message?: string } {
  if (pw.length < 8) return { valid: false, message: "Password must be at least 8 characters." };
  if (!/[A-Z]/.test(pw)) return { valid: false, message: "Password needs at least one uppercase letter." };
  if (!/[0-9]/.test(pw)) return { valid: false, message: "Password needs at least one number." };
  return { valid: true };
}

// Sanitize ingredient list text before OCR parsing
export function sanitizeIngredientText(raw: string): string {
  return raw
    .replace(/[\u0000-\u001F\u007F-\u009F]/g, "")
    .replace(/[<>{}[\]]/g, "")
    .trim()
    .slice(0, 5000); // hard cap for OCR text
}

// Sanitize product name before DB insert
export function sanitizeProductName(name: string): string {
  return name
    .replace(/[\u0000-\u001F\u007F-\u009F]/g, "")
    .replace(/[<>]/g, "")
    .trim()
    .slice(0, 200);
}

// Validate barcode — must be numeric or alphanumeric, reasonable length
export function isValidBarcode(barcode: string): boolean {
  return /^[a-zA-Z0-9\-]{4,50}$/.test(barcode.trim());
}
