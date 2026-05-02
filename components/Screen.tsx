import { LinearGradient } from "expo-linear-gradient";
import { ReactNode } from "react";
import { ScrollView, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

type ScreenProps = {
  children: ReactNode;
  scroll?: boolean;
  padded?: boolean;
};

export function Screen({ children, scroll = true, padded = true }: ScreenProps) {
  return (
    <LinearGradient colors={["#FFFCF5", "#F3F4FB"]} className="flex-1">
      <SafeAreaView className="flex-1">
        {scroll ? (
          <ScrollView
            className="flex-1"
            contentContainerClassName={`${padded ? "px-6 pt-4" : ""} pb-8`}
            showsVerticalScrollIndicator={false}
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
