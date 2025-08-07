import { WizardData } from "@/components/YachtCharterWizard";

// Centralized amenity prices (per day)
export const AMENITY_PRICES: Record<string, number> = {
  chef: 200, gourmet: 150, wine: 100, bbq: 50,
  sound: 75, tv: 100, games: 300, fishing: 150,
  ac: 100, wifi: 50, spa: 400, linens: 75,
  tender: 200, pickup: 150, helicopter: 1500, concierge: 300,
};

export type QuoteBreakdown = {
  baseWeekly: number;            // Destination base weekly rate
  yachtMultiplier: number;       // Multiplier by yacht type
  weeks: number;                 // duration in weeks
  weeklyAfterMultiplier: number; // baseWeekly * yachtMultiplier
  subtotal: number;              // weeklyAfterMultiplier * weeks
  bareboatDiscountRate: number;  // 0 - 1
  bareboatDiscountAmount: number;
  amenitiesDaily: number;        // sum of selected amenities per day
  amenitiesTotal: number;        // amenitiesDaily * duration (days)
  total: number;                 // subtotal - discount + amenities
};

const BAREBOAT_DISCOUNT = 0.25; // 25% discount for bareboat charters

export function computeQuote(data: WizardData): QuoteBreakdown {
  const baseWeekly = data.destination?.basePrice ?? 0;
  const yachtMultiplier = data.yachtType?.priceMultiplier ?? 1;
  const durationDays = Math.max(1, data.duration || 0);
  const weeks = durationDays / 7; // prorated by days

  const weeklyAfterMultiplier = baseWeekly * yachtMultiplier;
  const subtotal = weeklyAfterMultiplier * weeks;

  const bareboatDiscountRate = data.isBareboatCharter ? BAREBOAT_DISCOUNT : 0;
  const bareboatDiscountAmount = subtotal * bareboatDiscountRate;

  // Amenities: priced per day, multiply by duration days
  const amenitiesDaily = (data.amenities || []).reduce((sum, id) => sum + (AMENITY_PRICES[id] || 0), 0);
  const amenitiesTotal = amenitiesDaily * durationDays;

  const total = Math.round(subtotal - bareboatDiscountAmount + amenitiesTotal);

  return {
    baseWeekly,
    yachtMultiplier,
    weeks,
    weeklyAfterMultiplier,
    subtotal: Math.round(subtotal),
    bareboatDiscountRate,
    bareboatDiscountAmount: Math.round(bareboatDiscountAmount),
    amenitiesDaily,
    amenitiesTotal,
    total,
  };
}
