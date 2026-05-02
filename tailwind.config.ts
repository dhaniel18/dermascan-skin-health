import type { Config } from "tailwindcss";

export default {
  content: ["./app/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}"],
  presets: [require("nativewind/preset")],
  theme: {
    extend: {
      colors: {
        navy: "#374375",
        cloud: "#FFFCF5",
        periwinkle: "#BABDE2",
        "periwinkle-soft": "#E8E9F6",
        maroon: "#895159",
        "maroon-soft": "#E9D5D8",
        peach: "#DFAEA1",
        "peach-soft": "#FBEEE9",
        muted: "#777D9A",
        border: "#E5E6F0",
        card: "#FFFFFF"
      },
      boxShadow: {
        soft: "0 4px 18px rgba(55, 67, 117, 0.08)",
        card: "0 8px 30px rgba(55, 67, 117, 0.12)"
      }
    }
  },
  plugins: []
} satisfies Config;
