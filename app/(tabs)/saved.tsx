import { useCallback, useEffect, useState } from "react";
import { ActivityIndicator, RefreshControl, Text, TouchableOpacity, View } from "react-native";
import { Bookmark } from "lucide-react-native";
import { Screen } from "@/components/Screen";
import { colors } from "@/constants/theme";
import { getSavedProducts, toggleSaveProduct } from "@/services/products";
import type { Product } from "@/types/domain";

export default function SavedScreen() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const load = useCallback(async () => {
    try { setProducts(await getSavedProducts()); }
    catch (e) { console.warn("[saved]", e); }
    finally { setLoading(false); setRefreshing(false); }
  }, []);

  useEffect(() => { load(); }, [load]);

  const unsave = async (id: string) => {
    await toggleSaveProduct(id);
    setProducts((p) => p.filter((x) => x.id !== id));
  };

  if (loading) return (
    <Screen scroll={false}><View className="flex-1 items-center justify-center"><ActivityIndicator color={colors.navy} /></View></Screen>
  );

  return (
    <Screen refreshControl={<RefreshControl refreshing={refreshing} onRefresh={() => { setRefreshing(true); load(); }} />}>
      <Text className="text-3xl font-extrabold text-navy dark:text-cloud">Saved Products</Text>
      <Text className="mt-2 text-base text-muted dark:text-darkMuted">{products.length} product{products.length !== 1 ? "s" : ""} saved</Text>
      {products.length === 0 ? (
        <View className="mt-10 items-center">
          <Text className="text-center text-muted dark:text-darkMuted">No saved products yet.{"\n"}Scan a product to get started.</Text>
        </View>
      ) : (
        <View className="mt-5 gap-3">
          {products.map((p) => (
            <View key={p.id} className="flex-row items-center justify-between rounded-2xl bg-card px-4 py-3 dark:bg-darkSurface">
              <View className="flex-1">
                <Text className="font-semibold text-navy dark:text-cloud">{p.name}</Text>
                {p.brand && <Text className="text-xs text-muted dark:text-darkMuted">{p.brand}</Text>}
              </View>
              <TouchableOpacity onPress={() => unsave(p.id)} className="p-2">
                <Bookmark size={18} color={colors.maroon} fill={colors.maroon} />
              </TouchableOpacity>
            </View>
          ))}
        </View>
      )}
    </Screen>
  );
}
