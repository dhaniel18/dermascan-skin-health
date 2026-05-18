import { useState } from "react";
import {
  Alert, KeyboardAvoidingView, Platform,
  ScrollView, StyleSheet, Text, View,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { router } from "expo-router";
import { useAppTheme } from "@/components/AppThemeProvider";
import { Button } from "@/components/Button";
import { TextField } from "@/components/TextField";
import { Logo } from "@/components/Logo";
import { colors } from "@/constants/theme";
import { signIn } from "@/services/auth";

export default function SignInScreen() {
  const [email, setEmail]       = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading]   = useState(false);
  const { isDark } = useAppTheme();
  const insets = useSafeAreaInsets();

  const handleSignIn = async () => {
    if (!email || !password) {
      Alert.alert("Missing fields", "Please enter your email and password.");
      return;
    }
    setLoading(true);
    try {
      await signIn(email.trim(), password);
      router.replace("/(tabs)/home");
    } catch (e: unknown) {
      Alert.alert("Sign In Failed", e instanceof Error ? e.message : String(e));
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
            { paddingTop: 24 + insets.top, paddingBottom: 32 + insets.bottom }
          ]}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          <Logo />
          <View style={styles.form}>
            <Text style={[styles.heading, { color: isDark ? colors.cloud : colors.navy }]}>
              Welcome back
            </Text>
            <Text style={[styles.sub, { color: isDark ? colors.darkMuted : colors.muted }]}>
              Sign in to your DermaScan account
            </Text>
            <View style={styles.fields}>
              <TextField
                label="Email"
                value={email}
                onChangeText={setEmail}
                autoCapitalize="none"
                keyboardType="email-address"
                placeholder="you@example.com"
              />
              <TextField
                label="Password"
                value={password}
                onChangeText={setPassword}
                secureTextEntry
                placeholder="••••••••"
                returnKeyType="done"
                onSubmitEditing={handleSignIn}
              />
            </View>
            <View style={styles.buttons}>
              <Button onPress={handleSignIn} loading={loading}>Sign In</Button>
              <Button variant="outline" onPress={() => router.push("/create-account")}>
                Create Account
              </Button>
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  gradient: { flex: 1 },
  flex:     { flex: 1 },
  scroll:   { flexGrow: 1, paddingHorizontal: 24, gap: 32 },
  form:     { gap: 8 },
  heading:  { fontSize: 28, fontWeight: "800", marginBottom: 4 },
  sub:      { fontSize: 14, marginBottom: 8 },
  fields:   { gap: 16, marginBottom: 8 },
  buttons:  { gap: 12, marginTop: 8 },
});
