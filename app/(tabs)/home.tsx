import { useCallback, useEffect, useMemo, useState } from "react";
import { useFocusEffect } from "expo-router";
import {
  AlertTriangle,
  Bookmark,
  CheckCircle2,
  ChevronDown,
  Moon,
  Plus,
  Search,
  Sparkles,
  Sun,
  X,
} from "lucide-react-native";
import {
  ActivityIndicator,
  Alert,
  Image,
  Modal,
  Pressable,
  RefreshControl,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";
import { Screen } from "@/components/Screen";
import { colors } from "@/constants/theme";
import { analyseIngredients, resolveIngredientIds } from "@/lib/analysisEngine";
import { getCurrentUser } from "@/services/auth";
import { enrichAliasesFromHuggingFace } from "@/services/ingredients";
import { getSkinProfile } from "@/services/profile";
import { getProductById, getDiscoverFeed, getSavedProducts, saveProduct, searchProducts } from "@/services/products";
import { addToRoutine } from "@/services/routine";
import { getScanHistory } from "@/services/scans";
import type { AnalysisResult, Product, ScanHistoryItem, SkinProfile, User } from "@/types/domain";

type EnrichedScan = ScanHistoryItem & {
  sampleProduct?: Product;
  sampleAnalysis?: AnalysisResult;
};

const skincareTips = [
  { title: "Introduce actives one at a time.", body: "Give your skin a few days before adding another serum so reactions are easier to spot." },
  { title: "Patch-test new products first.", body: "Try a small amount near your jaw or behind your ear before using it on your whole face." },
  { title: "Use sunscreen every morning.", body: "Daily SPF helps protect your barrier and keeps brightening ingredients working properly." },
  { title: "Keep retinoids for nighttime.", body: "Retinoids can make skin more sensitive, so pair them with moisturizer and morning sunscreen." },
  { title: "Do not over-exfoliate.", body: "AHAs, BHAs, and scrubs can irritate when layered too often in the same week." },
  { title: "Hydrate before sealing.", body: "Apply humectants before heavier creams so water-binding ingredients have something to hold." },
  { title: "Fragrance can be tricky.", body: "If your skin is reactive, watch fragrance and essential oils on ingredient labels." },
  { title: "Keep routines simple during flare-ups.", body: "Cleanser, moisturizer, and sunscreen are often enough while your barrier calms down." },
  { title: "Separate strong actives.", body: "Avoid stacking too many acids, retinoids, or benzoyl peroxide in one routine." },
  { title: "Consistency beats quantity.", body: "A small routine used regularly is easier to evaluate than changing many products at once." },
];

function formatDate(date: string) {
  return new Intl.DateTimeFormat("id-ID", { day: "numeric", month: "short", year: "numeric" }).format(new Date(date));
}

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

function makeSampleScans(products: Product[], profile: SkinProfile | null): EnrichedScan[] {
  return products.slice(0, 5).map((product, index) => {
    const ingredients = resolveIngredientIds(product.ingredientIds);
    const analysis = analyseIngredients(ingredients, profile);
    const scannedAt = new Date(Date.now() - (index + 1) * 86_400_000).toISOString();

    return {
      id: `sample-${product.id}`,
      productId: product.id,
      productName: product.name,
      scanMethod: "barcode",
      score: analysis.score,
      warnings: analysis.warnings,
      scannedAt,
      sampleProduct: product,
      sampleAnalysis: analysis,
    };
  });
}

export default function HomeScreen() {
  const [user, setUser] = useState<User | null>(null);
  const [recentScans, setRecentScans] = useState<EnrichedScan[]>([]);
  const [discoverProducts, setDiscoverProducts] = useState<Product[]>([]);
  const [searchedProducts, setSearchedProducts] = useState<Product[]>([]);
  const [savedProductIds, setSavedProductIds] = useState<Set<string>>(() => new Set());
  const [discoverQuery, setDiscoverQuery] = useState("");
  const [profile, setProfile] = useState<SkinProfile | null>(null);
  const [tip] = useState(() => skincareTips[Math.floor(Math.random() * skincareTips.length)]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [selectedScan, setSelectedScan] = useState<EnrichedScan | null>(null);
  const [detailProduct, setDetailProduct] = useState<Product | null>(null);
  const [detailAnalysis, setDetailAnalysis] = useState<AnalysisResult | null>(null);
  const [detailLoading, setDetailLoading] = useState(false);
  const [ingredientsOpen, setIngredientsOpen] = useState(false);
  const [routinePickerOpen, setRoutinePickerOpen] = useState(false);
  const [saving, setSaving] = useState(false);
  const [detailSaved, setDetailSaved] = useState(false);
  const [addingRoutine, setAddingRoutine] = useState(false);
  const [searchingDiscover, setSearchingDiscover] = useState(false);

  const load = useCallback(async () => {
    try {
      const [currentUser, scans, discover, skinProfile, savedProducts] = await Promise.all([
        getCurrentUser(),
        getScanHistory(),
        getDiscoverFeed(),
        getSkinProfile(),
        getSavedProducts(),
      ]);
      const samples = makeSampleScans(discover, skinProfile);
      const seenProductIds = new Set(scans.map((scan) => scan.productId).filter(Boolean));
      const fillers = samples.filter((scan) => scan.productId && !seenProductIds.has(scan.productId));

      setUser(currentUser);
      setProfile(skinProfile);
      setRecentScans([...scans, ...fillers].slice(0, Math.max(scans.length, 5)));
      setDiscoverProducts(discover.slice(0, 12));
      setSavedProductIds(new Set(savedProducts.map((product) => product.id)));
      enrichAliasesFromHuggingFace().catch(() => {});
    } catch (error) {
      console.warn("[home]", error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  useFocusEffect(useCallback(() => { load(); }, [load]));

  useEffect(() => {
    const query = discoverQuery.trim();
    let cancelled = false;

    if (!query) {
      setSearchedProducts([]);
      setSearchingDiscover(false);
      return;
    }

    setSearchingDiscover(true);
    const timeout = setTimeout(() => {
      searchProducts(query)
        .then((products) => {
          if (!cancelled) setSearchedProducts(products);
        })
        .catch((error) => {
          console.warn("[home discover search]", error);
          if (!cancelled) setSearchedProducts([]);
        })
        .finally(() => {
          if (!cancelled) setSearchingDiscover(false);
        });
    }, 250);

    return () => {
      cancelled = true;
      clearTimeout(timeout);
    };
  }, [discoverQuery]);

  const filteredDiscover = useMemo(() => {
    const query = discoverQuery.trim().toLowerCase();
    if (!query) return discoverProducts.slice(0, 6);
    if (searchedProducts.length > 0) return searchedProducts.slice(0, 8);

    return discoverProducts.filter((product) => {
      const haystack = [
        product.name,
        product.brand,
        product.category,
        product.rawIngredientText,
      ].filter(Boolean).join(" ").toLowerCase();

      return haystack.includes(query);
    }).slice(0, 6);
  }, [discoverProducts, discoverQuery, searchedProducts]);

  const openScanDetail = useCallback(async (scan: EnrichedScan) => {
    setSelectedScan(scan);
    setDetailProduct(scan.sampleProduct ?? null);
    setDetailAnalysis(scan.sampleAnalysis ?? null);
    setDetailSaved(scan.productId ? savedProductIds.has(scan.productId) : false);
    setIngredientsOpen(false);
    setDetailLoading(true);

    try {
      const product = scan.sampleProduct ?? (scan.productId ? await getProductById(scan.productId) : null);
      const analysis = scan.sampleAnalysis ?? (product
        ? analyseIngredients(resolveIngredientIds(product.ingredientIds), profile)
        : {
            score: scan.score ?? 100,
            warnings: scan.warnings ?? [],
            detectedIngredients: [],
            safeIngredients: [],
          });

      setDetailProduct(product);
      setDetailAnalysis(analysis);
      setDetailSaved(product ? savedProductIds.has(product.id) : false);
    } catch (error) {
      console.warn("[home detail]", error);
    } finally {
      setDetailLoading(false);
    }
  }, [profile, savedProductIds]);

  const openProductDetail = useCallback((product: Product) => {
    const analysis = analyseIngredients(resolveIngredientIds(product.ingredientIds), profile);
    const scan: EnrichedScan = {
      id: `discover-${product.id}`,
      productId: product.id,
      productName: product.name,
      scanMethod: "manual",
      score: analysis.score,
      warnings: analysis.warnings,
      scannedAt: new Date().toISOString(),
      sampleProduct: product,
      sampleAnalysis: analysis,
    };

    openScanDetail(scan);
  }, [openScanDetail, profile]);

  const closeDetail = () => {
    setSelectedScan(null);
    setDetailProduct(null);
    setDetailAnalysis(null);
    setRoutinePickerOpen(false);
  };

  const handleSaveProduct = async () => {
    if (!detailProduct) return;
    setSaving(true);
    try {
      await saveProduct(detailProduct.id);
      setSavedProductIds((current) => new Set(current).add(detailProduct.id));
      setDetailSaved(true);
    } catch (error) {
      Alert.alert("Save failed", error instanceof Error ? error.message : "Please try again.");
    } finally {
      setSaving(false);
    }
  };

  const handleAddRoutine = async (timeOfDay: "morning" | "evening" | "any") => {
    if (!detailProduct) return;
    setAddingRoutine(true);
    try {
      await addToRoutine(detailProduct.id, timeOfDay);
      setRoutinePickerOpen(false);
      Alert.alert("Added", "Product added to your layering routine.");
    } catch (error) {
      Alert.alert("Add failed", error instanceof Error ? error.message : "Please try again.");
    } finally {
      setAddingRoutine(false);
    }
  };

  if (loading) {
    return (
      <Screen scroll={false}>
        <View className="flex-1 items-center justify-center">
          <ActivityIndicator color={colors.navy} />
        </View>
      </Screen>
    );
  }

  const detailTone = scoreTone(detailAnalysis?.score ?? selectedScan?.score);
  const detailWarnings = detailAnalysis?.warnings ?? selectedScan?.warnings ?? [];
  const detectedIngredients = detailAnalysis?.detectedIngredients ?? [];
  const flaggedNames = new Set(detailWarnings.flatMap((warning) => warning.ingredientNames ?? []));

  return (
    <>
      <Screen refreshControl={<RefreshControl refreshing={refreshing} onRefresh={() => { setRefreshing(true); load(); }} />}>
        <Text className="text-3xl font-extrabold text-navy dark:text-cloud">
          {user ? `Hi, ${user.name.split(" ")[0]}` : "Welcome to DermaScan"}
        </Text>
        <Text className="mt-1 text-base text-muted dark:text-darkMuted">Your skin-safe ingredient checker.</Text>

        <View className="mt-7">
          <Text className="text-lg font-bold text-navy dark:text-cloud">Discover</Text>
          <View className="mt-3 flex-row items-center rounded-3xl bg-card px-4 py-3 dark:bg-darkSurface">
            <Search size={22} color={colors.muted} />
            <TextInput
              value={discoverQuery}
              onChangeText={setDiscoverQuery}
              placeholder="Search scanned skincare or ingredients"
              placeholderTextColor={colors.muted}
              className="ml-3 flex-1 text-base font-semibold text-navy dark:text-cloud"
            />
          </View>

          {searchingDiscover ? (
            <View className="mt-4 items-start">
              <ActivityIndicator color={colors.navy} />
            </View>
          ) : filteredDiscover.length === 0 ? (
            <Text className="mt-3 text-sm text-muted dark:text-darkMuted">No shared scans found yet.</Text>
          ) : (
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerClassName="mt-4 gap-4 pr-6"
            >
              {filteredDiscover.map((product) => (
                <Pressable
                  key={product.id}
                  onPress={() => openProductDetail(product)}
                  className="w-40 rounded-3xl bg-card p-4 dark:bg-darkSurface"
                >
                  {product.image ? (
                    <Image
                      source={{ uri: product.image }}
                      className="h-20 rounded-2xl bg-peach-soft dark:bg-darkSurfaceSoft"
                      resizeMode="contain"
                    />
                  ) : (
                    <View className="h-20 items-center justify-center rounded-2xl bg-peach-soft dark:bg-darkSurfaceSoft">
                      <Sparkles size={28} color={colors.maroon} />
                    </View>
                  )}
                  <Text className="mt-4 text-xs font-bold text-muted dark:text-darkMuted">
                    {product.brand ?? product.category ?? "Shared Scan"}
                  </Text>
                  <Text className="mt-1 min-h-10 text-base font-extrabold text-navy dark:text-cloud" numberOfLines={2}>
                    {product.name}
                  </Text>
                  <Text className="mt-3 text-xs font-semibold text-muted dark:text-darkMuted">
                    {product.ingredientIds.length} ingredients
                  </Text>
                </Pressable>
              ))}
            </ScrollView>
          )}
        </View>

        <View className="mt-7 rounded-3xl bg-navy p-5 dark:bg-darkSurfaceSoft">
          <Text className="text-sm font-bold text-cloud/80">Tip of the Day</Text>
          <Text className="mt-3 text-lg font-extrabold text-cloud">{tip.title}</Text>
          <Text className="mt-3 text-sm leading-5 text-cloud/80">{tip.body}</Text>
        </View>

        <View className="mt-7">
          <Text className="text-lg font-bold text-navy dark:text-cloud">Recent Scans</Text>
          <Text className="mt-1 text-xs font-semibold text-muted dark:text-darkMuted">Tap a scan to see full details</Text>
        </View>
        {recentScans.length === 0 ? (
          <Text className="mt-3 text-sm text-muted dark:text-darkMuted">No scans yet. Tap the Scan tab to get started.</Text>
        ) : (
          <View className="mt-3 gap-4">
            {recentScans.map((scan) => {
              const tone = scoreTone(scan.score);
              const warningCount = scan.warnings?.length ?? 0;
              return (
                <Pressable
                  key={scan.id}
                  onPress={() => openScanDetail(scan)}
                  className="flex-row items-center justify-between rounded-2xl bg-card px-4 py-4 dark:bg-darkSurface"
                  style={styles.recentCard}
                >
                  <View className="mr-4 flex-1">
                    <Text className="text-base font-extrabold text-navy dark:text-cloud" numberOfLines={1}>
                      {scan.productName}
                    </Text>
                    <Text className="mt-1 text-xs font-semibold text-muted dark:text-darkMuted">
                      {formatDate(scan.scannedAt)}
                    </Text>
                    {warningCount > 0 ? (
                      <Text className="mt-2 text-xs font-bold" style={{ color: "#E67E22" }}>
                        {warningCount} warning{warningCount > 1 ? "s" : ""} - tap to view
                      </Text>
                    ) : null}
                  </View>
                  <View className="items-end">
                    <Text className="text-2xl font-extrabold" style={{ color: tone.color }}>
                      {scan.score ?? "--"}
                    </Text>
                    <Text className="mt-3 text-xs font-bold" style={{ color: tone.color }}>
                      {tone.label}
                    </Text>
                  </View>
                </Pressable>
              );
            })}
          </View>
        )}
      </Screen>

      <Modal visible={Boolean(selectedScan)} transparent animationType="slide" onRequestClose={closeDetail}>
        <View style={styles.modalBackdrop}>
          <View className="bg-cloud dark:bg-darkBackground" style={styles.detailSheet}>
            <View className="flex-row items-start justify-between border-b border-border px-6 pb-5 pt-6 dark:border-darkBorder">
              <View className="mr-4 flex-1">
                <Text className="text-3xl font-extrabold text-navy dark:text-cloud" numberOfLines={2}>
                  {selectedScan?.productName}
                </Text>
                <Text className="mt-1 text-base font-semibold text-muted dark:text-darkMuted">
                  {selectedScan ? formatDate(selectedScan.scannedAt) : ""}
                </Text>
              </View>
              <Pressable
                onPress={closeDetail}
                className="h-12 w-12 items-center justify-center rounded-full bg-periwinkle-soft dark:bg-darkSurfaceSoft"
              >
                <X size={26} color={colors.navy} />
              </Pressable>
            </View>

            <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.detailContent}>
              {detailLoading ? (
                <View className="items-center justify-center py-14">
                  <ActivityIndicator color={colors.navy} />
                </View>
              ) : (
                <>
                  <View className="items-center justify-center rounded-3xl p-8" style={{ backgroundColor: detailTone.bg }}>
                    <Text className="text-2xl font-extrabold" style={{ color: detailTone.color }}>
                      {detailAnalysis?.score ?? selectedScan?.score ?? "--"}
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
                                      <Text className="text-sm font-bold text-navy dark:text-cloud">{name}</Text>
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
                        const flagged = flaggedNames.has(ingredient.name);
                        return (
                          <View
                            key={ingredient.id}
                            className="rounded-full px-3 py-2"
                            style={{ backgroundColor: flagged ? "#F4D7F4" : colors.periwinkleSoft }}
                          >
                            <Text className="text-sm font-extrabold" style={{ color: flagged ? colors.maroon : colors.navy }}>
                              {flagged ? "Flagged " : ""}{ingredient.name}
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
                    disabled={!detailProduct || saving || detailSaved}
                    onPress={handleSaveProduct}
                    className="mt-7 h-16 flex-row items-center justify-center gap-3 rounded-3xl bg-maroon disabled:opacity-50"
                  >
                    {saving ? <ActivityIndicator color={colors.cloud} /> : <Bookmark size={24} color={colors.cloud} />}
                    <Text className="text-xl font-extrabold text-cloud">{detailSaved ? "Saved Product" : "Save Product"}</Text>
                  </Pressable>

                  <Pressable
                    disabled={!detailProduct || addingRoutine}
                    onPress={() => setRoutinePickerOpen(true)}
                    className="mt-4 h-16 flex-row items-center justify-center gap-3 rounded-3xl border-2 border-maroon bg-transparent disabled:opacity-50"
                  >
                    {addingRoutine ? <ActivityIndicator color={colors.maroon} /> : <Plus size={24} color={colors.maroon} />}
                    <Text className="text-xl font-extrabold text-maroon">Add to Routine</Text>
                  </Pressable>
                </>
              )}
            </ScrollView>
          </View>
        </View>
      </Modal>

      <Modal visible={routinePickerOpen} transparent animationType="fade" onRequestClose={() => setRoutinePickerOpen(false)}>
        <Pressable style={styles.actionBackdrop} onPress={() => setRoutinePickerOpen(false)}>
          <Pressable className="rounded-3xl bg-neutral-900 p-6" style={styles.actionSheet}>
            <Text className="text-2xl font-extrabold text-cloud">Add to Routine</Text>
            <Text className="mt-3 text-lg font-semibold text-cloud/70">When do you use this product?</Text>

            <View className="mt-6 gap-3">
              <Pressable onPress={() => handleAddRoutine("morning")} className="h-16 flex-row items-center justify-center gap-3 rounded-full bg-white/15">
                <Sun size={28} color={colors.warning} />
                <Text className="text-2xl font-bold text-cloud">Morning</Text>
              </Pressable>
              <Pressable onPress={() => handleAddRoutine("evening")} className="h-16 flex-row items-center justify-center gap-3 rounded-full bg-white/15">
                <Moon size={28} color={colors.periwinkle} />
                <Text className="text-2xl font-bold text-cloud">Evening</Text>
              </Pressable>
              <Pressable onPress={() => handleAddRoutine("any")} className="h-16 flex-row items-center justify-center gap-3 rounded-full bg-white/15">
                <Sun size={26} color={colors.warning} />
                <Moon size={26} color={colors.periwinkle} />
                <Text className="text-2xl font-bold text-cloud">Both</Text>
              </Pressable>
              <Pressable onPress={() => setRoutinePickerOpen(false)} className="h-16 items-center justify-center rounded-full bg-white/15">
                <Text className="text-2xl font-bold text-cloud">Cancel</Text>
              </Pressable>
            </View>
          </Pressable>
        </Pressable>
      </Modal>
    </>
  );
}

const styles = StyleSheet.create({
  actionBackdrop: {
    alignItems: "center",
    backgroundColor: "rgba(0,0,0,0.54)",
    flex: 1,
    justifyContent: "center",
    paddingHorizontal: 34,
  },
  actionSheet: {
    maxWidth: 420,
    width: "100%",
  },
  detailContent: {
    paddingBottom: 40,
    paddingHorizontal: 24,
    paddingTop: 24,
  },
  detailSheet: {
    borderTopLeftRadius: 34,
    borderTopRightRadius: 34,
    maxHeight: "92%",
    overflow: "hidden",
  },
  modalBackdrop: {
    backgroundColor: "rgba(0,0,0,0.42)",
    flex: 1,
    justifyContent: "flex-end",
  },
  recentCard: {
    shadowColor: "#374375",
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.08,
    shadowRadius: 18,
    elevation: 3,
  },
  softShadow: {
    shadowColor: "#374375",
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.08,
    shadowRadius: 18,
    elevation: 2,
  },
});
