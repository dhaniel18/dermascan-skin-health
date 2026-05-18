import { ScanLine } from "lucide-react-native";
import { StyleSheet, Text, View } from "react-native";
import { useAppTheme } from "@/components/AppThemeProvider";
import { colors } from "@/constants/theme";

export function Logo() {
  const { isDark } = useAppTheme();

  return (
    <View style={styles.container}>
      <View style={[
        styles.iconBox,
        { backgroundColor: isDark ? colors.darkSurface : colors.maroon }
      ]}>
        <ScanLine size={44} color={colors.cloud} strokeWidth={2.6} />
      </View>
      <View style={styles.textBox}>
        <Text style={[styles.title, { color: isDark ? colors.cloud : colors.navy }]}>
          DermaScan
        </Text>
        <Text style={[styles.subtitle, { color: isDark ? colors.darkMuted : colors.muted }]}>
          Skin health, clearer decisions
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { alignItems: "center", gap: 16 },
  iconBox: {
    width: 96, height: 96,
    borderRadius: 32,
    alignItems: "center",
    justifyContent: "center",
  },
  textBox: { alignItems: "center" },
  title: { fontSize: 40, fontWeight: "800" },
  subtitle: { marginTop: 6, fontSize: 15, textAlign: "center" },
});
