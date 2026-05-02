import { router } from "expo-router";
import { ArrowLeft } from "lucide-react-native";
import { useState } from "react";
import { Pressable, ScrollView, Text, View } from "react-native";
import { BackButton } from "@/components/BackButton";
import { Button } from "@/components/Button";
import { OptionCard } from "@/components/OptionCard";
import { Screen } from "@/components/Screen";
import { skinConditions, skinConcerns, skinTypes } from "@/constants/options";
import { colors } from "@/constants/theme";
import { saveSkinProfile } from "@/services/profile";

type Step = 1 | 2 | 3;

export default function SkinSetupScreen() {
  const [step, setStep] = useState<Step>(1);
  const [skinType, setSkinType] = useState<string | null>(null);
  const [conditions, setConditions] = useState<string[]>([]);
  const [concerns, setConcerns] = useState<string[]>([]);

  const toggle = (items: string[], setItems: (next: string[]) => void, id: string) => {
    setItems(items.includes(id) ? items.filter((item) => item !== id) : [...items, id]);
  };

  const next = async () => {
    if (step < 3) {
      setStep((step + 1) as Step);
      return;
    }

    await saveSkinProfile({ skinType, conditions, concerns });
    router.replace("/home" as never);
  };

  return (
    <Screen scroll={false}>
      <View className="flex-1">
        <View className="flex-row gap-2 pb-6">
          {[1, 2, 3].map((item) => (
            <View key={item} className={`h-1.5 flex-1 rounded-full ${item <= step ? "bg-maroon" : "bg-periwinkle-soft"}`} />
          ))}
        </View>

        {step > 1 ? (
          <Pressable onPress={() => setStep((step - 1) as Step)} className="mb-4 flex-row items-center gap-2 self-start">
            <ArrowLeft size={18} color={colors.navy} />
            <Text className="text-base font-semibold text-navy">Back</Text>
          </Pressable>
        ) : (
          <BackButton />
        )}

        <Text className="text-sm text-muted">Step {step} of 3</Text>

        <View className="mt-2 flex-1">
          {step === 1 ? (
            <>
              <Text className="text-3xl font-extrabold text-navy">What's your skin type?</Text>
              <Text className="mt-2 text-base text-muted">This helps us recommend the right products for you.</Text>
              <ScrollView className="mt-6 flex-1" contentContainerClassName="gap-3 pb-6" showsVerticalScrollIndicator={false}>
                {skinTypes.map((item) => (
                  <OptionCard key={item.id} {...item} selected={skinType === item.id} onPress={() => setSkinType(item.id)} />
                ))}
              </ScrollView>
            </>
          ) : null}

          {step === 2 ? (
            <>
              <Text className="text-3xl font-extrabold text-navy">Any skin conditions?</Text>
              <Text className="mt-2 text-base text-muted">Select all that apply (optional).</Text>
              <ScrollView className="mt-6 flex-1" contentContainerClassName="gap-3 pb-6" showsVerticalScrollIndicator={false}>
                {skinConditions.map((item) => (
                  <OptionCard
                    key={item.id}
                    {...item}
                    selected={conditions.includes(item.id)}
                    onPress={() => toggle(conditions, setConditions, item.id)}
                  />
                ))}
              </ScrollView>
            </>
          ) : null}

          {step === 3 ? (
            <>
              <Text className="text-3xl font-extrabold text-navy">What are your main concerns?</Text>
              <Text className="mt-2 text-base text-muted">Select all that apply.</Text>
              <ScrollView className="mt-6 flex-1" contentContainerClassName="pb-6" showsVerticalScrollIndicator={false}>
                <View className="flex-row flex-wrap gap-3">
                  {skinConcerns.map((item) => (
                    <View key={item.id} className="w-[47%]">
                      <OptionCard
                        {...item}
                        compact
                        selected={concerns.includes(item.id)}
                        onPress={() => toggle(concerns, setConcerns, item.id)}
                      />
                    </View>
                  ))}
                </View>
              </ScrollView>
            </>
          ) : null}
        </View>

        <Button onPress={next} disabled={step === 1 && !skinType} className="pb-4">
          {step === 3 ? "Finish & Start Scanning" : "Continue"}
        </Button>
      </View>
    </Screen>
  );
}
