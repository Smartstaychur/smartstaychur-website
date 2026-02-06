import { eq, like, and, sql } from "drizzle-orm";
import { drizzle } from "drizzle-orm/mysql2";
import { InsertUser, users, hotels, restaurants, providers, type InsertHotel, type InsertRestaurant } from "../drizzle/schema";
import { ENV } from './_core/env';

let _db: ReturnType<typeof drizzle> | null = null;

export async function getDb() {
  if (!_db && process.env.DATABASE_URL) {
    try {
      _db = drizzle(process.env.DATABASE_URL);
    } catch (error) {
      console.warn("[Database] Failed to connect:", error);
      _db = null;
    }
  }
  return _db;
}

// ─── Users (Manus OAuth) ───
export async function upsertUser(user: InsertUser): Promise<void> {
  if (!user.openId) throw new Error("User openId is required for upsert");
  const db = await getDb();
  if (!db) { console.warn("[Database] Cannot upsert user: database not available"); return; }
  try {
    const values: InsertUser = { openId: user.openId };
    const updateSet: Record<string, unknown> = {};
    const textFields = ["name", "email", "loginMethod"] as const;
    type TextField = (typeof textFields)[number];
    const assignNullable = (field: TextField) => {
      const value = user[field];
      if (value === undefined) return;
      const normalized = value ?? null;
      values[field] = normalized;
      updateSet[field] = normalized;
    };
    textFields.forEach(assignNullable);
    if (user.lastSignedIn !== undefined) { values.lastSignedIn = user.lastSignedIn; updateSet.lastSignedIn = user.lastSignedIn; }
    if (user.role !== undefined) { values.role = user.role; updateSet.role = user.role; }
    else if (user.openId === ENV.ownerOpenId) { values.role = 'admin'; updateSet.role = 'admin'; }
    if (!values.lastSignedIn) values.lastSignedIn = new Date();
    if (Object.keys(updateSet).length === 0) updateSet.lastSignedIn = new Date();
    await db.insert(users).values(values).onDuplicateKeyUpdate({ set: updateSet });
  } catch (error) { console.error("[Database] Failed to upsert user:", error); throw error; }
}

export async function getUserByOpenId(openId: string) {
  const db = await getDb();
  if (!db) { console.warn("[Database] Cannot get user: database not available"); return undefined; }
  const result = await db.select().from(users).where(eq(users.openId, openId)).limit(1);
  return result.length > 0 ? result[0] : undefined;
}

// ─── Hotels ───
export async function listHotels(filters?: { stars?: number; search?: string; featured?: boolean }) {
  const db = await getDb();
  if (!db) return [];
  const conditions = [eq(hotels.isPublished, true)];
  if (filters?.stars) conditions.push(eq(hotels.stars, filters.stars));
  if (filters?.search) conditions.push(like(hotels.name, `%${filters.search}%`));
  if (filters?.featured) conditions.push(eq(hotels.isFeatured, true));
  return db.select().from(hotels).where(and(...conditions)).orderBy(hotels.name);
}

export async function getHotelBySlug(slug: string) {
  const db = await getDb();
  if (!db) return null;
  const result = await db.select().from(hotels).where(eq(hotels.slug, slug)).limit(1);
  return result[0] || null;
}

export async function getHotelById(id: number) {
  const db = await getDb();
  if (!db) return null;
  const result = await db.select().from(hotels).where(eq(hotels.id, id)).limit(1);
  return result[0] || null;
}

export async function updateHotel(id: number, data: Partial<InsertHotel>) {
  const db = await getDb();
  if (!db) throw new Error("Datenbank nicht verfügbar");
  const { id: _, createdAt, updatedAt, ...updateData } = data as any;
  await db.update(hotels).set(updateData).where(eq(hotels.id, id));
  return getHotelById(id);
}

export async function createHotel(data: InsertHotel) {
  const db = await getDb();
  if (!db) throw new Error("Datenbank nicht verfügbar");
  const result = await db.insert(hotels).values(data);
  return getHotelById(Number(result[0].insertId));
}

// ─── Restaurants ───
export async function listRestaurants(filters?: { cuisineType?: string; search?: string; featured?: boolean }) {
  const db = await getDb();
  if (!db) return [];
  const conditions = [eq(restaurants.isPublished, true)];
  if (filters?.search) conditions.push(like(restaurants.name, `%${filters.search}%`));
  if (filters?.featured) conditions.push(eq(restaurants.isFeatured, true));
  const result = await db.select().from(restaurants).where(and(...conditions)).orderBy(restaurants.name);
  if (filters?.cuisineType) {
    return result.filter((r) => r.cuisineTypes && Array.isArray(r.cuisineTypes) && r.cuisineTypes.includes(filters.cuisineType!));
  }
  return result;
}

export async function getRestaurantBySlug(slug: string) {
  const db = await getDb();
  if (!db) return null;
  const result = await db.select().from(restaurants).where(eq(restaurants.slug, slug)).limit(1);
  return result[0] || null;
}

export async function getRestaurantById(id: number) {
  const db = await getDb();
  if (!db) return null;
  const result = await db.select().from(restaurants).where(eq(restaurants.id, id)).limit(1);
  return result[0] || null;
}

export async function updateRestaurant(id: number, data: Partial<InsertRestaurant>) {
  const db = await getDb();
  if (!db) throw new Error("Datenbank nicht verfügbar");
  const { id: _, createdAt, updatedAt, ...updateData } = data as any;
  await db.update(restaurants).set(updateData).where(eq(restaurants.id, id));
  return getRestaurantById(id);
}

export async function createRestaurant(data: InsertRestaurant) {
  const db = await getDb();
  if (!db) throw new Error("Datenbank nicht verfügbar");
  const result = await db.insert(restaurants).values(data);
  return getRestaurantById(Number(result[0].insertId));
}

// ─── All Hotels/Restaurants (for admin) ───
export async function listAllHotels() {
  const db = await getDb();
  if (!db) return [];
  return db.select().from(hotels).orderBy(hotels.name);
}

export async function listAllRestaurants() {
  const db = await getDb();
  if (!db) return [];
  return db.select().from(restaurants).orderBy(restaurants.name);
}
