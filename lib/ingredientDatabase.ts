// ============================================================
// DermaScan — Local Ingredient Database
// Bundled from Ingredient_List.json + Combination_List.json.
// Used for on-device analysis so the app works offline.
// Source datasets:
//   • Ingredient_List.json  (100 ingredients, proprietary)
//   • Combination_List.json (25 warning rules, proprietary)
//   • HuggingFace: yavuzyilmaz/cosmetic-ingredients — fetched at
//     runtime via fetchExtraIngredients() when online (MIT licence).
// ============================================================

import type { Ingredient, CombinationWarning } from "@/types/domain";

export const INGREDIENTS: Ingredient[] = [
  {
    "id": "ING-001",
    "name": "Salicylic Acid",
    "aliases": [
      "BHA",
      "Beta Hydroxy Acid"
    ],
    "isComedogenic": false,
    "allergenRisk": "Low",
    "unsuitableFor": [
      "Extremely Dry",
      "Sensitive"
    ],
    "category": "Active - Exfoliant"
  },
  {
    "id": "ING-002",
    "name": "Retinol",
    "aliases": [
      "Vitamin A",
      "Retinyl Palmitate"
    ],
    "isComedogenic": false,
    "allergenRisk": "Medium",
    "unsuitableFor": [
      "Sensitive",
      "Pregnant"
    ],
    "category": "Active - Anti-aging"
  },
  {
    "id": "ING-003",
    "name": "Niacinamide",
    "aliases": [
      "Vitamin B3",
      "Nicotinamide"
    ],
    "isComedogenic": false,
    "allergenRisk": "Low",
    "unsuitableFor": [
      "None"
    ],
    "category": "Active - Brightening"
  },
  {
    "id": "ING-004",
    "name": "Ascorbic Acid",
    "aliases": [
      "Vitamin C",
      "L-Ascorbic Acid"
    ],
    "isComedogenic": false,
    "allergenRisk": "Medium",
    "unsuitableFor": [
      "Sensitive"
    ],
    "category": "Active - Antioxidant"
  },
  {
    "id": "ING-005",
    "name": "Ceramide NP",
    "aliases": [
      "Ceramide 3"
    ],
    "isComedogenic": false,
    "allergenRisk": "Low",
    "unsuitableFor": [
      "None"
    ],
    "category": "Hydrator"
  },
  {
    "id": "ING-006",
    "name": "Mineral Oil",
    "aliases": [
      "Paraffinum Liquidum",
      "Petrolatum"
    ],
    "isComedogenic": true,
    "allergenRisk": "Low",
    "unsuitableFor": [
      "Oily",
      "Acne-Prone"
    ],
    "category": "Emollient"
  },
  {
    "id": "ING-007",
    "name": "Fragrance",
    "aliases": [
      "Parfum",
      "Perfume",
      "Essential Oil"
    ],
    "isComedogenic": false,
    "allergenRisk": "High",
    "unsuitableFor": [
      "Sensitive",
      "Acne-Prone"
    ],
    "category": "Additive"
  },
  {
    "id": "ING-008",
    "name": "Alcohol Denat",
    "aliases": [
      "SD Alcohol",
      "Denatured Alcohol",
      "Ethanol"
    ],
    "isComedogenic": false,
    "allergenRisk": "High",
    "unsuitableFor": [
      "Dry",
      "Sensitive"
    ],
    "category": "Solvent"
  },
  {
    "id": "ING-009",
    "name": "Dimethicone",
    "aliases": [
      "Polydimethylsiloxane"
    ],
    "isComedogenic": true,
    "allergenRisk": "Low",
    "unsuitableFor": [
      "Oily",
      "Acne-Prone"
    ],
    "category": "Silicone"
  },
  {
    "id": "ING-010",
    "name": "Sodium Hyaluronate",
    "aliases": [
      "Hyaluronic Acid",
      "HA"
    ],
    "isComedogenic": false,
    "allergenRisk": "Low",
    "unsuitableFor": [
      "None"
    ],
    "category": "Hydrator"
  },
  {
    "id": "ING-011",
    "name": "Glycolic Acid",
    "aliases": [
      "AHA",
      "Alpha Hydroxy Acid"
    ],
    "isComedogenic": false,
    "allergenRisk": "Medium",
    "unsuitableFor": [
      "Sensitive",
      "Rosacea"
    ],
    "category": "Active - Exfoliant"
  },
  {
    "id": "ING-012",
    "name": "Lactic Acid",
    "aliases": [
      "AHA"
    ],
    "isComedogenic": false,
    "allergenRisk": "Low",
    "unsuitableFor": [
      "Extremely Sensitive"
    ],
    "category": "Active - Exfoliant"
  },
  {
    "id": "ING-013",
    "name": "Mandelic Acid",
    "aliases": [
      "AHA"
    ],
    "isComedogenic": false,
    "allergenRisk": "Low",
    "unsuitableFor": [
      "None"
    ],
    "category": "Active - Exfoliant"
  },
  {
    "id": "ING-014",
    "name": "Gluconolactone",
    "aliases": [
      "PHA",
      "Polyhydroxy Acid"
    ],
    "isComedogenic": false,
    "allergenRisk": "Low",
    "unsuitableFor": [
      "None"
    ],
    "category": "Active - Exfoliant"
  },
  {
    "id": "ING-015",
    "name": "Panthenol",
    "aliases": [
      "Pro-Vitamin B5"
    ],
    "isComedogenic": false,
    "allergenRisk": "Low",
    "unsuitableFor": [
      "None"
    ],
    "category": "Soothing Agent"
  },
  {
    "id": "ING-016",
    "name": "Glycerin",
    "aliases": [
      "Glycerol"
    ],
    "isComedogenic": false,
    "allergenRisk": "Low",
    "unsuitableFor": [
      "None"
    ],
    "category": "Hydrator"
  },
  {
    "id": "ING-017",
    "name": "Centella Asiatica Extract",
    "aliases": [
      "Cica",
      "Gotu Kola"
    ],
    "isComedogenic": false,
    "allergenRisk": "Low",
    "unsuitableFor": [
      "None"
    ],
    "category": "Botanical - Soothing"
  },
  {
    "id": "ING-018",
    "name": "Aloe Barbadensis Leaf Juice",
    "aliases": [
      "Aloe Vera"
    ],
    "isComedogenic": false,
    "allergenRisk": "Low",
    "unsuitableFor": [
      "None"
    ],
    "category": "Botanical - Soothing"
  },
  {
    "id": "ING-019",
    "name": "Melaleuca Alternifolia Leaf Oil",
    "aliases": [
      "Tea Tree Oil"
    ],
    "isComedogenic": false,
    "allergenRisk": "Medium",
    "unsuitableFor": [
      "Sensitive"
    ],
    "category": "Botanical - Anti-acne"
  },
  {
    "id": "ING-020",
    "name": "Squalane",
    "aliases": [
      "Plant Squalane"
    ],
    "isComedogenic": false,
    "allergenRisk": "Low",
    "unsuitableFor": [
      "None"
    ],
    "category": "Emollient"
  },
  {
    "id": "ING-021",
    "name": "Butyrospermum Parkii Butter",
    "aliases": [
      "Shea Butter"
    ],
    "isComedogenic": true,
    "allergenRisk": "Low",
    "unsuitableFor": [
      "Oily",
      "Acne-Prone"
    ],
    "category": "Emollient"
  },
  {
    "id": "ING-022",
    "name": "Simmondsia Chinensis Seed Oil",
    "aliases": [
      "Jojoba Oil"
    ],
    "isComedogenic": false,
    "allergenRisk": "Low",
    "unsuitableFor": [
      "None"
    ],
    "category": "Emollient"
  },
  {
    "id": "ING-023",
    "name": "Rosa Canina Fruit Oil",
    "aliases": [
      "Rosehip Oil"
    ],
    "isComedogenic": false,
    "allergenRisk": "Low",
    "unsuitableFor": [
      "None"
    ],
    "category": "Emollient"
  },
  {
    "id": "ING-024",
    "name": "Tocopherol",
    "aliases": [
      "Vitamin E"
    ],
    "isComedogenic": false,
    "allergenRisk": "Low",
    "unsuitableFor": [
      "None"
    ],
    "category": "Antioxidant"
  },
  {
    "id": "ING-025",
    "name": "Phenoxyethanol",
    "aliases": [
      "Preservative"
    ],
    "isComedogenic": false,
    "allergenRisk": "Low",
    "unsuitableFor": [
      "None"
    ],
    "category": "Preservative"
  },
  {
    "id": "ING-026",
    "name": "Methylparaben",
    "aliases": [
      "Paraben"
    ],
    "isComedogenic": false,
    "allergenRisk": "Medium",
    "unsuitableFor": [
      "Sensitive"
    ],
    "category": "Preservative"
  },
  {
    "id": "ING-027",
    "name": "Propylparaben",
    "aliases": [
      "Paraben"
    ],
    "isComedogenic": false,
    "allergenRisk": "Medium",
    "unsuitableFor": [
      "Sensitive"
    ],
    "category": "Preservative"
  },
  {
    "id": "ING-028",
    "name": "Sodium Lauryl Sulfate",
    "aliases": [
      "SLS"
    ],
    "isComedogenic": true,
    "allergenRisk": "High",
    "unsuitableFor": [
      "Dry",
      "Sensitive",
      "Acne-Prone"
    ],
    "category": "Surfactant"
  },
  {
    "id": "ING-029",
    "name": "Sodium Laureth Sulfate",
    "aliases": [
      "SLES"
    ],
    "isComedogenic": false,
    "allergenRisk": "Medium",
    "unsuitableFor": [
      "Dry",
      "Sensitive"
    ],
    "category": "Surfactant"
  },
  {
    "id": "ING-030",
    "name": "Cocamidopropyl Betaine",
    "aliases": [
      "CAPB"
    ],
    "isComedogenic": false,
    "allergenRisk": "Low",
    "unsuitableFor": [
      "None"
    ],
    "category": "Surfactant"
  },
  {
    "id": "ING-031",
    "name": "Zinc Oxide",
    "aliases": [
      "Mineral UV Filter"
    ],
    "isComedogenic": false,
    "allergenRisk": "Low",
    "unsuitableFor": [
      "None"
    ],
    "category": "UV Filter"
  },
  {
    "id": "ING-032",
    "name": "Titanium Dioxide",
    "aliases": [
      "Mineral UV Filter"
    ],
    "isComedogenic": false,
    "allergenRisk": "Low",
    "unsuitableFor": [
      "None"
    ],
    "category": "UV Filter"
  },
  {
    "id": "ING-033",
    "name": "Avobenzone",
    "aliases": [
      "Butyl Methoxydibenzoylmethane"
    ],
    "isComedogenic": false,
    "allergenRisk": "Medium",
    "unsuitableFor": [
      "Sensitive"
    ],
    "category": "UV Filter"
  },
  {
    "id": "ING-034",
    "name": "Octinoxate",
    "aliases": [
      "Ethylhexyl Methoxycinnamate"
    ],
    "isComedogenic": false,
    "allergenRisk": "Low",
    "unsuitableFor": [
      "None"
    ],
    "category": "UV Filter"
  },
  {
    "id": "ING-035",
    "name": "Linalool",
    "aliases": [
      "Fragrance Component"
    ],
    "isComedogenic": false,
    "allergenRisk": "High",
    "unsuitableFor": [
      "Sensitive"
    ],
    "category": "Additive"
  },
  {
    "id": "ING-036",
    "name": "Limonene",
    "aliases": [
      "Fragrance Component"
    ],
    "isComedogenic": false,
    "allergenRisk": "High",
    "unsuitableFor": [
      "Sensitive"
    ],
    "category": "Additive"
  },
  {
    "id": "ING-037",
    "name": "Allantoin",
    "aliases": [],
    "isComedogenic": false,
    "allergenRisk": "Low",
    "unsuitableFor": [
      "None"
    ],
    "category": "Soothing Agent"
  },
  {
    "id": "ING-038",
    "name": "Snail Secretion Filtrate",
    "aliases": [
      "Snail Mucin"
    ],
    "isComedogenic": false,
    "allergenRisk": "Low",
    "unsuitableFor": [
      "None"
    ],
    "category": "Hydrator"
  },
  {
    "id": "ING-039",
    "name": "Caprylic/Capric Triglyceride",
    "aliases": [
      "Fractionated Coconut Oil"
    ],
    "isComedogenic": false,
    "allergenRisk": "Low",
    "unsuitableFor": [
      "None"
    ],
    "category": "Emollient"
  },
  {
    "id": "ING-040",
    "name": "Cocos Nucifera Oil",
    "aliases": [
      "Coconut Oil"
    ],
    "isComedogenic": true,
    "allergenRisk": "Low",
    "unsuitableFor": [
      "Oily",
      "Acne-Prone"
    ],
    "category": "Emollient"
  },
  {
    "id": "ING-041",
    "name": "Olea Europaea Fruit Oil",
    "aliases": [
      "Olive Oil"
    ],
    "isComedogenic": true,
    "allergenRisk": "Low",
    "unsuitableFor": [
      "Oily",
      "Acne-Prone"
    ],
    "category": "Emollient"
  },
  {
    "id": "ING-042",
    "name": "Argania Spinosa Kernel Oil",
    "aliases": [
      "Argan Oil"
    ],
    "isComedogenic": false,
    "allergenRisk": "Low",
    "unsuitableFor": [
      "None"
    ],
    "category": "Emollient"
  },
  {
    "id": "ING-043",
    "name": "Isopropyl Myristate",
    "aliases": [],
    "isComedogenic": true,
    "allergenRisk": "Low",
    "unsuitableFor": [
      "Oily",
      "Acne-Prone"
    ],
    "category": "Emollient"
  },
  {
    "id": "ING-044",
    "name": "Isopropyl Palmitate",
    "aliases": [],
    "isComedogenic": true,
    "allergenRisk": "Low",
    "unsuitableFor": [
      "Oily",
      "Acne-Prone"
    ],
    "category": "Emollient"
  },
  {
    "id": "ING-045",
    "name": "Cetearyl Alcohol",
    "aliases": [
      "Fatty Alcohol"
    ],
    "isComedogenic": false,
    "allergenRisk": "Low",
    "unsuitableFor": [
      "None"
    ],
    "category": "Emulsifier"
  },
  {
    "id": "ING-046",
    "name": "Stearyl Alcohol",
    "aliases": [
      "Fatty Alcohol"
    ],
    "isComedogenic": true,
    "allergenRisk": "Low",
    "unsuitableFor": [
      "Oily",
      "Acne-Prone"
    ],
    "category": "Emulsifier"
  },
  {
    "id": "ING-047",
    "name": "Myristic Acid",
    "aliases": [
      "Fatty Acid"
    ],
    "isComedogenic": true,
    "allergenRisk": "Low",
    "unsuitableFor": [
      "Oily",
      "Acne-Prone"
    ],
    "category": "Surfactant"
  },
  {
    "id": "ING-048",
    "name": "Palmitic Acid",
    "aliases": [
      "Fatty Acid"
    ],
    "isComedogenic": true,
    "allergenRisk": "Low",
    "unsuitableFor": [
      "Oily",
      "Acne-Prone"
    ],
    "category": "Emulsifier"
  },
  {
    "id": "ING-049",
    "name": "Stearic Acid",
    "aliases": [
      "Fatty Acid"
    ],
    "isComedogenic": true,
    "allergenRisk": "Low",
    "unsuitableFor": [
      "Oily",
      "Acne-Prone"
    ],
    "category": "Emulsifier"
  },
  {
    "id": "ING-050",
    "name": "Butylene Glycol",
    "aliases": [],
    "isComedogenic": false,
    "allergenRisk": "Low",
    "unsuitableFor": [
      "None"
    ],
    "category": "Solvent"
  },
  {
    "id": "ING-051",
    "name": "Propylene Glycol",
    "aliases": [],
    "isComedogenic": false,
    "allergenRisk": "Medium",
    "unsuitableFor": [
      "Sensitive"
    ],
    "category": "Solvent"
  },
  {
    "id": "ING-052",
    "name": "Propanediol",
    "aliases": [],
    "isComedogenic": false,
    "allergenRisk": "Low",
    "unsuitableFor": [
      "None"
    ],
    "category": "Solvent"
  },
  {
    "id": "ING-053",
    "name": "Cyclopentasiloxane",
    "aliases": [
      "Silicone",
      "D5"
    ],
    "isComedogenic": false,
    "allergenRisk": "Low",
    "unsuitableFor": [
      "None"
    ],
    "category": "Silicone"
  },
  {
    "id": "ING-054",
    "name": "Cyclohexasiloxane",
    "aliases": [
      "Silicone"
    ],
    "isComedogenic": false,
    "allergenRisk": "Low",
    "unsuitableFor": [
      "None"
    ],
    "category": "Silicone"
  },
  {
    "id": "ING-055",
    "name": "Amodimethicone",
    "aliases": [
      "Silicone"
    ],
    "isComedogenic": false,
    "allergenRisk": "Low",
    "unsuitableFor": [
      "None"
    ],
    "category": "Silicone"
  },
  {
    "id": "ING-056",
    "name": "Disodium EDTA",
    "aliases": [
      "EDTA"
    ],
    "isComedogenic": false,
    "allergenRisk": "Low",
    "unsuitableFor": [
      "None"
    ],
    "category": "Chelating Agent"
  },
  {
    "id": "ING-057",
    "name": "Tetrasodium EDTA",
    "aliases": [
      "EDTA"
    ],
    "isComedogenic": false,
    "allergenRisk": "Low",
    "unsuitableFor": [
      "None"
    ],
    "category": "Chelating Agent"
  },
  {
    "id": "ING-058",
    "name": "Carbomer",
    "aliases": [],
    "isComedogenic": false,
    "allergenRisk": "Low",
    "unsuitableFor": [
      "None"
    ],
    "category": "Texture Enhancer"
  },
  {
    "id": "ING-059",
    "name": "Xanthan Gum",
    "aliases": [],
    "isComedogenic": false,
    "allergenRisk": "Low",
    "unsuitableFor": [
      "None"
    ],
    "category": "Texture Enhancer"
  },
  {
    "id": "ING-060",
    "name": "Sodium Hydroxide",
    "aliases": [
      "Lye"
    ],
    "isComedogenic": false,
    "allergenRisk": "Medium",
    "unsuitableFor": [
      "Sensitive"
    ],
    "category": "pH Adjuster"
  },
  {
    "id": "ING-061",
    "name": "Citric Acid",
    "aliases": [],
    "isComedogenic": false,
    "allergenRisk": "Medium",
    "unsuitableFor": [
      "Sensitive"
    ],
    "category": "pH Adjuster"
  },
  {
    "id": "ING-062",
    "name": "Triethanolamine",
    "aliases": [
      "TEA"
    ],
    "isComedogenic": true,
    "allergenRisk": "Medium",
    "unsuitableFor": [
      "Oily",
      "Acne-Prone",
      "Sensitive"
    ],
    "category": "pH Adjuster"
  },
  {
    "id": "ING-063",
    "name": "Benzyl Alcohol",
    "aliases": [
      "Preservative"
    ],
    "isComedogenic": false,
    "allergenRisk": "High",
    "unsuitableFor": [
      "Sensitive"
    ],
    "category": "Preservative"
  },
  {
    "id": "ING-064",
    "name": "Ethylhexylglycerin",
    "aliases": [],
    "isComedogenic": false,
    "allergenRisk": "Low",
    "unsuitableFor": [
      "None"
    ],
    "category": "Preservative"
  },
  {
    "id": "ING-065",
    "name": "Chlorphenesin",
    "aliases": [
      "Preservative"
    ],
    "isComedogenic": false,
    "allergenRisk": "Low",
    "unsuitableFor": [
      "None"
    ],
    "category": "Preservative"
  },
  {
    "id": "ING-066",
    "name": "Potassium Sorbate",
    "aliases": [
      "Preservative"
    ],
    "isComedogenic": false,
    "allergenRisk": "Low",
    "unsuitableFor": [
      "None"
    ],
    "category": "Preservative"
  },
  {
    "id": "ING-067",
    "name": "Sodium Benzoate",
    "aliases": [
      "Preservative"
    ],
    "isComedogenic": false,
    "allergenRisk": "Low",
    "unsuitableFor": [
      "None"
    ],
    "category": "Preservative"
  },
  {
    "id": "ING-068",
    "name": "BHT",
    "aliases": [
      "Butylated Hydroxytoluene"
    ],
    "isComedogenic": false,
    "allergenRisk": "Medium",
    "unsuitableFor": [
      "None"
    ],
    "category": "Antioxidant"
  },
  {
    "id": "ING-069",
    "name": "BHA (Preservative)",
    "aliases": [
      "Butylated Hydroxyanisole"
    ],
    "isComedogenic": false,
    "allergenRisk": "Medium",
    "unsuitableFor": [
      "None"
    ],
    "category": "Antioxidant"
  },
  {
    "id": "ING-070",
    "name": "Talc",
    "aliases": [
      "Talcum Powder"
    ],
    "isComedogenic": true,
    "allergenRisk": "Low",
    "unsuitableFor": [
      "Oily",
      "Acne-Prone"
    ],
    "category": "Absorbent"
  },
  {
    "id": "ING-071",
    "name": "Mica",
    "aliases": [
      "Colorant"
    ],
    "isComedogenic": false,
    "allergenRisk": "Low",
    "unsuitableFor": [
      "None"
    ],
    "category": "Colorant"
  },
  {
    "id": "ING-072",
    "name": "Iron Oxides",
    "aliases": [
      "CI 77491",
      "CI 77492",
      "CI 77499"
    ],
    "isComedogenic": false,
    "allergenRisk": "Low",
    "unsuitableFor": [
      "None"
    ],
    "category": "Colorant"
  },
  {
    "id": "ING-073",
    "name": "Bismuth Oxychloride",
    "aliases": [
      "CI 77163"
    ],
    "isComedogenic": true,
    "allergenRisk": "Low",
    "unsuitableFor": [
      "Acne-Prone"
    ],
    "category": "Colorant"
  },
  {
    "id": "ING-074",
    "name": "Kojic Acid",
    "aliases": [],
    "isComedogenic": false,
    "allergenRisk": "Medium",
    "unsuitableFor": [
      "Sensitive"
    ],
    "category": "Active - Brightening"
  },
  {
    "id": "ING-075",
    "name": "Alpha-Arbutin",
    "aliases": [
      "Arbutin"
    ],
    "isComedogenic": false,
    "allergenRisk": "Low",
    "unsuitableFor": [
      "None"
    ],
    "category": "Active - Brightening"
  },
  {
    "id": "ING-076",
    "name": "Tranexamic Acid",
    "aliases": [],
    "isComedogenic": false,
    "allergenRisk": "Low",
    "unsuitableFor": [
      "None"
    ],
    "category": "Active - Brightening"
  },
  {
    "id": "ING-077",
    "name": "Azelaic Acid",
    "aliases": [],
    "isComedogenic": false,
    "allergenRisk": "Low",
    "unsuitableFor": [
      "None"
    ],
    "category": "Active - Anti-acne"
  },
  {
    "id": "ING-078",
    "name": "Benzoyl Peroxide",
    "aliases": [
      "BPO"
    ],
    "isComedogenic": false,
    "allergenRisk": "High",
    "unsuitableFor": [
      "Dry",
      "Sensitive"
    ],
    "category": "Active - Anti-acne"
  },
  {
    "id": "ING-079",
    "name": "Sulfur",
    "aliases": [],
    "isComedogenic": false,
    "allergenRisk": "Low",
    "unsuitableFor": [
      "Dry"
    ],
    "category": "Active - Anti-acne"
  },
  {
    "id": "ING-080",
    "name": "Urea",
    "aliases": [],
    "isComedogenic": false,
    "allergenRisk": "Low",
    "unsuitableFor": [
      "None"
    ],
    "category": "Hydrator"
  },
  {
    "id": "ING-081",
    "name": "Copper Peptides",
    "aliases": [
      "GHK-Cu"
    ],
    "isComedogenic": false,
    "allergenRisk": "Low",
    "unsuitableFor": [
      "None"
    ],
    "category": "Active - Anti-aging"
  },
  {
    "id": "ING-082",
    "name": "Matrixyl 3000",
    "aliases": [
      "Palmitoyl Tetrapeptide-7",
      "Palmitoyl Tripeptide-1"
    ],
    "isComedogenic": false,
    "allergenRisk": "Low",
    "unsuitableFor": [
      "None"
    ],
    "category": "Active - Anti-aging"
  },
  {
    "id": "ING-083",
    "name": "Argireline",
    "aliases": [
      "Acetyl Hexapeptide-8"
    ],
    "isComedogenic": false,
    "allergenRisk": "Low",
    "unsuitableFor": [
      "None"
    ],
    "category": "Active - Anti-aging"
  },
  {
    "id": "ING-084",
    "name": "Resveratrol",
    "aliases": [],
    "isComedogenic": false,
    "allergenRisk": "Low",
    "unsuitableFor": [
      "None"
    ],
    "category": "Antioxidant"
  },
  {
    "id": "ING-085",
    "name": "Ferulic Acid",
    "aliases": [],
    "isComedogenic": false,
    "allergenRisk": "Low",
    "unsuitableFor": [
      "None"
    ],
    "category": "Antioxidant"
  },
  {
    "id": "ING-086",
    "name": "Phytic Acid",
    "aliases": [],
    "isComedogenic": false,
    "allergenRisk": "Low",
    "unsuitableFor": [
      "None"
    ],
    "category": "Antioxidant"
  },
  {
    "id": "ING-087",
    "name": "Beta-Glucan",
    "aliases": [],
    "isComedogenic": false,
    "allergenRisk": "Low",
    "unsuitableFor": [
      "None"
    ],
    "category": "Hydrator"
  },
  {
    "id": "ING-088",
    "name": "Ceramide EOP",
    "aliases": [
      "Ceramide 1"
    ],
    "isComedogenic": false,
    "allergenRisk": "Low",
    "unsuitableFor": [
      "None"
    ],
    "category": "Hydrator"
  },
  {
    "id": "ING-089",
    "name": "Ceramide AP",
    "aliases": [
      "Ceramide 6 II"
    ],
    "isComedogenic": false,
    "allergenRisk": "Low",
    "unsuitableFor": [
      "None"
    ],
    "category": "Hydrator"
  },
  {
    "id": "ING-090",
    "name": "Cholesterol",
    "aliases": [],
    "isComedogenic": false,
    "allergenRisk": "Low",
    "unsuitableFor": [
      "None"
    ],
    "category": "Emollient"
  },
  {
    "id": "ING-091",
    "name": "Phytosphingosine",
    "aliases": [],
    "isComedogenic": false,
    "allergenRisk": "Low",
    "unsuitableFor": [
      "None"
    ],
    "category": "Hydrator"
  },
  {
    "id": "ING-092",
    "name": "Camellia Sinensis Leaf Extract",
    "aliases": [
      "Green Tea Extract"
    ],
    "isComedogenic": false,
    "allergenRisk": "Low",
    "unsuitableFor": [
      "None"
    ],
    "category": "Botanical - Antioxidant"
  },
  {
    "id": "ING-093",
    "name": "Glycyrrhiza Glabra Root Extract",
    "aliases": [
      "Licorice Root Extract"
    ],
    "isComedogenic": false,
    "allergenRisk": "Low",
    "unsuitableFor": [
      "None"
    ],
    "category": "Botanical - Brightening"
  },
  {
    "id": "ING-094",
    "name": "Chamomilla Recutita Flower Extract",
    "aliases": [
      "Chamomile Extract"
    ],
    "isComedogenic": false,
    "allergenRisk": "Medium",
    "unsuitableFor": [
      "Sensitive"
    ],
    "category": "Botanical - Soothing"
  },
  {
    "id": "ING-095",
    "name": "Rosmarinus Officinalis Leaf Extract",
    "aliases": [
      "Rosemary Extract"
    ],
    "isComedogenic": false,
    "allergenRisk": "Medium",
    "unsuitableFor": [
      "Sensitive"
    ],
    "category": "Botanical - Antioxidant"
  },
  {
    "id": "ING-096",
    "name": "Eugenol",
    "aliases": [
      "Fragrance Component"
    ],
    "isComedogenic": false,
    "allergenRisk": "High",
    "unsuitableFor": [
      "Sensitive"
    ],
    "category": "Additive"
  },
  {
    "id": "ING-097",
    "name": "Geraniol",
    "aliases": [
      "Fragrance Component"
    ],
    "isComedogenic": false,
    "allergenRisk": "High",
    "unsuitableFor": [
      "Sensitive"
    ],
    "category": "Additive"
  },
  {
    "id": "ING-098",
    "name": "Citronellol",
    "aliases": [
      "Fragrance Component"
    ],
    "isComedogenic": false,
    "allergenRisk": "High",
    "unsuitableFor": [
      "Sensitive"
    ],
    "category": "Additive"
  },
  {
    "id": "ING-099",
    "name": "Hexyl Cinnamal",
    "aliases": [
      "Fragrance Component"
    ],
    "isComedogenic": false,
    "allergenRisk": "High",
    "unsuitableFor": [
      "Sensitive"
    ],
    "category": "Additive"
  },
  {
    "id": "ING-100",
    "name": "Octocrylene",
    "aliases": [
      "UV Filter"
    ],
    "isComedogenic": false,
    "allergenRisk": "Medium",
    "unsuitableFor": [
      "Sensitive"
    ],
    "category": "UV Filter"
  }
];

