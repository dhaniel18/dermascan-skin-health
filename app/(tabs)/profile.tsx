// ============================================================
// DermaScan — Profile Screen
// Working profile editor: name, skin type, conditions, concerns.
// ============================================================
import { router, useFocusEffect } from "expo-router";
import {
  ChevronRight, LogOut, Moon, Save, Sun, User as UserIcon,
} from "lucide-react-native";
import { useCallback, useEffect, useState } from "react";
import {
  ActivityIndicator, Alert, Modal, ScrollView,
  Text, TextInput, TouchableOpacity, View,
} from "react-native";
import { useAppTheme } from "@/components/AppThemeProvider";
import { Screen } from "@/components/Screen";
import { colors } from "@/constants/theme";
import { skinConditions, skinConcerns, skinTypes } from "@/constants/options";
import { getCurrentUser, signOut } from "@/services/auth";
import { getSkinProfile, saveSkinProfile } from "@/services/profile";
import { getScanHistory } from "@/services/scans";
import type { ScanHistoryItem, SkinProfile, User } from "@/types/domain";

// ── Toggle chip ───────────────────────────────────────────────
function Chip({
  label, selected, onPress,
}: { label: string; selected: boolean; onPress: () => void }) {
  return (
    <TouchableOpacity
      onPress={onPress}
      className={`rounded-full px-4 py-2 border mr-2 mb-2 ${
        selected
          ? "bg-maroon border-maroon"
          : "bg-transparent border-border dark:border-darkBorder"
      }`}
    >
      <Text className={`text-sm font-semibold ${selected ? "text-cloud" : "text-navy dark:text-cloud"}`}>
        {label}
      </Text>
    </TouchableOpacity>
  );
}

// ── Profile Editor Modal ──────────────────────────────────────
function ProfileEditorModal({
  visible,
  user,
  profile,
  onClose,
  onSaved,
}: {
  visible: boolean;
  user: User | null;
  profile: SkinProfile | null;
  onClose: () => void;
  onSaved: (updated: SkinProfile) => void;
}) {
  const [displayName, setDisplayName] = useState(user?.name ?? "");
  const [skinType, setSkinType]       = useState(profile?.skinType ?? null);
  const [conditions, setConditions]   = useState<string[]>(profile?.conditions ?? []);
  const [concerns, setConcerns]       = useState<string[]>(profile?.concerns ?? []);
  const [saving, setSaving]           = useState(false);

  // Sync when modal opens
  useEffect(() => {
    if (visible) {
      setDisplayName(user?.name ?? "");
      setSkinType(profile?.skinType ?? null);
      setConditions(profile?.conditions ?? []);
      setConcerns(profile?.concerns ?? []);
    }
  }, [visible, user, profile]);

  const toggleItem = (
    list: string[],
    setter: (v: string[]) => void,
    id: string
  ) => {
    setter(list.includes(id) ? list.filter((x) => x !== id) : [...list, id]);
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      const updated: SkinProfile = {
        skinType,
        conditions,
        concerns,
      };
      await saveSkinProfile(updated);
      onSaved(updated);
      onClose();
    } catch (e: unknown) {
      Alert.alert("Error", e instanceof Error ? e.message : "Could not save profile.");
    } finally {
      setSaving(false);
    }
  };

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
          <Text className="text-xl font-extrabold text-navy dark:text-cloud">Edit Profile</Text>
          <TouchableOpacity onPress={onClose}>
            <Text className="text-sm font-semibold text-muted dark:text-darkMuted">Cancel</Text>
          </TouchableOpacity>
        </View>

        <ScrollView className="flex-1 px-6 pt-5" showsVerticalScrollIndicator={false}>

          {/* Name */}
          <Text className="text-sm font-bold text-navy dark:text-cloud mb-2">Display Name</Text>
          <TextInput
            value={displayName}
            onChangeText={setDisplayName}
            placeholder="Your name"
            placeholderTextColor={colors.muted}
            className="rounded-2xl bg-periwinkle-soft px-4 py-3 text-navy dark:bg-darkSurfaceSoft dark:text-cloud mb-6"
          />

          {/* Skin type */}
          <Text className="text-sm font-bold text-navy dark:text-cloud mb-3">Skin Type</Text>
          <View className="flex-row flex-wrap mb-6">
            {skinTypes.map((t) => (
              <Chip
                key={t.id}
                label={t.title}
                selected={skinType === t.id}
                onPress={() => setSkinType(skinType === t.id ? null : t.id)}
              />
            ))}
          </View>

          {/* Conditions */}
          <Text className="text-sm font-bold text-navy dark:text-cloud mb-1">Skin Conditions</Text>
          <Text className="text-xs text-muted dark:text-darkMuted mb-3">Select all that apply</Text>
          <View className="flex-row flex-wrap mb-6">
            {skinConditions.map((c) => (
              <Chip
                key={c.id}
                label={c.title}
                selected={conditions.includes(c.id)}
                onPress={() => toggleItem(conditions, setConditions, c.id)}
              />
            ))}
          </View>

          {/* Concerns */}
          <Text className="text-sm font-bold text-navy dark:text-cloud mb-1">Skin Concerns</Text>
          <Text className="text-xs text-muted dark:text-darkMuted mb-3">What do you want to improve?</Text>
          <View className="flex-row flex-wrap mb-6">
            {skinConcerns.map((c) => (
              <Chip
                key={c.id}
                label={c.title}
                selected={concerns.includes(c.id)}
                onPress={() => toggleItem(concerns, setConcerns, c.id)}
              />
            ))}
          </View>

          {/* Save button */}
          <TouchableOpacity
            onPress={handleSave}
            disabled={saving}
            className="flex-row items-center justify-center gap-2 rounded-2xl py-4 bg-maroon mb-10"
          >
            {saving
              ? <ActivityIndicator color={colors.cloud} size="small" />
              : <Save size={18} color={colors.cloud} />
            }
            <Text className="font-bold text-cloud">
              {saving ? "Saving..." : "Save Profile"}
            </Text>
          </TouchableOpacity>
        </ScrollView>
      </View>
    </Modal>
  );
}

