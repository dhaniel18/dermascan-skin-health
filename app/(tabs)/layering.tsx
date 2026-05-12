import { CheckCircle2, Moon, Plus, Sun, XCircle } from "lucide-react-native";
import { Text, View } from "react-native";
import { useAppTheme } from "@/components/AppThemeProvider";
import { Screen } from "@/components/Screen";
import { colors } from "@/constants/theme";
import { extraLayeringProducts, selectedLayeringProducts } from "@/services/products";

export default function LayeringScreen() {
  const { isDark } = useAppTheme();

  return (
    <Screen>
      <Text className="text-3xl font-extrabold text-navy dark:text-cloud">Layering Checker</Text>
      <Text className="mt-2 text-base text-muted dark:text-darkMuted">Check whether your routine plays nicely together.</Text>

      <View className="mt-6 rounded-3xl bg-card p-5 dark:bg-darkSurface">
        <Text className="text-lg font-bold text-navy dark:text-cloud">Your Products</Text>
        <View className="mt-4 gap-3">
          {selectedLayeringProducts.map((product) => (
            <View key={product} className="flex-row items-center justify-between rounded-2xl bg-peach-soft px-4 py-3 dark:bg-darkSurfaceSoft">
              <Text className="font-semibold text-navy dark:text-cloud">{product}</Text>
              <XCircle size={18} color={colors.maroon} />
            </View>
          ))}
        </View>
      </View>

      <View className="mt-5 rounded-3xl bg-card p-5 dark:bg-darkSurface">
        <Text className="text-lg font-bold text-navy dark:text-cloud">Add More Products</Text>
        <View className="mt-4 flex-row flex-wrap gap-2">
          {extraLayeringProducts.map((product) => (
            <View key={product} className="flex-row items-center gap-1 rounded-full bg-periwinkle-soft px-3 py-2 dark:bg-darkSurfaceSoft">
              <Plus size={14} color={isDark ? colors.cloud : colors.navy} />
              <Text className="text-sm font-semibold text-navy dark:text-cloud">{product}</Text>
            </View>
          ))}
        </View>
      </View>

      <View className="mt-5 rounded-3xl bg-card p-5 dark:bg-darkSurface">
        <Text className="text-lg font-bold text-navy dark:text-cloud">Compatibility Results</Text>
        <View className="mt-4 gap-3">
          <View className="flex-row gap-3 rounded-2xl bg-periwinkle-soft p-4 dark:bg-darkSurfaceSoft">
            <CheckCircle2 size={22} color={colors.success} />
            <View className="flex-1">
              <Text className="font-bold text-navy dark:text-cloud">Niacinamide + Hyaluronic Acid</Text>
              <Text className="mt-1 text-sm text-muted dark:text-darkMuted">Safe to layer together.</Text>
            </View>
          </View>
          <View className="flex-row gap-3 rounded-2xl bg-peach-soft p-4 dark:bg-darkSurfaceSoft">
            <XCircle size={22} color={colors.maroon} />
            <View className="flex-1">
              <Text className="font-bold text-navy dark:text-cloud">Retinol + AHA/BHA</Text>
              <Text className="mt-1 text-sm text-muted dark:text-darkMuted">Use on alternate nights to avoid irritation.</Text>
            </View>
          </View>
        </View>
      </View>

      <View className="mt-5 gap-3 rounded-3xl bg-card p-5 dark:bg-darkSurface">
        <View className="flex-row items-center gap-2">
          <Sun size={18} color={colors.warning} />
          <Text className="font-bold text-navy dark:text-cloud">Morning Routine</Text>
        </View>
        <Text className="text-sm text-muted dark:text-darkMuted">Cleanser, vitamin C, moisturizer, sunscreen.</Text>
        <View className="mt-2 flex-row items-center gap-2">
          <Moon size={18} color={isDark ? colors.cloud : colors.navy} />
          <Text className="font-bold text-navy dark:text-cloud">Night Routine</Text>
        </View>
        <Text className="text-sm text-muted dark:text-darkMuted">Cleanser, niacinamide, retinol cream, moisturizer.</Text>
      </View>
    </Screen>
  );
}
