import { Link } from "expo-router";
import { ShieldCheck, Sparkles, ScanLine } from "lucide-react-native";
import { StyleSheet, Text, View } from "react-native";
import { useAppTheme } from "@/components/AppThemeProvider";
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
  const { isDark } = useAppTheme();
  console.log("DermaScan WelcomeScreen rendered.");

  return (
    <Screen scroll={false}>
      <View className="flex-1 justify-between py-8" style={styles.container}>
        <View className="pt-10" style={styles.logoWrap}>
          <Logo />
        </View>

        <View className="flex-row justify-between gap-3" style={styles.features}>
          {features.map(({ icon: Icon, label }) => (
            <View
              key={label}
              className="flex-1 items-center gap-3 rounded-3xl bg-card p-4 dark:bg-darkSurface"
              style={[styles.featureCard, isDark && styles.darkCard]}
            >
              <View
                className="h-12 w-12 items-center justify-center rounded-2xl bg-periwinkle-soft dark:bg-darkSurfaceSoft"
                style={[styles.featureIcon, isDark && styles.darkSoft]}
              >
                <Icon size={24} color={isDark ? colors.cloud : colors.navy} strokeWidth={2.4} />
              </View>
              <Text className="text-center text-xs font-bold leading-4 text-navy dark:text-cloud" style={[styles.featureText, isDark && styles.darkText]}>
                {label}
              </Text>
            </View>
          ))}
        </View>

        <View className="gap-3" style={styles.actions}>
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

const styles = StyleSheet.create({
  actions: {
    gap: 12,
  },
  container: {
    flex: 1,
    justifyContent: "space-between",
    paddingVertical: 32,
  },
  darkCard: {
    backgroundColor: colors.darkSurface,
    borderColor: colors.darkBorder,
    borderWidth: 1,
  },
  darkSoft: {
    backgroundColor: colors.darkSurface,
    borderColor: colors.darkBorder,
    borderWidth: 1,
  },
  darkText: {
    color: colors.cloud,
  },
  featureCard: {
    alignItems: "center",
    backgroundColor: colors.card,
    borderRadius: 24,
    flex: 1,
    gap: 12,
    padding: 16,
  },
  featureIcon: {
    alignItems: "center",
    backgroundColor: colors.periwinkleSoft,
    borderRadius: 16,
    height: 48,
    justifyContent: "center",
    width: 48,
  },
  features: {
    flexDirection: "row",
    gap: 12,
    justifyContent: "space-between",
  },
  featureText: {
    color: colors.navy,
    fontSize: 12,
    fontWeight: "700",
    lineHeight: 16,
    textAlign: "center",
  },
  logoWrap: {
    paddingTop: 40,
  },
});
