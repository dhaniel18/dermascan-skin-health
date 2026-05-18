import { ScanLine } from "lucide-react-native";
import { Text, View } from "react-native";
import { useAppTheme } from "@/components/AppThemeProvider";
import { colors } from "@/constants/theme";

export function Logo() {
  const { isDark } = useAppTheme();

  return (
    <View className="items-center gap-4">
      <View className="h-24 w-24 items-center justify-center rounded-[32px] bg-periwinkle-soft dark:bg-darkSurface">
        <ScanLine size={44} color={isDark ? colors.cloud : colors.navy} strokeWidth={2.6} />
      </View>
      <View className="items-center">
        <Text className="text-5xl font-extrabold text-navy dark:text-cloud">DermaScan</Text>
        <Text className="mt-2 text-center text-base text-muted dark:text-darkMuted">Skin health, clearer decisions</Text>
      </View>
    </View>
  );
}
