/**
 * Unified type exports
 * Import shared types from this single entry point.
 */

export type * from "../drizzle/schema";
export * from "./_core/errors";

export interface ProviderSession {
  id: number;
  username: string;
  role: "admin" | "hotelier" | "gastronom";
  linkedHotelId: number | null;
  linkedRestaurantId: number | null;
  displayName: string | null;
}

export interface OpeningHoursEntry {
  open: string;
  close: string;
}

export interface OpeningHours {
  monday?: OpeningHoursEntry | null;
  tuesday?: OpeningHoursEntry | null;
  wednesday?: OpeningHoursEntry | null;
  thursday?: OpeningHoursEntry | null;
  friday?: OpeningHoursEntry | null;
  saturday?: OpeningHoursEntry | null;
  sunday?: OpeningHoursEntry | null;
}

export const WEEKDAYS_DE: Record<string, string> = {
  monday: "Montag",
  tuesday: "Dienstag",
  wednesday: "Mittwoch",
  thursday: "Donnerstag",
  friday: "Freitag",
  saturday: "Samstag",
  sunday: "Sonntag",
};

export const CUISINE_TYPES = [
  "Schweizerisch",
  "Bündner Spezialitäten",
  "Italienisch",
  "Asiatisch",
  "Indisch",
  "Thailändisch",
  "Japanisch",
  "Mexikanisch",
  "Griechisch",
  "Türkisch",
  "Französisch",
  "International",
  "Vegetarisch/Vegan",
  "Pizza",
  "Burger",
  "Café/Bistro",
  "Bar/Lounge",
];

export const HOTEL_AMENITIES = [
  { key: "wifiFree", label: "Gratis WLAN", icon: "Wifi" },
  { key: "parkingFree", label: "Gratis Parkplatz", icon: "Car" },
  { key: "parkingPaid", label: "Parkplatz (kostenpflichtig)", icon: "Car" },
  { key: "breakfastIncluded", label: "Frühstück inklusive", icon: "Coffee" },
  { key: "petsAllowed", label: "Haustiere erlaubt", icon: "Dog" },
  { key: "familyFriendly", label: "Familienfreundlich", icon: "Baby" },
  { key: "wheelchairAccessible", label: "Rollstuhlgerecht", icon: "Accessibility" },
  { key: "elevator", label: "Aufzug", icon: "ArrowUpDown" },
  { key: "spa", label: "Spa/Wellness", icon: "Sparkles" },
  { key: "pool", label: "Pool", icon: "Waves" },
  { key: "gym", label: "Fitnessraum", icon: "Dumbbell" },
  { key: "restaurant", label: "Restaurant", icon: "UtensilsCrossed" },
  { key: "bar", label: "Bar", icon: "Wine" },
  { key: "roomService", label: "Zimmerservice", icon: "BellRing" },
  { key: "airConditioning", label: "Klimaanlage", icon: "Snowflake" },
  { key: "balcony", label: "Balkon", icon: "Sun" },
] as const;
