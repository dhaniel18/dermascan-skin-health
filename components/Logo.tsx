import { ScanLine } from "lucide-react-native";
import { Text, View } from "react-native";
import { colors } from "@/constants/theme";

export function Logo() {
  return (
    <View className="items-center gap-4">
      <View className="h-24 w-24 items-center justify-center rounded-[32px] bg-periwinkle-soft">
        <ScanLine size={44} color={colors.navy} strokeWidth={2.6} />
      </View>
      <View className="items-center">
        <Text className="text-5xl font-extrabold text-navy">DermaScan</Text>
        <Text className="mt-2 text-center text-base text-muted">Skin health, clearer decisions</Text>
      </View>
    </View>
  );
}
