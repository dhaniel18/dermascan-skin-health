import { ScanLine } from "lucide-react-native";
import { StyleSheet, Text, View } from "react-native";
import { useAppTheme } from "@/components/AppThemeProvider";
import { colors } from "@/constants/theme";

export function Logo() {
  const { isDark } = useAppTheme();

  return (
    <View className="items-center gap-4" style={styles.container}>
      <View className="h-24 w-24 items-center justify-center rounded-[32px] bg-periwinkle-soft dark:bg-darkSurface" style={[styles.mark, isDark && styles.darkMark]}>
        <ScanLine size={44} color={isDark ? colors.cloud : colors.navy} strokeWidth={2.6} />
      </View>
      <View className="items-center" style={styles.textWrap}>
        <Text className="text-5xl font-extrabold text-navy dark:text-cloud" style={[styles.title, isDark && styles.darkText]}>
          DermaScan
        </Text>
        <Text className="mt-2 text-center text-base text-muted dark:text-darkMuted" style={[styles.subtitle, isDark && styles.darkMuted]}>
          Skin health, clearer decisions
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: "center",
    gap: 16,
  },
  darkMark: {
    backgroundColor: colors.darkSurface,
  },
  darkMuted: {
    color: colors.darkMuted,
  },
  darkText: {
    color: colors.cloud,
  },
  mark: {
    alignItems: "center",
    backgroundColor: colors.periwinkleSoft,
    borderRadius: 32,
    height: 96,
    justifyContent: "center",
    width: 96,
  },
  subtitle: {
    color: colors.muted,
    fontSize: 16,
    marginTop: 8,
    textAlign: "center",
  },
  textWrap: {
    alignItems: "center",
  },
  title: {
    color: colors.navy,
    fontSize: 44,
    fontWeight: "800",
  },
});
