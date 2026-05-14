import { Text, View } from "react-native";
import type { Product } from "@/types/domain";

type ProductCardProps = {
  product: Product;
};

export function ProductCard({ product }: ProductCardProps) {
  return (
    <View className="w-44 rounded-3xl bg-card p-4 dark:bg-darkSurface">
      <View className="mb-3 h-20 items-center justify-center rounded-2xl bg-peach-soft dark:bg-darkSurfaceSoft">
        <Text className="text-4xl">{product.image}</Text>
      </View>
      <Text className="text-xs font-semibold text-muted dark:text-darkMuted">{product.brand}</Text>
      <Text className="mt-1 text-sm font-bold text-navy dark:text-cloud" numberOfLines={2}>
        {product.name}
      </Text>
      <View className="mt-3 flex-row items-center justify-between">
        <Text className="font-bold text-navy dark:text-cloud">{product.price}</Text>
        <Text className="rounded-full bg-periwinkle-soft px-2 py-1 text-xs font-bold text-navy dark:bg-darkSurfaceSoft dark:text-cloud">
          {product.score}%
        </Text>
      </View>
    </View>
  );
}
