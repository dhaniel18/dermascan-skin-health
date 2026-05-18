// ============================================================
// DermaScan — Root Layout
// SafeAreaProvider MUST be the outermost wrapper — required by
// useSafeAreaInsets() in Screen.tsx. Without this, iOS crashes
// silently (white screen, no error logs).
// ============================================================

// Polyfill URL for Supabase — must be first import in the app
import "react-native-url-polyfill/auto";
import "../global.css";

import { Stack } from "expo-router";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { AppThemeProvider } from "@/components/AppThemeProvider";

export default function RootLayout() {
  return (
    <SafeAreaProvider>
      <AppThemeProvider>
        <Stack screenOptions={{ headerShown: false }}>
          <Stack.Screen name="index" />
          <Stack.Screen name="create-account" />
          <Stack.Screen name="sign-in" />
          <Stack.Screen name="skin-setup" />
          <Stack.Screen name="(tabs)" />
          <Stack.Screen name="+not-found" />
        </Stack>
      </AppThemeProvider>
    </SafeAreaProvider>
  );
}
