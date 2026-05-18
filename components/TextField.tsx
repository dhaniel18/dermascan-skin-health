import { StyleSheet, Text, TextInput, TextInputProps, View } from "react-native";
import { useAppTheme } from "@/components/AppThemeProvider";
import { colors } from "@/constants/theme";

type TextFieldProps = TextInputProps & { label: string };

export function TextField({ label, secureTextEntry, style, ...props }: TextFieldProps) {
  const { isDark } = useAppTheme();

  return (
    <View style={styles.wrapper}>
      <Text style={[styles.label, { color: isDark ? colors.cloud : colors.navy }]}>
        {label}
      </Text>
      <TextInput
        {...props}
        secureTextEntry={secureTextEntry}
        placeholderTextColor={colors.muted}
        style={[
          styles.input,
          {
            backgroundColor: isDark ? colors.darkSurface : "#F0F1FA",
            borderColor:     isDark ? colors.darkBorder  : colors.periwinkle,
            color:           isDark ? colors.cloud       : colors.navy,
          },
          style,
        ]}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: { gap: 8 },
  label: { fontSize: 14, fontWeight: "700" },
  input: {
    height: 56,
    borderRadius: 16,
    borderWidth: 1.5,
    paddingHorizontal: 16,
    fontSize: 16,
  },
});