export const COMBINATION_WARNINGS: CombinationWarning[] = [
  {
    "ruleId": "WARN-001",
    "ingredient1": "ING-001",
    "ingredient2": "ING-002",
    "severity": "High",
    "title": "Severe Barrier Risk",
    "message": "BAHAYA: Mencampur BHA (Salicylic Acid) dan Retinol dapat menyebabkan iritasi parah, kemerahan, dan mengelupas. Pisahkan penggunaannya (BHA Pagi / Retinol Malam)."
  },
  {
    "ruleId": "WARN-002",
    "ingredient1": "ING-004",
    "ingredient2": "ING-002",
    "severity": "Medium",
    "title": "pH Imbalance & Irritation",
    "message": "PERINGATAN: Vitamin C dan Retinol bekerja di tingkat pH yang berbeda dan sangat mengiritasi jika digabung. Gunakan Vitamin C di pagi hari dan Retinol di malam hari."
  },
  {
    "ruleId": "WARN-003",
    "ingredient1": "ING-001",
    "ingredient2": "ING-004",
    "severity": "High",
    "title": "Acid Overload",
    "message": "BAHAYA: Menggunakan BHA bersamaan dengan Vitamin C (Ascorbic Acid) sangat rentan memicu iritasi dan rasa terbakar pada kulit karena keduanya bersifat asam."
  },
  {
    "ruleId": "WARN-004",
    "ingredient1": "ING-011",
    "ingredient2": "ING-002",
    "severity": "High",
    "title": "Severe Barrier Risk",
    "message": "BAHAYA: Glycolic Acid (AHA) adalah eksfoliator kuat. Melapisinya dengan Retinol akan menghancurkan skin barrier. Selang-seling penggunaan di malam yang berbeda."
  },
  {
    "ruleId": "WARN-005",
    "ingredient1": "ING-012",
    "ingredient2": "ING-002",
    "severity": "High",
    "title": "Severe Barrier Risk",
    "message": "BAHAYA: Lactic Acid (AHA) ditambah Retinol berisiko tinggi membuat kulit kering terkelupas dan sensitif terhadap cahaya matahari."
  },
  {
    "ruleId": "WARN-006",
    "ingredient1": "ING-011",
    "ingredient2": "ING-001",
    "severity": "Medium",
    "title": "Over-Exfoliation Risk",
    "message": "PERINGATAN: Menggabungkan AHA (Glycolic) dan BHA dapat menyebabkan over-eksfoliasi. Hanya gunakan jika kulitmu sangat toleran atau formulanya memang sudah dicampur dari pabrik."
  },
  {
    "ruleId": "WARN-007",
    "ingredient1": "ING-078",
    "ingredient2": "ING-002",
    "severity": "High",
    "title": "Ingredient Deactivation",
    "message": "BAHAYA: Benzoyl Peroxide dan Retinol akan saling membatalkan efektivitas satu sama lain (deaktivasi) sekaligus memicu kekeringan kulit yang ekstrem."
  },
  {
    "ruleId": "WARN-008",
    "ingredient1": "ING-078",
    "ingredient2": "ING-004",
    "severity": "High",
    "title": "Oxidation Warning",
    "message": "BAHAYA: Benzoyl Peroxide akan langsung mengoksidasi Vitamin C, membuatnya tidak berguna sama sekali untuk kulitmu."
  },
  {
    "ruleId": "WARN-009",
    "ingredient1": "ING-078",
    "ingredient2": "ING-001",
    "severity": "High",
    "title": "Extreme Dryness Risk",
    "message": "BAHAYA: BHA dan Benzoyl Peroxide adalah dua agen anti-jerawat yang sangat mengeringkan. Melapisinya dapat memicu inflamasi dan luka pada jerawat."
  },
  {
    "ruleId": "WARN-010",
    "ingredient1": "ING-081",
    "ingredient2": "ING-004",
    "severity": "High",
    "title": "Ingredient Deactivation",
    "message": "BAHAYA: Copper Peptides dan Vitamin C murni (Ascorbic Acid) tidak boleh digabung. Vitamin C akan memecah rantai peptida dan membuatnya tidak berfungsi."
  },
  {
    "ruleId": "WARN-011",
    "ingredient1": "ING-081",
    "ingredient2": "ING-011",
    "severity": "High",
    "title": "Peptide Breakdown",
    "message": "BAHAYA: Tingkat keasaman yang tinggi dari Glycolic Acid (AHA) akan merusak ikatan asam amino pada Copper Peptides."
  },
  {
    "ruleId": "WARN-012",
    "ingredient1": "ING-081",
    "ingredient2": "ING-001",
    "severity": "Medium",
    "title": "Peptide Breakdown",
    "message": "PERINGATAN: BHA dapat menurunkan pH kulit secara drastis, berisiko mengganggu kerja seluler dari Copper Peptides."
  },
  {
    "ruleId": "WARN-013",
    "ingredient1": "ING-011",
    "ingredient2": "ING-004",
    "severity": "High",
    "title": "Acid Overload",
    "message": "BAHAYA: Glycolic Acid dan Vitamin C sama-sama mengandalkan lingkungan pH rendah. Melapisinya dapat memicu rasa terbakar yang hebat, terutama pada kulit sensitif."
  },
  {
    "ruleId": "WARN-014",
    "ingredient1": "ING-004",
    "ingredient2": "ING-003",
    "severity": "Medium",
    "title": "Potential Niacin Flush",
    "message": "PERINGATAN: Meski banyak diperdebatkan, menggabungkan Vitamin C murni dan Niacinamide pada kulit yang sensitif dapat memicu kemerahan sementara (Niacin Flush)."
  },
  {
    "ruleId": "WARN-015",
    "ingredient1": "ING-008",
    "ingredient2": "ING-002",
    "severity": "High",
    "title": "Excessive Drying",
    "message": "BAHAYA: Produk dengan kandungan Alcohol Denat tinggi akan merusak lipid kulit, dan jika digabung dengan Retinol, akan menyebabkan iritasi parah."
  },
  {
    "ruleId": "WARN-016",
    "ingredient1": "ING-008",
    "ingredient2": "ING-011",
    "severity": "Medium",
    "title": "Barrier Disruption",
    "message": "PERINGATAN: AHA (Glycolic Acid) sudah mengelupas kulit mati. Menambahkan produk berbasis Alkohol tinggi akan menembus terlalu dalam dan memicu sensasi perih."
  },
  {
    "ruleId": "WARN-017",
    "ingredient1": "ING-077",
    "ingredient2": "ING-011",
    "severity": "Medium",
    "title": "Exfoliation Overload",
    "message": "PERINGATAN: Azelaic Acid memiliki sifat eksfoliasi ringan. Digabungkan dengan Glycolic Acid (AHA) bisa terlalu agresif untuk pemula."
  },
  {
    "ruleId": "WARN-018",
    "ingredient1": "ING-077",
    "ingredient2": "ING-001",
    "severity": "Medium",
    "title": "Exfoliation Overload",
    "message": "PERINGATAN: BHA dan Azelaic Acid sama-sama merawat pori-pori. Melapisinya bisa menyebabkan kulit terasa tertarik dan kering."
  },
  {
    "ruleId": "WARN-019",
    "ingredient1": "ING-074",
    "ingredient2": "ING-011",
    "severity": "Medium",
    "title": "High Irritation Potential",
    "message": "PERINGATAN: Kojic Acid (pencerah) dapat mengiritasi kulit. Melapisinya dengan AHA (Glycolic Acid) meningkatkan penyerapan Kojic Acid ke tingkat yang bisa memicu dermatitis kontak."
  },
  {
    "ruleId": "WARN-020",
    "ingredient1": "ING-074",
    "ingredient2": "ING-002",
    "severity": "Medium",
    "title": "High Irritation Potential",
    "message": "PERINGATAN: Retinol dan Kojic Acid sangat ampuh untuk hiperpigmentasi, tetapi melapisinya secara bersamaan berisiko tinggi menimbulkan peradangan."
  },
  {
    "ruleId": "WARN-021",
    "ingredient1": "ING-028",
    "ingredient2": "ING-002",
    "severity": "High",
    "title": "Surfactant Damage",
    "message": "BAHAYA: Menggunakan pembersih keras berbahan SLS (Sodium Lauryl Sulfate) sebelum mengoleskan Retinol akan memperparah efek samping Retinol secara eksponensial."
  },
  {
    "ruleId": "WARN-022",
    "ingredient1": "ING-028",
    "ingredient2": "ING-011",
    "severity": "High",
    "title": "Surfactant Damage",
    "message": "BAHAYA: Sabun cuci muka berbahan SLS mengikis minyak alami kulit. Diikuti dengan toner AHA, ini adalah resep pasti untuk merusak skin barrier."
  },
  {
    "ruleId": "WARN-023",
    "ingredient1": "ING-078",
    "ingredient2": "ING-011",
    "severity": "High",
    "title": "Chemical Burn Risk",
    "message": "BAHAYA: Benzoyl Peroxide digabungkan dengan Glycolic Acid sangat korosif pada kulit dan dapat memicu luka bakar kimiawi tingkat ringan."
  },
  {
    "ruleId": "WARN-024",
    "ingredient1": "ING-078",
    "ingredient2": "ING-012",
    "severity": "High",
    "title": "Chemical Burn Risk",
    "message": "BAHAYA: Benzoyl Peroxide dan Lactic Acid (AHA). Jangan pernah melapisinya kecuali atas anjuran langsung dari dokter kulit spesialis."
  },
  {
    "ruleId": "WARN-025",
    "ingredient1": "ING-081",
    "ingredient2": "ING-002",
    "severity": "Medium",
    "title": "Tolerability Issue",
    "message": "PERINGATAN: Meskipun tidak saling membatalkan, melapisi Copper Peptides dan Retinol bersamaan dapat memicu sensitivitas bagi kulit yang belum terbiasa."
  }
];

