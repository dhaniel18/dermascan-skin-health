import { useCallback, useEffect, useState } from "react";
import { useRouter } from "expo-router";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import {
  ArrowLeft,
  AlertTriangle,
  Bookmark,
  CheckCircle2,
  ChevronDown,
  Moon,
  Plus,
  Search,
  Sun,
  X,
} from "lucide-react-native";
import {
  ActivityIndicator,
  Alert,
  FlatList,
  Image,
  Modal,
  Pressable,
  RefreshControl,
  StyleSheet,
  Text,
  TextInput,
  View,
  ScrollView,
} from "react-native";
import { Screen } from "@/components/Screen";
import { useAppTheme } from "@/components/AppThemeProvider";
import { colors } from "@/constants/theme";
import {
  analyseIngredients,
  cleanIngredientName,
  parseIngredientTextWithAI,
  resolveIngredientIds,
} from "@/lib/analysisEngine";
import { getSkinProfile } from "@/services/profile";
import {
  getProductById,
  getSavedProducts,
  saveProduct,
  queryDiscoverProducts,
} from "@/services/products";
import { addToRoutine } from "@/services/routine";
import type { AnalysisResult, Product, SkinProfile } from "@/types/domain";

const logoSource = require("@/assets/images/dermascan-logo.png");

const categories = ["All", "Cleanser", "Toner", "Serum", "Moisturizer", "Sunscreen", "Others"];

function scoreTone(score?: number) {
  if (score === undefined) return { label: "Unknown", color: colors.muted, bg: colors.periwinkleSoft };
  if (score >= 80) return { label: "Safe", color: colors.success, bg: "#EAF6EF" };
  if (score >= 50) return { label: "Caution", color: "#E67E22", bg: "#FFF3DF" };
  return { label: "Risk", color: "#C0392B", bg: "#FBE6E8" };
}

function warningTypeLabel(type: string) {
  if (type === "unsuitableForSkin") return "Unsuitable for Your Skin";
  if (type === "combination") return "Layering Conflict";
  if (type === "comedogenic") return "Breakout Risk";
  if (type === "allergen") return "Allergen Risk";
  return "Ingredient Warning";
}

const UPPERCASE_INGREDIENT_WORDS = new Set(["AHA", "BHA", "BHT", "CI", "DNA", "EDTA", "PEG", "PPG", "PCA", "UV", "VP"]);

function formatIngredientLabel(name: string) {
  return cleanIngredientName(name)
    .split(" ")
    .map((word) => word
      .split("-")
      .map((part) => {
        const upper = part.toUpperCase();
        if (UPPERCASE_INGREDIENT_WORDS.has(upper) || /^\d+$/.test(part)) return upper;
        return part ? part.charAt(0).toUpperCase() + part.slice(1).toLowerCase() : part;
      })
      .join("-"))
    .join(" ");
}

async function analyseProductForProfile(
  product: Product,
  profile: SkinProfile | null
): Promise<AnalysisResult> {
  let ingredients = resolveIngredientIds(product.ingredientIds);

  if (product.rawIngredientText && (ingredients.length === 0 || ingredients.length < product.ingredientIds.length)) {
    const parsed = await parseIngredientTextWithAI(product.rawIngredientText);
    if (parsed.ingredients.length > ingredients.length) {
      ingredients = parsed.ingredients;
    }
  }

  return analyseIngredients(ingredients, profile);
}

