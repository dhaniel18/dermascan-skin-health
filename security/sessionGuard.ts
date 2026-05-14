// ============================================================
// DermaScan — Session Guard
// Wraps screens that require authentication.
// Redirects to sign-in if no active session.
// ============================================================
import { useEffect, useState } from "react";
import { router } from "expo-router";
import { supabase } from "@/lib/supabase";

export function useRequireAuth(): { ready: boolean; userId: string | null } {
  const [ready, setReady] = useState(false);
  const [userId, setUserId] = useState<string | null>(null);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (!session) {
        router.replace("/sign-in");
      } else {
        setUserId(session.user.id);
        setReady(true);
      }
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      if (!session) {
        router.replace("/sign-in");
      } else {
        setUserId(session.user.id);
        setReady(true);
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  return { ready, userId };
}

// Token refresh — call once on app start
export async function ensureFreshSession(): Promise<boolean> {
  const { data, error } = await supabase.auth.refreshSession();
  return !error && !!data.session;
}
