import { LinearGradient } from "expo-linear-gradient";
import { ReactNode } from "react";
import { ActivityIndicator, Pressable, StyleSheet, Text, View } from "react-native";
import { useAppTheme } from "@/components/AppThemeProvider";
import { colors } from "@/constants/theme";

type ButtonProps = {
  children: ReactNode;
  onPress?: () => void;
  disabled?: boolean;
  loading?: boolean;
  variant?: "brand" | "soft" | "outline";
  className?: string;
};

export function Button({ children, onPress, disabled, loading, variant = "brand", className = "" }: ButtonProps) {
  const { isDark } = useAppTheme();
  const content = (
    <View className="h-14 flex-row items-center justify-center gap-2 rounded-2xl px-5" style={styles.content}>
      {loading ? <ActivityIndicator color={variant === "brand" || isDark ? "#FFFCF5" : "#374375"} /> : null}
      <Text
        className={`text-base font-bold ${variant === "brand" ? "text-cloud" : "text-navy dark:text-cloud"}`}
        style={[styles.text, variant === "brand" ? styles.brandText : styles.altText, isDark && variant !== "brand" && styles.darkText]}
      >
        {children}
      </Text>
    </View>
  );

  return (
    <Pressable
      accessibilityRole="button"
      disabled={disabled || loading}
      onPress={onPress}
      className={`${disabled ? "opacity-50" : "active:opacity-90"} ${className}`}
      style={disabled ? styles.disabled : undefined}
    >
      {variant === "brand" ? (
        <LinearGradient
          colors={isDark ? ["#895159", "#374375"] : ["#895159", "#DFAEA1"]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          className="rounded-2xl"
          style={styles.brandBg}
        >
          {content}
        </LinearGradient>
      ) : (
        <View
          className={`rounded-2xl ${
            variant === "soft" ? "bg-periwinkle-soft dark:bg-darkSurfaceSoft" : "border border-border bg-card dark:border-darkBorder dark:bg-darkSurface"
          }`}
          style={[
            styles.altBg,
            variant === "soft" && styles.softBg,
            variant === "outline" && styles.outlineBg,
            isDark && variant === "soft" && styles.darkSoftBg,
            isDark && variant === "outline" && styles.darkOutlineBg,
          ]}
        >
          {content}
        </View>
      )}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  altBg: {
    borderRadius: 16,
  },
  altText: {
    color: colors.navy,
  },
  brandBg: {
    borderRadius: 16,
  },
  brandText: {
    color: colors.cloud,
  },
  content: {
    alignItems: "center",
    borderRadius: 16,
    flexDirection: "row",
    gap: 8,
    height: 56,
    justifyContent: "center",
    paddingHorizontal: 20,
  },
  darkOutlineBg: {
    backgroundColor: colors.darkSurface,
    borderColor: colors.darkBorder,
  },
  darkSoftBg: {
    backgroundColor: colors.darkSurfaceSoft,
  },
  darkText: {
    color: colors.cloud,
  },
  disabled: {
    opacity: 0.5,
  },
  outlineBg: {
    backgroundColor: colors.card,
    borderColor: colors.border,
    borderWidth: 1,
  },
  softBg: {
    backgroundColor: colors.periwinkleSoft,
  },
  text: {
    fontSize: 16,
    fontWeight: "700",
  },
});
