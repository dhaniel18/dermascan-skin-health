// ============================================================
// DermaScan — Layering Screen
// Morning & evening cards separated, editable time-of-day,
// compatibility results per card.
// ============================================================
import { useCallback, useEffect, useState } from "react";
import {
  ActivityIndicator, Alert, RefreshControl,
  Text, TouchableOpacity, View,
} from "react-native";
import {
  CheckCircle2, Moon, Pencil, Plus,
  Sun, Trash2, XCircle,
} from "lucide-react-native";
import { useAppTheme } from "@/components/AppThemeProvider";
import { Screen } from "@/components/Screen";
import { colors } from "@/constants/theme";
import {
  getUserRoutine, removeFromRoutine,
  checkRoutineCompatibility, addToRoutine,
} from "@/services/routine";
import type { RoutineCompatibilityResult, RoutineProduct } from "@/types/domain";

const SEV = { High: "#C0392B", Medium: "#E67E22", Low: "#F1C40F" } as const;

// ── Routine product row ───────────────────────────────────────
function RoutineRow({
  product,
  stepNumber,
  onDelete,
  onEdit,
}: {
  product: RoutineProduct;
  stepNumber: number;
  onDelete: () => void;
  onEdit: () => void;
}) {
  return (
    <View className="flex-row items-center justify-between rounded-2xl bg-cloud px-4 py-3 dark:bg-darkSurfaceSoft">
      {/* Step number badge */}
      <View
        className="w-7 h-7 rounded-full items-center justify-center mr-3"
        style={{ backgroundColor: colors.maroon }}
      >
        <Text style={{ fontSize: 12, fontWeight: "800", color: colors.cloud }}>
          {stepNumber}
        </Text>
      </View>
      <View className="flex-1">
        <Text className="font-semibold text-navy dark:text-cloud" numberOfLines={1}>
          {product.productName}
        </Text>
        <Text className="text-xs capitalize text-muted dark:text-darkMuted mt-0.5">
          {product.timeOfDay === "any" ? "Morning & Evening" : product.timeOfDay}
        </Text>
      </View>
      <View className="flex-row gap-2 ml-2">
        <TouchableOpacity
          onPress={onEdit}
          className="p-2 rounded-xl bg-periwinkle-soft dark:bg-darkSurface"
        >
          <Pencil size={14} color={colors.navy} />
        </TouchableOpacity>
        <TouchableOpacity
          onPress={onDelete}
          className="p-2 rounded-xl bg-peach-soft dark:bg-darkSurface"
        >
          <Trash2 size={14} color={colors.maroon} />
        </TouchableOpacity>
      </View>
    </View>
  );
}

// ── Routine card (morning or evening) ────────────────────────
function RoutineCard({
  title,
  icon,
  products,
  accentColor,
  onDelete,
  onEdit,
}: {
  title: string;
  icon: React.ReactNode;
  products: RoutineProduct[];
  accentColor: string;
  onDelete: (id: string) => void;
  onEdit: (product: RoutineProduct) => void;
}) {
  return (
    <View className="rounded-3xl bg-card p-5 dark:bg-darkSurface">
      {/* Card header */}
      <View className="flex-row items-center gap-2 mb-4">
        {icon}
        <Text className="text-lg font-bold text-navy dark:text-cloud">{title}</Text>
        <View
          className="ml-auto rounded-full px-2 py-0.5"
          style={{ backgroundColor: accentColor + "22" }}
        >
          <Text className="text-xs font-bold" style={{ color: accentColor }}>
            {products.length} product{products.length !== 1 ? "s" : ""}
          </Text>
        </View>
      </View>

      {products.length === 0 ? (
        <Text className="text-sm text-muted dark:text-darkMuted">
          No products yet. Scan a product and add it to your routine.
        </Text>
      ) : (
        <View className="gap-2">
          {products.map((p, index) => (
            <RoutineRow
              key={p.productId}
              product={p}
              stepNumber={index + 1}
              onDelete={() => onDelete(p.productId)}
              onEdit={() => onEdit(p)}
            />
          ))}
        </View>
      )}
    </View>
  );
}

// ── Compatibility conflict card ───────────────────────────────
function ConflictCard({ conflict }: { conflict: RoutineCompatibilityResult["conflicts"][0] }) {
  const sev = conflict.warning.severity as keyof typeof SEV;
  return (
    <View className="rounded-2xl p-4" style={{ backgroundColor: SEV[sev] + "18" }}>
      <View className="flex-row items-center gap-2 mb-1">
        <XCircle size={14} color={SEV[sev]} />
        <Text className="font-bold text-sm" style={{ color: SEV[sev] }}>
          {conflict.warning.title}
        </Text>
      </View>
      <Text className="text-xs text-muted dark:text-darkMuted mb-1">
        {conflict.product1Name} × {conflict.product2Name}
      </Text>
      <Text className="text-sm text-navy dark:text-cloud">
        {conflict.warning.message}
      </Text>
    </View>
  );
}