// ── Score color ───────────────────────────────────────────────
function scoreColor(s: number) {
  return s >= 80 ? colors.success : s >= 50 ? "#E67E22" : "#C0392B";
}

// ── Main Screen ───────────────────────────────────────────────
export default function ProfileScreen() {
  const { isDark, toggleTheme } = useAppTheme();
  const [user, setUser]           = useState<User | null>(null);
  const [profile, setProfile]     = useState<SkinProfile | null>(null);
  const [scans, setScans]         = useState<ScanHistoryItem[]>([]);
  const [loading, setLoading]     = useState(true);
  const [editorOpen, setEditorOpen] = useState(false);

  const load = useCallback(async () => {
    try {
      const [u, p, h] = await Promise.all([
        getCurrentUser(),
        getSkinProfile(),
        getScanHistory(),
      ]);
      setUser(u);
      setProfile(p);
      setScans(h.slice(0, 5));
    } catch (e) { console.warn("[profile]", e); }
    finally { setLoading(false); }
  }, []);

  useEffect(() => { load(); }, [load]);
  useFocusEffect(useCallback(() => { load(); }, [load]));

  const skinTypeLabel = skinTypes.find((t) => t.id === profile?.skinType)?.title;
  const conditionLabels = (profile?.conditions ?? [])
    .map((id) => skinConditions.find((c) => c.id === id)?.title)
    .filter(Boolean) as string[];
  const concernLabels = (profile?.concerns ?? [])
    .map((id) => skinConcerns.find((c) => c.id === id)?.title)
    .filter(Boolean) as string[];

  const allTags = [
    ...(skinTypeLabel ? [skinTypeLabel] : []),
    ...conditionLabels,
  ];

  if (loading) return (
    <Screen scroll={false}>
      <View className="flex-1 items-center justify-center">
        <ActivityIndicator color={isDark ? colors.cloud : colors.navy} />
      </View>
    </Screen>
  );

  return (
    <>
      <Screen>
        {/* Avatar & name */}
        <View className="items-center pt-4 pb-6">
          <View className="h-24 w-24 items-center justify-center rounded-[32px] bg-periwinkle-soft dark:bg-darkSurfaceSoft mb-4">
            <UserIcon size={40} color={colors.navy} />
          </View>
          <Text className="text-2xl font-extrabold text-navy dark:text-cloud">
            {user?.name ?? "Derma User"}
          </Text>
          <Text className="text-sm text-muted dark:text-darkMuted mt-1">
            {user?.email ?? ""}
          </Text>
        </View>

        {/* Skin profile card */}
        <TouchableOpacity
          onPress={() => setEditorOpen(true)}
          activeOpacity={0.8}
          className="rounded-3xl bg-card p-5 dark:bg-darkSurface mb-4"
        >
          <View className="flex-row items-center justify-between mb-3">
            <Text className="text-base font-bold text-navy dark:text-cloud">
              🧴 Skin Profile
            </Text>
            <View className="flex-row items-center gap-1">
              <Text className="text-xs text-maroon font-semibold">Edit</Text>
              <ChevronRight size={14} color={colors.maroon} />
            </View>
          </View>

          {allTags.length > 0 ? (
            <>
              <View className="flex-row flex-wrap gap-2 mb-3">
                {allTags.map((tag) => (
                  <View
                    key={tag}
                    className="rounded-full bg-periwinkle-soft px-3 py-1.5 dark:bg-darkSurfaceSoft"
                  >
                    <Text className="text-xs font-semibold text-navy dark:text-cloud">
                      {tag}
                    </Text>
                  </View>
                ))}
              </View>
              {concernLabels.length > 0 && (
                <Text className="text-xs text-muted dark:text-darkMuted">
                  Concerns: {concernLabels.join(", ")}
                </Text>
              )}
            </>
          ) : (
            <Text className="text-sm text-muted dark:text-darkMuted">
              Tap to set up your skin profile for personalised warnings.
            </Text>
          )}
        </TouchableOpacity>

        {/* Recent scans */}
        <View className="rounded-3xl bg-card p-5 dark:bg-darkSurface mb-4">
          <Text className="text-base font-bold text-navy dark:text-cloud mb-3">
            🕓 Recent Scans
          </Text>
          {scans.length === 0 ? (
            <Text className="text-sm text-muted dark:text-darkMuted">
              No scans yet.
            </Text>
          ) : (
            <View className="gap-2">
              {scans.map((item) => (
                <View
                  key={item.id}
                  className="flex-row items-center justify-between rounded-2xl bg-periwinkle-soft px-4 py-3 dark:bg-darkSurfaceSoft"
                >
                  <View className="flex-1">
                    <Text
                      className="font-semibold text-navy dark:text-cloud text-sm"
                      numberOfLines={1}
                    >
                      {item.productName}
                    </Text>
                    <Text className="text-xs text-muted dark:text-darkMuted mt-0.5">
                      {new Date(item.scannedAt).toLocaleDateString("id-ID", {
                        day: "numeric", month: "short", year: "numeric",
                      })}
                    </Text>
                  </View>
                  {item.score !== undefined && (
                    <Text
                      className="text-lg font-extrabold ml-3"
                      style={{ color: scoreColor(item.score) }}
                    >
                      {item.score}
                    </Text>
                  )}
                </View>
              ))}
            </View>
          )}
        </View>

        {/* Preferences */}
        <View className="rounded-3xl bg-card p-5 dark:bg-darkSurface mb-4">
          <Text className="text-base font-bold text-navy dark:text-cloud mb-3">
            ⚙️ Preferences
          </Text>
          <TouchableOpacity
            onPress={toggleTheme}
            className="flex-row items-center justify-between py-3 border-b border-border dark:border-darkBorder"
          >
            <View className="flex-row items-center gap-3">
              {isDark
                ? <Sun size={18} color={colors.warning} />
                : <Moon size={18} color={colors.navy} />
              }
              <Text className="text-sm font-semibold text-navy dark:text-cloud">
                {isDark ? "Switch to Light Mode" : "Switch to Dark Mode"}
              </Text>
            </View>
            <ChevronRight size={14} color={colors.muted} />
          </TouchableOpacity>
        </View>

        {/* Sign out */}
        <TouchableOpacity
          onPress={async () => {
            Alert.alert("Sign Out", "Are you sure you want to sign out?", [
              {
                text: "Sign Out",
                style: "destructive",
                onPress: async () => {
                  await signOut();
                  router.replace("/");
                },
              },
              { text: "Cancel", style: "cancel" },
            ]);
          }}
          className="flex-row items-center justify-center gap-2 rounded-2xl py-4 border border-maroon mb-6"
        >
          <LogOut size={18} color={colors.maroon} />
          <Text className="font-bold text-maroon">Sign Out</Text>
        </TouchableOpacity>
      </Screen>

      <ProfileEditorModal
        visible={editorOpen}
        user={user}
        profile={profile}
        onClose={() => setEditorOpen(false)}
        onSaved={(updated) => {
          setProfile(updated);
        }}
      />
    </>
  );
}
