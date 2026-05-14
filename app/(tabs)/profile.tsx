import { router, useFocusEffect } from "expo-router";
import { Clock, LogOut, Settings, ShieldCheck } from "lucide-react-native";
import { useCallback, useEffect, useState } from "react";
import { Text, View } from "react-native";
import { useAppTheme } from "@/components/AppThemeProvider";
import { Button } from "@/components/Button";
import { Screen } from "@/components/Screen";
import { colors } from "@/constants/theme";
import { skinConditions, skinTypes } from "@/constants/options";
import { getCurrentUser, signOut } from "@/services/auth";
import { getSkinProfile } from "@/services/profile";
import { getScanHistory } from "@/services/scans";
import type { ScanHistoryItem, SkinProfile, User } from "@/types/domain";

const skinTypeLabels = new Map(skinTypes.map((i) => [i.id, i.title]));
const conditionLabels = new Map(skinConditions.map((i) => [i.id, i.title]));

export default function ProfileScreen() {
  const [user, setUser] = useState<User | null>(null);
  const [skinProfile, setSkinProfile] = useState<SkinProfile | null>(null);
  const [scanHistory, setScanHistory] = useState<ScanHistoryItem[]>([]);
  const { isDark, toggleTheme } = useAppTheme();

  useEffect(() => { getCurrentUser().then(setUser); }, []);

  useFocusEffect(useCallback(() => {
    let active = true;
    getSkinProfile().then((p) => { if (active) setSkinProfile(p); });
    getScanHistory().then((h) => { if (active) setScanHistory(h.slice(0, 5)); });
    return () => { active = false; };
  }, []));

  const tags = [
    ...(skinProfile?.skinType ? [{ id: `t-${skinProfile.skinType}`, label: skinTypeLabels.get(skinProfile.skinType) ?? skinProfile.skinType }] : []),
    ...(skinProfile?.conditions.map((id) => ({ id: `c-${id}`, label: conditionLabels.get(id) ?? id })) ?? []),
  ];

  const scoreColor = (s: number) => s >= 80 ? colors.success : s >= 50 ? "#E67E22" : "#C0392B";

  return (
    <Screen>
      <View className="items-center">
        <View className="h-24 w-24 items-center justify-center rounded-[32px] bg-periwinkle-soft dark:bg-darkSurfaceSoft">
          <Text className="text-4xl">✨</Text>
        </View>
        <Text className="mt-4 text-3xl font-extrabold text-navy dark:text-cloud">{user?.name ?? "Derma User"}</Text>
        <Text className="mt-1 text-muted dark:text-darkMuted">{user?.email ?? ""}</Text>
      </View>

      <View className="mt-7 rounded-3xl bg-card p-5 dark:bg-darkSurface">
        <View className="flex-row items-center gap-2">
          <ShieldCheck size={19} color={colors.maroon} />
          <Text className="text-lg font-bold text-navy dark:text-cloud">Skin Profile</Text>
        </View>
        <View className="mt-4 flex-row flex-wrap gap-2">
          {tags.length > 0 ? tags.map((t) => (
            <Text key={t.id} className="rounded-full bg-periwinkle-soft px-3 py-2 text-sm font-semibold text-navy dark:bg-darkSurfaceSoft dark:text-cloud">{t.label}</Text>
          )) : (
            <Text className="text-sm text-muted dark:text-darkMuted">Complete your skin setup to see your profile here.</Text>
          )}
        </View>
      </View>

      <View className="mt-5 rounded-3xl bg-card p-5 dark:bg-darkSurface">
        <View className="flex-row items-center gap-2 mb-4">
          <Clock size={19} color={isDark ? colors.cloud : colors.navy} />
          <Text className="text-lg font-bold text-navy dark:text-cloud">Recent Scans</Text>
        </View>
        {scanHistory.length === 0 ? (
          <Text className="text-sm text-muted dark:text-darkMuted">No scans yet.</Text>
        ) : scanHistory.map((item) => (
          <View key={item.id} className="mb-3 flex-row items-center justify-between rounded-2xl bg-cloud p-4 dark:bg-darkSurfaceSoft">
            <View className="flex-1">
              <Text className="font-semibold text-navy dark:text-cloud">{item.productName}</Text>
              <Text className="mt-1 text-xs text-muted dark:text-darkMuted">{new Date(item.scannedAt).toLocaleDateString()}</Text>
            </View>
            {item.score !== undefined && (
              <Text className="rounded-full bg-periwinkle-soft px-2 py-1 text-xs font-bold text-navy dark:bg-navy dark:text-cloud" style={{ color: scoreColor(item.score) }}>{item.score}</Text>
            )}
          </View>
        ))}
      </View>

      <View className="mt-5 rounded-3xl bg-card p-5 dark:bg-darkSurface">
        <View className="flex-row items-center gap-3">
          <Settings size={20} color={isDark ? colors.peach : colors.navy} />
          <Text className="font-semibold text-navy dark:text-cloud">Preferences</Text>
        </View>
      </View>

      <Button variant="soft" onPress={toggleTheme} className="mt-4">{isDark ? "Switch to Light Mode" : "Switch to Dark Mode"}</Button>
      <Button variant="outline" onPress={async () => { await signOut(); router.replace("/"); }} className="mt-3 mb-8">Sign Out</Button>
    </Screen>
  );
}
