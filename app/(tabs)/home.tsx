import { Bell, Search } from "lucide-react-native";
import { ScrollView, Text, TextInput, View } from "react-native";
import { ProductCard } from "@/components/ProductCard";
import { Screen } from "@/components/Screen";
import { colors } from "@/constants/theme";
import { recentProducts, recommendedProducts } from "@/services/products";

export default function HomeScreen() {
  return (
    <Screen padded={false}>
      <View className="px-6 pt-4">
        <View className="flex-row items-center justify-between">
          <View>
            <Text className="text-sm font-semibold text-muted">Hello!</Text>
            <Text className="text-3xl font-extrabold text-navy">Ready to scan?</Text>
          </View>
          <View className="h-11 w-11 items-center justify-center rounded-2xl bg-periwinkle-soft">
            <Bell size={21} color={colors.navy} />
          </View>
        </View>

        <View className="mt-6 flex-row items-center gap-3 rounded-2xl bg-card px-4">
          <Search size={20} color={colors.muted} />
          <TextInput
            placeholder="Search ingredients or products"
            placeholderTextColor={colors.muted}
            className="h-14 flex-1 text-base text-navy"
          />
        </View>

        <View className="mt-6 rounded-3xl bg-navy p-5">
          <Text className="text-sm font-semibold text-cloud/80">Tip of the Day</Text>
          <Text className="mt-2 text-lg font-bold text-cloud">Introduce actives one at a time.</Text>
          <Text className="mt-2 text-sm leading-5 text-cloud/80">
            Give your skin a few days before adding another serum so reactions are easier to spot.
          </Text>
        </View>
      </View>

      <View className="mt-7">
        <Text className="px-6 text-xl font-extrabold text-navy">Recent Scans</Text>
        <ScrollView horizontal className="mt-4" contentContainerClassName="gap-4 px-6" showsHorizontalScrollIndicator={false}>
          {recentProducts.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </ScrollView>
      </View>

      <View className="mt-7 pb-24">
        <Text className="px-6 text-xl font-extrabold text-navy">Recommended for You</Text>
        <ScrollView horizontal className="mt-4" contentContainerClassName="gap-4 px-6" showsHorizontalScrollIndicator={false}>
          {recommendedProducts.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </ScrollView>
      </View>
    </Screen>
  );
}
