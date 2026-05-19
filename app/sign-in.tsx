import { useState } from "react";
import { Alert, Text, View } from "react-native";
import { router } from "expo-router";
import { Screen } from "@/components/Screen";
import { Button } from "@/components/Button";
import { TextField } from "@/components/TextField";
import { Logo } from "@/components/Logo";
import { signIn } from "@/services/auth";

export default function SignInScreen() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSignIn = async () => {
    if (!email || !password) { Alert.alert("Missing fields", "Please enter email and password."); return; }
    setLoading(true);
    try {
      await signIn(email.trim(), password);
      router.replace("/(tabs)/home");
    } catch (e: unknown) {
      Alert.alert("Sign In Failed", e instanceof Error ? e.message : String(e));
    } finally { setLoading(false); }
  };

  return (
    <Screen>
      <View className="flex-1 justify-center gap-6 py-12">
        <Logo />
        <Text className="text-3xl font-extrabold text-navy dark:text-cloud">Welcome back</Text>
        <TextField label="Email" value={email} onChangeText={setEmail} autoCapitalize="none" keyboardType="email-address" placeholder="you@example.com" />
        <TextField label="Password" value={password} onChangeText={setPassword} secureTextEntry placeholder="••••••••" />
        <Button onPress={handleSignIn} loading={loading}>Sign In</Button>
        <Button variant="outline" onPress={() => router.push("/create-account")}>Create Account</Button>
      </View>
    </Screen>
  );
}
