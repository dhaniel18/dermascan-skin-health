import { Link } from "expo-router";
import { ShieldCheck, Sparkles, ScanLine } from "lucide-react-native";
import { Text, View } from "react-native";
import { Button } from "@/components/Button";
import { Logo } from "@/components/Logo";
import { Screen } from "@/components/Screen";
import { colors } from "@/constants/theme";

const features = [
  { icon: ScanLine, label: "Scan\nProducts" },
  { icon: ShieldCheck, label: "Safe Match" },
  { icon: Sparkles, label: "Smart\nRoutine" }
];

export default function WelcomeScreen() {
  return (
    <Screen scroll={false}>
      <View className="flex-1 justify-between py-8">
        <View className="pt-10">
          <Logo />
        </View>

        <View className="flex-row justify-between gap-3">
          {features.map(({ icon: Icon, label }) => (
            <View key={label} className="flex-1 items-center gap-3 rounded-3xl bg-card p-4">
              <View className="h-12 w-12 items-center justify-center rounded-2xl bg-periwinkle-soft">
                <Icon size={24} color={colors.navy} strokeWidth={2.4} />
              </View>
              <Text className="text-center text-xs font-bold leading-4 text-navy">{label}</Text>
            </View>
          ))}
        </View>

        <View className="gap-3">
          <Link href="/create-account" asChild>
            <Button>Create Account</Button>
          </Link>
          <Link href="/sign-in" asChild>
            <Button variant="outline">Sign In</Button>
          </Link>
        </View>
      </View>
    </Screen>
  );
}
