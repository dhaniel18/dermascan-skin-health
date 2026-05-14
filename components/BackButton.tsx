import { router } from "expo-router";
import { ArrowLeft } from "lucide-react-native";
import { Pressable, Text } from "react-native";
import { useAppTheme } from "@/components/AppThemeProvider";
import { colors } from "@/constants/theme";

type BackButtonProps = {
  fallback?: string;
};

export function BackButton({ fallback = "/" }: BackButtonProps) {
  const { isDark } = useAppTheme();

  return (
    <Pressable
      accessibilityRole="button"
      onPress={() => (router.canGoBack() ? router.back() : router.replace(fallback as never))}
      className="mb-4 flex-row items-center gap-2 self-start"
    >
      <ArrowLeft size={18} color={isDark ? colors.cloud : colors.navy} />
      <Text className="text-base font-semibold text-navy dark:text-cloud">Back</Text>
    </Pressable>
  );
}
