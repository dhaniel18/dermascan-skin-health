import AsyncStorage from "@react-native-async-storage/async-storage";
import { StatusBar } from "expo-status-bar";
import { useColorScheme } from "nativewind";
import {
  createContext, ReactNode, useContext,
  useEffect, useMemo, useState,
} from "react";
import { View } from "react-native";

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
    AsyncStorage.getItem(THEME_STORAGE_KEY).then((saved) => {
      const next: ThemeMode = saved === "dark" ? "dark" : "light";
      setMode(next);
      setColorScheme(next);
      // Mark ready AFTER theme is set so iOS doesn't flash white
      setReady(true);
    }).catch(() => {
      // AsyncStorage failed — still show the app with default theme
      setReady(true);
    });
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

  // Hold render until theme is loaded — fixes iOS white screen
  if (!ready) {
    return <View style={{ flex: 1, backgroundColor: "#FFFCF5" }} />;
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
