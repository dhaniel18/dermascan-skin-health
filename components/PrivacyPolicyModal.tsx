import { Modal, Pressable, ScrollView, Text, View, StyleSheet } from "react-native";
import { ShieldCheck } from "lucide-react-native";
import { Button } from "./Button";
import { colors } from "@/constants/theme";
import { useAppTheme } from "./AppThemeProvider";

type PrivacyPolicyModalProps = {
  visible: boolean;
  onClose: () => void;
};

export function PrivacyPolicyModal({ visible, onClose }: PrivacyPolicyModalProps) {
  const { isDark } = useAppTheme();

  return (
    <Modal
      animationType="fade"
      transparent={true}
      visible={visible}
      onRequestClose={onClose}
    >
      <View style={styles.backdrop} className="justify-center items-center p-6">
        <View className="w-full max-h-[85%] rounded-3xl bg-card p-6 shadow-2xl dark:bg-darkSurface border border-border dark:border-darkBorder">
          
          {/* Header */}
          <View className="flex-row justify-between items-center mb-4 border-b border-border pb-3 dark:border-darkBorder">
            <View className="flex-row items-center gap-2">
              <ShieldCheck size={24} color={isDark ? colors.peach : colors.maroon} />
              <Text className="text-xl font-extrabold text-navy dark:text-cloud">Privacy Policy</Text>
            </View>
            <Pressable
              onPress={onClose}
              className="h-8 w-8 items-center justify-center rounded-full bg-periwinkleSoft dark:bg-darkSurfaceSoft"
            >
              <Text className="text-navy dark:text-cloud font-bold text-sm">✕</Text>
            </Pressable>
          </View>

          {/* Content */}
          <ScrollView showsVerticalScrollIndicator={true} className="pr-1">
            <Text className="text-xs font-semibold text-muted dark:text-darkMuted mb-4">Last Updated: June 2026</Text>

            <Text className="text-sm text-navy dark:text-cloud leading-5 mb-5">
              Welcome to DermaScan. Your privacy is important to us. This Privacy Policy explains how DermaScan collects, uses, stores, and protects your information when you use our mobile application and related services.
            </Text>

            <View style={styles.divider} className="mb-5 bg-border dark:bg-darkBorder" />

            {/* Section 1 */}
            <Text className="text-base font-extrabold text-navy dark:text-cloud mb-2">1. Information We Collect</Text>
            
            <Text className="text-sm font-bold text-navy dark:text-cloud mb-1">Account Information</Text>
            <Text className="text-sm text-muted dark:text-darkMuted mb-3 leading-5">
              • Name and Email address{"\n"}
              • Authentication credentials managed securely through our provider (Supabase Auth).
            </Text>

            <Text className="text-sm font-bold text-navy dark:text-cloud mb-1">Skin Images & Scan Data</Text>
            <Text className="text-sm text-muted dark:text-darkMuted mb-3 leading-5">
              • When scanning product ingredients or capturing skin images, these are processed solely to provide cosmetic scoring, warnings, and compatibility checks.
            </Text>

            <Text className="text-sm font-bold text-navy dark:text-cloud mb-1">Usage & Preferences</Text>
            <Text className="text-sm text-muted dark:text-darkMuted mb-4 leading-5">
              • Device characteristics, operating system versions, diagnostic logs.{"\n"}
              • Skin profiles, skincare goals, skin concerns, and local scan history.
            </Text>

            <View style={styles.divider} className="mb-5 bg-border dark:bg-darkBorder" />

            {/* Section 2 */}
            <Text className="text-base font-extrabold text-navy dark:text-cloud mb-2">2. How We Use Your Information</Text>
            <Text className="text-sm text-muted dark:text-darkMuted mb-4 leading-5">
              We process your details exclusively to:{"\n"}
              • Perform real-time skincare ingredients rating and analysis.{"\n"}
              • Calculate routine layering checks to prevent active clashes (e.g., Vitamin C + Retinol).{"\n"}
              • Save personal routine logs and customize skin wellness preferences.{"\n"}
              • Identify technical glitches and enhance performance.
            </Text>

            <View style={styles.divider} className="mb-5 bg-border dark:bg-darkBorder" />

            {/* Section 3 */}
            <Text className="text-base font-extrabold text-navy dark:text-cloud mb-2">3. Data Storage & Security</Text>
            <Text className="text-sm text-muted dark:text-darkMuted mb-4 leading-5">
              Your details are protected using industry-grade SSL encryption and secure, ISO-certified hosting structures (Supabase). While we take every measure to keep your data safe, please note that no system is 100% immune to online hazards.
            </Text>

            <View style={styles.divider} className="mb-5 bg-border dark:bg-darkBorder" />

            {/* Section 4 */}
            <Text className="text-base font-extrabold text-navy dark:text-cloud mb-2">4. Zero Sale of Personal Data</Text>
            <Text className="text-sm text-muted dark:text-darkMuted mb-4 leading-5">
              We hold a strict policy against commercializing user information. We do **not** sell, lease, or distribute your email, profile, or skin metrics to third-party advertisers. Data is only shared to support base operations (such as authentication or database syncing).
            </Text>

            <View style={styles.divider} className="mb-5 bg-border dark:bg-darkBorder" />

            {/* Section 5 */}
            <Text className="text-base font-extrabold text-navy dark:text-cloud mb-2">5. Clinical Disclaimer</Text>
            <Text className="text-sm text-muted dark:text-darkMuted mb-4 leading-5">
              DermaScan provides informational ratings and compatibility summaries based on preloaded chemical literature. It does **not** constitute clinical diagnosis, medical prescription, or professional dermatological treatment. Always consult a certified dermatologist for persistent skin issues.
            </Text>

            <View style={styles.divider} className="mb-5 bg-border dark:bg-darkBorder" />

            {/* Section 6 */}
            <Text className="text-base font-extrabold text-navy dark:text-cloud mb-2">{"6. Children's Privacy"}</Text>
            <Text className="text-sm text-muted dark:text-darkMuted mb-4 leading-5">
              DermaScan is not structured for children under the age of 13. If we become aware of child account data, it is instantly expunged from database servers.
            </Text>

            <View style={styles.divider} className="mb-5 bg-border dark:bg-darkBorder" />

            {/* Section 7 */}
            <Text className="text-base font-extrabold text-navy dark:text-cloud mb-2">7. User Rights & Data Deletion</Text>
            <Text className="text-sm text-muted dark:text-darkMuted mb-4 leading-5">
              You maintain total autonomy over your profile. You can modify your details, update settings, or wipe your scan history and account permanently in your Profile Settings at any time.
            </Text>

            <View style={styles.divider} className="mb-5 bg-border dark:bg-darkBorder" />

            {/* Section 8 */}
            <Text className="text-base font-extrabold text-navy dark:text-cloud mb-2">8. Contact Details</Text>
            <Text className="text-sm text-muted dark:text-darkMuted mb-4 leading-5">
              For any questions regarding your data settings, feel free to email:{"\n"}
              **Email:** wisnulintang111@gmail.com
            </Text>
          </ScrollView>

          {/* Footer */}
          <Button onPress={onClose} className="mt-4">
            Understood
          </Button>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  backdrop: {
    flex: 1,
    backgroundColor: "rgba(32, 40, 79, 0.65)",
  },
  divider: {
    height: 1,
    width: "100%",
    opacity: 0.8,
  },
});
