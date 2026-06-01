# ✨ DermaScan — Skin Health & Skincare Layering Assistant

<div align="center">
  <img src="./assets/images/icon.png" width="128" height="128" style="border-radius: 28px;" alt="DermaScan Logo" />
  <p><strong>Your companion for smart ingredient analysis, compatibility checking, and personalized skin health monitoring.</strong></p>
</div>

---

## 🌟 Overview

**DermaScan** is a premium, cross-platform mobile application designed to help users demystify skincare ingredients and establish healthy, irritation-free routines. By combining personalized skin type analysis with dynamic ingredient screening and compatibility mapping, DermaScan empowers consumers to make educated decisions at the shelf.

No more guessing whether your Retinol clashes with Vitamin C, or whether a popular moisturizer will trigger your acne. DermaScan screens it all in seconds.

---

## 🚀 Key Features

*   🔍 **Barcode & Ingredient Scanning**
    *   Surgically extract cosmetic ingredient texts or barcode lists.
    *   Instantly screen ingredient safety, allergen counts, and comedogenic ratings.
    *   Provides a clean **Skin Health Score (0 - 100)** for every product based on your skin type.
*   🧪 **Advanced Skincare Layering Check**
    *   Verify product compatibility dynamically.
    *   Prevents hazardous combinations that strip the skin barrier (e.g. Retinol + Benzoyl Peroxide, AHA + BHA, multiple high-strength acids).
    *   Explains *why* the combination clashes and offers alternative routine scheduling (e.g., AM vs. PM).
*   👤 **Personalized Skin Profile**
    *   Configure skin type: Dry, Normal, Oily, Combination, or Sensitive.
    *   Select conditions: Acne-Prone, Rosacea, Eczema, Fungal Acne, etc.
    *   Highlight key goals/concerns: Anti-aging, hydration, brightening, redness, or texture.
*   🗺️ **Discover & Search Skincare**
    *   Explore a deep, pre-loaded catalog of over 500 validated dermatological ingredients.
    *   Lookup safety indices, category descriptions, and comedogenic ratings.
*   📅 **Saved Scans & History**
    *   Maintain a local journal of all scans and routines.
    *   Keep records of safe and warning-flagged cosmetics to review anytime.
*   🌗 **Rich Premium UI**
    *   Tailored light and dark modes built on a modern HSL-based palette.
    *   Fluid micro-animations, custom native overlays, and beautiful layouts.

---

## 🛠️ Tech Stack

*   **Framework**: [Expo SDK 54](https://expo.dev/) (React Native)
*   **Routing**: [Expo Router v3](https://docs.expo.dev/router/introduction/) (File-based navigation)
*   **Language**: [TypeScript](https://www.typescriptlang.org/)
*   **Styling**: [NativeWind (Tailwind CSS v4)](https://www.nativewind.dev/)
*   **Icons**: [Lucide React Native](https://lucide.dev/)
*   **Backend & Auth**: [Supabase](https://supabase.com/) (PostgreSQL database, Row Level Security, Auth service)

---

## 📂 Project Structure

```
DermaScanClean/
├── app/                  # Expo Router directory (screens & layouts)
│   ├── (tabs)/           # Main tab-bar navigation (Home, Layering, Scan, Saved, Profile)
│   ├── _layout.tsx       # Root entry & theme provider configuration
│   ├── create-account.tsx# Signup page with terms & privacy modals
│   ├── discover.tsx      # Curated skincare library & ingredient database
│   ├── index.tsx         # Launch gate & auth resolver
│   ├── sign-in.tsx       # Login screen
│   └── skin-setup.tsx    # Skin analysis configuration wizard
├── assets/               # Image assets (logos, adaptive icons, splashes)
├── components/           # Reusable UI components (buttons, textfields, modals)
├── constants/            # Theme colors, static config, and option sets
├── lib/                  # Skincare core logic & ingredient compatibility engines
├── security/             # Encryption, de-identification & data privacy protocols
├── services/             # Supabase & backend api handlers (auth, profiles, scans)
├── supabase/             # Database migrations, configuration, and seed data
├── package.json          # System dependencies and scripts
└── app.json              # Expo application manifest
```

---

## ⚡ Setup & Installation

### 1. Prerequisites
Ensure you have the following installed on your system:
*   [Node.js](https://nodejs.org/) (v18 or higher recommended)
*   [npm](https://www.npmjs.com/) or [yarn](https://yarnpkg.com/)
*   [Expo Go app](https://expo.dev/go) (for testing on real iOS/Android devices)

### 2. Install Dependencies
Clone the repository and run:
```bash
npm install
```

### 3. Setup Environment Variables
Create a `.env.local` file in the root directory and copy the contents from `.env.example`:
```env
EXPO_PUBLIC_SUPABASE_URL=your-supabase-project-url
EXPO_PUBLIC_SUPABASE_ANON_KEY=your-supabase-anon-key
```

### 4. Seed database in Supabase
This project relies on a comprehensive seed database of over 500 skincare ingredients and interaction rules. To import these:
1. Log in to your **Supabase Dashboard**.
2. Open the **SQL Editor** in your project.
3. Copy and run the SQL instructions located in `supabase/seed.sql`.

### 5. Running Locally
Start the development server:
```bash
npm run start
```
*   Press **`a`** to open in Android Emulator (requires Android Studio).
*   Press **`i`** to open in iOS Simulator (requires macOS and Xcode).
*   Scan the QR code on your terminal with **Expo Go** to test instantly on a physical phone.

---

## 📄 Privacy & Data Transparency

DermaScan is built around a robust, de-identified model:
*   **Privacy-First Scanning**: All skin profiles and scan queries are strictly anonymized prior to database indexing.
*   **Local Control**: Users maintain full discretion over their local history and can wipe scanned records instantly through the account profile settings.
*   **Full Privacy Policy**: Read the integrated document in `PrivacyPolicy.md` or directly inside the app under **Profile -> Preferences -> Privacy Policy**.

---

## ⚖️ Disclaimer

*DermaScan is built for educational, cosmetic-screening, and routine-tracking purposes only. The application does not offer medical advice, dermatological diagnostics, or clinical treatment regimens. Please consult a board-certified dermatologist for chronic skin concerns.*
