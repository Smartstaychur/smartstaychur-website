import { int, mysqlEnum, mysqlTable, text, timestamp, varchar, boolean, json, decimal, date } from "drizzle-orm/mysql-core";

// ============================================
// USERS
// ============================================
export const users = mysqlTable("users", {
  id: int("id").autoincrement().primaryKey(),
  openId: varchar("openId", { length: 64 }).notNull().unique(),
  username: varchar("username", { length: 128 }).unique(),
  passwordHash: varchar("passwordHash", { length: 256 }),
  name: text("name"),
  email: varchar("email", { length: 320 }),
  loginMethod: varchar("loginMethod", { length: 64 }),
  role: mysqlEnum("role", ["user", "admin", "hotelier", "restaurateur"]).default("user").notNull(),
  // Link to hotel or restaurant they manage
  hotelId: int("hotelId"),
  restaurantId: int("restaurantId"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
  lastSignedIn: timestamp("lastSignedIn").defaultNow().notNull(),
});

export type User = typeof users.$inferSelect;
export type InsertUser = typeof users.$inferInsert;

// ============================================
// HOTELS
// ============================================
export const hotels = mysqlTable("hotels", {
  id: int("id").autoincrement().primaryKey(),
  slug: varchar("slug", { length: 128 }).notNull().unique(),
  name: varchar("name", { length: 256 }).notNull(),
  type: mysqlEnum("type", ["hotel", "hostel", "pension", "apartment", "b_and_b"]).default("hotel").notNull(),
  stars: int("stars"),
  
  // Address
  address: varchar("address", { length: 512 }).notNull(),
  postalCode: varchar("postalCode", { length: 10 }).notNull(),
  city: varchar("city", { length: 128 }).notNull(),
  
  // Description
  description: text("description"),
  shortDescription: text("shortDescription"),
  
  // Contact
  phone: varchar("phone", { length: 32 }),
  email: varchar("email", { length: 320 }),
  website: varchar("website", { length: 512 }),
  bookingUrl: varchar("bookingUrl", { length: 512 }),
  
  // Media
  imageUrl: varchar("imageUrl", { length: 512 }),
  images: json("images").$type<string[]>(),
  
  // Pricing
  priceFrom: decimal("priceFrom", { precision: 10, scale: 2 }),
  priceTo: decimal("priceTo", { precision: 10, scale: 2 }),
  currency: varchar("currency", { length: 3 }).default("CHF"),
  
  // Amenities (boolean flags for quick filtering)
  petsAllowed: boolean("petsAllowed").default(false),
  familyFriendly: boolean("familyFriendly").default(false),
  wheelchairAccessible: boolean("wheelchairAccessible").default(false),
  parking: boolean("parking").default(false),
  parkingFee: varchar("parkingFee", { length: 64 }),
  wifi: boolean("wifi").default(true),
  wifiFree: boolean("wifiFree").default(true),
  breakfast: boolean("breakfast").default(false),
  breakfastIncluded: boolean("breakfastIncluded").default(false),
  restaurant: boolean("restaurant").default(false),
  bar: boolean("bar").default(false),
  spa: boolean("spa").default(false),
  pool: boolean("pool").default(false),
  gym: boolean("gym").default(false),
  airConditioning: boolean("airConditioning").default(false),
  
  // Check-in/out
  checkInFrom: varchar("checkInFrom", { length: 10 }),
  checkInTo: varchar("checkInTo", { length: 10 }),
  checkOutUntil: varchar("checkOutUntil", { length: 10 }),
  
  // Location
  latitude: varchar("latitude", { length: 32 }),
  longitude: varchar("longitude", { length: 32 }),
  
  // Text fields for AI-readable room info
  roomTypesText: text("roomTypesText"), // Comma-separated list of room types
  amenitiesText: text("amenitiesText"), // Comma-separated list of amenities
  
  // Status
  isActive: boolean("isActive").default(true),
  
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type Hotel = typeof hotels.$inferSelect;
export type InsertHotel = typeof hotels.$inferInsert;

// ============================================
// ROOM TYPES (for hotels)
// ============================================
export const roomTypes = mysqlTable("room_types", {
  id: int("id").autoincrement().primaryKey(),
  hotelId: int("hotelId").notNull(),
  
  name: varchar("name", { length: 128 }).notNull(), // e.g., "Familienzimmer", "Doppelzimmer Deluxe"
  description: text("description"),
  
  // Capacity
  maxGuests: int("maxGuests").default(2),
  beds: varchar("beds", { length: 128 }), // e.g., "1 Doppelbett, 1 Einzelbett"
  sizeSqm: int("sizeSqm"),
  
  // Pricing
  pricePerNight: decimal("pricePerNight", { precision: 10, scale: 2 }),
  priceWeekend: decimal("priceWeekend", { precision: 10, scale: 2 }),
  currency: varchar("currency", { length: 3 }).default("CHF"),
  
  // Room amenities
  balcony: boolean("balcony").default(false),
  terrace: boolean("terrace").default(false),
  mountainView: boolean("mountainView").default(false),
  cityView: boolean("cityView").default(false),
  bathroom: mysqlEnum("bathroom", ["private", "shared"]).default("private"),
  shower: boolean("shower").default(true),
  bathtub: boolean("bathtub").default(false),
  tv: boolean("tv").default(true),
  safe: boolean("safe").default(false),
  minibar: boolean("minibar").default(false),
  coffeemaker: boolean("coffeemaker").default(false),
  airConditioning: boolean("airConditioning").default(false),
  heating: boolean("heating").default(true),
  desk: boolean("desk").default(false),
  
  // Family features
  babyCot: boolean("babyCot").default(false),
  babyCotFee: varchar("babyCotFee", { length: 64 }),
  childBed: boolean("childBed").default(false),
  
  // Images
  imageUrl: varchar("imageUrl", { length: 512 }),
  images: json("images").$type<string[]>(),
  
  // Availability
  totalRooms: int("totalRooms").default(1),
  isActive: boolean("isActive").default(true),
  
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type RoomType = typeof roomTypes.$inferSelect;
export type InsertRoomType = typeof roomTypes.$inferInsert;

// ============================================
// RESTAURANTS
// ============================================
export const restaurants = mysqlTable("restaurants", {
  id: int("id").autoincrement().primaryKey(),
  slug: varchar("slug", { length: 128 }).notNull().unique(),
  name: varchar("name", { length: 256 }).notNull(),
  cuisineType: varchar("cuisineType", { length: 128 }), // e.g., "Bündner Küche, Italienisch"
  
  // Address
  address: varchar("address", { length: 512 }).notNull(),
  postalCode: varchar("postalCode", { length: 10 }).notNull(),
  city: varchar("city", { length: 128 }).notNull(),
  
  // Description
  description: text("description"),
  shortDescription: text("shortDescription"),
  
  // Contact
  phone: varchar("phone", { length: 32 }),
  email: varchar("email", { length: 320 }),
  website: varchar("website", { length: 512 }),
  reservationUrl: varchar("reservationUrl", { length: 512 }),
  reservationPhone: varchar("reservationPhone", { length: 32 }),
  menuUrl: varchar("menuUrl", { length: 512 }), // Link to PDF menu or online menu
  
  // Media
  imageUrl: varchar("imageUrl", { length: 512 }),
  images: json("images").$type<string[]>(),
  
  // Pricing
  priceLevel: mysqlEnum("priceLevel", ["budget", "moderate", "upscale", "fine_dining"]),
  averagePrice: decimal("averagePrice", { precision: 10, scale: 2 }), // Average main course price
  currency: varchar("currency", { length: 3 }).default("CHF"),
  
  // Opening hours (JSON for flexibility)
  openingHours: json("openingHours").$type<{
    monday?: { open: string; close: string; closed?: boolean };
    tuesday?: { open: string; close: string; closed?: boolean };
    wednesday?: { open: string; close: string; closed?: boolean };
    thursday?: { open: string; close: string; closed?: boolean };
    friday?: { open: string; close: string; closed?: boolean };
    saturday?: { open: string; close: string; closed?: boolean };
    sunday?: { open: string; close: string; closed?: boolean };
  }>(),
  
  // Features
  vegetarianOptions: boolean("vegetarianOptions").default(false),
  veganOptions: boolean("veganOptions").default(false),
  glutenFreeOptions: boolean("glutenFreeOptions").default(false),
  outdoorSeating: boolean("outdoorSeating").default(false),
  indoorSeating: boolean("indoorSeating").default(true),
  takeaway: boolean("takeaway").default(false),
  delivery: boolean("delivery").default(false),
  reservationRequired: boolean("reservationRequired").default(false),
  wheelchairAccessible: boolean("wheelchairAccessible").default(false),
  childFriendly: boolean("childFriendly").default(false),
  dogFriendly: boolean("dogFriendly").default(false),
  
  // Capacity
  seatingCapacity: int("seatingCapacity"),
  
  // Location
  latitude: varchar("latitude", { length: 32 }),
  longitude: varchar("longitude", { length: 32 }),
  
  // Status
  isActive: boolean("isActive").default(true),
  
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type Restaurant = typeof restaurants.$inferSelect;
export type InsertRestaurant = typeof restaurants.$inferInsert;

// ============================================
// MENU CATEGORIES (for restaurants)
// ============================================
export const menuCategories = mysqlTable("menu_categories", {
  id: int("id").autoincrement().primaryKey(),
  restaurantId: int("restaurantId").notNull(),
  
  name: varchar("name", { length: 128 }).notNull(), // e.g., "Vorspeisen", "Hauptgerichte", "Desserts"
  description: text("description"),
  sortOrder: int("sortOrder").default(0),
  isActive: boolean("isActive").default(true),
  
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type MenuCategory = typeof menuCategories.$inferSelect;
export type InsertMenuCategory = typeof menuCategories.$inferInsert;

// ============================================
// MENU ITEMS (dishes)
// ============================================
export const menuItems = mysqlTable("menu_items", {
  id: int("id").autoincrement().primaryKey(),
  restaurantId: int("restaurantId").notNull(),
  categoryId: int("categoryId"),
  
  name: varchar("name", { length: 256 }).notNull(), // e.g., "Spaghetti Bolognese"
  description: text("description"),
  
  price: decimal("price", { precision: 10, scale: 2 }).notNull(),
  currency: varchar("currency", { length: 3 }).default("CHF"),
  
  // Dietary info
  isVegetarian: boolean("isVegetarian").default(false),
  isVegan: boolean("isVegan").default(false),
  isGlutenFree: boolean("isGlutenFree").default(false),
  isSpicy: boolean("isSpicy").default(false),
  
  // Allergens (comma-separated or JSON)
  allergens: varchar("allergens", { length: 512 }),
  
  // Media
  imageUrl: varchar("imageUrl", { length: 512 }),
  
  sortOrder: int("sortOrder").default(0),
  isActive: boolean("isActive").default(true),
  isPopular: boolean("isPopular").default(false),
  
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type MenuItem = typeof menuItems.$inferSelect;
export type InsertMenuItem = typeof menuItems.$inferInsert;

// ============================================
// DAILY SPECIALS / TAGESMENÜ
// ============================================
export const dailySpecials = mysqlTable("daily_specials", {
  id: int("id").autoincrement().primaryKey(),
  restaurantId: int("restaurantId").notNull(),
  
  date: date("date").notNull(), // The date this special is valid
  
  name: varchar("name", { length: 256 }).notNull(), // e.g., "Tagesmenü", "Mittagsmenü"
  description: text("description"), // e.g., "Suppe, Hauptgang, Dessert"
  
  // Individual items in the menu
  items: json("items").$type<{
    course: string; // "Vorspeise", "Hauptgang", "Dessert"
    name: string;
    description?: string;
  }[]>(),
  
  price: decimal("price", { precision: 10, scale: 2 }).notNull(),
  currency: varchar("currency", { length: 3 }).default("CHF"),
  
  // Dietary info
  isVegetarian: boolean("isVegetarian").default(false),
  isVegan: boolean("isVegan").default(false),
  
  // Availability
  availableFrom: varchar("availableFrom", { length: 10 }), // e.g., "11:30"
  availableTo: varchar("availableTo", { length: 10 }), // e.g., "14:00"
  
  isActive: boolean("isActive").default(true),
  
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type DailySpecial = typeof dailySpecials.$inferSelect;
export type InsertDailySpecial = typeof dailySpecials.$inferInsert;

// ============================================
// EXPERIENCES / ERLEBNISSE
// ============================================
export const experiences = mysqlTable("experiences", {
  id: int("id").autoincrement().primaryKey(),
  slug: varchar("slug", { length: 128 }).notNull().unique(),
  name: varchar("name", { length: 256 }).notNull(),
  category: mysqlEnum("category", ["tour", "hiking", "culture", "sport", "wellness", "family", "adventure", "food_wine"]).notNull(),
  
  // Description
  description: text("description"),
  shortDescription: text("shortDescription"),
  highlights: json("highlights").$type<string[]>(), // Key highlights
  
  // Details
  duration: varchar("duration", { length: 64 }), // e.g., "2 Stunden", "Halbtag"
  difficulty: mysqlEnum("difficulty", ["easy", "moderate", "difficult"]),
  
  // Location
  location: varchar("location", { length: 256 }),
  meetingPoint: varchar("meetingPoint", { length: 256 }),
  latitude: varchar("latitude", { length: 32 }),
  longitude: varchar("longitude", { length: 32 }),
  
  // Pricing
  priceAdult: decimal("priceAdult", { precision: 10, scale: 2 }),
  priceChild: decimal("priceChild", { precision: 10, scale: 2 }),
  priceGroup: decimal("priceGroup", { precision: 10, scale: 2 }),
  currency: varchar("currency", { length: 3 }).default("CHF"),
  priceNote: text("priceNote"), // Additional pricing info
  
  // Contact
  phone: varchar("phone", { length: 32 }),
  email: varchar("email", { length: 320 }),
  website: varchar("website", { length: 512 }),
  bookingUrl: varchar("bookingUrl", { length: 512 }),
  
  // Media
  imageUrl: varchar("imageUrl", { length: 512 }),
  images: json("images").$type<string[]>(),
  
  // Features
  familyFriendly: boolean("familyFriendly").default(false),
  wheelchairAccessible: boolean("wheelchairAccessible").default(false),
  dogFriendly: boolean("dogFriendly").default(false),
  
  // Availability
  seasonalAvailability: varchar("seasonalAvailability", { length: 128 }), // e.g., "Ganzjährig", "Mai-Oktober"
  availableDays: json("availableDays").$type<string[]>(), // e.g., ["monday", "wednesday", "saturday"]
  
  // Capacity
  minParticipants: int("minParticipants"),
  maxParticipants: int("maxParticipants"),
  
  // Requirements
  requirements: text("requirements"), // e.g., "Gute Kondition erforderlich"
  includedItems: json("includedItems").$type<string[]>(), // What's included
  notIncludedItems: json("notIncludedItems").$type<string[]>(), // What to bring
  
  // Status
  isActive: boolean("isActive").default(true),
  
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type Experience = typeof experiences.$inferSelect;
export type InsertExperience = typeof experiences.$inferInsert;

// ============================================
// EXPERIENCE DATES (scheduled occurrences)
// ============================================
export const experienceDates = mysqlTable("experience_dates", {
  id: int("id").autoincrement().primaryKey(),
  experienceId: int("experienceId").notNull(),
  
  date: date("date").notNull(),
  startTime: varchar("startTime", { length: 10 }).notNull(), // e.g., "09:00"
  endTime: varchar("endTime", { length: 10 }),
  
  availableSpots: int("availableSpots"),
  bookedSpots: int("bookedSpots").default(0),
  
  specialPrice: decimal("specialPrice", { precision: 10, scale: 2 }), // Override default price
  note: text("note"), // Special notes for this date
  
  isCancelled: boolean("isCancelled").default(false),
  
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type ExperienceDate = typeof experienceDates.$inferSelect;
export type InsertExperienceDate = typeof experienceDates.$inferInsert;
