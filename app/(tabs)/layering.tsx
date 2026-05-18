import { useCallback, useEffect, useState } from "react";
import { ActivityIndicator, RefreshControl, Text, TouchableOpacity, View } from "react-native";
import { CheckCircle2, Moon, Sun, XCircle } from "lucide-react-native";
import { useAppTheme } from "@/components/AppThemeProvider";
import { Screen } from "@/components/Screen";
import { colors } from "@/constants/theme";
import { getUserRoutine, removeFromRoutine, checkRoutineCompatibility } from "@/services/routine";
import type { RoutineCompatibilityResult, RoutineProduct } from "@/types/domain";

const SEV = { High: "#C0392B", Medium: "#E67E22", Low: "#F1C40F" } as const;

export default function LayeringScreen() {
  const { isDark } = useAppTheme();
  const [routine, setRoutine] = useState<RoutineProduct[]>([]);
  const [compat, setCompat] = useState<RoutineCompatibilityResult | null>(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const load = useCallback(async () => {
    try {
      const [r, c] = await Promise.all([getUserRoutine(), checkRoutineCompatibility()]);
      setRoutine(r); setCompat(c);
    } catch (e) { console.warn("[layering]", e); }
    finally { setLoading(false); setRefreshing(false); }
  }, []);

  useEffect(() => { load(); }, [load]);

  if (loading) return (
    <Screen scroll={false}>
      <View className="flex-1 items-center justify-center">
        <ActivityIndicator color={isDark ? colors.cloud : colors.navy} />
      </View>
    </Screen>
  );

  return (
    <Screen refreshControl={<RefreshControl refreshing={refreshing} onRefresh={() => { setRefreshing(true); load(); }} />}>
      <Text className="text-3xl font-extrabold text-navy dark:text-cloud">Layering Checker</Text>
      <Text className="mt-2 text-base text-muted dark:text-darkMuted">Check if your routine products are compatible.</Text>

      <View className="mt-6 rounded-3xl bg-card p-5 dark:bg-darkSurface">
        <Text className="text-lg font-bold text-navy dark:text-cloud">Your Routine ({routine.length} products)</Text>
        {routine.length === 0 ? (
          <Text className="mt-3 text-sm text-muted dark:text-darkMuted">No products added. Scan a product and add it to your routine.</Text>
        ) : (
          <View className="mt-4 gap-3">
            {routine.map((p) => (
              <TouchableOpacity key={p.productId} onPress={() => removeFromRoutine(p.productId).then(load)}
                className="flex-row items-center justify-between rounded-2xl bg-peach-soft px-4 py-3 dark:bg-darkSurfaceSoft">
                <View className="flex-1">
                  <Text className="font-semibold text-navy dark:text-cloud">{p.productName}</Text>
                  <Text className="text-xs capitalize text-muted dark:text-darkMuted">{p.timeOfDay}</Text>
                </View>
                <XCircle size={18} color={colors.maroon} />
              </TouchableOpacity>
            ))}
          </View>
        )}
      </View>

      {compat && (
        <View className="mt-5 rounded-3xl bg-card p-5 dark:bg-darkSurface">
          <Text className="text-lg font-bold text-navy dark:text-cloud">Compatibility Results</Text>
          {compat.conflicts.length === 0 ? (
            <View className="mt-4 flex-row items-center gap-3 rounded-2xl bg-periwinkle-soft p-4 dark:bg-darkSurfaceSoft">
              <CheckCircle2 size={22} color={colors.success} />
              <Text className="font-bold text-navy dark:text-cloud">All products are compatible ✓</Text>
            </View>
          ) : (
            <View className="mt-4 gap-3">
              {compat.conflicts.map((c, i) => (
                <View key={i} className="rounded-2xl p-4" style={{ backgroundColor: SEV[c.warning.severity as keyof typeof SEV] + "22" }}>
                  <View className="flex-row items-center gap-2">
                    <XCircle size={18} color={SEV[c.warning.severity as keyof typeof SEV]} />
                    <Text className="font-bold" style={{ color: SEV[c.warning.severity as keyof typeof SEV] }}>{c.warning.title}</Text>
                  </View>
                  <Text className="mt-1 text-xs text-muted dark:text-darkMuted">{c.product1Name} × {c.product2Name}</Text>
                  <Text className="mt-1 text-sm text-navy dark:text-cloud">{c.warning.message}</Text>
                </View>
              ))}
            </View>
          )}
        </View>
      )}

      {compat && (compat.morningOrder.length > 0 || compat.eveningOrder.length > 0) && (
        <View className="mt-5 rounded-3xl bg-card p-5 dark:bg-darkSurface">
          <Text className="mb-3 text-lg font-bold text-navy dark:text-cloud">Recommended Application Order</Text>
          {compat.morningOrder.length > 0 && (
            <>
              <View className="flex-row items-center gap-2 mb-2"><Sun size={16} color={colors.warning} /><Text className="font-bold text-navy dark:text-cloud">Morning</Text></View>
              {compat.morningOrder.map((n, i) => <Text key={i} className="text-sm text-muted dark:text-darkMuted ml-6">{i + 1}. {n}</Text>)}
            </>
          )}
          {compat.eveningOrder.length > 0 && (
            <>
              <View className="flex-row items-center gap-2 mt-4 mb-2"><Moon size={16} color={isDark ? colors.cloud : colors.navy} /><Text className="font-bold text-navy dark:text-cloud">Evening</Text></View>
              {compat.eveningOrder.map((n, i) => <Text key={i} className="text-sm text-muted dark:text-darkMuted ml-6">{i + 1}. {n}</Text>)}
            </>
          )}
        </View>
      )}
    </Screen>
  );
}
