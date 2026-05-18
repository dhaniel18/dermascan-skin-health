import { useState } from "react";
import {
  Alert, KeyboardAvoidingView, Platform,
  Pressable, ScrollView, StyleSheet, Text, View,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { router } from "expo-router";
import { ArrowLeft } from "lucide-react-native";
import { useAppTheme } from "@/components/AppThemeProvider";
import { Button } from "@/components/Button";
import { TextField } from "@/components/TextField";
import { Logo } from "@/components/Logo";
import { colors } from "@/constants/theme";
import { signUp } from "@/services/auth";

export default function CreateAccountScreen() {
  const [name, setName]         = useState("");
  const [email, setEmail]       = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading]   = useState(false);
  const { isDark } = useAppTheme();
  const insets = useSafeAreaInsets();

  const handleSignUp = async () => {
    if (!name || !email || !password) {
      Alert.alert("Missing fields", "Please fill in all fields.");
      return;
    }
    setLoading(true);
    try {
      await signUp(name.trim(), email.trim(), password);
      router.replace("/skin-setup");
    } catch (e: unknown) {
      Alert.alert("Sign Up Failed", e instanceof Error ? e.message : String(e));
    } finally { setLoading(false); }
  };

  const gradientColors: [string, string] = isDark
    ? ["#20284F", "#2F3867"]
    : ["#FDF1EC", "#EDEEF9"];

  return (
    <LinearGradient colors={gradientColors} style={styles.gradient}>
      <KeyboardAvoidingView
        style={styles.flex}
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        keyboardVerticalOffset={Platform.OS === "ios" ? 0 : 20}
      >
        <ScrollView
          style={styles.flex}
          contentContainerStyle={[
            styles.scroll,
            { paddingTop: 16 + insets.top, paddingBottom: 32 + insets.bottom }
          ]}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          {/* Back button */}
          <Pressable
            onPress={() => router.canGoBack() ? router.back() : router.replace("/")}
            style={styles.back}
          >
            <ArrowLeft size={18} color={isDark ? colors.cloud : colors.navy} />
            <Text style={[styles.backText, { color: isDark ? colors.cloud : colors.navy }]}>
              Back
            </Text>
          </Pressable>

          <Logo />

          <View style={styles.form}>
            <Text style={[styles.heading, { color: isDark ? colors.cloud : colors.navy }]}>
              Create Account
            </Text>
            <Text style={[styles.sub, { color: isDark ? colors.darkMuted : colors.muted }]}>
              Join DermaScan to protect your skin
            </Text>
            <View style={styles.fields}>
              <TextField
                label="Name"
                value={name}
                onChangeText={setName}
                placeholder="Your name"
                returnKeyType="next"
              />
              <TextField
                label="Email"
                value={email}
                onChangeText={setEmail}
                autoCapitalize="none"
                keyboardType="email-address"
                placeholder="you@example.com"
                returnKeyType="next"
              />
              <TextField
                label="Password"
                value={password}
                onChangeText={setPassword}
                secureTextEntry
                placeholder="Min 8 chars, 1 uppercase, 1 number"
                returnKeyType="done"
                onSubmitEditing={handleSignUp}
              />
            </View>
            <Button onPress={handleSignUp} loading={loading}>
              Create Account
            </Button>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  gradient: { flex: 1 },
  flex:     { flex: 1 },
  scroll:   { flexGrow: 1, paddingHorizontal: 24, gap: 24 },
  back:     { flexDirection: "row", alignItems: "center", gap: 8, alignSelf: "flex-start" },
  backText: { fontSize: 16, fontWeight: "600" },
  form:     { gap: 8 },
  heading:  { fontSize: 28, fontWeight: "800", marginBottom: 4 },
  sub:      { fontSize: 14, marginBottom: 8 },
  fields:   { gap: 16, marginBottom: 8 },
});
