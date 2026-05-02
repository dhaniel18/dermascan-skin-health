import { router } from "expo-router";
import { useState } from "react";
import { Alert, KeyboardAvoidingView, Platform, Pressable, Text, View } from "react-native";
import { BackButton } from "@/components/BackButton";
import { Button } from "@/components/Button";
import { Screen } from "@/components/Screen";
import { TextField } from "@/components/TextField";
import { signUp } from "@/services/auth";

export default function CreateAccountScreen() {
  const [name, setName] = useState("Derma User");
  const [email, setEmail] = useState("hello@dermascan.app");
  const [password, setPassword] = useState("password");
  const [agreed, setAgreed] = useState(true);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    if (!name || !email || !password) {
      Alert.alert("Missing details", "Please complete your account details.");
      return;
    }
    if (!agreed) {
      Alert.alert("Terms required", "Please agree to continue.");
      return;
    }

    setLoading(true);
    await signUp(name, email, password);
    setLoading(false);
    router.replace("/skin-setup" as never);
  };

  return (
    <Screen scroll={false}>
      <KeyboardAvoidingView behavior={Platform.OS === "ios" ? "padding" : undefined} className="flex-1">
        <BackButton />
        <View className="flex-1 justify-center gap-8">
          <View>
            <Text className="text-4xl font-extrabold text-navy">Create Account</Text>
            <Text className="mt-3 text-base text-muted">Start with a profile that matches your skin.</Text>
          </View>

          <View className="gap-4">
            <TextField label="Full Name" value={name} onChangeText={setName} autoCapitalize="words" />
            <TextField label="Email" value={email} onChangeText={setEmail} keyboardType="email-address" autoCapitalize="none" />
            <TextField label="Password" value={password} onChangeText={setPassword} secureTextEntry />
            <Pressable onPress={() => setAgreed((value) => !value)} className="flex-row items-center gap-3">
              <View className={`h-5 w-5 rounded-md border ${agreed ? "border-maroon bg-maroon" : "border-border bg-card"}`} />
              <Text className="flex-1 text-sm text-muted">I agree to the DermaScan terms and privacy policy.</Text>
            </Pressable>
          </View>
        </View>

        <Button onPress={handleSubmit} loading={loading} className="pb-4">
          Continue
        </Button>
      </KeyboardAvoidingView>
    </Screen>
  );
}
