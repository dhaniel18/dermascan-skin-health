import { Image, Text, View } from "react-native";
import { useAppTheme } from "@/components/AppThemeProvider";
import { colors } from "@/constants/theme";
import type { Product } from "@/types/domain";

const logoSource = require("@/assets/images/dermascan-logo.png");

type ProductCardProps = {
  product: Product;
};

export function ProductCard({ product }: ProductCardProps) {
  const { isDark } = useAppTheme();

  return (
    <View className="w-44 rounded-3xl bg-card p-4 dark:bg-darkSurface">
      <View className="mb-3 h-20 items-center justify-center rounded-2xl bg-peach-soft dark:bg-darkSurfaceSoft">
        {product.image?.startsWith("http") ? (
          <Image source={{ uri: product.image }} className="h-full w-full rounded-2xl" resizeMode="contain" />
        ) : (
          <Image
            source={logoSource}
            className="h-16 w-16"
            resizeMode="contain"
            style={isDark ? { tintColor: colors.cloud } : undefined}
          />
        )}
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
