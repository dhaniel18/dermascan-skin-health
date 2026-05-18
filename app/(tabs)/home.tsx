import { useCallback, useMemo, useState } from "react";
import { useFocusEffect } from "expo-router";
import { Search, Sparkles } from "lucide-react-native";
import { ActivityIndicator, Image, RefreshControl, ScrollView, Text, TextInput, View } from "react-native";
import { Screen } from "@/components/Screen";
import { colors } from "@/constants/theme";
import { getCurrentUser } from "@/services/auth";
import { getDiscoverFeed } from "@/services/products";
import { getScanHistory } from "@/services/scans";
import { enrichAliasesFromHuggingFace } from "@/services/ingredients";
import type { Product, ScanHistoryItem, User } from "@/types/domain";

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

export default function HomeScreen() {
  const [user, setUser] = useState<User | null>(null);
  const [recentScans, setRecentScans] = useState<ScanHistoryItem[]>([]);
  const [discoverProducts, setDiscoverProducts] = useState<Product[]>([]);
  const [discoverQuery, setDiscoverQuery] = useState("");
  const [tip] = useState(() => skincareTips[Math.floor(Math.random() * skincareTips.length)]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const load = useCallback(async () => {
    try {
      const [currentUser, scans, discover] = await Promise.all([
        getCurrentUser(),
        getScanHistory(),
        getDiscoverFeed(),
      ]);

      setUser(currentUser);
      setRecentScans(scans.slice(0, 5));
      setDiscoverProducts(discover.slice(0, 12));
      enrichAliasesFromHuggingFace().catch(() => {});
    } catch (error) {
      console.warn("[home]", error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  useFocusEffect(useCallback(() => { load(); }, [load]));

  const filteredDiscover = useMemo(() => {
    const query = discoverQuery.trim().toLowerCase();
    if (!query) return discoverProducts.slice(0, 6);

    return discoverProducts.filter((product) => {
      const haystack = [
        product.name,
        product.brand,
        product.category,
        product.rawIngredientText,
      ].filter(Boolean).join(" ").toLowerCase();

      return haystack.includes(query);
    }).slice(0, 6);
  }, [discoverProducts, discoverQuery]);

  const scoreColor = (score?: number) => {
    if (!score) return colors.muted;
    if (score >= 80) return colors.success;
    if (score >= 50) return "#E67E22";
    return "#C0392B";
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

  return (
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

        {filteredDiscover.length === 0 ? (
          <Text className="mt-3 text-sm text-muted dark:text-darkMuted">No shared scans found yet.</Text>
        ) : (
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerClassName="mt-4 gap-4 pr-6"
          >
            {filteredDiscover.map((product) => (
              <View key={product.id} className="w-40 rounded-3xl bg-card p-4 dark:bg-darkSurface">
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
              </View>
            ))}
          </ScrollView>
        )}
      </View>

      <View className="mt-7 rounded-3xl bg-navy p-5 dark:bg-darkSurfaceSoft">
        <Text className="text-sm font-bold text-cloud/80">Tip of the Day</Text>
        <Text className="mt-3 text-lg font-extrabold text-cloud">{tip.title}</Text>
        <Text className="mt-3 text-sm leading-5 text-cloud/80">{tip.body}</Text>
      </View>

      <Text className="mt-7 text-lg font-bold text-navy dark:text-cloud">Recent Scans</Text>
      {recentScans.length === 0 ? (
        <Text className="mt-3 text-sm text-muted dark:text-darkMuted">No scans yet. Tap the Scan tab to get started.</Text>
      ) : (
        <View className="mt-3 gap-3">
          {recentScans.map((scan) => (
            <View key={scan.id} className="flex-row items-center justify-between rounded-2xl bg-card px-4 py-3 dark:bg-darkSurface">
              <View className="flex-1">
                <Text className="font-semibold text-navy dark:text-cloud">{scan.productName}</Text>
                <Text className="text-xs text-muted dark:text-darkMuted">{new Date(scan.scannedAt).toLocaleDateString()}</Text>
              </View>
              {scan.score !== undefined && (
                <Text className="text-lg font-extrabold" style={{ color: scoreColor(scan.score) }}>{scan.score}</Text>
              )}
            </View>
          ))}
        </View>
      )}
    </Screen>
  );
}