const SUPPLEMENTAL_INGREDIENTS: Ingredient[] = [
  { id: "ING-COMMON-WATER", name: "Water", aliases: ["Aqua"], isComedogenic: false, allergenRisk: "Low", unsuitableFor: ["None"], category: "Solvent" },
  { id: "ING-COMMON-ZEA-MAYS-STARCH", name: "Zea Mays Starch", aliases: ["Corn Starch", "Zea Mays (Corn) Starch"], isComedogenic: false, allergenRisk: "Low", unsuitableFor: ["None"], category: "Absorbent" },
  { id: "ING-COMMON-DISODIUM-COCOYL-GLUTAMATE", name: "Disodium Cocoyl Glutamate", aliases: [], isComedogenic: false, allergenRisk: "Low", unsuitableFor: ["None"], category: "Surfactant" },
  { id: "ING-COMMON-SODIUM-COCOAMPHOACETATE", name: "Sodium Cocoamphoacetate", aliases: [], isComedogenic: false, allergenRisk: "Low", unsuitableFor: ["None"], category: "Surfactant" },
  { id: "ING-COMMON-SODIUM-CHLORIDE", name: "Sodium Chloride", aliases: ["Salt"], isComedogenic: false, allergenRisk: "Low", unsuitableFor: ["None"], category: "Texture Enhancer" },
  { id: "ING-COMMON-DICAPRYLYL-ETHER", name: "Dicaprylyl Ether", aliases: [], isComedogenic: false, allergenRisk: "Low", unsuitableFor: ["None"], category: "Emollient" },
  { id: "ING-COMMON-PANTHENOL", name: "Panthenol", aliases: ["Pro-Vitamin B5"], isComedogenic: false, allergenRisk: "Low", unsuitableFor: ["None"], category: "Soothing Agent" },
  { id: "ING-COMMON-BENZYL-ALCOHOL", name: "Benzyl Alcohol", aliases: [], isComedogenic: false, allergenRisk: "Medium", unsuitableFor: ["Sensitive"], category: "Preservative" },
  { id: "ING-COMMON-PHENOXYETHANOL", name: "Phenoxyethanol", aliases: [], isComedogenic: false, allergenRisk: "Medium", unsuitableFor: ["Sensitive"], category: "Preservative" },
  { id: "ING-COMMON-SEA-WATER", name: "Sea Water", aliases: ["Seawater"], isComedogenic: false, allergenRisk: "Low", unsuitableFor: ["None"], category: "Solvent" },
  { id: "ING-COMMON-ALLANTOIN", name: "Allantoin", aliases: [], isComedogenic: false, allergenRisk: "Low", unsuitableFor: ["None"], category: "Soothing Agent" },
  { id: "ING-COMMON-DISODIUM-EDTA", name: "Disodium EDTA", aliases: ["EDTA"], isComedogenic: false, allergenRisk: "Low", unsuitableFor: ["None"], category: "Chelating Agent" },
  { id: "ING-COMMON-ALOE-BARBADENSIS", name: "Aloe Barbadensis Leaf Extract", aliases: ["Aloe Vera Leaf Extract"], isComedogenic: false, allergenRisk: "Low", unsuitableFor: ["None"], category: "Botanical - Soothing" },
  { id: "ING-COMMON-SODIUM-LAUROYL-LACTYLATE", name: "Sodium Lauroyl Lactylate", aliases: [], isComedogenic: false, allergenRisk: "Low", unsuitableFor: ["None"], category: "Emulsifier" },
  { id: "ING-COMMON-HEXANEDIOL", name: "1,2-Hexanediol", aliases: ["Hexanediol"], isComedogenic: false, allergenRisk: "Low", unsuitableFor: ["None"], category: "Solvent" },
  { id: "ING-COMMON-POLYGLUTAMIC-ACID", name: "Polyglutamic Acid", aliases: [], isComedogenic: false, allergenRisk: "Low", unsuitableFor: ["None"], category: "Hydrator" },
  { id: "ING-COMMON-PUERARIA-LOBATA", name: "Pueraria Lobata Root Extract", aliases: [], isComedogenic: false, allergenRisk: "Low", unsuitableFor: ["None"], category: "Botanical - Antioxidant" },
  { id: "ING-COMMON-GLYCINE-SOJA", name: "Glycine Soja Seed Extract", aliases: ["Soybean Seed Extract"], isComedogenic: false, allergenRisk: "Low", unsuitableFor: ["None"], category: "Botanical - Antioxidant" },
  { id: "ING-COMMON-CERATONIA-SILIQUA", name: "Ceratonia Siliqua Seed Extract", aliases: ["Carob Seed Extract"], isComedogenic: false, allergenRisk: "Low", unsuitableFor: ["None"], category: "Texture Enhancer" },
  { id: "ING-COMMON-CENTELLA-ASIATICA", name: "Centella Asiatica Extract", aliases: ["Cica"], isComedogenic: false, allergenRisk: "Low", unsuitableFor: ["None"], category: "Botanical - Soothing" },
  { id: "ING-COMMON-PHASEOLUS-RADIATUS", name: "Phaseolus Radiatus Seed Extract", aliases: ["Mung Bean Seed Extract"], isComedogenic: false, allergenRisk: "Low", unsuitableFor: ["None"], category: "Botanical - Antioxidant" },
  { id: "ING-COMMON-CANAVALIA-GLADIATA", name: "Canavalia Gladiata Seed Extract", aliases: ["Sword Bean Seed Extract"], isComedogenic: false, allergenRisk: "Low", unsuitableFor: ["None"], category: "Botanical - Antioxidant" },
  { id: "ING-COMMON-LACTOBACILLUS-FERMENT", name: "Lactobacillus Ferment Lysate", aliases: ["Lactobacillus Ferment Lysate"], isComedogenic: false, allergenRisk: "Low", unsuitableFor: ["None"], category: "Soothing Agent" },
  { id: "ING-COMMON-CERAMIDE-AP", name: "Ceramide AP", aliases: [], isComedogenic: false, allergenRisk: "Low", unsuitableFor: ["None"], category: "Emollient" },
  { id: "ING-COMMON-PHYTOSPHINGOSINE", name: "Phytosphingosine", aliases: [], isComedogenic: false, allergenRisk: "Low", unsuitableFor: ["None"], category: "Emollient" },
  { id: "ING-COMMON-CHOLESTEROL", name: "Cholesterol", aliases: [], isComedogenic: false, allergenRisk: "Low", unsuitableFor: ["None"], category: "Emollient" },
  { id: "ING-COMMON-CARBOMER", name: "Carbomer", aliases: [], isComedogenic: false, allergenRisk: "Low", unsuitableFor: ["None"], category: "Texture Enhancer" },
  { id: "ING-COMMON-XANTHAN-GUM", name: "Xanthan Gum", aliases: [], isComedogenic: false, allergenRisk: "Low", unsuitableFor: ["None"], category: "Texture Enhancer" },
  { id: "ING-COMMON-HYDROLYZED-HA", name: "Hydrolyzed Hyaluronic Acid", aliases: [], isComedogenic: false, allergenRisk: "Low", unsuitableFor: ["None"], category: "Hydrator" },
  { id: "ING-COMMON-HYDROXYPROPYLTRIMONIUM-HA", name: "Hydroxypropyltrimonium Hyaluronate", aliases: [], isComedogenic: false, allergenRisk: "Low", unsuitableFor: ["None"], category: "Hydrator" },
  { id: "ING-COMMON-SODIUM-ACETYLATED-HA", name: "Sodium Acetylated Hyaluronate", aliases: [], isComedogenic: false, allergenRisk: "Low", unsuitableFor: ["None"], category: "Hydrator" },
];

