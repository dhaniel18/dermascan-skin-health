// ============================================================
// DermaScan — Saved Products Screen
// Clickable product cards, unsave confirmation dialog,
// fixed Supabase delete row bug.
// ============================================================
import { useCallback, useEffect, useState } from "react";
import {
  ActivityIndicator, Alert, Modal, RefreshControl,
  ScrollView, Text, TouchableOpacity, View,
} from "react-native";
import {
  AlertTriangle, Bookmark, BookmarkX,
  CheckCircle, ChevronDown, ChevronUp, Plus, X,
} from "lucide-react-native";
import { Screen } from "@/components/Screen";
import { colors } from "@/constants/theme";
import { getSavedProducts, toggleSaveProduct } from "@/services/products";
import { addToRoutine, getUserRoutine } from "@/services/routine";
import type { Product, RoutineProduct } from "@/types/domain";

const SEV_COLOR = { High: "#C0392B", Medium: "#E67E22", Low: "#F1C40F" } as const;

// ── Product Detail Modal ──────────────────────────────────────
function ProductDetailModal({
  product,
  visible,
  onClose,
  inRoutine,
  onUnsave,
  onAddToRoutine,
}: {
  product: Product | null;
  visible: boolean;
  onClose: () => void;
  inRoutine: boolean;
  onUnsave: () => void;
  onAddToRoutine: () => void;
}) {
  const [ingExpanded, setIngExpanded] = useState(false);
  if (!product) return null;

  return (
    <Modal
      visible={visible}
      animationType="slide"
      presentationStyle="pageSheet"
      onRequestClose={onClose}
    >
      <View className="flex-1 bg-cloud dark:bg-darkSurface">
        {/* Header */}
        <View className="flex-row items-center justify-between px-6 pt-6 pb-4 border-b border-border dark:border-darkBorder">
          <View className="flex-1">
            <Text
              className="text-xl font-extrabold text-navy dark:text-cloud"
              numberOfLines={1}
            >
              {product.name}
            </Text>
            {product.brand && (
              <Text className="text-xs text-muted dark:text-darkMuted mt-0.5">
                {product.brand}
              </Text>
            )}
          </View>
          <TouchableOpacity
            onPress={onClose}
            className="ml-4 p-2 rounded-full bg-periwinkle-soft dark:bg-darkSurfaceSoft"
          >
            <X size={18} color={colors.navy} />
          </TouchableOpacity>
        </View>

        <ScrollView
          className="flex-1 px-6 pt-5"
          showsVerticalScrollIndicator={false}
        >
          {/* Category badge */}
          {product.category && (
            <View className="self-start rounded-full bg-periwinkle-soft px-3 py-1 mb-4 dark:bg-darkSurfaceSoft">
              <Text className="text-xs font-bold text-navy dark:text-cloud">
                {product.category}
              </Text>
            </View>
          )}

          {/* Status */}
          <View className="flex-row items-center gap-2 rounded-2xl bg-periwinkle-soft px-4 py-3 mb-5 dark:bg-darkSurfaceSoft">
            {product.verificationStatus === "Verified" ? (
              <>
                <CheckCircle size={16} color={colors.success} />
                <Text className="text-sm font-semibold text-navy dark:text-cloud">
                  Verified product
                </Text>
              </>
            ) : (
              <>
                <AlertTriangle size={16} color={SEV_COLOR.Medium} />
                <Text className="text-sm font-semibold text-navy dark:text-cloud">
                  Community uploaded — unverified
                </Text>
              </>
            )}
          </View>

          {/* Ingredient list */}
          {product.ingredientIds.length > 0 && (
            <View className="rounded-3xl bg-card p-5 mb-5 dark:bg-darkSurface">
              <TouchableOpacity
                className="flex-row items-center justify-between"
                onPress={() => setIngExpanded((e) => !e)}
              >
                <Text className="font-bold text-navy dark:text-cloud">
                  Ingredients ({product.ingredientIds.length})
                </Text>
                {ingExpanded
                  ? <ChevronUp size={16} color={colors.muted} />
                  : <ChevronDown size={16} color={colors.muted} />
                }
              </TouchableOpacity>

              {ingExpanded && (
                <View className="mt-3 flex-row flex-wrap gap-2">
                  {product.ingredientIds.map((id) => {
                    const { getIngredientById } = require("@/lib/ingredientDatabase");
                    const ing = getIngredientById(id);
                    return (
                      <View
                        key={id}
                        className="rounded-full px-3 py-1"
                        style={{
                          backgroundColor: ing?.isComedogenic
                            ? "#fff3e0"
                            : ing?.allergenRisk === "High"
                            ? "#fdecea"
                            : "#f0faf5",
                        }}
                      >
                        <Text
                          className="text-xs font-semibold"
                          style={{
                            color: ing?.isComedogenic
                              ? "#E67E22"
                              : ing?.allergenRisk === "High"
                              ? "#C0392B"
                              : "#2e7d5e",
                          }}
                        >
                          {ing?.name ?? id}
                          {ing?.isComedogenic ? " 🔴" : ""}
                          {ing?.allergenRisk === "High" ? " 🚨" : ""}
                        </Text>
                      </View>
                    );
                  })}
                </View>
              )}

              {ingExpanded && (
                <View className="mt-3 flex-row flex-wrap gap-3">
                  <View className="flex-row items-center gap-1">
                    <Text className="text-xs text-muted dark:text-darkMuted">🔴 Comedogenic</Text>
                  </View>
                  <View className="flex-row items-center gap-1">
                    <Text className="text-xs text-muted dark:text-darkMuted">🚨 High allergen</Text>
                  </View>
                  <View className="flex-row items-center gap-1">
                    <Text className="text-xs text-muted dark:text-darkMuted">🟢 Safe</Text>
                  </View>
                </View>
              )}
            </View>
          )}

          {/* Raw text if available */}
          {product.rawIngredientText && !product.ingredientIds.length && (
            <View className="rounded-3xl bg-card p-5 mb-5 dark:bg-darkSurface">
              <Text className="font-bold text-navy dark:text-cloud mb-2">
                Ingredient List
              </Text>
              <Text className="text-sm text-muted dark:text-darkMuted">
                {product.rawIngredientText}
              </Text>
            </View>
          )}

          {/* Actions */}
          <View className="gap-3 mb-8">
            {!inRoutine ? (
              <TouchableOpacity
                onPress={onAddToRoutine}
                className="flex-row items-center justify-center gap-2 rounded-2xl py-4 bg-maroon"
              >
                <Plus size={18} color={colors.cloud} />
                <Text className="font-bold text-cloud">Add to Routine</Text>
              </TouchableOpacity>
            ) : (
              <View className="flex-row items-center justify-center gap-2 rounded-2xl py-4 bg-periwinkle-soft dark:bg-darkSurfaceSoft">
                <CheckCircle size={18} color={colors.success} />
                <Text className="font-bold text-navy dark:text-cloud">In Your Routine ✓</Text>
              </View>
            )}

            <TouchableOpacity
              onPress={onUnsave}
              className="flex-row items-center justify-center gap-2 rounded-2xl py-4 border border-maroon"
            >
              <BookmarkX size={18} color={colors.maroon} />
              <Text className="font-bold text-maroon">Remove from Saved</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </View>
    </Modal>
  );
}

