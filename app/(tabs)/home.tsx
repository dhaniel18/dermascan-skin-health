import { useCallback, useEffect, useState } from "react";
import { ActivityIndicator, RefreshControl, Text, View } from "react-native";
import { Screen } from "@/components/Screen";
import { colors } from "@/constants/theme";
import { getCurrentUser } from "@/services/auth";
import { getSkinProfile } from "@/services/profile";
import { getScanHistory } from "@/services/scans";
import { searchProducts } from "@/services/products";
import { enrichAliasesFromHuggingFace } from "@/services/ingredients";
import type { Product, ScanHistoryItem, User } from "@/types/domain";

export default function HomeScreen() {
  const [user, setUser] = useState<User | null>(null);
  const [recentScans, setRecentScans] = useState<ScanHistoryItem[]>([]);
  const [recommended, setRecommended] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const load = useCallback(async () => {
    try {
      const [u, scans] = await Promise.all([getCurrentUser(), getScanHistory()]);
      setUser(u);
      setRecentScans(scans.slice(0, 5));
      const profile = await getSkinProfile();
      const concern = profile?.concerns?.[0] ?? "serum";
      const recs = await searchProducts(concern);
      setRecommended(recs.slice(0, 4));
      enrichAliasesFromHuggingFace().catch(() => {});
    } catch (e) { console.warn("[home]", e); }
    finally { setLoading(false); setRefreshing(false); }
  }, []);

  useEffect(() => { load(); }, [load]);

  const scoreColor = (s?: number) => !s ? colors.muted : s >= 80 ? colors.success : s >= 50 ? "#E67E22" : "#C0392B";

  if (loading) return (
    <Screen scroll={false}>
      <View className="flex-1 items-center justify-center">
        <ActivityIndicator color={colors.navy} />
      </View>
    </Screen>
  );

  return (
    <Screen refreshControl={<RefreshControl refreshing={refreshing} onRefresh={() => { setRefreshing(true); load(); }} />}>
      <Text className="text-3xl font-extrabold text-navy dark:text-cloud">
        {user ? `Hi, ${user.name.split(" ")[0]} 👋` : "Welcome to DermaScan"}
      </Text>
      <Text className="mt-1 text-base text-muted dark:text-darkMuted">Your skin-safe ingredient checker.</Text>

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

      {recommended.length > 0 && (
        <>
          <Text className="mt-7 text-lg font-bold text-navy dark:text-cloud">Recommended For You</Text>
          <View className="mt-3 gap-3">
            {recommended.map((p) => (
              <View key={p.id} className="flex-row items-center justify-between rounded-2xl bg-card px-4 py-3 dark:bg-darkSurface">
                <Text className="font-semibold text-navy dark:text-cloud">{p.name}</Text>
                {p.score !== undefined && (
                  <Text className="text-sm font-bold" style={{ color: scoreColor(p.score) }}>{p.score}</Text>
                )}
              </View>
            ))}
          </View>
        </>
      )}
    </Screen>
  );
}
