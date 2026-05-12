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
import { scanHistory } from "@/services/scans";
import type { SkinProfile, User } from "@/types/domain";

const skinTypeLabels = new Map(skinTypes.map((item) => [item.id, item.title]));
const conditionLabels = new Map(skinConditions.map((item) => [item.id, item.title]));

export default function ProfileScreen() {
  const [user, setUser] = useState<User | null>(null);
  const [skinProfile, setSkinProfile] = useState<SkinProfile | null>(null);
  const { isDark, toggleTheme } = useAppTheme();
  const skinProfileTags = [
    ...(skinProfile?.skinType ? [{ id: `type-${skinProfile.skinType}`, label: skinTypeLabels.get(skinProfile.skinType) ?? skinProfile.skinType }] : []),
    ...(skinProfile?.conditions.map((id) => ({ id: `condition-${id}`, label: conditionLabels.get(id) ?? id })) ?? []),
  ];

  useEffect(() => {
    getCurrentUser().then(setUser);
  }, []);

  useFocusEffect(
    useCallback(() => {
      let isActive = true;

      getSkinProfile().then((profile) => {
        if (isActive) {
          setSkinProfile(profile);
        }
      });

      return () => {
        isActive = false;
      };
    }, []),
  );

  const handleSignOut = async () => {
    await signOut();
    router.replace("/" as never);
  };

  return (
    <Screen>
      <View className="items-center">
        <View className="h-24 w-24 items-center justify-center rounded-[32px] bg-periwinkle-soft dark:bg-darkSurfaceSoft">
          <Text className="text-4xl">✨</Text>
        </View>
        <Text className="mt-4 text-3xl font-extrabold text-navy dark:text-cloud">{user?.name ?? "Derma User"}</Text>
        <Text className="mt-1 text-muted dark:text-darkMuted">{user?.email ?? "hello@dermascan.app"}</Text>
      </View>

      <View className="mt-7 rounded-3xl bg-card p-5 dark:bg-darkSurface">
        <View className="flex-row items-center gap-2">
          <ShieldCheck size={19} color={colors.maroon} />
          <Text className="text-lg font-bold text-navy dark:text-cloud">Skin Profile</Text>
        </View>
        <View className="mt-4 flex-row flex-wrap gap-2">
          {skinProfileTags.length > 0 ? (
            skinProfileTags.map((tag) => (
              <Text key={tag.id} className="rounded-full bg-periwinkle-soft px-3 py-2 text-sm font-semibold text-navy dark:bg-darkSurfaceSoft dark:text-cloud">
                {tag.label}
              </Text>
            ))
          ) : (
            <Text className="text-sm leading-5 text-muted dark:text-darkMuted">
              Complete your skin setup to show your skin type and skin conditions here.
            </Text>
          )}
        </View>
      </View>

      <View className="mt-5 rounded-3xl bg-card p-5 dark:bg-darkSurface">
        <View className="flex-row items-center gap-2">
          <Clock size={19} color={isDark ? colors.cloud : colors.navy} />
          <Text className="text-lg font-bold text-navy dark:text-cloud">Scan History</Text>
        </View>
        <View className="mt-4 gap-3">
          {scanHistory.map((item) => (
            <View key={item.id} className="flex-row items-center justify-between rounded-2xl bg-cloud p-4 dark:bg-darkSurfaceSoft">
              <View>
                <Text className="font-semibold text-navy dark:text-cloud">{item.productName}</Text>
                <Text className="mt-1 text-xs text-muted dark:text-darkMuted">{item.scannedAt}</Text>
              </View>
              <Text className="rounded-full bg-periwinkle-soft px-2 py-1 text-xs font-bold text-navy dark:bg-navy dark:text-cloud">{item.score}%</Text>
            </View>
          ))}
        </View>
      </View>

      <View className="mt-5 rounded-3xl bg-card p-5 dark:bg-darkSurface">
        <View className="flex-row items-center gap-3">
          <Settings size={20} color={isDark ? colors.peach : colors.navy} />
          <Text className="font-semibold text-navy dark:text-cloud">Preferences</Text>
        </View>
      </View>

      <View className="mt-4 rounded-3xl bg-card p-5 dark:bg-darkSurface">
        <View className="flex-row items-center gap-3">
          <LogOut size={20} color={colors.maroon} />
          <Text className="font-semibold text-navy dark:text-cloud">Account</Text>
        </View>
      </View>

      <Button variant="soft" onPress={toggleTheme} className="mt-4">
        {isDark ? "Lightmode" : "Darkmode"}
      </Button>

      <Button variant="outline" onPress={handleSignOut} className="mt-5 pb-24">
        Sign Out
      </Button>
    </Screen>
  );
}
