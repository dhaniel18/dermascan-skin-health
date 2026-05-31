import { router, useFocusEffect } from "expo-router";
import { ChevronRight, Clock, LogOut, Moon, Save, Settings, ShieldCheck } from "lucide-react-native";
import { useCallback, useMemo, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  KeyboardAvoidingView,
  Modal,
  Platform,
  Pressable,
  RefreshControl,
  ScrollView,
  StyleSheet,
  Image,
  Text,
  TextInput,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useAppTheme } from "@/components/AppThemeProvider";
import { Screen } from "@/components/Screen";
import { ProfileSkeleton } from "@/components/Skeleton";
import { skinConditions, skinConcerns, skinTypes } from "@/constants/options";
import { colors } from "@/constants/theme";
import { analyseIngredients, parseIngredientTextWithAI, resolveIngredientIds } from "@/lib/analysisEngine";
import { getCurrentUser, signOut, updateDisplayName } from "@/services/auth";
import { getSkinProfile, saveSkinProfile } from "@/services/profile";
import { getDiscoverFeed, getProductById } from "@/services/products";
import { getScanHistory } from "@/services/scans";
import type { Product, ScanHistoryItem, SkinProfile, User } from "@/types/domain";

const skinTypeLabels = new Map(skinTypes.map((item) => [item.id, item.title]));
const conditionLabels = new Map(skinConditions.map((item) => [item.id, item.title]));
const concernLabels = new Map(skinConcerns.map((item) => [item.id, item.title]));
const logoSource = require("@/assets/images/dermascan-logo.png");

function formatDate(date: string) {
  return new Intl.DateTimeFormat("id-ID", { day: "numeric", month: "short", year: "numeric" }).format(new Date(date));
}

function scoreColor(score?: number) {
  if (score === undefined) return colors.muted;
  if (score >= 80) return colors.success;
  if (score >= 50) return "#E67E22";
  return "#C0392B";
}

function makeSampleScans(products: Product[], profile: SkinProfile | null): ScanHistoryItem[] {
  return products.slice(0, 5).map((product, index) => {
    const analysis = analyseIngredients(resolveIngredientIds(product.ingredientIds), profile);
    return {
      id: `profile-sample-${product.id}`,
      productId: product.id,
      productName: product.name,
      score: analysis.score,
      warnings: analysis.warnings,
      scanMethod: "barcode",
      scannedAt: new Date(Date.now() - (index + 1) * 86_400_000).toISOString(),
    };
  });
}

async function analyseProductScore(product: Product, profile: SkinProfile | null) {
  let ingredients = resolveIngredientIds(product.ingredientIds);

  if (product.rawIngredientText && (ingredients.length === 0 || ingredients.length < product.ingredientIds.length)) {
    const parsed = await parseIngredientTextWithAI(product.rawIngredientText);
    if (parsed.ingredients.length > ingredients.length) ingredients = parsed.ingredients;
  }

  return analyseIngredients(ingredients, profile);
}

