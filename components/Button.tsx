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
  style?: object;
};

const styles = StyleSheet.create({
  base: {
    borderRadius: 16,
    overflow: "hidden",
  },
  inner: {
    height: 56,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    paddingHorizontal: 20,
  },
  brandText: {
    fontSize: 16,
    fontWeight: "700",
    color: colors.cloud,
  },
  otherText: {
    fontSize: 16,
    fontWeight: "700",
    color: colors.navy,
  },
  softBg: {
    backgroundColor: colors.periwinkleSoft,
    borderRadius: 16,
  },
  outlineBg: {
    borderRadius: 16,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.card,
  },
});

export function Button({
  children,
  onPress,
  disabled,
  loading,
  variant = "brand",
  style,
}: ButtonProps) {
  const { isDark } = useAppTheme();

  const textStyle = variant === "brand"
    ? styles.brandText
    : [styles.otherText, isDark && { color: colors.cloud }];

  const inner = (
    <View style={styles.inner}>
      {loading && (
        <ActivityIndicator
          color={variant === "brand" ? colors.cloud : (isDark ? colors.cloud : colors.navy)}
        />
      )}
      <Text style={textStyle}>{children}</Text>
    </View>
  );

  return (
    <Pressable
      accessibilityRole="button"
      disabled={disabled || loading}
      onPress={onPress}
      style={[
        styles.base,
        disabled && { opacity: 0.5 },
        style,
      ]}
    >
      {variant === "brand" ? (
        <LinearGradient
          colors={isDark ? ["#895159", "#374375"] : ["#895159", "#DFAEA1"]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={styles.base}
        >
          {inner}
        </LinearGradient>
      ) : (
        <View
          style={
            variant === "soft"
              ? [styles.softBg, isDark && { backgroundColor: "#2a2f4e" }]
              : [styles.outlineBg, isDark && { borderColor: "#3a3f60", backgroundColor: "#1e2340" }]
          }
        >
          {inner}
        </View>
      )}
    </Pressable>
  );
}