SUPPLEMENTAL_INGREDIENTS.forEach((ingredient) => {
  if (!INGREDIENTS.some((existing) => existing.id === ingredient.id || existing.name.toLowerCase() === ingredient.name.toLowerCase())) {
    INGREDIENTS.push(ingredient);
  }
});

// Build fast lookup maps
const _byId   = new Map<string, Ingredient>(INGREDIENTS.map((i) => [i.id, i]));
const _byName = new Map<string, Ingredient>(
  INGREDIENTS.flatMap((i) => [
    [i.name.toLowerCase(), i],
    ...i.aliases.map((a) => [a.toLowerCase(), i] as [string, Ingredient]),
  ])
);

/** Get ingredient by ING-xxx id */
export const getIngredientById = (id: string): Ingredient | undefined =>
  _byId.get(id);

/** Fuzzy name / alias lookup used by OCR matcher */
export const getIngredientByName = (raw: string): Ingredient | undefined =>
  _byName.get(raw.toLowerCase().trim());

/** Get all combination warnings that involve this ingredient */
export const getWarningsForIngredient = (id: string): CombinationWarning[] =>
  COMBINATION_WARNINGS.filter((w) => w.ingredient1 === id || w.ingredient2 === id);

/** Get the warning (if any) between two ingredients */
export const getWarningBetween = (
  idA: string,
  idB: string
): CombinationWarning | undefined =>
  COMBINATION_WARNINGS.find(
    (w) =>
      (w.ingredient1 === idA && w.ingredient2 === idB) ||
      (w.ingredient1 === idB && w.ingredient2 === idA)
  );

// ── Runtime registration (used by ingredientAI) ──────────────
/**
 * Register a newly discovered ingredient into the live lookup
 * maps so it is immediately findable within this session without
 * restarting the app.
 */
export function registerIngredient(ing: Ingredient): void {
  if (_byId.has(ing.id)) return; // already registered
  _byId.set(ing.id, ing);
  _byName.set(ing.name.toLowerCase(), ing);
  ing.aliases.forEach((a) => _byName.set(a.toLowerCase(), ing));
  INGREDIENTS.push(ing);
}