// ── Main Screen ───────────────────────────────────────────────
export default function LayeringScreen() {
  const { isDark } = useAppTheme();
  const [routine, setRoutine] = useState<RoutineProduct[]>([]);
  const [compat, setCompat] = useState<RoutineCompatibilityResult | null>(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const load = useCallback(async () => {
    try {
      const [r, c] = await Promise.all([
        getUserRoutine(),
        checkRoutineCompatibility(),
      ]);
      setRoutine(r);
      setCompat(c);
    } catch (e) { console.warn("[layering]", e); }
    finally { setLoading(false); setRefreshing(false); }
  }, []);

  useEffect(() => { load(); }, [load]);

  const handleDelete = (productId: string, name: string) => {
    Alert.alert(
      "Remove from Routine",
      `Remove "${name}" from your routine?`,
      [
        {
          text: "Remove",
          style: "destructive",
          onPress: async () => {
            await removeFromRoutine(productId);
            load();
          },
        },
        { text: "Cancel", style: "cancel" },
      ]
    );
  };

  const handleEdit = (product: RoutineProduct) => {
    Alert.alert(
      "Change Time of Day",
      `When do you use "${product.productName}"?`,
      [
        {
          text: "☀️ Morning",
          onPress: async () => {
            await addToRoutine(product.productId, "morning");
            load();
          },
        },
        {
          text: "🌙 Evening",
          onPress: async () => {
            await addToRoutine(product.productId, "evening");
            load();
          },
        },
        {
          text: "☀️🌙 Both",
          onPress: async () => {
            await addToRoutine(product.productId, "any");
            load();
          },
        },
        { text: "Cancel", style: "cancel" },
      ]
    );
  };

  // Split by time of day
  const morning = routine.filter((p) => p.timeOfDay === "morning" || p.timeOfDay === "any");
  const evening = routine.filter((p) => p.timeOfDay === "evening" || p.timeOfDay === "any");

  if (loading) return (
    <Screen scroll={false}>
      <View className="flex-1 items-center justify-center">
        <ActivityIndicator color={isDark ? colors.cloud : colors.navy} />
      </View>
    </Screen>
  );

  return (
    <Screen
      refreshControl={
        <RefreshControl
          refreshing={refreshing}
          onRefresh={() => { setRefreshing(true); load(); }}
        />
      }
    >
      <Text className="text-3xl font-extrabold text-navy dark:text-cloud">
        Layering Checker
      </Text>
      <Text className="mt-1 text-base text-muted dark:text-darkMuted">
        Check if your morning & evening routines are compatible.
      </Text>

      {/* Morning card */}
      <View className="mt-6">
        <RoutineCard
          title="Morning Routine"
          icon={<Sun size={20} color={colors.warning} />}
          products={morning}
          accentColor={colors.warning}
          onDelete={(id) => {
            const p = routine.find((r) => r.productId === id);
            if (p) handleDelete(id, p.productName);
          }}
          onEdit={handleEdit}
        />
      </View>

      {/* Evening card */}
      <View className="mt-4">
        <RoutineCard
          title="Evening Routine"
          icon={<Moon size={20} color={isDark ? colors.peach : colors.navy} />}
          products={evening}
          accentColor={isDark ? colors.peach : colors.navy}
          onDelete={(id) => {
            const p = routine.find((r) => r.productId === id);
            if (p) handleDelete(id, p.productName);
          }}
          onEdit={handleEdit}
        />
      </View>

      {/* Compatibility results */}
      {compat && routine.length > 1 && (
        <View className="mt-5 rounded-3xl bg-card p-5 dark:bg-darkSurface">
          <Text className="text-lg font-bold text-navy dark:text-cloud mb-3">
            Compatibility Check
          </Text>
          {compat.conflicts.length === 0 ? (
            <View className="flex-row items-center gap-3 rounded-2xl bg-periwinkle-soft p-4 dark:bg-darkSurfaceSoft">
              <CheckCircle2 size={22} color={colors.success} />
              <View>
                <Text className="font-bold text-navy dark:text-cloud">All clear ✓</Text>
                <Text className="text-xs text-muted dark:text-darkMuted mt-0.5">
                  No dangerous combinations found
                </Text>
              </View>
            </View>
          ) : (
            <View className="gap-3">
              <Text className="text-sm text-muted dark:text-darkMuted">
                {compat.conflicts.length} conflict{compat.conflicts.length > 1 ? "s" : ""} found:
              </Text>
              {compat.conflicts.map((c, i) => (
                <ConflictCard key={i} conflict={c} />
              ))}
            </View>
          )}
        </View>
      )}

      {/* Recommended application order */}
      {compat && routine.length > 0 && (
        <View className="mt-4 gap-4">
          {compat.morningOrder.length > 1 && (
            <View className="rounded-3xl bg-card p-5 dark:bg-darkSurface">
              <View className="flex-row items-center gap-2 mb-3">
                <Sun size={16} color={colors.warning} />
                <Text className="font-bold text-navy dark:text-cloud">
                  Recommended Morning Order
                </Text>
              </View>
              {compat.morningOrder.map((name, i) => (
                <View key={i} className="flex-row items-center gap-3 py-1.5">
                  <View className="w-6 h-6 rounded-full bg-periwinkle-soft items-center justify-center dark:bg-darkSurfaceSoft">
                    <Text className="text-xs font-bold text-navy dark:text-cloud">{i + 1}</Text>
                  </View>
                  <Text className="text-sm text-navy dark:text-cloud">{name}</Text>
                </View>
              ))}
            </View>
          )}
          {compat.eveningOrder.length > 1 && (
            <View className="rounded-3xl bg-card p-5 dark:bg-darkSurface">
              <View className="flex-row items-center gap-2 mb-3">
                <Moon size={16} color={isDark ? colors.peach : colors.navy} />
                <Text className="font-bold text-navy dark:text-cloud">
                  Recommended Evening Order
                </Text>
              </View>
              {compat.eveningOrder.map((name, i) => (
                <View key={i} className="flex-row items-center gap-3 py-1.5">
                  <View className="w-6 h-6 rounded-full bg-periwinkle-soft items-center justify-center dark:bg-darkSurfaceSoft">
                    <Text className="text-xs font-bold text-navy dark:text-cloud">{i + 1}</Text>
                  </View>
                  <Text className="text-sm text-navy dark:text-cloud">{name}</Text>
                </View>
              ))}
            </View>
          )}
        </View>
      )}
    </Screen>
  );
}
