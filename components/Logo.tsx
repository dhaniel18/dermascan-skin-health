import { Image, StyleSheet, Text, View } from "react-native";
import { useAppTheme } from "@/components/AppThemeProvider";
import { colors } from "@/constants/theme";

const logoSource = require("@/assets/images/dermascan-logo.png");

export function Logo() {
  const { isDark } = useAppTheme();

  return (
    <View className="items-center gap-4" style={styles.container}>
      <View className="h-28 w-28 items-center justify-center rounded-[34px] bg-card dark:bg-darkSurface" style={[styles.mark, isDark && styles.darkMark]}>
        <Image source={logoSource} style={[styles.logoImage, isDark && styles.darkLogoImage]} resizeMode="contain" />
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
    borderColor: colors.darkBorder,
  },
  darkMuted: {
    color: colors.darkMuted,
  },
  darkText: {
    color: colors.cloud,
  },
  mark: {
    alignItems: "center",
    backgroundColor: colors.card,
    borderColor: colors.border,
    borderRadius: 34,
    borderWidth: 1.5,
    height: 112,
    justifyContent: "center",
    width: 112,
  },
  logoImage: {
    height: 104,
    width: 104,
  },
  darkLogoImage: {
    tintColor: colors.cloud,
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
