import type { ScanHistoryItem } from "@/types/domain";

export const scanHistory: ScanHistoryItem[] = [
  { id: "scan-1", productName: "Gentle Vitamin C Serum", scannedAt: "Today", score: 92 },
  { id: "scan-2", productName: "Barrier Repair Moisturizer", scannedAt: "Yesterday", score: 88 },
  { id: "scan-3", productName: "Hydrating Cloud Toner", scannedAt: "Last week", score: 95 }
];

export const scanTips = [
  "Place the product label inside the frame.",
  "Use bright, even lighting for clearer text.",
  "Avoid glare on reflective packaging."
];
