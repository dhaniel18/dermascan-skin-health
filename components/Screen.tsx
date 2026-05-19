import { LinearGradient } from "expo-linear-gradient";
import { ReactNode } from "react";
import { ScrollView, StyleSheet, View } from "react-native";
import type { ScrollViewProps } from "react-native";
import { SafeAreaView, useSafeAreaInsets } from "react-native-safe-area-context";
import { useAppTheme } from "@/components/AppThemeProvider";

type ScreenProps = {
  children: ReactNode;
  scroll?: boolean;
  padded?: boolean;
  refreshControl?: ScrollViewProps["refreshControl"];
};

export function Screen({ children, scroll = true, padded = true, refreshControl }: ScreenProps) {
  const { isDark } = useAppTheme();
  const insets = useSafeAreaInsets();
  const bottomPadding = 104 + Math.max(insets.bottom, 10);

  return (
    <LinearGradient colors={isDark ? ["#20284F", "#2F3867"] : ["#FFFCF5", "#F3F4FB"]} className="flex-1" style={styles.fill}>
      <SafeAreaView className="flex-1" style={styles.fill}>
        {scroll ? (
          <ScrollView
            className="flex-1"
            style={styles.fill}
            contentContainerClassName={`${padded ? "px-6 pt-4" : ""} pb-8`}
            contentContainerStyle={[padded && styles.paddedContent, { paddingBottom: bottomPadding }]}
            showsVerticalScrollIndicator={false}
            refreshControl={refreshControl}
          >
            {children}
          </ScrollView>
        ) : (
          <View className={`flex-1 ${padded ? "px-6 pt-4" : ""}`} style={[styles.fill, padded && styles.paddedView]}>
            {children}
          </View>
        )}
      </SafeAreaView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  fill: {
    flex: 1,
  },
  paddedContent: {
    paddingHorizontal: 24,
    paddingTop: 16,
  },
  paddedView: {
    paddingHorizontal: 24,
    paddingTop: 16,
  },
  scrollContent: {
    paddingBottom: 32,
  },
});
