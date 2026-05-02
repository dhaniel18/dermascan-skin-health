# DermaScan Expo

DermaScan has been migrated from a Vite React prototype to an Expo React Native app.

## Run

```bash
npm install
npx expo start
```

Open the QR code with Expo Go on your phone.

## Project shape

- `app/` contains the Expo Router screens and tab navigation.
- `components/` contains native UI primitives.
- `services/` contains the mock data layer for auth, profile, products, and scans.
- `lib/supabase.ts` is prepared for the next phase of Supabase integration.
- `src/` is kept only as the legacy web reference during migration.
