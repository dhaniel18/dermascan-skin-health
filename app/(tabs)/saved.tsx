import { useState } from "react";
import { Pressable, Text, View } from "react-native";
import { ProductCard } from "@/components/ProductCard";
import { Screen } from "@/components/Screen";
import { recommendedProducts, savedProducts } from "@/services/products";

const tabs = [
  { id: "wishlist", label: "Wishlist" },
  { id: "recommended", label: "Recommended" },
];

export default function SavedScreen() {
  const [active, setActive] = useState("wishlist");
  const products = active === "wishlist" ? savedProducts : recommendedProducts;

  return (
    <Screen>
      <Text className="text-3xl font-extrabold text-navy dark:text-cloud">Saved</Text>
      <Text className="mt-2 text-base text-muted dark:text-darkMuted">Products you want to revisit later.</Text>

      <View className="mt-6 flex-row rounded-2xl border border-periwinkle-soft bg-periwinkle-soft p-1 dark:border-darkBorder dark:bg-darkSurface">
        {tabs.map((tab) => {
          const isActive = active === tab.id;

          return (
            <Pressable
              key={tab.id}
              onPress={() => setActive(tab.id)}
              className={`flex-1 items-center justify-center rounded-xl border py-3 ${
                isActive ? "border-maroon/30 bg-peach-soft dark:bg-darkSurfaceSoft" : "border-transparent"
              }`}
            >
              <View className="flex-row items-center justify-center gap-2">
                {isActive ? <View className="h-2 w-2 rounded-full bg-maroon" /> : null}
                <Text className={`text-center text-sm font-extrabold ${isActive ? "text-maroon dark:text-peach" : "text-muted dark:text-darkMuted"}`}>
                  {tab.label}
                </Text>
              </View>
              {isActive ? <View className="mt-2 h-1 w-10 rounded-full bg-maroon" /> : <View className="mt-2 h-1 w-10" />}
            </Pressable>
          );
        })}
      </View>

      <View className="mt-6 flex-row flex-wrap gap-4 pb-24">
        {products.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </View>
    </Screen>
  );
}
