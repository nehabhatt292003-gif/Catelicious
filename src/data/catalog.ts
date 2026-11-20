import { Product } from '../types';

export const FREE_DELIVERY_THRESHOLD_INR = 599;
export const STANDARD_DELIVERY_FEE_INR = 49;

export const HERO_IMAGE_URL = '/src/assets/images/hero_catelicious_lifestyle_1795172062638.jpg';

export const CATALOG_PRODUCTS: Product[] = [
  {
    id: 'cat-trial-01',
    sku: 'CAT-TRIAL-01',
    name: 'First-Taste Trial Pack',
    subtitle: '7-Day Palatability & Acceptance Pouch',
    packType: 'Trial Pack',
    weightLabel: '300g',
    servingsEstimate: '5–7 days · 1 adult cat',
    priceInr: 249,
    needTags: ['First-Time Switchers', 'Coat & Gut Care'],
    pastelTone: 'peach',
    imageUrl: '/src/assets/images/product_trial_pack_1795172062616.jpg',
    kicker: 'Trial Pack · 300g',
    nutritionHighlights: [
      '68% real deboned chicken & organ meat',
      'Pumpkin & chicory root for gentle transition',
    ],
    description:
      'Designed specifically for cautious urban cat parents testing palatability before switching. Same flagship natural recipe in a low-commitment 300g pouch so you can verify your cat loves every bowl.',
    keyIngredients: [
      'Deboned Farm Chicken (52%)',
      'Chicken Liver & Heart (16%)',
      'Steamed Pumpkin & Sweet Potato',
      'Brown Rice & Oats',
      'Cold-Pressed Sardine Oil',
      'Taurine, Vitamin E & Chicory Inulin',
    ],
    guaranteedAnalysis: [
      { label: 'Crude Protein', value: '34.0% min' },
      { label: 'Crude Fat', value: '14.5% min' },
      { label: 'Crude Fiber', value: '3.2% max' },
      { label: 'Taurine', value: '0.22% min' },
    ],
    feedingGuide:
      'Mix 25% Catelicious with 75% current food on Days 1–2, 50/50 on Days 3–4, and 100% by Day 7.',
  },
  {
    id: 'cat-intro-550',
    sku: 'CAT-INTRO-550',
    name: 'Everyday Natural Starter',
    subtitle: 'Balanced Daily Poultry & Pumpkin',
    packType: 'Daily Pack',
    weightLabel: '900g',
    servingsEstimate: '18 days · 1 adult cat',
    priceInr: 550,
    needTags: ['First-Time Switchers', 'Everyday Nutrition'],
    pastelTone: 'butter',
    imageUrl: '/src/assets/images/product_intro_pack_1795172062979.jpg',
    kicker: 'Daily Pack · 900g',
    nutritionHighlights: [
      'Zero corn, soy, or artificial colours',
      'Mid-range ₹550 entry pouch for home trialers',
    ],
    description:
      'Our approachable 900g everyday pouch built for young households transitioning away from conventional commercial kibble without jumping to ₹1,200+ imported bags.',
    keyIngredients: [
      'Deboned Farm Chicken (50%)',
      'Chicken Liver & Broth (15%)',
      'Pumpkin & Green Peas',
      'Whole Oats & Brown Rice',
      'Flaxseed & Sardine Oil',
      'Essential Taurine & Chelated Minerals',
    ],
    guaranteedAnalysis: [
      { label: 'Crude Protein', value: '33.5% min' },
      { label: 'Crude Fat', value: '14.0% min' },
      { label: 'Crude Fiber', value: '3.5% max' },
      { label: 'Taurine', value: '0.20% min' },
    ],
    feedingGuide:
      'Serve 45–60g daily split across 2 meals for a 4 kg indoor adult cat alongside fresh water.',
  },
  {
    id: 'cat-core-600',
    sku: 'CAT-CORE-600',
    name: 'Core Daily Nutrition Pack',
    subtitle: 'Flagship Naturally Sourced Daily Meal',
    packType: 'Daily Pack',
    weightLabel: '1 kg',
    servingsEstimate: '20–22 days · 1 adult cat',
    priceInr: 600,
    compareAtInr: 680,
    needTags: ['Everyday Nutrition', 'First-Time Switchers'],
    pastelTone: 'sage',
    imageUrl: '/src/assets/images/product_core_pack_1795172064268.jpg',
    kicker: 'Flagship Daily · 1 kg',
    nutritionHighlights: [
      'Real meat #1 ingredient · 35% clean protein',
      'Qualifies for free urban delivery at ₹600',
    ],
    description:
      'Catelicious’s flagship 1 kg daily nourishment pouch. Formulated for Indian indoor cats with clean animal protein, natural prebiotics, and zero chemical preservatives at an honest ₹600.',
    keyIngredients: [
      'Deboned Farm Chicken (54%)',
      'Chicken Liver & Heart (16%)',
      'Organic Pumpkin & Carrot Fiber',
      'Cold-Pressed Fish Oil (Omega-3 & 6)',
      'Yucca & Chicory Prebiotics',
      'Taurine, Zinc & Vitamin E',
    ],
    guaranteedAnalysis: [
      { label: 'Crude Protein', value: '35.0% min' },
      { label: 'Crude Fat', value: '15.0% min' },
      { label: 'Crude Fiber', value: '3.0% max' },
      { label: 'Taurine', value: '0.24% min' },
    ],
    feedingGuide:
      'Serve 50g/day for a 4 kg cat (about ₹27/day). Resealable zip-lock keeps kibble aromatic.',
  },
  {
    id: 'cat-plus-650',
    sku: 'CAT-PLUS-650',
    name: 'Vital Coat & Gut Daily Pack',
    subtitle: 'Enriched Omega-3 & Prebiotic Formula',
    packType: 'Daily Pack',
    weightLabel: '1.1 kg',
    servingsEstimate: '24 days · 1 adult cat',
    priceInr: 650,
    needTags: ['Everyday Nutrition', 'Coat & Gut Care'],
    pastelTone: 'lavender',
    imageUrl: '/src/assets/images/product_vital_pack_1795172063844.jpg',
    kicker: 'Enriched Daily · 1.1 kg',
    nutritionHighlights: [
      'Added salmon oil for low-shed indoor coats',
      'Active prebiotics for sensitive tummies',
    ],
    description:
      'Built for urban apartment cats needing extra digestive comfort and coat sheen. Combines our core natural recipe with boosted marine Omega-3s and gentle soluble fiber.',
    keyIngredients: [
      'Deboned Chicken & Ocean Fish (56%)',
      'Chicken Liver & Taurine Rich Heart (15%)',
      'Norwegian Salmon Oil & Flaxseed',
      'Pumpkin, Cranberries & Chicory Root',
      'Prebiotic MOS & FOS Blend',
      'Natural Mixed Tocopherols',
    ],
    guaranteedAnalysis: [
      { label: 'Crude Protein', value: '36.0% min' },
      { label: 'Crude Fat', value: '15.5% min' },
      { label: 'Omega-3 Fatty Acids', value: '0.85% min' },
      { label: 'Taurine', value: '0.25% min' },
    ],
    feedingGuide:
      'Ideal for indoor cats prone to hairballs or dull coats. Serve 45–65g daily with fresh water.',
  },
];