export default function DiscoverScreen() {
  const router = useRouter();
  const { isDark } = useAppTheme();
  const insets = useSafeAreaInsets();

  // Scopes and pagination state
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [offset, setOffset] = useState(0);
  const [hasMore, setHasMore] = useState(true);
  const LIMIT = 12;

  // Profile and saved products cache
  const [profile, setProfile] = useState<SkinProfile | null>(null);
  const [savedProductIds, setSavedProductIds] = useState<Set<string>>(() => new Set());

  // Detail Modal state
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [detailAnalysis, setDetailAnalysis] = useState<AnalysisResult | null>(null);
  const [detailLoading, setDetailLoading] = useState(false);
  const [ingredientsOpen, setIngredientsOpen] = useState(false);
  const [routinePickerOpen, setRoutinePickerOpen] = useState(false);
  const [saving, setSaving] = useState(false);
  const [detailSaved, setDetailSaved] = useState(false);
  const [addingRoutine, setAddingRoutine] = useState(false);

  // Load profile and saved items
  const loadCaches = useCallback(async () => {
    try {
      const [skinProfile, savedProducts] = await Promise.all([
        getSkinProfile(),
        getSavedProducts(),
      ]);
      setProfile(skinProfile);
      setSavedProductIds(new Set(savedProducts.map((p) => p.id)));
    } catch (e) {
      console.warn("[discover caches]", e);
    }
  }, []);

  useEffect(() => {
    loadCaches();
  }, [loadCaches]);

  // Load products helper
  const loadProducts = useCallback(async (currentOffset: number, category: string, search: string = "", isRefresh: boolean = false) => {
    if (isRefresh) {
      setRefreshing(true);
    } else if (currentOffset === 0) {
      setLoading(true);
    } else {
      setLoadingMore(true);
    }

    try {
      const data = await queryDiscoverProducts({
        category,
        search,
        limit: LIMIT,
        offset: currentOffset,
      });

      if (data.length < LIMIT) {
        setHasMore(false);
      } else {
        setHasMore(true);
      }

      setProducts((prev) => {
        const combined = isRefresh || currentOffset === 0 ? data : [...prev, ...data];
        const seen = new Set<string>();
        return combined.filter((p) => {
          if (seen.has(p.id)) return false;
          seen.add(p.id);
          return true;
        });
      });
      setOffset(currentOffset + data.length);
    } catch (err) {
      console.warn("[discover load]", err);
    } finally {
      setLoading(false);
      setLoadingMore(false);
      setRefreshing(false);
    }
  }, []);

  useEffect(() => {
    setOffset(0);
    setProducts([]);
    setHasMore(true);
    setLoading(true);

    const delayDebounceFn = setTimeout(() => {
      loadProducts(0, selectedCategory, searchQuery);
    }, 300);

    return () => clearTimeout(delayDebounceFn);
  }, [selectedCategory, searchQuery, loadProducts]);

  const handleRefresh = () => {
    setOffset(0);
    setHasMore(true);
    loadCaches();
    loadProducts(0, selectedCategory, searchQuery, true);
  };

  const handleLoadMore = () => {
    if (loadingMore || !hasMore || loading || refreshing) return;
    loadProducts(offset, selectedCategory, searchQuery);
  };

  // Open details
  const openProductDetail = async (product: Product) => {
    setSelectedProduct(product);
    setDetailAnalysis(null);
    setDetailSaved(savedProductIds.has(product.id));
    setIngredientsOpen(false);
    setDetailLoading(true);

    try {
      const fullProduct = await getProductById(product.id);
      const analysis = await analyseProductForProfile(fullProduct ?? product, profile);
      setDetailAnalysis(analysis);
      setDetailSaved(savedProductIds.has(product.id));
    } catch (error) {
      console.warn("[discover details]", error);
    } finally {
      setDetailLoading(false);
    }
  };

  const handleSaveProduct = async () => {
    if (!selectedProduct) return;
    setSaving(true);
    try {
      await saveProduct(selectedProduct.id);
      setSavedProductIds((current) => new Set(current).add(selectedProduct.id));
      setDetailSaved(true);
    } catch (error) {
      Alert.alert("Save failed", error instanceof Error ? error.message : "Please try again.");
    } finally {
      setSaving(false);
    }
  };

  const handleAddRoutine = async (timeOfDay: "morning" | "evening" | "any") => {
    if (!selectedProduct) return;
    setAddingRoutine(true);
    try {
      await addToRoutine(selectedProduct.id, timeOfDay);
      setRoutinePickerOpen(false);
      Alert.alert("Added", "Product added to your layering routine.");
    } catch (error) {
      Alert.alert("Add failed", error instanceof Error ? error.message : "Please try again.");
    } finally {
      setAddingRoutine(false);
    }
  };

  const closeDetail = () => {
    setSelectedProduct(null);
    setDetailAnalysis(null);
    setRoutinePickerOpen(false);
  };

  const detailTone = scoreTone(detailAnalysis?.score);
  const detailWarnings = detailAnalysis?.warnings ?? [];
  const detectedIngredients = detailAnalysis?.detectedIngredients ?? [];
  const flaggedNames = new Set(
    detailWarnings
      .flatMap((warning) => warning.ingredientNames ?? [])
      .map((name) => cleanIngredientName(name).toLowerCase())
  );

  return (
    <>
      <Screen scroll={false}>
        {/* Header */}
        <View className="flex-row items-center pt-4 mb-4">
          <Pressable
            onPress={() => router.back()}
            className="mr-4 p-2 rounded-full bg-card dark:bg-darkSurface"
          >
            <ArrowLeft size={24} color={isDark ? colors.cloud : colors.navy} />
          </Pressable>
          <Text className="text-3xl font-extrabold text-navy dark:text-cloud">
            Discover Skincare
          </Text>
        </View>

        {/* Search Bar */}
        <View className="flex-row items-center px-4 h-14 rounded-2xl bg-card dark:bg-darkSurface border border-border dark:border-darkBorder mb-4 gap-3">
          <Search size={22} color={isDark ? colors.cloud : colors.muted} />
          <TextInput
            className="flex-1 text-base font-bold text-navy dark:text-cloud"
            placeholder="Search products by name..."
            placeholderTextColor={isDark ? "rgba(255,255,255,0.4)" : "rgba(55,67,117,0.4)"}
            value={searchQuery}
            onChangeText={setSearchQuery}
            autoCapitalize="none"
            autoCorrect={false}
          />
          {searchQuery !== "" ? (
            <Pressable onPress={() => setSearchQuery("")} className="p-1 rounded-full bg-border/20 dark:bg-darkBorder/40">
              <X size={16} color={isDark ? colors.cloud : colors.navy} />
            </Pressable>
          ) : null}
        </View>

        {/* Horizontal Category List */}
        <View className="mb-4">
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerClassName="gap-3 py-1 pr-6"
          >
            {categories.map((cat) => {
              const active = selectedCategory === cat;
              return (
                <Pressable
                  key={cat}
                  onPress={() => setSelectedCategory(cat)}
                  className={`px-5 py-2.5 rounded-full border ${active
                      ? "bg-maroon border-maroon dark:bg-maroon dark:border-maroon"
                      : "bg-card border-border dark:bg-darkSurface dark:border-darkBorder"
                    }`}
                >
                  <Text
                    className={`text-sm font-bold ${active ? "text-cloud" : "text-navy dark:text-cloud"
                      }`}
                  >
                    {cat}
                  </Text>
                </Pressable>
              );
            })}
          </ScrollView>
        </View>

        {/* Products Grid */}
        {loading && offset === 0 ? (
          <View className="flex-1 items-center justify-center py-20">
            <ActivityIndicator color={colors.navy} size="large" />
          </View>
        ) : products.length === 0 ? (
          <View className="flex-1 items-center justify-center py-20 px-6">
            <Text className="text-lg font-bold text-navy dark:text-cloud text-center">
              No products found
            </Text>
            <Text className="mt-2 text-sm text-muted dark:text-darkMuted text-center">
              There are no shared scans under this category yet.
            </Text>
          </View>
        ) : (
          <FlatList
            data={products}
            keyExtractor={(item) => item.id}
            numColumns={2}
            columnWrapperStyle={{ gap: 16, marginBottom: 16 }}
            contentContainerStyle={{ paddingBottom: insets.bottom + 40 }}
            showsVerticalScrollIndicator={false}
            refreshControl={
              <RefreshControl refreshing={refreshing} onRefresh={handleRefresh} />
            }
            onEndReached={handleLoadMore}
            onEndReachedThreshold={0.5}
            ListFooterComponent={
              loadingMore ? (
                <View className="py-4 items-center justify-center">
                  <ActivityIndicator color={colors.navy} />
                </View>
              ) : null
            }
            renderItem={({ item }) => {
              const ingredients = resolveIngredientIds(item.ingredientIds);
              const analysis = analyseIngredients(ingredients, profile);
              const tone = scoreTone(analysis.score);

              return (
                <Pressable
                  onPress={() => openProductDetail(item)}
                  className="flex-1 rounded-3xl bg-card p-4 dark:bg-darkSurface relative"
                  style={styles.productCard}
                >
                  <View className="relative">
                    {item.image ? (
                      <Image
                        source={{ uri: item.image }}
                        className="h-28 rounded-2xl bg-peach-soft dark:bg-darkSurfaceSoft"
                        resizeMode="contain"
                      />
                    ) : (
                      <View className="h-28 items-center justify-center rounded-2xl bg-peach-soft dark:bg-darkSurfaceSoft">
                        <Image
                          source={logoSource}
                          className="h-20 w-20"
                          resizeMode="contain"
                          style={isDark ? styles.darkLogoImage : undefined}
                        />
                      </View>
                    )}
                    <View
                      className="absolute top-1.5 right-1.5 px-2 py-0.5 rounded-full"
                      style={{ backgroundColor: tone.bg, borderColor: tone.color, borderWidth: 0.5 }}
                    >
                      <Text className="text-xs font-extrabold" style={{ color: tone.color }}>
                        {analysis.score}
                      </Text>
                    </View>
                  </View>
                  <Text className="mt-4 text-xs font-bold text-muted dark:text-darkMuted">
                    {item.brand ?? item.category ?? "Shared Scan"}
                  </Text>
                  <Text
                    className="mt-1 min-h-10 text-base font-extrabold text-navy dark:text-cloud"
                    numberOfLines={2}
                  >
                    {item.name}
                  </Text>
                  <Text className="mt-3 text-xs font-semibold text-muted dark:text-darkMuted">
                    {item.ingredientIds?.length ?? 0} ingredients
                  </Text>
                </Pressable>
              );
            }}
          />
        )}
      </Screen>

      {/* Product Detail Modal */}
      <Modal
        visible={Boolean(selectedProduct)}
        transparent
        animationType="slide"
        onRequestClose={() => {
          if (routinePickerOpen) {
            setRoutinePickerOpen(false);
            return;
          }
          closeDetail();
        }}
      >
        <View style={styles.modalBackdrop}>
          <View className="bg-cloud dark:bg-darkBackground" style={styles.detailSheet}>
            <View className="flex-row items-start justify-between border-b border-border px-6 pb-5 pt-6 dark:border-darkBorder">
              <View className="mr-4 flex-1">
                <Text className="text-3xl font-extrabold text-navy dark:text-cloud" numberOfLines={2}>
                  {selectedProduct?.name}
                </Text>
                <Text className="mt-1 text-base font-semibold text-muted dark:text-darkMuted">
                  {selectedProduct?.brand ?? "Shared Scan"}
                </Text>
              </View>
              <Pressable
                onPress={closeDetail}
                className="h-12 w-12 items-center justify-center rounded-full"
                style={[styles.detailCloseButton, isDark && styles.detailCloseButtonDark]}
              >
                <X size={26} color={isDark ? colors.navy : colors.muted} strokeWidth={2.6} />
              </Pressable>
            </View>

            <ScrollView
              keyboardShouldPersistTaps="handled"
              showsVerticalScrollIndicator={false}
              contentContainerStyle={[styles.detailContent, { paddingBottom: 40 + Math.max(insets.bottom, 16) }]}
            >
              {detailLoading ? (
                <View className="items-center justify-center py-14">
                  <ActivityIndicator color={colors.navy} />
                </View>
              ) : (
                <>
                  <View className="items-center justify-center rounded-3xl p-8" style={{ backgroundColor: detailTone.bg }}>
                    <Text className="text-2xl font-extrabold" style={{ color: detailTone.color }}>
                      {detailAnalysis?.score ?? "--"}
                    </Text>
                    <Text className="mt-4 text-2xl font-extrabold" style={{ color: detailTone.color }}>
                      {detailTone.label}
                    </Text>
                    <Text className="mt-1 text-base font-semibold text-muted">Safety Score</Text>
                  </View>

                  <View className="mt-5 rounded-3xl bg-card p-5 dark:bg-darkSurface" style={styles.softShadow}>
                    <View className="flex-row items-center gap-2">
                      <AlertTriangle size={26} color={detailWarnings.length > 0 ? colors.warning : colors.success} />
                      <Text className="text-2xl font-extrabold text-navy dark:text-cloud">
                        Warnings ({detailWarnings.length})
                      </Text>
                    </View>
                    {detailWarnings.length === 0 ? (
                      <View className="mt-4 flex-row items-center gap-3 rounded-2xl bg-periwinkle-soft p-4 dark:bg-darkSurfaceSoft">
                        <CheckCircle2 size={22} color={colors.success} />
                        <Text className="flex-1 font-bold text-navy dark:text-cloud">No ingredient warnings found for your profile.</Text>
                      </View>
                    ) : (
                      <View className="mt-4 gap-3">
                        {detailWarnings.map((warning, index) => {
                          const warningColor = warning.severity === "High" ? "#C0392B" : warning.severity === "Medium" ? "#E67E22" : colors.warning;
                          return (
                            <View key={`${warning.title}-${index}`} className="rounded-3xl p-4" style={{ backgroundColor: `${warningColor}18` }}>
                              <Text className="text-sm font-extrabold" style={{ color: warningColor }}>
                                {warningTypeLabel(warning.type)} · {warning.severity}
                              </Text>
                              <Text className="mt-2 text-lg font-extrabold text-navy dark:text-cloud">{warning.title}</Text>
                              <Text className="mt-2 text-sm leading-5 text-navy dark:text-cloud">{warning.message}</Text>
                              {warning.ingredientNames?.length ? (
                                <View className="mt-4 flex-row flex-wrap gap-2">
                                  {warning.ingredientNames.map((name) => (
                                    <View key={name} className="rounded-full bg-cloud px-4 py-2 dark:bg-darkSurfaceSoft">
                                      <Text className="text-sm font-bold text-navy dark:text-cloud">{formatIngredientLabel(name)}</Text>
                                    </View>
                                  ))}
                                </View>
                              ) : null}
                            </View>
                          );
                        })}
                      </View>
                    )}
                  </View>

                  <View className="mt-5 rounded-3xl bg-card p-5 dark:bg-darkSurface" style={styles.softShadow}>
                    <View className="flex-row items-center justify-between">
                      <Text className="text-2xl font-extrabold text-navy dark:text-cloud">Ingredient Analysis</Text>
                      <View className="rounded-full bg-maroon-soft px-3 py-1 dark:bg-darkSurfaceSoft">
                        <Text className="text-sm font-extrabold text-maroon dark:text-cloud">{detailWarnings.length} flagged</Text>
                      </View>
                    </View>

                    <View className="mt-4 flex-row flex-wrap gap-2">
                      {detectedIngredients.slice(0, ingredientsOpen ? detectedIngredients.length : 4).map((ingredient) => {
                        const ingredientName = formatIngredientLabel(ingredient.name);
                        const flagged = flaggedNames.has(cleanIngredientName(ingredient.name).toLowerCase());
                        return (
                          <View
                            key={ingredient.id}
                            className="rounded-full px-3 py-2"
                            style={{ backgroundColor: flagged ? "#F4D7F4" : colors.periwinkleSoft }}
                          >
                            <Text className="text-sm font-extrabold" style={{ color: flagged ? colors.maroon : colors.navy }}>
                              {flagged ? "Flagged " : ""}{ingredientName}
                            </Text>
                          </View>
                        );
                      })}
                    </View>

                    {detectedIngredients.length > 4 ? (
                      <Pressable onPress={() => setIngredientsOpen((value) => !value)} className="mt-5 flex-row items-center justify-center gap-2">
                        <ChevronDown size={20} color={colors.muted} />
                        <Text className="text-base font-extrabold text-muted dark:text-darkMuted">
                          {ingredientsOpen ? "Hide ingredient breakdown" : "View full ingredient breakdown"}
                        </Text>
                      </Pressable>
                    ) : null}
                  </View>

                  <Pressable
                    disabled={!selectedProduct || saving || detailSaved}
                    onPress={handleSaveProduct}
                    className="mt-7 h-16 flex-row items-center justify-center gap-3 rounded-3xl bg-maroon disabled:opacity-50"
                  >
                    {saving ? <ActivityIndicator color={colors.cloud} /> : <Bookmark size={24} color={colors.cloud} />}
                    <Text className="text-xl font-extrabold text-cloud">{detailSaved ? "Saved Product" : "Save Product"}</Text>
                  </Pressable>

                  <Pressable
                    disabled={!selectedProduct || addingRoutine}
                    onPress={() => setRoutinePickerOpen(true)}
                    className="mt-4 h-16 flex-row items-center justify-center gap-3 rounded-3xl border-2 border-maroon bg-transparent disabled:opacity-50"
                  >
                    {addingRoutine ? <ActivityIndicator color={colors.maroon} /> : <Plus size={24} color={colors.maroon} />}
                    <Text className="text-xl font-extrabold text-maroon">Add to Routine</Text>
                  </Pressable>
                </>
              )}
            </ScrollView>

            {routinePickerOpen ? (
              <Pressable style={styles.routineOverlay} onPress={() => setRoutinePickerOpen(false)}>
                <Pressable
                  className="rounded-3xl bg-neutral-900 p-6"
                  style={styles.actionSheet}
                  onPress={(event) => event.stopPropagation()}
                >
                  <Text className="text-2xl font-extrabold text-cloud">Add to Routine</Text>
                  <Text className="mt-3 text-lg font-semibold text-cloud/70">When do you use this product?</Text>

                  <View className="mt-6 gap-3">
                    <Pressable
                      disabled={addingRoutine}
                      onPress={() => handleAddRoutine("morning")}
                      className="h-16 flex-row items-center justify-center gap-3 rounded-full bg-white/15 disabled:opacity-50"
                    >
                      <Sun size={28} color={colors.warning} />
                      <Text className="text-2xl font-bold text-cloud">Morning</Text>
                    </Pressable>
                    <Pressable
                      disabled={addingRoutine}
                      onPress={() => handleAddRoutine("evening")}
                      className="h-16 flex-row items-center justify-center gap-3 rounded-full bg-white/15 disabled:opacity-50"
                    >
                      <Moon size={28} color={colors.periwinkle} />
                      <Text className="text-2xl font-bold text-cloud">Evening</Text>
                    </Pressable>
                    <Pressable
                      disabled={addingRoutine}
                      onPress={() => handleAddRoutine("any")}
                      className="h-16 flex-row items-center justify-center gap-3 rounded-full bg-white/15 disabled:opacity-50"
                    >
                      <Sun size={26} color={colors.warning} />
                      <Moon size={26} color={colors.periwinkle} />
                      <Text className="text-2xl font-bold text-cloud">Both</Text>
                    </Pressable>
                    <Pressable
                      disabled={addingRoutine}
                      onPress={() => setRoutinePickerOpen(false)}
                      className="h-16 items-center justify-center rounded-full bg-white/15 disabled:opacity-50"
                    >
                      <Text className="text-2xl font-bold text-cloud">Cancel</Text>
                    </Pressable>
                  </View>
                </Pressable>
              </Pressable>
            ) : null}
          </View>
        </View>
      </Modal>
    </>
  );
}

