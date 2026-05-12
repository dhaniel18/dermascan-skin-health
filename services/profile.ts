import AsyncStorage from "@react-native-async-storage/async-storage";
import type { SkinProfile } from "@/types/domain";

const SKIN_PROFILE_KEY = "dermascan:skin-profile";

export const getSkinProfile = async (): Promise<SkinProfile | null> => {
  const savedProfile = await AsyncStorage.getItem(SKIN_PROFILE_KEY);

  if (!savedProfile) {
    return null;
  }

  return JSON.parse(savedProfile) as SkinProfile;
};

export const saveSkinProfile = async (nextProfile: SkinProfile): Promise<SkinProfile> => {
  await AsyncStorage.setItem(SKIN_PROFILE_KEY, JSON.stringify(nextProfile));
  return nextProfile;
};
