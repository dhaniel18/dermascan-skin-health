import { Tabs } from "expo-router";
import { Heart, Home, Layers, ScanLine, User } from "lucide-react-native";
import { Platform, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useAppTheme } from "@/components/AppThemeProvider";
import { colors } from "@/constants/theme";

const tabs = [
  { name: "home",     title: "Home",     icon: Home },
  { name: "layering", title: "Layering", icon: Layers },
  { name: "scan",     title: "Scan",     icon: ScanLine, center: true },
  { name: "saved",    title: "Saved",    icon: Heart },
  { name: "profile",  title: "Profile",  icon: User },
];

export const TAB_BAR_HEIGHT = 66;

export default function TabLayout() {
  const insets = useSafeAreaInsets();
  const { isDark } = useAppTheme();

  // Home indicator height on iPhone (≥ X) is typically 34pt.
  // On Android with gesture nav it can be 16–24pt.
  // useSafeAreaInsets().bottom gives us the exact value per device.
  const safeBottom = Math.max(insets.bottom, 0);
  const tabBarHeight = TAB_BAR_HEIGHT + safeBottom;

  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor:   isDark ? colors.peach  : colors.maroon,
        tabBarInactiveTintColor: isDark ? colors.darkMuted : colors.muted,
        tabBarLabelStyle: {
          fontSize: 11,
          fontWeight: "700",
          marginTop: 2,
        },
        tabBarStyle: {
          height: tabBarHeight,
          paddingTop: 8,
          paddingBottom: safeBottom,
          borderTopWidth: 1,
          borderTopColor: isDark ? colors.darkBorder : colors.border,
          backgroundColor: isDark ? colors.darkSurface : colors.card,
          // Sit on top of content — Screen.tsx adds matching bottom padding
          position: "absolute",
          bottom: 0,
          left: 0,
          right: 0,
          // Subtle shadow so it lifts off content
          ...Platform.select({
            ios: {
              shadowColor: "#000",
              shadowOffset: { width: 0, height: -2 },
              shadowOpacity: 0.06,
              shadowRadius: 8,
            },
            android: {
              elevation: 12,
            },
          }),
        },
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
                // Floating scan button — sits above the tab bar
                <View
                  style={{
                    marginTop: -28,
                    width: 64,
                    height: 64,
                    borderRadius: 32,
                    backgroundColor: colors.maroon,
                    alignItems: "center",
                    justifyContent: "center",
                    // Shadow for the floating button
                    ...Platform.select({
                      ios: {
                        shadowColor: colors.maroon,
                        shadowOffset: { width: 0, height: 4 },
                        shadowOpacity: 0.4,
                        shadowRadius: 8,
                      },
                      android: {
                        elevation: 8,
                      },
                    }),
                  }}
                >
                  <Icon size={27} color={colors.cloud} strokeWidth={2.5} />
                </View>
              ) : (
                <Icon
                  size={focused ? 24 : 22}
                  color={color}
                  strokeWidth={focused ? 2.7 : 2.1}
                />
              ),
          }}
        />
      ))}
    </Tabs>
  );
}