export interface ComparisonColumn {
  id: string;
  tierName: string;
  subtitle: string;
  priceRange: string;
  isHighlighted?: boolean;
  metrics: {
    label: string;
    value: string;
  }[];
}

export const VALUE_COMPARISON_COLUMNS: ComparisonColumn[] = [
  {
    id: 'budget',
    tierName: 'Conventional Budget',
    subtitle: 'Mass-market kibble options',
    priceRange: '₹280 – ₹420 / kg',
    metrics: [
      { label: 'Primary Ingredients', value: 'Cereal grains, corn gluten & meat by-products' },
      { label: 'Preservatives & Dyes', value: 'Often uses synthetic flavors & artificial colors' },
      { label: 'Palatability Risk', value: 'Flavor-sprayed, low whole-meat digestibility' },
      { label: 'Monthly Cost (1 Cat)', value: 'Low upfront, higher vet & hairball concern' },
    ],
  },
  {
    id: 'catelicious',
    tierName: 'Catelicious Natural',
    subtitle: 'Honest mid-range nutrition',
    priceRange: '₹550 – ₹650 / pack',
    isHighlighted: true,
    metrics: [
      { label: 'Primary Ingredients', value: '68%+ real deboned poultry, organ meat & pumpkin' },
      { label: 'Preservatives & Dyes', value: 'Zero corn, soy, artificial colours, or BHA/BHT' },
      { label: 'Palatability Risk', value: '₹249 Trial Pack lets your cat test before committing' },
      { label: 'Monthly Cost (1 Cat)', value: 'Balanced ~₹600–₹850/month for daily clean feeding' },
    ],
  },
  {
    id: 'luxury',
    tierName: 'Imported Luxury',
    subtitle: 'High-priced specialty brands',
    priceRange: '₹1,100 – ₹1,650 / kg',
    metrics: [
      { label: 'Primary Ingredients', value: 'Formulated nutrition, often import-taxed' },
      { label: 'Preservatives & Dyes', value: 'Clean label, though steep markup per gram' },
      { label: 'Palatability Risk', value: 'Large upfront spend before knowing cat acceptance' },
      { label: 'Monthly Cost (1 Cat)', value: '₹1,500–₹2,400+/month — hard to sustain daily' },
    ],
  },
];