// ── Main Screen ───────────────────────────────────────────────
export default function SavedScreen() {
  const [products, setProducts] = useState<Product[]>([]);
  const [routine, setRoutine] = useState<RoutineProduct[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [selected, setSelected] = useState<Product | null>(null);

  const load = useCallback(async () => {
    try {
      const [saved, r] = await Promise.all([getSavedProducts(), getUserRoutine()]);
      setProducts(saved);
      setRoutine(r);
    } catch (e) { console.warn("[saved]", e); }
    finally { setLoading(false); setRefreshing(false); }
  }, []);

  useEffect(() => { load(); }, [load]);

  const routineIds = new Set(routine.map((r) => r.productId));

  const handleUnsave = (product: Product) => {
    Alert.alert(
      "Remove from Saved",
      `Remove "${product.name}" from your saved products?`,
      [
        {
          text: "Remove",
          style: "destructive",
          onPress: async () => {
            // Close modal first
            setSelected(null);
            // Delete from Supabase — toggleSaveProduct checks existing row
            // and deletes if found (fixes the bug where row wasn't deleted)
            await toggleSaveProduct(product.id);
            // Remove from local state immediately
            setProducts((prev) => prev.filter((p) => p.id !== product.id));
          },
        },
        { text: "Cancel", style: "cancel" },
      ]
    );
  };

  const handleAddToRoutine = (product: Product) => {
    Alert.alert(
      "Add to Routine",
      `When do you use "${product.name}"?`,
      [
        {
          text: "☀️ Morning",
          onPress: async () => {
            await addToRoutine(product.id, "morning");
            setRoutine((prev) => [
              ...prev,
              {
                productId: product.id,
                productName: product.name,
                ingredientIds: product.ingredientIds,
                timeOfDay: "morning",
              },
            ]);
          },
        },
        {
          text: "🌙 Evening",
          onPress: async () => {
            await addToRoutine(product.id, "evening");
            setRoutine((prev) => [
              ...prev,
              {
                productId: product.id,
                productName: product.name,
                ingredientIds: product.ingredientIds,
                timeOfDay: "evening",
              },
            ]);
          },
        },
        {
          text: "☀️🌙 Both",
          onPress: async () => {
            await addToRoutine(product.id, "any");
            setRoutine((prev) => [
              ...prev,
              {
                productId: product.id,
                productName: product.name,
                ingredientIds: product.ingredientIds,
                timeOfDay: "any",
              },
            ]);
          },
        },
        { text: "Cancel", style: "cancel" },
      ]
    );
  };

  if (loading) return (
    <Screen scroll={false}>
      <View className="flex-1 items-center justify-center">
        <ActivityIndicator color={colors.navy} />
      </View>
    </Screen>
  );

  return (
    <>
      <Screen
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={() => { setRefreshing(true); load(); }}
          />
        }
      >
        <Text className="text-3xl font-extrabold text-navy dark:text-cloud">
          Saved Products
        </Text>
        <Text className="mt-1 text-base text-muted dark:text-darkMuted">
          {products.length} product{products.length !== 1 ? "s" : ""} saved
          {products.length > 0 ? " · tap to view details" : ""}
        </Text>

        {products.length === 0 ? (
          <View className="mt-16 items-center gap-4">
            <View className="h-24 w-24 rounded-full bg-periwinkle-soft items-center justify-center dark:bg-darkSurfaceSoft">
              <Bookmark size={36} color={colors.muted} />
            </View>
            <Text className="text-center text-muted dark:text-darkMuted text-sm">
              No saved products yet.{"\n"}Scan a product and tap Save to add it here.
            </Text>
          </View>
        ) : (
          <View className="mt-5 gap-3">
            {products.map((product) => {
              const inRoutine = routineIds.has(product.id);
              return (
                <TouchableOpacity
                  key={product.id}
                  onPress={() => setSelected(product)}
                  activeOpacity={0.75}
                  className="rounded-2xl bg-card dark:bg-darkSurface overflow-hidden"
                >
                  <View className="px-4 py-4">
                    <View className="flex-row items-start justify-between">
                      <View className="flex-1">
                        <Text
                          className="font-bold text-navy dark:text-cloud"
                          numberOfLines={1}
                        >
                          {product.name}
                        </Text>
                        {product.brand && (
                          <Text className="text-xs text-muted dark:text-darkMuted mt-0.5">
                            {product.brand}
                          </Text>
                        )}
                      </View>
                      <Bookmark
                        size={18}
                        color={colors.maroon}
                        fill={colors.maroon}
                        className="ml-3 mt-0.5"
                      />
                    </View>

                    <View className="flex-row items-center gap-2 mt-2 flex-wrap">
                      {product.category && (
                        <View className="rounded-full bg-periwinkle-soft px-2 py-0.5 dark:bg-darkSurfaceSoft">
                          <Text className="text-xs font-semibold text-navy dark:text-cloud">
                            {product.category}
                          </Text>
                        </View>
                      )}
                      {inRoutine && (
                        <View className="rounded-full bg-green-50 px-2 py-0.5">
                          <Text className="text-xs font-semibold text-green-700">
                            ✓ In routine
                          </Text>
                        </View>
                      )}
                      {product.ingredientIds.length > 0 && (
                        <Text className="text-xs text-muted dark:text-darkMuted">
                          {product.ingredientIds.length} ingredients
                        </Text>
                      )}
                    </View>
                  </View>
                </TouchableOpacity>
              );
            })}
          </View>
        )}
      </Screen>

      <ProductDetailModal
        product={selected}
        visible={!!selected}
        onClose={() => setSelected(null)}
        inRoutine={selected ? routineIds.has(selected.id) : false}
        onUnsave={() => selected && handleUnsave(selected)}
        onAddToRoutine={() => selected && handleAddToRoutine(selected)}
      />
    </>
  );
}
