import type { SkinProfile } from "@/types/domain";

let profile: SkinProfile = {
  skinType: "combination",
  conditions: ["sensitive", "acne"],
  concerns: ["acne", "dullness", "redness"]
};

export const getSkinProfile = async (): Promise<SkinProfile> => profile;

export const saveSkinProfile = async (nextProfile: SkinProfile): Promise<SkinProfile> => {
  profile = nextProfile;
  return profile;
};
