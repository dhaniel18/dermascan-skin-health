import { router } from "expo-router";
import { Clock, LogOut, Settings, ShieldCheck } from "lucide-react-native";
import { useEffect, useState } from "react";
import { Text, View } from "react-native";
import { Button } from "@/components/Button";
import { Screen } from "@/components/Screen";
import { colors } from "@/constants/theme";
import { skinConditions, skinConcerns, skinTypes } from "@/constants/options";
import { getCurrentUser, signOut } from "@/services/auth";
import { scanHistory } from "@/services/scans";
import type { User } from "@/types/domain";

const labelsById = new Map([...skinTypes, ...skinConditions, ...skinConcerns].map((item) => [item.id, item.title]));

export default function ProfileScreen() {
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    getCurrentUser().then(setUser);
  }, []);

  const handleSignOut = async () => {
    await signOut();
    router.replace("/" as never);
  };

  return (
    <Screen>
      <View className="items-center">
        <View className="h-24 w-24 items-center justify-center rounded-[32px] bg-periwinkle-soft">
          <Text className="text-4xl">✨</Text>
        </View>
        <Text className="mt-4 text-3xl font-extrabold text-navy">{user?.name ?? "Derma User"}</Text>
        <Text className="mt-1 text-muted">{user?.email ?? "hello@dermascan.app"}</Text>
      </View>

      <View className="mt-7 rounded-3xl bg-card p-5">
        <View className="flex-row items-center gap-2">
          <ShieldCheck size={19} color={colors.maroon} />
          <Text className="text-lg font-bold text-navy">Skin Profile</Text>
        </View>
        <View className="mt-4 flex-row flex-wrap gap-2">
          {["combination", "sensitive", "acne", "dullness", "redness"].map((id) => (
            <Text key={id} className="rounded-full bg-periwinkle-soft px-3 py-2 text-sm font-semibold text-navy">
              {labelsById.get(id) ?? id}
            </Text>
          ))}
        </View>
      </View>

      <View className="mt-5 rounded-3xl bg-card p-5">
        <View className="flex-row items-center gap-2">
          <Clock size={19} color={colors.navy} />
          <Text className="text-lg font-bold text-navy">Scan History</Text>
        </View>
        <View className="mt-4 gap-3">
          {scanHistory.map((item) => (
            <View key={item.id} className="flex-row items-center justify-between rounded-2xl bg-cloud p-4">
              <View>
                <Text className="font-semibold text-navy">{item.productName}</Text>
                <Text className="mt-1 text-xs text-muted">{item.scannedAt}</Text>
              </View>
              <Text className="rounded-full bg-periwinkle-soft px-2 py-1 text-xs font-bold text-navy">{item.score}%</Text>
            </View>
          ))}
        </View>
      </View>

      <View className="mt-5 gap-3 rounded-3xl bg-card p-5">
        <View className="flex-row items-center gap-3">
          <Settings size={20} color={colors.navy} />
          <Text className="font-semibold text-navy">Preferences</Text>
        </View>
        <View className="flex-row items-center gap-3">
          <LogOut size={20} color={colors.maroon} />
          <Text className="font-semibold text-navy">Account</Text>
        </View>
      </View>

      <Button variant="outline" onPress={handleSignOut} className="mt-5 pb-24">
        Sign Out
      </Button>
    </Screen>
  );
}
