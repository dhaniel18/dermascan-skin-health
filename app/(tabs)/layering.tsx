import { useCallback, useRef, useMemo, useState } from "react";
import { useFocusEffect } from "expo-router";
import { ActivityIndicator, Animated, Easing, Pressable, RefreshControl, StyleSheet, Text, View } from "react-native";
import { CheckCircle2, Moon, Sun, Trash2, XCircle } from "lucide-react-native";
import { useAppTheme } from "@/components/AppThemeProvider";
import { Screen } from "@/components/Screen";
import { colors } from "@/constants/theme";
import { checkRoutineCompatibility, getUserRoutine, removeFromRoutine } from "@/services/routine";
import type { RoutineCompatibilityResult, RoutineProduct } from "@/types/domain";

const SEVERITY_COLOR = { High: "#C0392B", Medium: "#E67E22", Low: "#E1A83E" } as const;

function routineLabel(timeOfDay: RoutineProduct["timeOfDay"]) {
  if (timeOfDay === "any") return "Both";
  return timeOfDay === "morning" ? "Morning" : "Evening";
}

function truncateName(name: string) {
  return name.length > 26 ? `${name.slice(0, 25)}...` : name;
}

function RoutineCheckButton() {
  const [checked, setChecked] = useState(false);
  const progress = useRef(new Animated.Value(0)).current;

  const toggle = () => {
    const next = !checked;
    setChecked(next);
    Animated.sequence([
      Animated.timing(progress, {
        toValue: next ? 1 : 0,
        duration: 180,
        easing: Easing.out(Easing.cubic),
        useNativeDriver: false,
      }),
      Animated.spring(progress, {
        toValue: next ? 1 : 0,
        friction: 5,
        tension: 120,
        useNativeDriver: false,
      }),
    ]).start();
  };

  const backgroundColor = progress.interpolate({
    inputRange: [0, 1],
    outputRange: [colors.periwinkleSoft, "#EAF6EF"],
  });
  const borderColor = progress.interpolate({
    inputRange: [0, 1],
    outputRange: ["#D8DBEC", colors.success],
  });
  const scale = progress.interpolate({
    inputRange: [0, 0.55, 1],
    outputRange: [1, 1.08, 1],
  });

  return (
    <Pressable accessibilityRole="button" onPress={toggle} hitSlop={8}>
      <Animated.View
        className="h-11 w-11 items-center justify-center rounded-2xl"
        style={[styles.checkButton, { backgroundColor, borderColor, transform: [{ scale }] }]}
      >
        <CheckCircle2 size={23} color={checked ? colors.success : colors.muted} strokeWidth={2.6} />
      </Animated.View>
    </Pressable>
  );
}

