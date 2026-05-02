import { ScanLine } from "lucide-react-native";
import { Text, View } from "react-native";
import { Button } from "@/components/Button";
import { Screen } from "@/components/Screen";
import { colors } from "@/constants/theme";
import { scanTips } from "@/services/scans";

export default function ScanScreen() {
  return (
    <Screen>
      <View className="-mx-6 -mt-4 bg-navy px-6 pb-8 pt-8">
        <Text className="text-3xl font-extrabold text-cloud">Product Scanner</Text>
        <Text className="mt-2 text-base text-cloud/80">Scan a label or upload a photo to check ingredient compatibility.</Text>

        <View className="mt-6 aspect-square items-center justify-center rounded-3xl border border-cloud/20 bg-cloud/10">
          <View className="h-40 w-40 items-center justify-center rounded-full border-2 border-dashed border-cloud/50">
            <ScanLine size={56} color={colors.cloud} />
          </View>
          <Text className="mt-5 text-center text-sm font-semibold text-cloud/80">Camera preview placeholder</Text>
        </View>
      </View>

      <View className="mt-6 gap-3">
        <Button>Scan Product</Button>
        <Button variant="outline">Upload Photo</Button>
      </View>

      <View className="mt-6 rounded-3xl bg-card p-5">
        <Text className="text-lg font-bold text-navy">Scanning Tips</Text>
        <View className="mt-4 gap-3">
          {scanTips.map((tip) => (
            <View key={tip} className="flex-row gap-3">
              <View className="mt-1.5 h-2 w-2 rounded-full bg-maroon" />
              <Text className="flex-1 text-sm leading-5 text-muted">{tip}</Text>
            </View>
          ))}
        </View>
      </View>
    </Screen>
  );
}
