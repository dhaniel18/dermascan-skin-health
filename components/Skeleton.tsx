import { useEffect, useRef } from "react";
import { Animated, StyleSheet, View } from "react-native";
import { useAppTheme } from "@/components/AppThemeProvider";
import { colors } from "@/constants/theme";

type SkeletonBlockProps = {
  width?: number | `${number}%`;
  height: number;
  radius?: number;
  className?: string;
};

export function SkeletonBlock({ width = "100%", height, radius = 18, className = "" }: SkeletonBlockProps) {
  const { isDark } = useAppTheme();
  const opacity = useRef(new Animated.Value(0.55)).current;

  useEffect(() => {
    const loop = Animated.loop(
      Animated.sequence([
        Animated.timing(opacity, { toValue: 1, duration: 760, useNativeDriver: true }),
        Animated.timing(opacity, { toValue: 0.55, duration: 760, useNativeDriver: true }),
      ])
    );
    loop.start();
    return () => loop.stop();
  }, [opacity]);

  return (
    <Animated.View
      className={className}
      style={[
        styles.block,
        {
          width,
          height,
          borderRadius: radius,
          backgroundColor: isDark ? colors.darkSurfaceSoft : colors.periwinkleSoft,
          borderColor: isDark ? colors.darkBorder : colors.border,
          opacity,
        },
      ]}
    />
  );
}

export function HomeSkeleton() {
  return (
    <View className="gap-6">
      <View>
        <SkeletonBlock width="58%" height={34} radius={12} />
        <SkeletonBlock width="74%" height={18} radius={9} className="mt-3" />
      </View>

      <View>
        <SkeletonBlock width="36%" height={24} radius={12} />
        <SkeletonBlock height={54} radius={22} className="mt-3" />
        <View className="mt-4 flex-row gap-4">
          <SkeletonBlock width={152} height={172} radius={24} />
          <SkeletonBlock width={152} height={172} radius={24} />
        </View>
      </View>

      <SkeletonBlock height={116} radius={24} />

      <View>
        <SkeletonBlock width="42%" height={24} radius={12} />
        <SkeletonBlock height={78} radius={18} className="mt-4" />
        <SkeletonBlock height={78} radius={18} className="mt-3" />
        <SkeletonBlock height={78} radius={18} className="mt-3" />
      </View>
    </View>
  );
}

export function ProfileSkeleton() {
  return (
    <View>
      <View className="items-center">
        <SkeletonBlock width={84} height={84} radius={42} />
        <SkeletonBlock width={136} height={28} radius={14} className="mt-5" />
        <SkeletonBlock width={196} height={18} radius={9} className="mt-3" />
      </View>

      <SkeletonBlock height={158} radius={24} className="mt-8" />
      <SkeletonBlock height={306} radius={24} className="mt-7" />
      <SkeletonBlock height={124} radius={24} className="mt-7" />
    </View>
  );
}

const styles = StyleSheet.create({
  block: {
    borderWidth: 1,
  },
});
