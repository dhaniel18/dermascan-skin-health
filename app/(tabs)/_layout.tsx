import { Tabs } from "expo-router";
import { Heart, Home, Layers, ScanLine, User } from "lucide-react-native";
import { Platform, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { colors } from "@/constants/theme";

const tabs = [
  { name: "home", title: "Home", icon: Home },
  { name: "layering", title: "Layering", icon: Layers },
  { name: "scan", title: "Scan", icon: ScanLine, center: true },
  { name: "saved", title: "Saved", icon: Heart },
  { name: "profile", title: "Profile", icon: User }
];

export default function TabLayout() {
  const insets = useSafeAreaInsets();
  const bottom = Math.max(insets.bottom, 10);

  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: colors.maroon,
        tabBarInactiveTintColor: colors.muted,
        tabBarLabelStyle: {
          fontSize: 11,
          fontWeight: "700",
          marginTop: 2
        },
        tabBarStyle: {
          height: 66 + bottom,
          paddingTop: 8,
          paddingBottom: bottom,
          borderTopColor: colors.border,
          backgroundColor: colors.card,
          position: Platform.OS === "android" ? "absolute" : "absolute"
        }
      }}
    >
      {tabs.map(({ name, title, icon: Icon, center }) => (
        <Tabs.Screen
          key={name}
          name={name}
          options={{
            title,
            tabBarIcon: ({ color, focused }) =>
              center ? (
                <View className="-mt-7 h-16 w-16 items-center justify-center rounded-full bg-maroon">
                  <Icon size={27} color={colors.cloud} strokeWidth={2.5} />
                </View>
              ) : (
                <Icon size={focused ? 24 : 22} color={color} strokeWidth={focused ? 2.7 : 2.1} />
              )
          }}
        />
      ))}
    </Tabs>
  );
}
