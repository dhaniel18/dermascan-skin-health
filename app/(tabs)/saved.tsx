import { useCallback, useMemo, useState } from "react";
import { useFocusEffect } from "expo-router";
import { ActivityIndicator, Pressable, RefreshControl, StyleSheet, Text, View } from "react-native";
import { Bookmark, Check } from "lucide-react-native";
import { Screen } from "@/components/Screen";
import { colors } from "@/constants/theme";
import { getSavedProducts, toggleSaveProduct } from "@/services/products";
import { getUserRoutine } from "@/services/routine";
import type { Product, RoutineProduct } from "@/types/domain";

export default function SavedScreen() {
  const [products, setProducts] = useState<Product[]>([]);
  const [routine, setRoutine] = useState<RoutineProduct[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const load = useCallback(async () => {
    try {
      const [savedProducts, userRoutine] = await Promise.all([
        getSavedProducts(),
        getUserRoutine(),
      ]);
      setProducts(savedProducts);
      setRoutine(userRoutine);
    } catch (e) {
      console.warn("[saved]", e);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  useFocusEffect(useCallback(() => { load(); }, [load]));

  const routineIds = useMemo(
    () => new Set(routine.map((product) => product.productId)),
    [routine]
  );

  const unsave = async (id: string) => {
    await toggleSaveProduct(id);
    setProducts((current) => current.filter((product) => product.id !== id));
  };

  if (loading) return (
    <Screen scroll={false}>
      <View className="flex-1 items-center justify-center">
        <ActivityIndicator color={colors.navy} />
      </View>
    </Screen>
  );

  return (
    <Screen refreshControl={<RefreshControl refreshing={refreshing} onRefresh={() => { setRefreshing(true); load(); }} />}>
      <Text className="text-4xl font-extrabold text-navy dark:text-cloud">Saved Products</Text>
      <Text className="mt-3 text-lg text-muted dark:text-darkMuted">
        {products.length} product{products.length !== 1 ? "s" : ""} saved · tap to view details
      </Text>

      {products.length === 0 ? (
        <View className="mt-10 items-center rounded-3xl bg-card p-8 dark:bg-darkSurface" style={styles.card}>
          <Text className="text-center text-base font-semibold leading-6 text-muted dark:text-darkMuted">
            No saved products yet. Save a product from Recent Scans to keep it here.
          </Text>
        </View>
      ) : (
        <View className="mt-7 gap-5">
          {products.map((product) => {
            const inRoutine = routineIds.has(product.id);
            return (
              <View key={product.id} className="flex-row rounded-3xl bg-card p-4 dark:bg-darkSurface" style={styles.card}>
                <View className="flex-1 pr-3">
                  <Text className="text-xl font-extrabold text-navy dark:text-cloud" numberOfLines={2}>
                    {product.name}
                  </Text>
                  <Text className="mt-1 text-base text-muted dark:text-darkMuted" numberOfLines={1}>
                    {product.brand ?? product.category ?? "Shared Scan"}
                  </Text>

                  <View className="mt-4 flex-row flex-wrap items-center gap-3">
                    <View className="rounded-full bg-periwinkle-soft px-3 py-1 dark:bg-darkSurfaceSoft">
                      <Text className="text-sm font-extrabold text-navy dark:text-cloud">
                        {product.category ?? "Skincare"}
                      </Text>
                    </View>

                    {inRoutine ? (
                      <View className="flex-row items-center gap-1 rounded-full bg-emerald-50 px-3 py-1">
                        <Check size={15} color={colors.success} />
                        <Text className="text-sm font-extrabold" style={styles.successText}>In routine</Text>
                      </View>
                    ) : null}

                    <Text className="text-sm font-semibold text-muted dark:text-darkMuted">
                      {product.ingredientIds.length} ingredients
                    </Text>
                  </View>
                </View>

                <Pressable
                  accessibilityRole="button"
                  onPress={() => unsave(product.id)}
                  className="h-11 w-11 items-center justify-center"
                >
                  <Bookmark size={28} color={colors.maroon} fill={colors.maroon} />
                </Pressable>
              </View>
            );
          })}
        </View>
      )}
    </Screen>
  );
}

const styles = StyleSheet.create({
  card: {
    shadowColor: "#374375",
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.08,
    shadowRadius: 18,
    elevation: 2,
  },
  successText: {
    color: colors.success,
  },
});
