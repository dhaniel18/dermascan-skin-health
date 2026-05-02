import { Pressable, Text, View } from "react-native";

type OptionCardProps = {
  emoji: string;
  title: string;
  desc?: string;
  selected?: boolean;
  compact?: boolean;
  onPress: () => void;
};

export function OptionCard({ emoji, title, desc, selected, compact, onPress }: OptionCardProps) {
  return (
    <Pressable
      accessibilityRole="button"
      onPress={onPress}
      className={`rounded-3xl border-2 bg-card ${compact ? "items-center gap-2 p-4" : "flex-row items-center gap-4 p-4"} ${
        selected ? "border-maroon bg-peach-soft" : "border-transparent"
      }`}
    >
      <Text className="text-3xl">{emoji}</Text>
      <View className={compact ? "items-center" : "flex-1"}>
        <Text className={`font-bold text-navy ${compact ? "text-center text-sm" : "text-base"}`}>{title}</Text>
        {desc ? <Text className="mt-1 text-sm text-muted">{desc}</Text> : null}
      </View>
    </Pressable>
  );
}
