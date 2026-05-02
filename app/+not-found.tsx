import { Link } from "expo-router";
import { Text, View } from "react-native";
import { Button } from "@/components/Button";
import { Screen } from "@/components/Screen";

export default function NotFoundScreen() {
  return (
    <Screen scroll={false}>
      <View className="flex-1 items-center justify-center gap-4">
        <Text className="text-3xl font-extrabold text-navy">Page not found</Text>
        <Text className="text-center text-muted">The screen you opened is not available in DermaScan.</Text>
        <Link href="/" asChild>
          <Button className="w-full">Back to Welcome</Button>
        </Link>
      </View>
    </Screen>
  );
}
