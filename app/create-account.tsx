import { useState } from "react";
import { Alert, Modal, Pressable, ScrollView, Text, View } from "react-native";
import { router } from "expo-router";
import { Check } from "lucide-react-native";
import { Screen } from "@/components/Screen";
import { Button } from "@/components/Button";
import { TextField } from "@/components/TextField";
import { Logo } from "@/components/Logo";
import { BackButton } from "@/components/BackButton";
import { signUp } from "@/services/auth";
import { useAppTheme } from "@/components/AppThemeProvider";
import { colors } from "@/constants/theme";
import { PrivacyPolicyModal } from "@/components/PrivacyPolicyModal";

export default function CreateAccountScreen() {
  const { isDark } = useAppTheme();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [agree, setAgree] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [privacyVisible, setPrivacyVisible] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSignUp = async () => {
    if (!name || !email || !password) {
      Alert.alert("Missing fields", "Please fill in all fields.");
      return;
    }
    if (!agree) {
      Alert.alert(
        "Consent Required",
        "Please read and agree to the Terms & Conditions and consent to your anonymized data being used for the public to proceed."
      );
      return;
    }
    setLoading(true);
    try {
      await signUp(name.trim(), email.trim(), password, agree);
      router.replace("/skin-setup");
    } catch (e: unknown) {
      Alert.alert("Sign Up Failed", e instanceof Error ? e.message : String(e));
    } finally {
      setLoading(false);
    }
  };

  return (
    <Screen>
      <BackButton />
      <ScrollView contentContainerStyle={{ flexGrow: 1, justifyContent: "center" }} showsVerticalScrollIndicator={false}>
        <View className="flex-1 justify-center gap-6 py-6">
          <Logo />
          <Text className="text-3xl font-extrabold text-navy dark:text-cloud">Create Account</Text>
          <TextField label="Name" value={name} onChangeText={setName} placeholder="Your name" />
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
            placeholder="Min 8 chars, 1 uppercase, 1 number"
          />

          {/* Agreement Checkbox Row */}
          <View className="flex-row items-start gap-3 mt-1 px-1">
            <Pressable
              onPress={() => setAgree(!agree)}
              accessibilityRole="checkbox"
              accessibilityState={{ checked: agree }}
              className={`h-6 w-6 items-center justify-center rounded-md border ${
                agree
                  ? "bg-maroon border-maroon dark:bg-peach dark:border-peach"
                  : "border-border bg-card dark:border-darkBorder dark:bg-darkSurface"
              }`}
            >
              {agree ? (
                <Check size={14} color={isDark ? colors.navy : colors.cloud} strokeWidth={3} />
              ) : null}
            </Pressable>
            <View className="flex-1">
              <Text className="text-sm leading-5 text-muted dark:text-darkMuted">
                I agree to the{" "}
                <Text
                  onPress={() => setModalVisible(true)}
                  className="font-semibold text-maroon dark:text-peach underline"
                >
                  Terms & Conditions
                </Text>
                {", "}read the{" "}
                <Text
                  onPress={() => setPrivacyVisible(true)}
                  className="font-semibold text-maroon dark:text-peach underline"
                >
                  Privacy Policy
                </Text>
                , and consent that my scanned skin data may be anonymized and used for the public.
              </Text>
            </View>
          </View>

          <Button onPress={handleSignUp} loading={loading}>Create Account</Button>
        </View>
      </ScrollView>

      {/* Terms & Conditions Modal */}
      <Modal
        animationType="fade"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={{ flex: 1, backgroundColor: "rgba(32, 40, 79, 0.6)" }} className="justify-center items-center p-6">
          <View className="w-full max-h-[80%] rounded-3xl bg-card p-6 shadow-2xl dark:bg-darkSurface border border-border dark:border-darkBorder">
            {/* Header */}
            <View className="flex-row justify-between items-center mb-4 border-b border-border pb-3 dark:border-darkBorder">
              <Text className="text-xl font-extrabold text-navy dark:text-cloud">Terms & Data Consent</Text>
              <Pressable
                onPress={() => setModalVisible(false)}
                className="h-8 w-8 items-center justify-center rounded-full bg-periwinkleSoft dark:bg-darkSurfaceSoft"
              >
                <Text className="text-navy dark:text-cloud font-bold text-sm">✕</Text>
              </Pressable>
            </View>

            {/* Content */}
            <ScrollView showsVerticalScrollIndicator={true} className="pr-1">
              <Text className="text-xs font-semibold text-muted dark:text-darkMuted mb-4">Last Updated: June 2026</Text>

              <Text className="text-base font-bold text-navy dark:text-cloud mb-2">1. Public Data Contribution</Text>
              <Text className="text-sm text-muted dark:text-darkMuted mb-4 leading-5">
                By registering an account with DermaScan, you explicitly consent to let the app anonymize, clean, and aggregate your scanned product and skin health findings. This data will be used to improve public machine learning models, compile global skincare safety statistics, and raise dermatological health awareness.
              </Text>

              <Text className="text-base font-bold text-navy dark:text-cloud mb-2">2. Strict De-Identification</Text>
              <Text className="text-sm text-muted dark:text-darkMuted mb-4 leading-5">
                Your privacy is our utmost priority. All scans are strictly de-identified. No personally identifiable information (PII) such as your name, email address, password, or direct device identifier is ever associated with public datasets, research papers, or public analysis metrics.
              </Text>

              <Text className="text-base font-bold text-navy dark:text-cloud mb-2">3. Research & Education Purpose</Text>
              <Text className="text-sm text-muted dark:text-darkMuted mb-4 leading-5">
                This dataset compiles community-driven product ingredient safety ratings, allergen reports, and anonymous routine analysis. This enables dermatologists, researchers, and consumers worldwide to identify skin irritants, toxic chemical combinations, and optimize wellness routines.
              </Text>

              <Text className="text-base font-bold text-navy dark:text-cloud mb-2">4. Right to Withdraw & Modify</Text>
              <Text className="text-sm text-muted dark:text-darkMuted mb-6 leading-5">
                You maintain full control of your local scan history. You can view, delete, or clear your past scan entries at any time directly in your app profile settings, which will stop future aggregations of those specific files.
              </Text>
            </ScrollView>

            {/* Footer Button */}
            <Button
              onPress={() => {
                setAgree(true);
                setModalVisible(false);
              }}
              className="mt-4"
            >
              I Consent & Accept
            </Button>
          </View>
        </View>
      </Modal>

      <PrivacyPolicyModal
        visible={privacyVisible}
        onClose={() => setPrivacyVisible(false)}
      />
    </Screen>
  );
}