const styles = StyleSheet.create({
  actionSheet: {
    maxWidth: 420,
    width: "100%",
  },
  detailContent: {
    paddingBottom: 40,
    paddingHorizontal: 24,
    paddingTop: 24,
  },
  detailCloseButton: {
    backgroundColor: colors.periwinkleSoft,
    borderColor: colors.border,
    borderWidth: 1,
  },
  detailCloseButtonDark: {
    backgroundColor: "rgba(255, 252, 245, 0.92)",
    borderColor: "rgba(255, 252, 245, 0.82)",
    borderWidth: 1.5,
    shadowColor: colors.cloud,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.2,
    shadowRadius: 12,
  },
  detailSheet: {
    borderTopLeftRadius: 34,
    borderTopRightRadius: 34,
    maxHeight: "92%",
    overflow: "hidden",
  },
  darkLogoImage: {
    tintColor: colors.cloud,
  },
  modalBackdrop: {
    backgroundColor: "rgba(0,0,0,0.42)",
    flex: 1,
    justifyContent: "flex-end",
  },
  productCard: {
    shadowColor: "#374375",
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.04,
    shadowRadius: 12,
    elevation: 2,
  },
  softShadow: {
    shadowColor: "#374375",
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.08,
    shadowRadius: 18,
    elevation: 2,
  },
  routineOverlay: {
    ...StyleSheet.absoluteFillObject,
    alignItems: "center",
    backgroundColor: "rgba(0,0,0,0.48)",
    justifyContent: "center",
    paddingHorizontal: 34,
    zIndex: 20,
  },
});
