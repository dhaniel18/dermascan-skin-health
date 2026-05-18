import { LinearGradient } from "expo-linear-gradient";
import { ReactNode } from "react";
import { RefreshControl, ScrollView, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useAppTheme } from "@/components/AppThemeProvider";

const TAB_BAR_HEIGHT = 66;

type ScreenProps = {
  children: ReactNode;
  scroll?: boolean;
  padded?: boolean;
  refreshControl?: React.ReactElement<typeof RefreshControl>;
};

export function Screen({ children, scroll = true, padded = true, refreshControl }: ScreenProps) {
  const { isDark } = useAppTheme();
  const insets = useSafeAreaInsets();

  const topPad    = padded ? 16 + insets.top : insets.top;
  const bottomPad = TAB_BAR_HEIGHT + Math.max(insets.bottom, 10);
  const sidePad   = padded ? 24 : 0;

  // Light mode: warm peach-to-periwinkle — clearly visible, not near-white
  // Dark mode: deep navy gradient
  const gradientColors: [string, string] = isDark
    ? ["#20284F", "#2F3867"]
    : ["#FDF1EC", "#EDEEF9"];

  return (
    <LinearGradient colors={gradientColors} style={{ flex: 1 }}>
      {scroll ? (
        <ScrollView
          style={{ flex: 1 }}
          contentContainerStyle={{
            paddingHorizontal: sidePad,
            paddingTop: topPad,
            paddingBottom: bottomPad + 16,
          }}
          showsVerticalScrollIndicator={false}
          refreshControl={refreshControl}
          scrollIndicatorInsets={{ bottom: bottomPad }}
        >
          {children}
        </ScrollView>
      ) : (
        <View style={{
          flex: 1,
          paddingHorizontal: sidePad,
          paddingTop: topPad,
          paddingBottom: bottomPad,
        }}>
          {children}
        </View>
      )}
    </LinearGradient>
  );
}
