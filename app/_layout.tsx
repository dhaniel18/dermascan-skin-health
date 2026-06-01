import "../global.css";

import { Stack } from "expo-router";
import type { ErrorBoundaryProps } from "expo-router";
import { Pressable, Text, View } from "react-native";
import { AppThemeProvider } from "@/components/AppThemeProvider";

export function ErrorBoundary({ error, retry }: ErrorBoundaryProps) {
  return (
    <View style={{ flex: 1, justifyContent: "center", gap: 16, padding: 24, backgroundColor: "#FFFCF5" }}>
      <Text style={{ color: "#374375", fontSize: 24, fontWeight: "800" }}>DermaScan could not start</Text>
      <Text style={{ color: "#777D9A", fontSize: 14, lineHeight: 20 }}>{error.message}</Text>
      <Pressable
        accessibilityRole="button"
        onPress={retry}
        style={{ alignItems: "center", borderRadius: 16, backgroundColor: "#895159", padding: 16 }}
      >
        <Text style={{ color: "#FFFCF5", fontSize: 16, fontWeight: "700" }}>Retry</Text>
      </Pressable>
    </View>
  );
}

export default function RootLayout() {
  console.log("DermaScan RootLayout mounted.");

  return (
    <AppThemeProvider>
      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Screen name="index" />
        <Stack.Screen name="create-account" />
        <Stack.Screen name="sign-in" />
        <Stack.Screen name="skin-setup" />
        <Stack.Screen name="(tabs)" />
        <Stack.Screen name="discover" />
        <Stack.Screen name="+not-found" />
      </Stack>
    </AppThemeProvider>
  );
}
