// ============================================================
// DermaScan — App Theme Provider
// Uses react-native's built-in useColorScheme (safe on iOS).
// nativewind's useColorScheme can crash before SafeAreaProvider
// is ready on iOS — this avoids that entirely.
// ============================================================
import AsyncStorage from "@react-native-async-storage/async-storage";
import { StatusBar } from "expo-status-bar";
import {
  createContext, ReactNode, useCallback,
  useContext, useEffect, useMemo, useState,
} from "react";
import { useColorScheme as useRNColorScheme, View } from "react-native";

type ThemeMode = "light" | "dark";

type AppThemeContextValue = {
  mode: ThemeMode;
  isDark: boolean;
  toggleTheme: () => Promise<void>;
};

const THEME_KEY = "dermascan:theme-mode";
const AppThemeContext = createContext<AppThemeContextValue | null>(null);

export function AppThemeProvider({ children }: { children: ReactNode }) {
  const systemScheme = useRNColorScheme(); // safe on iOS — no provider needed
  const [mode, setMode] = useState<ThemeMode>("light");
  const [ready, setReady] = useState(false);

  useEffect(() => {
    // Load saved preference from AsyncStorage
    AsyncStorage.getItem(THEME_KEY)
      .then((saved) => {
        if (saved === "dark" || saved === "light") {
          setMode(saved);
        } else {
          // Fall back to system preference
          setMode(systemScheme === "dark" ? "dark" : "light");
        }
      })
      .catch(() => {
        setMode(systemScheme === "dark" ? "dark" : "light");
      })
      .finally(() => {
        setReady(true);
      });
  }, []); // run once on mount — intentionally no deps

  const toggleTheme = useCallback(async () => {
    const next: ThemeMode = mode === "dark" ? "light" : "dark";
    setMode(next);
    await AsyncStorage.setItem(THEME_KEY, next);
  }, [mode]);

  const value = useMemo<AppThemeContextValue>(
    () => ({
      mode,
      isDark: mode === "dark",
      toggleTheme,
    }),
    [mode, toggleTheme]
  );

  // Don't render children until theme preference is loaded.
  // This prevents the white flash on iOS.
  if (!ready) {
    return <View style={{ flex: 1, backgroundColor: "#FFFCF5" }} />;
  }

  return (
    <AppThemeContext.Provider value={value}>
      <StatusBar style={mode === "dark" ? "light" : "dark"} />
      {children}
    </AppThemeContext.Provider>
  );
}

export function useAppTheme(): AppThemeContextValue {
  const value = useContext(AppThemeContext);
  if (!value) {
    throw new Error("useAppTheme must be used inside <AppThemeProvider>");
  }
  return value;
}
