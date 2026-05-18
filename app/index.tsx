import { Link } from "expo-router";
import { ShieldCheck, Sparkles, ScanLine } from "lucide-react-native";
import { StyleSheet, Text, View } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useAppTheme } from "@/components/AppThemeProvider";
import { Button } from "@/components/Button";
import { Logo } from "@/components/Logo";
import { colors } from "@/constants/theme";

const features = [
  { icon: ScanLine,    label: "Scan\nProducts" },
  { icon: ShieldCheck, label: "Safe Match"     },
  { icon: Sparkles,    label: "Smart\nRoutine" },
];

export default function WelcomeScreen() {
  const { isDark } = useAppTheme();
  const insets = useSafeAreaInsets();

  const gradientColors: [string, string] = isDark
    ? ["#20284F", "#2F3867"]
    : ["#FBEEE9", "#E8E9F6"];  // warm peach → soft periwinkle

  const cardBg    = isDark ? colors.darkSurface    : "#FFFFFF";
  const cardIcon  = isDark ? colors.darkSurfaceSoft : colors.periwinkleSoft;
  const textColor = isDark ? colors.cloud           : colors.navy;
  const mutedColor= isDark ? colors.darkMuted       : colors.muted;

  return (
    <LinearGradient colors={gradientColors} style={styles.gradient}>
      <View style={[
        styles.container,
        { paddingTop: 24 + insets.top, paddingBottom: 32 + insets.bottom }
      ]}>
        {/* Logo */}
        <View style={styles.logoWrap}>
          <Logo />
        </View>

        {/* Feature cards */}
        <View style={styles.cardsRow}>
          {features.map(({ icon: Icon, label }) => (
            <View key={label} style={[styles.card, { backgroundColor: cardBg }]}>
              <View style={[styles.cardIcon, { backgroundColor: cardIcon }]}>
                <Icon size={24} color={textColor} strokeWidth={2.4} />
              </View>
              <Text style={[styles.cardLabel, { color: textColor }]}>{label}</Text>
            </View>
          ))}
        </View>

        {/* CTA buttons */}
        <View style={styles.buttons}>
          <Link href="/create-account" asChild>
            <Button>Create Account</Button>
          </Link>
          <Link href="/sign-in" asChild>
            <Button variant="outline">Sign In</Button>
          </Link>
        </View>
      </View>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  gradient:   { flex: 1 },
  container:  { flex: 1, paddingHorizontal: 24, justifyContent: "space-between" },
  logoWrap:   { paddingTop: 16 },
  cardsRow:   { flexDirection: "row", gap: 12 },
  card: {
    flex: 1, alignItems: "center", gap: 12,
    borderRadius: 24, padding: 16,
    shadowColor: "#374375",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 12,
    elevation: 4,
  },
  cardIcon: { width: 48, height: 48, borderRadius: 16, alignItems: "center", justifyContent: "center" },
  cardLabel: { fontSize: 12, fontWeight: "700", textAlign: "center", lineHeight: 17 },
  buttons:   { gap: 12 },
});
