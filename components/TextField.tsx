import { Text, TextInput, TextInputProps, View } from "react-native";

type TextFieldProps = TextInputProps & {
  label: string;
};

export function TextField({ label, secureTextEntry, ...props }: TextFieldProps) {
  return (
    <View className="gap-2">
      <Text className="text-sm font-bold text-navy">{label}</Text>
      <TextInput
        {...props}
        secureTextEntry={secureTextEntry}
        placeholderTextColor="#777D9A"
        className="h-14 rounded-2xl border border-border bg-card px-4 text-base text-navy"
      />
    </View>
  );
}
