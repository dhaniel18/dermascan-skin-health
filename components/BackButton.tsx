import { router } from "expo-router";
import { ArrowLeft } from "lucide-react-native";
import { Pressable, Text } from "react-native";
import { colors } from "@/constants/theme";

type BackButtonProps = {
  fallback?: string;
};

export function BackButton({ fallback = "/" }: BackButtonProps) {
  return (
    <Pressable
      accessibilityRole="button"
      onPress={() => (router.canGoBack() ? router.back() : router.replace(fallback as never))}
      className="mb-4 flex-row items-center gap-2 self-start"
    >
      <ArrowLeft size={18} color={colors.navy} />
      <Text className="text-base font-semibold text-navy">Back</Text>
    </Pressable>
  );
}
