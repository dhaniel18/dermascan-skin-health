import { CheckCircle2, Moon, Plus, Sun, XCircle } from "lucide-react-native";
import { Text, View } from "react-native";
import { Screen } from "@/components/Screen";
import { colors } from "@/constants/theme";
import { extraLayeringProducts, selectedLayeringProducts } from "@/services/products";

export default function LayeringScreen() {
  return (
    <Screen>
      <Text className="text-3xl font-extrabold text-navy">Layering Checker</Text>
      <Text className="mt-2 text-base text-muted">Check whether your routine plays nicely together.</Text>

      <View className="mt-6 rounded-3xl bg-card p-5">
        <Text className="text-lg font-bold text-navy">Your Products</Text>
        <View className="mt-4 gap-3">
          {selectedLayeringProducts.map((product) => (
            <View key={product} className="flex-row items-center justify-between rounded-2xl bg-peach-soft px-4 py-3">
              <Text className="font-semibold text-navy">{product}</Text>
              <XCircle size={18} color={colors.maroon} />
            </View>
          ))}
        </View>
      </View>

      <View className="mt-5 rounded-3xl bg-card p-5">
        <Text className="text-lg font-bold text-navy">Add More Products</Text>
        <View className="mt-4 flex-row flex-wrap gap-2">
          {extraLayeringProducts.map((product) => (
            <View key={product} className="flex-row items-center gap-1 rounded-full bg-periwinkle-soft px-3 py-2">
              <Plus size={14} color={colors.navy} />
              <Text className="text-sm font-semibold text-navy">{product}</Text>
            </View>
          ))}
        </View>
      </View>

      <View className="mt-5 rounded-3xl bg-card p-5">
        <Text className="text-lg font-bold text-navy">Compatibility Results</Text>
        <View className="mt-4 gap-3">
          <View className="flex-row gap-3 rounded-2xl bg-periwinkle-soft p-4">
            <CheckCircle2 size={22} color={colors.success} />
            <View className="flex-1">
              <Text className="font-bold text-navy">Niacinamide + Hyaluronic Acid</Text>
              <Text className="mt-1 text-sm text-muted">Safe to layer together.</Text>
            </View>
          </View>
          <View className="flex-row gap-3 rounded-2xl bg-peach-soft p-4">
            <XCircle size={22} color={colors.maroon} />
            <View className="flex-1">
              <Text className="font-bold text-navy">Retinol + AHA/BHA</Text>
              <Text className="mt-1 text-sm text-muted">Use on alternate nights to avoid irritation.</Text>
            </View>
          </View>
        </View>
      </View>

      <View className="mt-5 gap-3 rounded-3xl bg-card p-5">
        <View className="flex-row items-center gap-2">
          <Sun size={18} color={colors.warning} />
          <Text className="font-bold text-navy">Morning Routine</Text>
        </View>
        <Text className="text-sm text-muted">Cleanser, vitamin C, moisturizer, sunscreen.</Text>
        <View className="mt-2 flex-row items-center gap-2">
          <Moon size={18} color={colors.navy} />
          <Text className="font-bold text-navy">Night Routine</Text>
        </View>
        <Text className="text-sm text-muted">Cleanser, niacinamide, retinol cream, moisturizer.</Text>
      </View>
    </Screen>
  );
}
