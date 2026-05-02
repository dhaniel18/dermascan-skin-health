import type { Product } from "@/types/domain";

export const recentProducts: Product[] = [
  {
    id: "1",
    name: "Gentle Vitamin C Serum",
    brand: "Glow Lab",
    price: "$28",
    score: 92,
    image: "🍊",
    category: "Serum"
  },
  {
    id: "2",
    name: "Barrier Repair Moisturizer",
    brand: "DermaKind",
    price: "$24",
    score: 88,
    image: "🧴",
    category: "Moisturizer"
  }
];

export const recommendedProducts: Product[] = [
  {
    id: "3",
    name: "Hydrating Cloud Toner",
    brand: "AquaBloom",
    price: "$18",
    score: 95,
    image: "💧",
    category: "Toner"
  },
  {
    id: "4",
    name: "Daily Mineral Sunscreen SPF 50",
    brand: "SunKind",
    price: "$22",
    score: 91,
    image: "☀️",
    category: "Sunscreen"
  }
];

export const savedProducts: Product[] = [
  ...recentProducts,
  ...recommendedProducts,
  {
    id: "5",
    name: "Soothing Centella Cream",
    brand: "CicaCare",
    price: "$26",
    score: 89,
    image: "🌿",
    category: "Cream"
  }
];

export const selectedLayeringProducts = ["Vitamin C Serum", "Niacinamide", "Retinol Cream"];

export const extraLayeringProducts = ["Hyaluronic Acid", "AHA/BHA Toner", "Sunscreen SPF 50", "Moisturizer"];
