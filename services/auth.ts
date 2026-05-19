// ============================================================
// DermaScan — Auth Service (Production-hardened)
// ============================================================
import { supabase } from "@/lib/supabase";
import { isValidEmail, validatePassword, sanitizeText } from "@/security/inputSanitizer";
import type { User } from "@/types/domain";

function mapUser(u: { id: string; email?: string; user_metadata?: { name?: string } }): User {
  return { id: u.id, email: u.email ?? "", name: u.user_metadata?.name ?? u.email ?? "User" };
}

export async function signUp(name: string, email: string, password: string): Promise<User> {
  const cleanName = sanitizeText(name, 80);
  const cleanEmail = email.trim().toLowerCase();

  if (!isValidEmail(cleanEmail)) throw new Error("Invalid email address.");
  const pwCheck = validatePassword(password);
  if (!pwCheck.valid) throw new Error(pwCheck.message);

  const { data, error } = await supabase.auth.signUp({
    email: cleanEmail,
    password,
    options: { data: { name: cleanName } },
  });
  if (error) throw new Error(error.message);
  if (!data.user) throw new Error("Sign-up failed.");
  return mapUser(data.user);
}

export async function signIn(email: string, password: string): Promise<User> {
  const { data, error } = await supabase.auth.signInWithPassword({
    email: email.trim().toLowerCase(),
    password,
  });
  if (error) throw new Error(error.message);
  if (!data.user) throw new Error("Sign-in failed.");
  return mapUser(data.user);
}

export async function signOut(): Promise<void> {
  const { error } = await supabase.auth.signOut();
  if (error) throw new Error(error.message);
}

export async function getCurrentUser(): Promise<User | null> {
  const { data } = await supabase.auth.getUser();
  return data.user ? mapUser(data.user) : null;
}

export async function updateDisplayName(name: string): Promise<User | null> {
  const cleanName = sanitizeText(name, 80);
  const { data, error } = await supabase.auth.updateUser({
    data: { name: cleanName },
  });

  if (error) throw new Error(error.message);

  if (data.user) {
    await supabase.from("profiles").upsert({
      id: data.user.id,
      display_name: cleanName,
      updated_at: new Date().toISOString(),
    });
  }

  return data.user ? mapUser(data.user) : null;
}

export async function sendPasswordReset(email: string): Promise<void> {
  if (!isValidEmail(email)) throw new Error("Invalid email address.");
  const { error } = await supabase.auth.resetPasswordForEmail(email.trim().toLowerCase());
  if (error) throw new Error(error.message);
}
