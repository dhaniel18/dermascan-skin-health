import { router } from "expo-router";
import { useState } from "react";
import { Alert, KeyboardAvoidingView, Platform, Text, View } from "react-native";
import { BackButton } from "@/components/BackButton";
import { Button } from "@/components/Button";
import { Screen } from "@/components/Screen";
import { TextField } from "@/components/TextField";
import { signIn } from "@/services/auth";

export default function SignInScreen() {
  const [email, setEmail] = useState("hello@dermascan.app");
  const [password, setPassword] = useState("password");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    if (!email || !password) {
      Alert.alert("Missing details", "Please enter your email and password.");
      return;
    }

    setLoading(true);
    await signIn(email, password);
    setLoading(false);
    router.replace("/skin-setup" as never);
  };

  return (
    <Screen scroll={false}>
      <KeyboardAvoidingView behavior={Platform.OS === "ios" ? "padding" : undefined} className="flex-1">
        <BackButton />
        <View className="flex-1 justify-center gap-8">
          <View>
            <Text className="text-4xl font-extrabold text-navy dark:text-cloud">Welcome Back!</Text>
            <Text className="mt-3 text-base text-muted dark:text-darkMuted">Sign in to continue your skin health routine.</Text>
          </View>

          <View className="gap-4">
            <TextField label="Email" value={email} onChangeText={setEmail} keyboardType="email-address" autoCapitalize="none" />
            <TextField label="Password" value={password} onChangeText={setPassword} secureTextEntry />
          </View>
        </View>

        <View className="gap-3 pb-4">
          <Button onPress={handleSubmit} loading={loading}>
            Sign In
          </Button>
          <Button variant="soft" onPress={() => router.push("/create-account" as never)}>
            Create a new account
          </Button>
        </View>
      </KeyboardAvoidingView>
    </Screen>
  );
}
