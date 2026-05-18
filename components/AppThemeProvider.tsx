import AsyncStorage from "@react-native-async-storage/async-storage";
import { StatusBar } from "expo-status-bar";
import { useColorScheme } from "nativewind";
import {
  createContext, ReactNode, useContext,
  useEffect, useMemo, useState,
} from "react";
import { ActivityIndicator, View } from "react-native";

type ThemeMode = "light" | "dark";
type AppThemeContextValue = {
  mode: ThemeMode;
  isDark: boolean;
  toggleTheme: () => Promise<void>;
};

const THEME_STORAGE_KEY = "dermascan:theme-mode";
const AppThemeContext = createContext<AppThemeContextValue | null>(null);

export function AppThemeProvider({ children }: { children: ReactNode }) {
  const { colorScheme, setColorScheme } = useColorScheme();
  const [mode, setMode] = useState<ThemeMode>("light");
  const [ready, setReady] = useState(false);

  useEffect(() => {
    let mounted = true;
    const fallback = setTimeout(() => {
      if (!mounted) return;
      console.warn("Theme load timed out; continuing with the default theme.");
      setReady(true);
    }, 1500);

    AsyncStorage.getItem(THEME_STORAGE_KEY)
      .then((saved) => {
        if (!mounted) return;
        const next: ThemeMode = saved === "dark" ? "dark" : "light";
        setMode(next);
        setColorScheme(next);
        setReady(true);
      })
      .catch((error) => {
        console.warn("Theme load failed; continuing with the default theme.", error);
        if (mounted) setReady(true);
      })
      .finally(() => clearTimeout(fallback));

    return () => {
      mounted = false;
      clearTimeout(fallback);
    };
  }, [setColorScheme]);

  const value = useMemo<AppThemeContextValue>(
    () => ({
      mode,
      isDark: mode === "dark" || colorScheme === "dark",
      toggleTheme: async () => {
        const next: ThemeMode = mode === "dark" ? "light" : "dark";
        setMode(next);
        setColorScheme(next);
        await AsyncStorage.setItem(THEME_STORAGE_KEY, next);
      },
    }),
    [colorScheme, mode, setColorScheme]
  );

  if (!ready) {
    return (
      <View style={{ flex: 1, alignItems: "center", justifyContent: "center", backgroundColor: "#FFFCF5" }}>
        <ActivityIndicator color="#374375" />
      </View>
    );
  }

  return (
    <AppThemeContext.Provider value={value}>
      <StatusBar style={value.isDark ? "light" : "dark"} />
      {children}
    </AppThemeContext.Provider>
  );
}

export function useAppTheme() {
  const value = useContext(AppThemeContext);
  if (!value) throw new Error("useAppTheme must be used inside AppThemeProvider");
  return value;
}