export default function ProfileScreen() {
  const insets = useSafeAreaInsets();
  const [user, setUser] = useState<User | null>(null);
  const [skinProfile, setSkinProfile] = useState<SkinProfile | null>(null);
  const [scanHistory, setScanHistory] = useState<ScanHistoryItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [editing, setEditing] = useState(false);
  const [saving, setSaving] = useState(false);
  const [draftName, setDraftName] = useState("");
  const [draftSkinType, setDraftSkinType] = useState<string | null>(null);
  const [draftConditions, setDraftConditions] = useState<string[]>([]);
  const [draftConcerns, setDraftConcerns] = useState<string[]>([]);
  const { isDark, toggleTheme } = useAppTheme();

  const load = useCallback(async () => {
    try {
      const [currentUser, profile, history, discover] = await Promise.all([
        getCurrentUser(),
        getSkinProfile(),
        getScanHistory(),
        getDiscoverFeed(),
      ]);
      const discoverById = new Map(discover.map((product) => [product.id, product]));
      const updatedHistory = await Promise.all(history.map(async (scan) => {
        if (!scan.productId) return scan;

        const product = discoverById.get(scan.productId) ?? await getProductById(scan.productId);
        if (!product) return scan;

        const analysis = await analyseProductScore(product, profile);
        return {
          ...scan,
          productName: product.name,
          score: analysis.score,
          warnings: analysis.warnings,
        };
      }));
      const seen = new Set(updatedHistory.map((scan) => scan.productId).filter(Boolean));
      const fillers = makeSampleScans(discover, profile).filter((scan) => scan.productId && !seen.has(scan.productId));

      setUser(currentUser);
      setSkinProfile(profile);
      setScanHistory([...updatedHistory, ...fillers].slice(0, 5));
    } catch (error) {
      console.warn("[profile]", error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  useFocusEffect(useCallback(() => { load(); }, [load]));

  const tags = useMemo(() => [
    ...(skinProfile?.skinType ? [{ id: `t-${skinProfile.skinType}`, label: skinTypeLabels.get(skinProfile.skinType) ?? skinProfile.skinType }] : []),
    ...(skinProfile?.conditions.map((id) => ({ id: `c-${id}`, label: conditionLabels.get(id) ?? id })) ?? []),
  ], [skinProfile]);

  const concernsText = useMemo(() => {
    const labels = skinProfile?.concerns.map((id) => concernLabels.get(id) ?? id) ?? [];
    return labels.length > 0 ? labels.join(", ") : "No concerns selected";
  }, [skinProfile]);

  const openEdit = () => {
    setDraftName(user?.name ?? "");
    setDraftSkinType(skinProfile?.skinType ?? null);
    setDraftConditions(skinProfile?.conditions ?? []);
    setDraftConcerns(skinProfile?.concerns ?? []);
    setEditing(true);
  };

  const toggleListValue = (values: string[], setValues: (next: string[]) => void, id: string) => {
    setValues(values.includes(id) ? values.filter((value) => value !== id) : [...values, id]);
  };

  const saveProfile = async () => {
    if (!draftSkinType) {
      Alert.alert("Skin type required", "Choose your skin type before saving.");
      return;
    }

    setSaving(true);
    try {
      const nextProfile = {
        skinType: draftSkinType,
        conditions: draftConditions,
        concerns: draftConcerns,
      };
      const nextUser = await updateDisplayName(draftName.trim() || user?.name || "Derma User");
      const savedProfile = await saveSkinProfile(nextProfile);

      if (nextUser) setUser(nextUser);
      setSkinProfile(savedProfile);
      setEditing(false);
      await load();
    } catch (error) {
      Alert.alert("Save failed", error instanceof Error ? error.message : "Please try again.");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <Screen>
        <ProfileSkeleton />
      </Screen>
    );
  }

  return (
    <>
      <Screen refreshControl={<RefreshControl refreshing={refreshing} onRefresh={() => { setRefreshing(true); load(); }} />}>
        <View className="items-center">
          <View className="h-20 w-20 items-center justify-center rounded-full bg-periwinkle-soft dark:bg-darkSurfaceSoft">
            <Image
              source={logoSource}
              className="h-16 w-16"
              resizeMode="contain"
              style={isDark ? styles.darkLogoImage : undefined}
            />
          </View>
          <Text className="mt-4 text-2xl font-extrabold text-navy dark:text-cloud">{user?.name ?? "Derma User"}</Text>
          <Text className="mt-1 text-sm text-muted dark:text-darkMuted">{user?.email ?? ""}</Text>
        </View>

        <View className="mt-7 rounded-3xl bg-card p-5 dark:bg-darkSurface" style={styles.card}>
          <View className="flex-row items-center justify-between">
            <View className="flex-row items-center gap-2">
              <ShieldCheck size={19} color={colors.maroon} />
              <Text className="text-lg font-extrabold text-navy dark:text-cloud">Skin Profile</Text>
            </View>
            <Pressable onPress={openEdit} className="flex-row items-center gap-2 px-1 py-2">
              <Text className="text-sm font-bold text-maroon">Edit</Text>
              <ChevronRight size={18} color={colors.maroon} />
            </Pressable>
          </View>

          <View className="mt-4 flex-row flex-wrap gap-3">
            {tags.length > 0 ? tags.map((tag) => (
              <View key={tag.id} className="rounded-full bg-periwinkle-soft px-4 py-2 dark:bg-darkSurfaceSoft">
                <Text className="text-sm font-semibold text-navy dark:text-cloud">{tag.label}</Text>
              </View>
            )) : (
              <Text className="text-sm text-muted dark:text-darkMuted">Complete your skin setup to see your profile here.</Text>
            )}
          </View>
          <Text className="mt-4 text-sm leading-5 text-muted dark:text-darkMuted">Concerns: {concernsText}</Text>
        </View>

        <View className="mt-7 rounded-3xl bg-card p-5 dark:bg-darkSurface" style={styles.card}>
          <View className="mb-4 flex-row items-center gap-2">
            <Clock size={22} color={isDark ? colors.cloud : colors.navy} />
            <Text className="text-2xl font-extrabold text-navy dark:text-cloud">Recent Scans</Text>
          </View>
          {scanHistory.length === 0 ? (
            <Text className="text-sm text-muted dark:text-darkMuted">No scans yet.</Text>
          ) : scanHistory.map((item) => (
            <View key={item.id} className="mb-3 flex-row items-center justify-between rounded-2xl bg-periwinkle-soft p-4 dark:bg-darkSurfaceSoft">
              <View className="mr-3 flex-1">
                <Text className="text-base font-extrabold text-navy dark:text-cloud" numberOfLines={1}>
                  {item.productName}
                </Text>
                <Text className="mt-1 text-sm text-muted dark:text-darkMuted">{formatDate(item.scannedAt)}</Text>
              </View>
              <Text className="text-2xl font-extrabold" style={{ color: scoreColor(item.score) }}>
                {item.score ?? "--"}
              </Text>
            </View>
          ))}
        </View>

        <View className="mt-7 rounded-3xl bg-card p-5 dark:bg-darkSurface" style={styles.card}>
          <View className="mb-6 flex-row items-center gap-3">
            <Settings size={22} color={isDark ? colors.peach : colors.navy} />
            <Text className="text-2xl font-extrabold text-navy dark:text-cloud">Preferences</Text>
          </View>
          <Pressable
            accessibilityRole="switch"
            accessibilityState={{ checked: isDark }}
            onPress={toggleTheme}
            className="flex-row items-center border-b border-border pb-5 dark:border-darkBorder"
          >
            <Moon size={24} color={isDark ? colors.cloud : colors.navy} />
            <Text className="ml-4 flex-1 text-lg font-semibold text-navy dark:text-cloud">
              {isDark ? "Switch to Light Mode" : "Switch to Dark Mode"}
            </Text>
            <View style={[styles.themeSwitchTrack, isDark ? styles.themeSwitchTrackOn : styles.themeSwitchTrackOff]}>
              <View style={[styles.themeSwitchKnob, isDark ? styles.themeSwitchKnobOn : styles.themeSwitchKnobOff]} />
            </View>
          </Pressable>
        </View>

        <Pressable
          onPress={async () => { await signOut(); router.replace("/"); }}
          className="mt-7 h-16 flex-row items-center justify-center gap-3 rounded-3xl border border-maroon"
        >
          <LogOut size={24} color={colors.maroon} />
          <Text className="text-xl font-extrabold text-maroon">Sign Out</Text>
        </Pressable>
      </Screen>

      <Modal visible={editing} transparent animationType="slide" onRequestClose={() => setEditing(false)}>
        <KeyboardAvoidingView
          behavior={Platform.OS === "ios" ? "padding" : undefined}
          style={styles.modalBackdrop}
        >
          <View className="bg-cloud dark:bg-darkBackground" style={styles.editSheet}>
            <View className="flex-row items-center justify-between border-b border-border px-6 pb-5 pt-6 dark:border-darkBorder">
              <Text className="text-3xl font-extrabold text-navy dark:text-cloud">Edit Profile</Text>
              <Pressable onPress={() => setEditing(false)} className="px-2 py-2">
                <Text className="text-lg font-bold text-muted dark:text-darkMuted">Cancel</Text>
              </Pressable>
            </View>

            <ScrollView
              contentContainerStyle={[styles.editContent, { paddingBottom: 44 + Math.max(insets.bottom, 16) }]}
              keyboardShouldPersistTaps="handled"
              showsVerticalScrollIndicator={false}
            >
              <Text className="text-xl font-extrabold text-navy dark:text-cloud">Display Name</Text>
              <TextInput
                value={draftName}
                onChangeText={setDraftName}
                placeholder="Display name"
                placeholderTextColor={colors.muted}
                className="mt-4 rounded-3xl bg-periwinkle-soft px-5 py-4 text-xl text-navy dark:bg-darkSurfaceSoft dark:text-cloud"
              />

              <Text className="mt-8 text-xl font-extrabold text-navy dark:text-cloud">Skin Type</Text>
              <View className="mt-4 flex-row flex-wrap gap-3">
                {skinTypes.map((item) => (
                  <Chip
                    key={item.id}
                    label={item.title}
                    selected={draftSkinType === item.id}
                    onPress={() => setDraftSkinType(item.id)}
                  />
                ))}
              </View>

              <Text className="mt-10 text-xl font-extrabold text-navy dark:text-cloud">Skin Conditions</Text>
              <Text className="mt-2 text-base text-muted dark:text-darkMuted">Select all that apply</Text>
              <View className="mt-4 flex-row flex-wrap gap-3">
                {skinConditions.map((item) => (
                  <Chip
                    key={item.id}
                    label={item.title}
                    selected={draftConditions.includes(item.id)}
                    onPress={() => toggleListValue(draftConditions, setDraftConditions, item.id)}
                  />
                ))}
              </View>

              <Text className="mt-10 text-xl font-extrabold text-navy dark:text-cloud">Skin Concerns</Text>
              <Text className="mt-2 text-base text-muted dark:text-darkMuted">What do you want to improve?</Text>
              <View className="mt-4 flex-row flex-wrap gap-3">
                {skinConcerns.map((item) => (
                  <Chip
                    key={item.id}
                    label={item.title}
                    selected={draftConcerns.includes(item.id)}
                    onPress={() => toggleListValue(draftConcerns, setDraftConcerns, item.id)}
                  />
                ))}
              </View>

              <Pressable
                disabled={saving}
                onPress={saveProfile}
                className="mt-10 h-16 flex-row items-center justify-center gap-3 rounded-3xl bg-maroon disabled:opacity-50"
              >
                {saving ? <ActivityIndicator color={colors.cloud} /> : <Save size={24} color={colors.cloud} />}
                <Text className="text-xl font-extrabold text-cloud">Save Profile</Text>
              </Pressable>
            </ScrollView>
          </View>
        </KeyboardAvoidingView>
      </Modal>
    </>
  );
}

function Chip({ label, selected, onPress }: { label: string; selected: boolean; onPress: () => void }) {
  return (
    <Pressable
      onPress={onPress}
      className={`rounded-full border px-5 py-3 ${selected ? "border-maroon bg-maroon" : "border-border bg-transparent dark:border-darkBorder"}`}
    >
      <Text className={`text-lg font-bold ${selected ? "text-cloud" : "text-navy dark:text-cloud"}`}>{label}</Text>
    </Pressable>
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
  editContent: {
    paddingBottom: 44,
    paddingHorizontal: 24,
    paddingTop: 28,
  },
  editSheet: {
    borderTopLeftRadius: 34,
    borderTopRightRadius: 34,
    maxHeight: "92%",
    overflow: "hidden",
  },
  darkLogoImage: {
    tintColor: colors.cloud,
  },
  modalBackdrop: {
    backgroundColor: "rgba(0,0,0,0.44)",
    flex: 1,
    justifyContent: "flex-end",
  },
  themeSwitchKnob: {
    backgroundColor: colors.card,
    borderRadius: 13,
    height: 26,
    shadowColor: "#374375",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    width: 26,
    elevation: 3,
  },
  themeSwitchKnobOff: {
    transform: [{ translateX: 0 }],
  },
  themeSwitchKnobOn: {
    transform: [{ translateX: 24 }],
  },
  themeSwitchTrack: {
    borderRadius: 16,
    height: 32,
    justifyContent: "center",
    paddingHorizontal: 3,
    width: 56,
  },
  themeSwitchTrackOff: {
    backgroundColor: colors.periwinkleSoft,
  },
  themeSwitchTrackOn: {
    backgroundColor: colors.maroon,
  },
});