export default function LayeringScreen() {
  const { isDark } = useAppTheme();
  const [routine, setRoutine] = useState<RoutineProduct[]>([]);
  const [compat, setCompat] = useState<RoutineCompatibilityResult | null>(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const load = useCallback(async () => {
    try {
      const [r, c] = await Promise.all([getUserRoutine(), checkRoutineCompatibility()]);
      setRoutine(r);
      setCompat(c);
    } catch (e) {
      console.warn("[layering]", e);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  useFocusEffect(useCallback(() => { load(); }, [load]));

  const morningRoutine = useMemo(
    () => routine.filter((product) => product.timeOfDay !== "evening"),
    [routine]
  );
  const eveningRoutine = useMemo(
    () => routine.filter((product) => product.timeOfDay !== "morning"),
    [routine]
  );

  const deleteRoutineProduct = async (productId: string) => {
    await removeFromRoutine(productId);
    await load();
  };

  if (loading) return (
    <Screen scroll={false}>
      <View className="flex-1 items-center justify-center">
        <ActivityIndicator color={isDark ? colors.cloud : colors.navy} />
      </View>
    </Screen>
  );

  const renderRoutineSection = (
    title: string,
    products: RoutineProduct[],
    Icon: typeof Sun,
    iconColor: string,
  ) => (
    <View className="mt-5 rounded-3xl bg-card p-5 dark:bg-darkSurface" style={styles.panel}>
      <View className="flex-row items-center justify-between">
        <View className="flex-1 flex-row items-center gap-3">
          <Icon size={24} color={iconColor} />
          <Text className="text-xl font-extrabold text-navy dark:text-cloud">{title}</Text>
        </View>
        <View className="rounded-full bg-peach-soft px-3 py-1 dark:bg-darkSurfaceSoft">
          <Text className="text-sm font-extrabold dark:text-cloud" style={!isDark ? styles.warningText : undefined}>
            {products.length} product{products.length === 1 ? "" : "s"}
          </Text>
        </View>
      </View>

      {products.length === 0 ? (
        <Text className="mt-5 text-sm font-semibold text-muted dark:text-darkMuted">
          Add products from Recent Scans to build this routine.
        </Text>
      ) : (
        <View className="mt-4 gap-3">
          {products.map((product, index) => (
            <View
              key={`${title}-${product.productId}`}
              className="flex-row items-center rounded-3xl bg-cloud px-3 py-3 dark:bg-darkSurfaceSoft"
              style={styles.routineItem}
            >
              <View className="h-10 w-10 items-center justify-center rounded-full bg-maroon">
                <Text className="text-base font-extrabold text-cloud">{index + 1}</Text>
              </View>
              <View className="ml-3 flex-1">
                <Text className="text-lg font-extrabold text-navy dark:text-cloud" numberOfLines={1}>
                  {truncateName(product.productName)}
                </Text>
                <Text className="mt-1 text-sm font-semibold text-muted dark:text-darkMuted">
                  {routineLabel(product.timeOfDay)}
                </Text>
              </View>
              <RoutineCheckButton />
              <Pressable
                onPress={() => deleteRoutineProduct(product.productId)}
                className="ml-2 h-11 w-11 items-center justify-center rounded-2xl bg-maroon-soft dark:bg-darkSurface"
              >
                <Trash2 size={20} color={colors.maroon} />
              </Pressable>
            </View>
          ))}
        </View>
      )}
    </View>
  );

  return (
    <Screen refreshControl={<RefreshControl refreshing={refreshing} onRefresh={() => { setRefreshing(true); load(); }} />}>
      <Text className="text-4xl font-extrabold text-navy dark:text-cloud">Layering Checker</Text>
      <Text className="mt-3 text-lg leading-7 text-muted dark:text-darkMuted">
        Check if your morning & evening routines are compatible.
      </Text>

      {renderRoutineSection("Morning Routine", morningRoutine, Sun, colors.warning)}
      {renderRoutineSection("Evening Routine", eveningRoutine, Moon, isDark ? colors.cloud : colors.navy)}

      {compat && (
        <View className="mt-5 rounded-3xl bg-card p-5 dark:bg-darkSurface" style={styles.panel}>
          <Text className="text-xl font-extrabold text-navy dark:text-cloud">Compatibility Check</Text>
          <Text className="mt-4 text-base text-muted dark:text-darkMuted">
            {compat.conflicts.length} conflict{compat.conflicts.length === 1 ? "" : "s"} found:
          </Text>

          {compat.conflicts.length === 0 ? (
            <View className="mt-4 flex-row items-center gap-3 rounded-3xl bg-periwinkle-soft p-4 dark:bg-darkSurfaceSoft">
              <CheckCircle2 size={24} color={colors.success} />
              <Text className="flex-1 text-sm font-bold text-navy dark:text-cloud">All products are compatible.</Text>
            </View>
          ) : (
            <View className="mt-4 gap-4">
              {compat.conflicts.map((conflict, index) => {
                const color = SEVERITY_COLOR[conflict.warning.severity];
                return (
                  <View key={`${conflict.warning.ruleId}-${index}`} className="rounded-3xl p-5" style={{ backgroundColor: `${color}14` }}>
                    <View className="flex-row items-center gap-2">
                      <XCircle size={21} color={color} />
                      <Text className="text-lg font-extrabold" style={{ color }}>{conflict.warning.title}</Text>
                    </View>
                    <Text className="mt-3 text-sm leading-5 text-muted dark:text-darkMuted">
                      {conflict.product1Name} x {conflict.product2Name}
                    </Text>
                    <Text className="mt-3 text-base leading-6 text-navy dark:text-cloud">
                      {conflict.warning.message}
                    </Text>
                  </View>
                );
              })}
            </View>
          )}
        </View>
      )}

      {compat && compat.morningOrder.length > 0 && (
        <View className="mt-5 rounded-3xl bg-card p-5 dark:bg-darkSurface" style={styles.panel}>
          <View className="flex-row items-center gap-3">
            <Sun size={22} color={colors.warning} />
            <Text className="flex-1 text-lg font-extrabold leading-6 text-navy dark:text-cloud">
              Recommended Morning Order
            </Text>
          </View>
          <View className="mt-4 gap-3">
            {compat.morningOrder.map((name, index) => (
              <View key={`${name}-${index}`} className="flex-row items-center gap-4">
                <View className="h-8 w-8 items-center justify-center rounded-full bg-periwinkle-soft dark:bg-darkSurfaceSoft">
                  <Text className="text-sm font-extrabold text-navy dark:text-cloud">{index + 1}</Text>
                </View>
                <Text className="flex-1 text-base text-navy dark:text-cloud" numberOfLines={2}>{name}</Text>
              </View>
            ))}
          </View>
        </View>
      )}

      {compat && compat.eveningOrder.length > 0 && (
        <View className="mt-5 rounded-3xl bg-card p-5 dark:bg-darkSurface" style={styles.panel}>
          <View className="flex-row items-center gap-3">
            <Moon size={22} color={isDark ? colors.cloud : colors.navy} />
            <Text className="flex-1 text-lg font-extrabold leading-6 text-navy dark:text-cloud">
              Recommended Evening Order
            </Text>
          </View>
          <View className="mt-4 gap-3">
            {compat.eveningOrder.map((name, index) => (
              <View key={`${name}-${index}`} className="flex-row items-center gap-4">
                <View className="h-8 w-8 items-center justify-center rounded-full bg-periwinkle-soft dark:bg-darkSurfaceSoft">
                  <Text className="text-sm font-extrabold text-navy dark:text-cloud">{index + 1}</Text>
                </View>
                <Text className="flex-1 text-base text-navy dark:text-cloud" numberOfLines={2}>{name}</Text>
              </View>
            ))}
          </View>
        </View>
      )}
    </Screen>
  );
}

const styles = StyleSheet.create({
  checkButton: {
    borderWidth: 1.5,
  },
  panel: {
    shadowColor: "#374375",
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.08,
    shadowRadius: 20,
    elevation: 3,
  },
  routineItem: {
    shadowColor: "#374375",
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.05,
    shadowRadius: 14,
    elevation: 1,
  },
  warningText: {
    color: colors.warning,
  },
});
