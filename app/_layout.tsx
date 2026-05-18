import "../global.css";

import { Stack } from "expo-router";
import { AppThemeProvider } from "@/components/AppThemeProvider";

export default function RootLayout() {
  return (
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
  );
}
