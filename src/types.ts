export type PackType = 'Trial Pack' | 'Daily Pack';

export type CatNeed = 'All' | 'First-Time Switchers' | 'Everyday Nutrition' | 'Coat & Gut Care';

export type SortOption = 'featured' | 'price-asc' | 'price-desc';

export type PastelTone = 'peach' | 'sage' | 'lavender' | 'butter';

export interface Product {
  id: string;
  sku: string;
  name: string;
  subtitle: string;
  packType: PackType;
  weightLabel: string;
  servingsEstimate: string;
  priceInr: number;
  compareAtInr?: number;
  needTags: Exclude<CatNeed, 'All'>[];
  pastelTone: PastelTone;
  imageUrl: string;
  kicker: string;
  nutritionHighlights: string[];
  description: string;
  keyIngredients: string[];
  guaranteedAnalysis: {
    label: string;
    value: string;
  }[];
  feedingGuide: string;
}

export interface CartItem {
  productId: string;
  quantity: number;
}

export interface AuthUser {
  uid: string;
  displayName: string;
  email: string;
  photoInitials: string;
  photoURL?: string;
  mode: 'demo' | 'firebase';
}

export interface UserPreferences {
  catName: string;
  lifeStage: 'Kitten (3–12m)' | 'Indoor Adult' | 'Senior (7+ yrs)';
  priorityGoal: 'Natural Ingredients' | 'Gentle Digestion' | 'Fair Daily Value';
}

export interface MockOrder {
  orderId: string;
  customerName: string;
  phone: string;
  city: string;
  address: string;
  paymentMethod: 'UPI' | 'Cash on Delivery';
  items: {
    sku: string;
    name: string;
    weightLabel: string;
    quantity: number;
    unitPriceInr: number;
  }[];
  subtotalInr: number;
  deliveryFeeInr: number;
  totalInr: number;
  placedAtIso: string;
}
