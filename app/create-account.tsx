import { useState } from "react";
import { Alert, Text, View } from "react-native";
import { router } from "expo-router";
import { Screen } from "@/components/Screen";
import { Button } from "@/components/Button";
import { TextField } from "@/components/TextField";
import { Logo } from "@/components/Logo";
import { BackButton } from "@/components/BackButton";
import { signUp } from "@/services/auth";

export default function CreateAccountScreen() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSignUp = async () => {
    if (!name || !email || !password) { Alert.alert("Missing fields", "Please fill in all fields."); return; }
    setLoading(true);
    try {
      await signUp(name.trim(), email.trim(), password);
      router.replace("/skin-setup");
    } catch (e: unknown) {
      Alert.alert("Sign Up Failed", e instanceof Error ? e.message : String(e));
    } finally { setLoading(false); }
  };

  return (
    <Screen>
      <BackButton />
      <View className="flex-1 justify-center gap-6 py-6">
        <Logo />
        <Text className="text-3xl font-extrabold text-navy dark:text-cloud">Create Account</Text>
        <TextField label="Name" value={name} onChangeText={setName} placeholder="Your name" />
        <TextField label="Email" value={email} onChangeText={setEmail} autoCapitalize="none" keyboardType="email-address" placeholder="you@example.com" />
        <TextField label="Password" value={password} onChangeText={setPassword} secureTextEntry placeholder="Min 8 chars, 1 uppercase, 1 number" />
        <Button onPress={handleSignUp} loading={loading}>Create Account</Button>
      </View>
    </Screen>
  );
}
