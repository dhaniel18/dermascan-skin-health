import { useCallback, useRef, useMemo, useState } from "react";
import { useFocusEffect } from "expo-router";
import { ActivityIndicator, Animated, Easing, Modal, Pressable, RefreshControl, StyleSheet, Text, View } from "react-native";
import { CheckCircle2, Moon, Pencil, Sun, Trash2, XCircle } from "lucide-react-native";
import { useAppTheme } from "@/components/AppThemeProvider";
import { Screen } from "@/components/Screen";
import { SkeletonBlock } from "@/components/Skeleton";
import { colors } from "@/constants/theme";
import { addToRoutine, checkRoutineCompatibility, getUserRoutine, removeFromRoutine } from "@/services/routine";
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
        className="h-10 w-10 items-center justify-center rounded-2xl"
        style={[styles.checkButton, { backgroundColor, borderColor, transform: [{ scale }] }]}
      >
        <CheckCircle2 size={22} color={checked ? colors.success : colors.muted} strokeWidth={2.6} />
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
  const [editingRoutine, setEditingRoutine] = useState<RoutineProduct | null>(null);
  const [removingRoutine, setRemovingRoutine] = useState<RoutineProduct | null>(null);
  const [routineBusy, setRoutineBusy] = useState(false);

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

  const updateRoutineTime = async (timeOfDay: RoutineProduct["timeOfDay"]) => {
    if (!editingRoutine) return;
    setRoutineBusy(true);
    try {
      await addToRoutine(editingRoutine.productId, timeOfDay);
      setEditingRoutine(null);
      await load();
    } finally {
      setRoutineBusy(false);
    }
  };

  const deleteRoutineProduct = async () => {
    if (!removingRoutine) return;
    setRoutineBusy(true);
    try {
      await removeFromRoutine(removingRoutine.productId);
      setRemovingRoutine(null);
      await load();
    } finally {
      setRoutineBusy(false);
    }
  };

  if (loading) return (
    <Screen>
      <SkeletonBlock width="70%" height={42} radius={16} />
      <SkeletonBlock height={148} radius={24} className="mt-6" />
      <SkeletonBlock height={178} radius={24} className="mt-5" />
      <SkeletonBlock height={178} radius={24} className="mt-5" />
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
              className="flex-row items-center rounded-3xl bg-cloud px-2.5 py-2.5 dark:bg-darkSurfaceSoft"
              style={styles.routineItem}
            >
              <View className="h-9 w-9 items-center justify-center rounded-full bg-maroon">
                <Text className="text-sm font-extrabold text-cloud">{index + 1}</Text>
              </View>
              <View className="ml-3 mr-2 flex-1">
                <Text className="text-base font-extrabold text-navy dark:text-cloud" numberOfLines={1}>
                  {truncateName(product.productName)}
                </Text>
                <Text className="mt-0.5 text-xs font-semibold text-muted dark:text-darkMuted">
                  {routineLabel(product.timeOfDay)}
                </Text>
              </View>
              <Pressable
                onPress={() => setEditingRoutine(product)}
                className="h-10 w-10 items-center justify-center rounded-2xl bg-periwinkle-soft dark:bg-darkSurface"
              >
                <Pencil size={18} color={colors.navy} />
              </Pressable>
              <Pressable
                onPress={() => setRemovingRoutine(product)}
                className="ml-1.5 h-10 w-10 items-center justify-center rounded-2xl bg-maroon-soft dark:bg-darkSurface"
              >
                <Trash2 size={18} color={colors.maroon} />
              </Pressable>
              <View className="ml-1.5">
                <RoutineCheckButton />
              </View>
            </View>
          ))}
        </View>
      )}
    </View>
  );

  return (
    <>
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

      <Modal visible={Boolean(editingRoutine)} transparent animationType="fade" onRequestClose={() => setEditingRoutine(null)}>
        <Pressable style={styles.actionBackdrop} onPress={() => setEditingRoutine(null)}>
          <Pressable className="rounded-3xl bg-neutral-900 p-6" style={styles.actionSheet}>
            <Text className="text-2xl font-extrabold text-cloud">Routine Timing</Text>
            <Text className="mt-3 text-base font-semibold text-cloud/70" numberOfLines={2}>
              {editingRoutine?.productName}
            </Text>
            <View className="mt-6 gap-3">
              <Pressable disabled={routineBusy} onPress={() => updateRoutineTime("morning")} className="h-14 flex-row items-center justify-center gap-3 rounded-full bg-white/15">
                <Sun size={24} color={colors.warning} />
                <Text className="text-xl font-bold text-cloud">Morning</Text>
              </Pressable>
              <Pressable disabled={routineBusy} onPress={() => updateRoutineTime("evening")} className="h-14 flex-row items-center justify-center gap-3 rounded-full bg-white/15">
                <Moon size={24} color={colors.periwinkle} />
                <Text className="text-xl font-bold text-cloud">Evening</Text>
              </Pressable>
              <Pressable disabled={routineBusy} onPress={() => updateRoutineTime("any")} className="h-14 flex-row items-center justify-center gap-3 rounded-full bg-white/15">
                <Sun size={22} color={colors.warning} />
                <Moon size={22} color={colors.periwinkle} />
                <Text className="text-xl font-bold text-cloud">Both</Text>
              </Pressable>
            </View>
          </Pressable>
        </Pressable>
      </Modal>

      <Modal visible={Boolean(removingRoutine)} transparent animationType="fade" onRequestClose={() => setRemovingRoutine(null)}>
        <View style={styles.confirmBackdrop}>
          <View className="rounded-3xl bg-card p-6 dark:bg-darkSurface" style={styles.confirmBox}>
            <Text className="text-2xl font-extrabold text-navy dark:text-cloud">Remove from routine?</Text>
            <Text className="mt-3 text-base leading-6 text-muted dark:text-darkMuted" numberOfLines={3}>
              {removingRoutine?.productName} will be removed from your layering routine.
            </Text>
            <View className="mt-6 flex-row gap-3">
              <Pressable
                disabled={routineBusy}
                onPress={() => setRemovingRoutine(null)}
                className="h-12 flex-1 items-center justify-center rounded-2xl bg-periwinkle-soft dark:bg-darkSurfaceSoft"
              >
                <Text className="font-extrabold text-navy dark:text-cloud">Cancel</Text>
              </Pressable>
              <Pressable
                disabled={routineBusy}
                onPress={deleteRoutineProduct}
                className="h-12 flex-1 items-center justify-center rounded-2xl bg-maroon disabled:opacity-50"
              >
                {routineBusy ? <ActivityIndicator color={colors.cloud} /> : <Text className="font-extrabold text-cloud">Remove</Text>}
              </Pressable>
            </View>
          </View>
        </View>
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
  checkButton: {
    borderWidth: 1.5,
  },
  confirmBackdrop: {
    alignItems: "center",
    backgroundColor: "rgba(0,0,0,0.45)",
    flex: 1,
    justifyContent: "center",
    paddingHorizontal: 28,
  },
  confirmBox: {
    elevation: 8,
    maxWidth: 420,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 12 },
    shadowOpacity: 0.18,
    shadowRadius: 24,
    width: "100%",
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
