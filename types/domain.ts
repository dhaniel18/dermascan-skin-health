export type User = {
  id: string;
  name: string;
  email: string;
};

export type SkinProfile = {
  skinType: string | null;
  conditions: string[];
  concerns: string[];
};

export type Product = {
  id: string;
  name: string;
  brand: string;
  price: string;
  score: number;
  image: string;
  category: string;
};

export type ScanHistoryItem = {
  id: string;
  productName: string;
  scannedAt: string;
  score: number;
};
