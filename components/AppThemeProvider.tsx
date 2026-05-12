import AsyncStorage from "@react-native-async-storage/async-storage";
import { StatusBar } from "expo-status-bar";
import { useColorScheme } from "nativewind";
import { createContext, ReactNode, useContext, useEffect, useMemo, useState } from "react";

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

  useEffect(() => {
    AsyncStorage.getItem(THEME_STORAGE_KEY).then((savedMode) => {
      const nextMode = savedMode === "dark" ? "dark" : "light";

      setMode(nextMode);
      setColorScheme(nextMode);
    });
  }, [setColorScheme]);

  const value = useMemo<AppThemeContextValue>(
    () => ({
      mode,
      isDark: mode === "dark" || colorScheme === "dark",
      toggleTheme: async () => {
        const nextMode = mode === "dark" ? "light" : "dark";

        setMode(nextMode);
        setColorScheme(nextMode);
        await AsyncStorage.setItem(THEME_STORAGE_KEY, nextMode);
      },
    }),
    [colorScheme, mode, setColorScheme],
  );

  return (
    <AppThemeContext.Provider value={value}>
      <StatusBar style={value.isDark ? "light" : "dark"} />
      {children}
    </AppThemeContext.Provider>
  );
}

export function useAppTheme() {
  const value = useContext(AppThemeContext);

  if (!value) {
    throw new Error("useAppTheme must be used inside AppThemeProvider");
  }

  return value;
}
