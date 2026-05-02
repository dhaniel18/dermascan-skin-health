import { useState } from "react";
import { Pressable, Text, View } from "react-native";
import { ProductCard } from "@/components/ProductCard";
import { Screen } from "@/components/Screen";
import { savedProducts } from "@/services/products";

const tabs = ["wishlist", "recommended"];

export default function SavedScreen() {
  const [active, setActive] = useState("wishlist");

  return (
    <Screen>
      <Text className="text-3xl font-extrabold text-navy">Saved</Text>
      <Text className="mt-2 text-base text-muted">Products you want to revisit later.</Text>

      <View className="mt-6 flex-row rounded-2xl bg-periwinkle-soft p-1">
        {tabs.map((tab) => (
          <Pressable key={tab} onPress={() => setActive(tab)} className={`flex-1 rounded-xl py-3 ${active === tab ? "bg-card" : ""}`}>
            <Text className={`text-center text-sm font-bold capitalize ${active === tab ? "text-navy" : "text-muted"}`}>{tab}</Text>
          </Pressable>
        ))}
      </View>

      <View className="mt-6 flex-row flex-wrap gap-4 pb-24">
        {savedProducts.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </View>
    </Screen>
  );
}
