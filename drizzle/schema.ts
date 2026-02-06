import { int, mysqlEnum, mysqlTable, text, timestamp, varchar, boolean, decimal, json } from "drizzle-orm/mysql-core";

// ─── Users (Manus OAuth – kept for system compatibility) ───
export const users = mysqlTable("users", {
  id: int("id").autoincrement().primaryKey(),
  openId: varchar("openId", { length: 64 }).notNull().unique(),
  name: text("name"),
  email: varchar("email", { length: 320 }),
  loginMethod: varchar("loginMethod", { length: 64 }),
  role: mysqlEnum("role", ["user", "admin"]).default("user").notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
  lastSignedIn: timestamp("lastSignedIn").defaultNow().notNull(),
});

export type User = typeof users.$inferSelect;
export type InsertUser = typeof users.$inferInsert;

// ─── Providers (Password-based auth for Leistungsträger) ───
export const providers = mysqlTable("providers", {
  id: int("id").autoincrement().primaryKey(),
  username: varchar("username", { length: 100 }).notNull().unique(),
  passwordHash: varchar("passwordHash", { length: 255 }).notNull(),
  displayName: varchar("displayName", { length: 200 }),
  email: varchar("email", { length: 320 }),
  role: mysqlEnum("role", ["admin", "hotelier", "gastronom"]).default("hotelier").notNull(),
  linkedHotelId: int("linkedHotelId"),
  linkedRestaurantId: int("linkedRestaurantId"),
  isActive: boolean("isActive").default(true).notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type Provider = typeof providers.$inferSelect;
export type InsertProvider = typeof providers.$inferInsert;

// ─── Hotels ───
export const hotels = mysqlTable("hotels", {
  id: int("id").autoincrement().primaryKey(),
  name: varchar("name", { length: 200 }).notNull(),
  slug: varchar("slug", { length: 200 }).notNull().unique(),
  stars: int("stars"),
  category: varchar("category", { length: 100 }),
  address: varchar("address", { length: 300 }),
  city: varchar("city", { length: 100 }).default("Chur"),
  postalCode: varchar("postalCode", { length: 10 }),
  country: varchar("country", { length: 50 }).default("Schweiz"),
  phone: varchar("phone", { length: 50 }),
  email: varchar("email", { length: 320 }),
  website: varchar("website", { length: 500 }),
  bookingUrl: varchar("bookingUrl", { length: 500 }),
  latitude: decimal("latitude", { precision: 10, scale: 7 }),
  longitude: decimal("longitude", { precision: 10, scale: 7 }),
  descriptionDe: text("descriptionDe"),
  descriptionEn: text("descriptionEn"),
  shortDescDe: text("shortDescDe"),
  shortDescEn: text("shortDescEn"),
  priceFrom: int("priceFrom"),
  priceTo: int("priceTo"),
  currency: varchar("currency", { length: 10 }).default("CHF"),
  checkInFrom: varchar("checkInFrom", { length: 10 }),
  checkInTo: varchar("checkInTo", { length: 10 }),
  checkOutFrom: varchar("checkOutFrom", { length: 10 }),
  checkOutTo: varchar("checkOutTo", { length: 10 }),
  // Amenities as booleans
  wifiFree: boolean("wifiFree").default(false),
  parkingFree: boolean("parkingFree").default(false),
  parkingPaid: boolean("parkingPaid").default(false),
  breakfastIncluded: boolean("breakfastIncluded").default(false),
  petsAllowed: boolean("petsAllowed").default(false),
  petSurcharge: varchar("petSurcharge", { length: 100 }),
  familyFriendly: boolean("familyFriendly").default(false),
  wheelchairAccessible: boolean("wheelchairAccessible").default(false),
  elevator: boolean("elevator").default(false),
  spa: boolean("spa").default(false),
  pool: boolean("pool").default(false),
  gym: boolean("gym").default(false),
  restaurant: boolean("restaurant").default(false),
  bar: boolean("bar").default(false),
  roomService: boolean("roomService").default(false),
  airConditioning: boolean("airConditioning").default(false),
  balcony: boolean("balcony").default(false),
  // Images stored as JSON arrays of URLs
  mainImage: varchar("mainImage", { length: 500 }),
  galleryImages: json("galleryImages").$type<string[]>(),
  specialFeatures: text("specialFeatures"),
  isPublished: boolean("isPublished").default(true).notNull(),
  isFeatured: boolean("isFeatured").default(false).notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type Hotel = typeof hotels.$inferSelect;
export type InsertHotel = typeof hotels.$inferInsert;

// ─── Restaurants ───
export const restaurants = mysqlTable("restaurants", {
  id: int("id").autoincrement().primaryKey(),
  name: varchar("name", { length: 200 }).notNull(),
  slug: varchar("slug", { length: 200 }).notNull().unique(),
  address: varchar("address", { length: 300 }),
  city: varchar("city", { length: 100 }).default("Chur"),
  postalCode: varchar("postalCode", { length: 10 }),
  country: varchar("country", { length: 50 }).default("Schweiz"),
  phone: varchar("phone", { length: 50 }),
  email: varchar("email", { length: 320 }),
  website: varchar("website", { length: 500 }),
  menuUrl: varchar("menuUrl", { length: 500 }),
  latitude: decimal("latitude", { precision: 10, scale: 7 }),
  longitude: decimal("longitude", { precision: 10, scale: 7 }),
  cuisineTypes: json("cuisineTypes").$type<string[]>(),
  priceLevel: varchar("priceLevel", { length: 20 }),
  ambiance: varchar("ambiance", { length: 200 }),
  descriptionDe: text("descriptionDe"),
  descriptionEn: text("descriptionEn"),
  shortDescDe: text("shortDescDe"),
  shortDescEn: text("shortDescEn"),
  // Opening hours as structured JSON
  openingHours: json("openingHours").$type<{
    monday?: { open: string; close: string } | null;
    tuesday?: { open: string; close: string } | null;
    wednesday?: { open: string; close: string } | null;
    thursday?: { open: string; close: string } | null;
    friday?: { open: string; close: string } | null;
    saturday?: { open: string; close: string } | null;
    sunday?: { open: string; close: string } | null;
  }>(),
  openingHoursText: text("openingHoursText"),
  closedDays: json("closedDays").$type<string[]>(),
  outdoorSeating: boolean("outdoorSeating").default(false),
  terrace: boolean("terrace").default(false),
  garden: boolean("garden").default(false),
  wheelchairAccessible: boolean("wheelchairAccessible").default(false),
  vegetarianOptions: boolean("vegetarianOptions").default(false),
  veganOptions: boolean("veganOptions").default(false),
  glutenFreeOptions: boolean("glutenFreeOptions").default(false),
  reservationRequired: boolean("reservationRequired").default(false),
  reservationUrl: varchar("reservationUrl", { length: 500 }),
  mainImage: varchar("mainImage", { length: 500 }),
  galleryImages: json("galleryImages").$type<string[]>(),
  isPublished: boolean("isPublished").default(true).notNull(),
  isFeatured: boolean("isFeatured").default(false).notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type Restaurant = typeof restaurants.$inferSelect;
export type InsertRestaurant = typeof restaurants.$inferInsert;
