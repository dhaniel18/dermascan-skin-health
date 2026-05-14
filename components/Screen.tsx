import { LinearGradient } from "expo-linear-gradient";
import { ReactNode } from "react";
import { RefreshControl, ScrollView, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useAppTheme } from "@/components/AppThemeProvider";

type ScreenProps = {
  children: ReactNode;
  scroll?: boolean;
  padded?: boolean;
  refreshControl?: React.ReactElement<typeof RefreshControl>;
};

export function Screen({ children, scroll = true, padded = true, refreshControl }: ScreenProps) {
  const { isDark } = useAppTheme();

  return (
    <LinearGradient colors={isDark ? ["#20284F", "#2F3867"] : ["#FFFCF5", "#F3F4FB"]} className="flex-1">
      <SafeAreaView className="flex-1">
        {scroll ? (
          <ScrollView
            className="flex-1"
            contentContainerClassName={`${padded ? "px-6 pt-4" : ""} pb-8`}
            showsVerticalScrollIndicator={false}
            refreshControl={refreshControl}
          >
            {children}
          </ScrollView>
        ) : (
          <View className={`flex-1 ${padded ? "px-6 pt-4" : ""}`}>{children}</View>
        )}
      </SafeAreaView>
    </LinearGradient>
  );
}
