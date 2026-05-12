import { LinearGradient } from "expo-linear-gradient";
import { ReactNode } from "react";
import { ActivityIndicator, Pressable, Text, View } from "react-native";
import { useAppTheme } from "@/components/AppThemeProvider";

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
    <View className="h-14 flex-row items-center justify-center gap-2 rounded-2xl px-5">
      {loading ? <ActivityIndicator color={variant === "brand" || isDark ? "#FFFCF5" : "#374375"} /> : null}
      <Text className={`text-base font-bold ${variant === "brand" ? "text-cloud" : "text-navy dark:text-cloud"}`}>{children}</Text>
    </View>
  );

  return (
    <Pressable
      accessibilityRole="button"
      disabled={disabled || loading}
      onPress={onPress}
      className={`${disabled ? "opacity-50" : "active:opacity-90"} ${className}`}
    >
      {variant === "brand" ? (
        <LinearGradient
          colors={isDark ? ["#895159", "#374375"] : ["#895159", "#DFAEA1"]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          className="rounded-2xl"
        >
          {content}
        </LinearGradient>
      ) : (
        <View
          className={`rounded-2xl ${
            variant === "soft" ? "bg-periwinkle-soft dark:bg-darkSurfaceSoft" : "border border-border bg-card dark:border-darkBorder dark:bg-darkSurface"
          }`}
        >
          {content}
        </View>
      )}
    </Pressable>
  );
}
