import { Eye, EyeOff } from "lucide-react-native";
import { useState } from "react";
import { Pressable, StyleSheet, Text, TextInput, TextInputProps, View } from "react-native";
import { useAppTheme } from "@/components/AppThemeProvider";
import { colors } from "@/constants/theme";

type TextFieldProps = TextInputProps & {
  label: string;
};

export function TextField({ label, secureTextEntry, ...props }: TextFieldProps) {
  const { isDark } = useAppTheme();
  const [passwordVisible, setPasswordVisible] = useState(false);
  const isPassword = Boolean(secureTextEntry);

  return (
    <View className="gap-2">
      <Text className="text-sm font-bold text-navy dark:text-cloud">{label}</Text>
      <View className="relative">
        <TextInput
          {...props}
          secureTextEntry={isPassword && !passwordVisible}
          placeholderTextColor="#777D9A"
          style={isDark ? styles.darkInput : undefined}
          className={`h-14 rounded-2xl border border-border bg-card px-4 text-base text-navy dark:border-darkBorder dark:bg-darkSurface dark:text-cloud ${
            isPassword ? "pr-14" : ""
          }`}
        />
        {isPassword ? (
          <Pressable
            accessibilityRole="button"
            accessibilityLabel={passwordVisible ? "Hide password" : "Show password"}
            onPress={() => setPasswordVisible((value) => !value)}
            className="absolute right-2 top-2 h-10 w-10 items-center justify-center rounded-full"
          >
            {passwordVisible ? (
              <EyeOff size={21} color={colors.muted} />
            ) : (
              <Eye size={21} color={colors.muted} />
            )}
          </Pressable>
        ) : null}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  darkInput: {
    borderColor: colors.periwinkle,
    borderWidth: 1.25,
  },
});
