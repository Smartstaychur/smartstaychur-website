import { eq, like, and, or, sql, gte, lte } from "drizzle-orm";
import { drizzle } from "drizzle-orm/mysql2";
import { 
  InsertUser, users, 
  hotels, restaurants, experiences, 
  roomTypes, menuCategories, menuItems, dailySpecials, experienceDates,
  Hotel, Restaurant, Experience, 
  RoomType, MenuCategory, MenuItem, DailySpecial, ExperienceDate,
  InsertHotel, InsertRestaurant, InsertExperience,
  InsertRoomType, InsertMenuCategory, InsertMenuItem, InsertDailySpecial, InsertExperienceDate
} from "../drizzle/schema";
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

// ============================================
// USER FUNCTIONS
// ============================================
export async function upsertUser(user: InsertUser): Promise<void> {
  if (!user.openId) {
    throw new Error("User openId is required for upsert");
  }

  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot upsert user: database not available");
    return;
  }

  try {
    const values: InsertUser = {
      openId: user.openId,
    };
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

    if (user.lastSignedIn !== undefined) {
      values.lastSignedIn = user.lastSignedIn;
      updateSet.lastSignedIn = user.lastSignedIn;
    }
    if (user.role !== undefined) {
      values.role = user.role;
      updateSet.role = user.role;
    } else if (user.openId === ENV.ownerOpenId) {
      values.role = 'admin';
      updateSet.role = 'admin';
    }

    if (!values.lastSignedIn) {
      values.lastSignedIn = new Date();
    }

    if (Object.keys(updateSet).length === 0) {
      updateSet.lastSignedIn = new Date();
    }

    await db.insert(users).values(values).onDuplicateKeyUpdate({
      set: updateSet,
    });
  } catch (error) {
    console.error("[Database] Failed to upsert user:", error);
    throw error;
  }
}

export async function getUserByOpenId(openId: string) {
  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot get user: database not available");
    return undefined;
  }

  const result = await db.select().from(users).where(eq(users.openId, openId)).limit(1);
  return result.length > 0 ? result[0] : undefined;
}

// ============================================
// HOTEL FUNCTIONS
// ============================================
export async function getAllHotels(): Promise<Hotel[]> {
  const db = await getDb();
  if (!db) return [];
  return db.select().from(hotels).where(eq(hotels.isActive, true)).orderBy(hotels.name);
}

export async function getHotelById(id: number): Promise<Hotel | undefined> {
  const db = await getDb();
  if (!db) return undefined;
  const result = await db.select().from(hotels).where(eq(hotels.id, id)).limit(1);
  return result[0];
}

export async function getHotelBySlug(slug: string): Promise<Hotel | undefined> {
  const db = await getDb();
  if (!db) return undefined;
  const result = await db.select().from(hotels).where(eq(hotels.slug, slug)).limit(1);
  return result[0];
}

export async function searchHotels(query?: string, stars?: number): Promise<Hotel[]> {
  const db = await getDb();
  if (!db) return [];
  
  const conditions = [eq(hotels.isActive, true)];
  if (query) {
    conditions.push(or(
      like(hotels.name, `%${query}%`),
      like(hotels.city, `%${query}%`),
      like(hotels.shortDescription, `%${query}%`)
    )!);
  }
  if (stars) {
    conditions.push(eq(hotels.stars, stars));
  }
  
  return db.select().from(hotels).where(and(...conditions)).orderBy(hotels.name);
}

export async function createHotel(hotel: InsertHotel): Promise<number> {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  const result = await db.insert(hotels).values(hotel);
  return result[0].insertId;
}

export async function updateHotel(id: number, hotel: Partial<InsertHotel>): Promise<void> {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  await db.update(hotels).set(hotel).where(eq(hotels.id, id));
}

export async function deleteHotel(id: number): Promise<void> {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  await db.delete(hotels).where(eq(hotels.id, id));
}

export async function getHotelCount(): Promise<number> {
  const db = await getDb();
  if (!db) return 0;
  const result = await db.select({ count: sql<number>`count(*)` }).from(hotels).where(eq(hotels.isActive, true));
  return result[0]?.count ?? 0;
}

// ============================================
// ROOM TYPE FUNCTIONS
// ============================================
export async function getRoomTypesByHotelId(hotelId: number): Promise<RoomType[]> {
  const db = await getDb();
  if (!db) return [];
  return db.select().from(roomTypes).where(and(eq(roomTypes.hotelId, hotelId), eq(roomTypes.isActive, true))).orderBy(roomTypes.pricePerNight);
}

export async function getRoomTypeById(id: number): Promise<RoomType | undefined> {
  const db = await getDb();
  if (!db) return undefined;
  const result = await db.select().from(roomTypes).where(eq(roomTypes.id, id)).limit(1);
  return result[0];
}

export async function createRoomType(roomType: InsertRoomType): Promise<number> {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  const result = await db.insert(roomTypes).values(roomType);
  return result[0].insertId;
}

export async function updateRoomType(id: number, roomType: Partial<InsertRoomType>): Promise<void> {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  await db.update(roomTypes).set(roomType).where(eq(roomTypes.id, id));
}

export async function deleteRoomType(id: number): Promise<void> {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  await db.delete(roomTypes).where(eq(roomTypes.id, id));
}

// ============================================
// RESTAURANT FUNCTIONS
// ============================================
export async function getAllRestaurants(): Promise<Restaurant[]> {
  const db = await getDb();
  if (!db) return [];
  return db.select().from(restaurants).where(eq(restaurants.isActive, true)).orderBy(restaurants.name);
}

export async function getRestaurantById(id: number): Promise<Restaurant | undefined> {
  const db = await getDb();
  if (!db) return undefined;
  const result = await db.select().from(restaurants).where(eq(restaurants.id, id)).limit(1);
  return result[0];
}

export async function getRestaurantBySlug(slug: string): Promise<Restaurant | undefined> {
  const db = await getDb();
  if (!db) return undefined;
  const result = await db.select().from(restaurants).where(eq(restaurants.slug, slug)).limit(1);
  return result[0];
}

export async function searchRestaurants(query?: string): Promise<Restaurant[]> {
  const db = await getDb();
  if (!db) return [];
  
  const conditions = [eq(restaurants.isActive, true)];
  if (query) {
    conditions.push(or(
      like(restaurants.name, `%${query}%`),
      like(restaurants.cuisineType, `%${query}%`),
      like(restaurants.city, `%${query}%`)
    )!);
  }
  
  return db.select().from(restaurants).where(and(...conditions)).orderBy(restaurants.name);
}

export async function createRestaurant(restaurant: InsertRestaurant): Promise<number> {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  const result = await db.insert(restaurants).values(restaurant);
  return result[0].insertId;
}

export async function updateRestaurant(id: number, restaurant: Partial<InsertRestaurant>): Promise<void> {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  await db.update(restaurants).set(restaurant).where(eq(restaurants.id, id));
}

export async function deleteRestaurant(id: number): Promise<void> {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  await db.delete(restaurants).where(eq(restaurants.id, id));
}

export async function getRestaurantCount(): Promise<number> {
  const db = await getDb();
  if (!db) return 0;
  const result = await db.select({ count: sql<number>`count(*)` }).from(restaurants).where(eq(restaurants.isActive, true));
  return result[0]?.count ?? 0;
}

// ============================================
// MENU CATEGORY FUNCTIONS
// ============================================
export async function getMenuCategoriesByRestaurantId(restaurantId: number): Promise<MenuCategory[]> {
  const db = await getDb();
  if (!db) return [];
  return db.select().from(menuCategories).where(and(eq(menuCategories.restaurantId, restaurantId), eq(menuCategories.isActive, true))).orderBy(menuCategories.sortOrder);
}

export async function createMenuCategory(category: InsertMenuCategory): Promise<number> {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  const result = await db.insert(menuCategories).values(category);
  return result[0].insertId;
}

export async function updateMenuCategory(id: number, category: Partial<InsertMenuCategory>): Promise<void> {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  await db.update(menuCategories).set(category).where(eq(menuCategories.id, id));
}

export async function deleteMenuCategory(id: number): Promise<void> {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  await db.delete(menuCategories).where(eq(menuCategories.id, id));
}

// ============================================
// MENU ITEM FUNCTIONS
// ============================================
export async function getMenuItemsByRestaurantId(restaurantId: number): Promise<MenuItem[]> {
  const db = await getDb();
  if (!db) return [];
  return db.select().from(menuItems).where(and(eq(menuItems.restaurantId, restaurantId), eq(menuItems.isActive, true))).orderBy(menuItems.sortOrder);
}

export async function getMenuItemsByCategoryId(categoryId: number): Promise<MenuItem[]> {
  const db = await getDb();
  if (!db) return [];
  return db.select().from(menuItems).where(and(eq(menuItems.categoryId, categoryId), eq(menuItems.isActive, true))).orderBy(menuItems.sortOrder);
}

export async function createMenuItem(item: InsertMenuItem): Promise<number> {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  const result = await db.insert(menuItems).values(item);
  return result[0].insertId;
}

export async function updateMenuItem(id: number, item: Partial<InsertMenuItem>): Promise<void> {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  await db.update(menuItems).set(item).where(eq(menuItems.id, id));
}

export async function deleteMenuItem(id: number): Promise<void> {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  await db.delete(menuItems).where(eq(menuItems.id, id));
}

// Search menu items (for KI-Suche: "Wo gibt es heute Spaghetti?")
export async function searchMenuItems(query: string): Promise<(MenuItem & { restaurantName: string; restaurantSlug: string })[]> {
  const db = await getDb();
  if (!db) return [];
  
  const result = await db
    .select({
      id: menuItems.id,
      restaurantId: menuItems.restaurantId,
      categoryId: menuItems.categoryId,
      name: menuItems.name,
      description: menuItems.description,
      price: menuItems.price,
      currency: menuItems.currency,
      isVegetarian: menuItems.isVegetarian,
      isVegan: menuItems.isVegan,
      isGlutenFree: menuItems.isGlutenFree,
      isSpicy: menuItems.isSpicy,
      allergens: menuItems.allergens,
      imageUrl: menuItems.imageUrl,
      sortOrder: menuItems.sortOrder,
      isActive: menuItems.isActive,
      isPopular: menuItems.isPopular,
      createdAt: menuItems.createdAt,
      updatedAt: menuItems.updatedAt,
      restaurantName: restaurants.name,
      restaurantSlug: restaurants.slug,
    })
    .from(menuItems)
    .innerJoin(restaurants, eq(menuItems.restaurantId, restaurants.id))
    .where(and(
      eq(menuItems.isActive, true),
      eq(restaurants.isActive, true),
      or(
        like(menuItems.name, `%${query}%`),
        like(menuItems.description, `%${query}%`)
      )
    ));
  
  return result;
}

// ============================================
// DAILY SPECIAL FUNCTIONS
// ============================================
export async function getDailySpecialsByRestaurantId(restaurantId: number): Promise<DailySpecial[]> {
  const db = await getDb();
  if (!db) return [];
  return db.select().from(dailySpecials).where(and(eq(dailySpecials.restaurantId, restaurantId), eq(dailySpecials.isActive, true))).orderBy(dailySpecials.date);
}

export async function getTodaysDailySpecials(): Promise<(DailySpecial & { restaurantName: string; restaurantSlug: string })[]> {
  const db = await getDb();
  if (!db) return [];
  
  const today = new Date().toISOString().split('T')[0];
  
  const result = await db
    .select({
      id: dailySpecials.id,
      restaurantId: dailySpecials.restaurantId,
      date: dailySpecials.date,
      name: dailySpecials.name,
      description: dailySpecials.description,
      items: dailySpecials.items,
      price: dailySpecials.price,
      currency: dailySpecials.currency,
      isVegetarian: dailySpecials.isVegetarian,
      isVegan: dailySpecials.isVegan,
      availableFrom: dailySpecials.availableFrom,
      availableTo: dailySpecials.availableTo,
      isActive: dailySpecials.isActive,
      createdAt: dailySpecials.createdAt,
      updatedAt: dailySpecials.updatedAt,
      restaurantName: restaurants.name,
      restaurantSlug: restaurants.slug,
    })
    .from(dailySpecials)
    .innerJoin(restaurants, eq(dailySpecials.restaurantId, restaurants.id))
    .where(and(
      eq(dailySpecials.isActive, true),
      eq(restaurants.isActive, true),
      sql`DATE(${dailySpecials.date}) = ${today}`
    ));
  
  return result;
}

export async function createDailySpecial(special: InsertDailySpecial): Promise<number> {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  const result = await db.insert(dailySpecials).values(special);
  return result[0].insertId;
}

export async function updateDailySpecial(id: number, special: Partial<InsertDailySpecial>): Promise<void> {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  await db.update(dailySpecials).set(special).where(eq(dailySpecials.id, id));
}

export async function deleteDailySpecial(id: number): Promise<void> {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  await db.delete(dailySpecials).where(eq(dailySpecials.id, id));
}

// ============================================
// EXPERIENCE FUNCTIONS
// ============================================
export async function getAllExperiences(): Promise<Experience[]> {
  const db = await getDb();
  if (!db) return [];
  return db.select().from(experiences).where(eq(experiences.isActive, true)).orderBy(experiences.name);
}

export async function getExperienceById(id: number): Promise<Experience | undefined> {
  const db = await getDb();
  if (!db) return undefined;
  const result = await db.select().from(experiences).where(eq(experiences.id, id)).limit(1);
  return result[0];
}

export async function getExperienceBySlug(slug: string): Promise<Experience | undefined> {
  const db = await getDb();
  if (!db) return undefined;
  const result = await db.select().from(experiences).where(eq(experiences.slug, slug)).limit(1);
  return result[0];
}

export async function searchExperiences(query?: string, category?: string): Promise<Experience[]> {
  const db = await getDb();
  if (!db) return [];
  
  const conditions = [eq(experiences.isActive, true)];
  if (query) {
    conditions.push(or(
      like(experiences.name, `%${query}%`),
      like(experiences.location, `%${query}%`),
      like(experiences.shortDescription, `%${query}%`)
    )!);
  }
  if (category) {
    conditions.push(eq(experiences.category, category as any));
  }
  
  return db.select().from(experiences).where(and(...conditions)).orderBy(experiences.name);
}

export async function createExperience(experience: InsertExperience): Promise<number> {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  const result = await db.insert(experiences).values(experience);
  return result[0].insertId;
}

export async function updateExperience(id: number, experience: Partial<InsertExperience>): Promise<void> {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  await db.update(experiences).set(experience).where(eq(experiences.id, id));
}

export async function deleteExperience(id: number): Promise<void> {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  await db.delete(experiences).where(eq(experiences.id, id));
}

export async function getExperienceCount(): Promise<number> {
  const db = await getDb();
  if (!db) return 0;
  const result = await db.select({ count: sql<number>`count(*)` }).from(experiences).where(eq(experiences.isActive, true));
  return result[0]?.count ?? 0;
}

// ============================================
// EXPERIENCE DATE FUNCTIONS
// ============================================
export async function getExperienceDatesByExperienceId(experienceId: number): Promise<ExperienceDate[]> {
  const db = await getDb();
  if (!db) return [];
  const today = new Date().toISOString().split('T')[0];
  return db.select().from(experienceDates).where(and(
    eq(experienceDates.experienceId, experienceId),
    eq(experienceDates.isCancelled, false),
    sql`DATE(${experienceDates.date}) >= ${today}`
  )).orderBy(experienceDates.date);
}

export async function createExperienceDate(expDate: InsertExperienceDate): Promise<number> {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  const result = await db.insert(experienceDates).values(expDate);
  return result[0].insertId;
}

export async function updateExperienceDate(id: number, expDate: Partial<InsertExperienceDate>): Promise<void> {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  await db.update(experienceDates).set(expDate).where(eq(experienceDates.id, id));
}

export async function deleteExperienceDate(id: number): Promise<void> {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  await db.delete(experienceDates).where(eq(experienceDates.id, id));
}

// ============================================
// STATISTICS
// ============================================
export async function getStatistics() {
  const [hotelCount, restaurantCount, experienceCount] = await Promise.all([
    getHotelCount(),
    getRestaurantCount(),
    getExperienceCount()
  ]);
  return { hotelCount, restaurantCount, experienceCount };
}

// ============================================
// KI-SUCHE: Komplexe Suchanfragen
// ============================================
export async function searchHotelsAdvanced(params: {
  query?: string;
  stars?: number;
  petsAllowed?: boolean;
  familyFriendly?: boolean;
  wheelchairAccessible?: boolean;
  parking?: boolean;
  wifi?: boolean;
  breakfast?: boolean;
  priceMin?: number;
  priceMax?: number;
}): Promise<Hotel[]> {
  const db = await getDb();
  if (!db) return [];
  
  const conditions = [eq(hotels.isActive, true)];
  
  if (params.query) {
    conditions.push(or(
      like(hotels.name, `%${params.query}%`),
      like(hotels.city, `%${params.query}%`),
      like(hotels.shortDescription, `%${params.query}%`),
      like(hotels.description, `%${params.query}%`)
    )!);
  }
  if (params.stars) conditions.push(eq(hotels.stars, params.stars));
  if (params.petsAllowed) conditions.push(eq(hotels.petsAllowed, true));
  if (params.familyFriendly) conditions.push(eq(hotels.familyFriendly, true));
  if (params.wheelchairAccessible) conditions.push(eq(hotels.wheelchairAccessible, true));
  if (params.parking) conditions.push(eq(hotels.parking, true));
  if (params.wifi) conditions.push(eq(hotels.wifi, true));
  if (params.breakfast) conditions.push(eq(hotels.breakfast, true));
  if (params.priceMin) conditions.push(gte(hotels.priceFrom, params.priceMin.toString()));
  if (params.priceMax) conditions.push(lte(hotels.priceTo, params.priceMax.toString()));
  
  return db.select().from(hotels).where(and(...conditions)).orderBy(hotels.name);
}

// Search for rooms with specific amenities
export async function searchRoomTypes(params: {
  hotelId?: number;
  balcony?: boolean;
  babyCot?: boolean;
  mountainView?: boolean;
  maxGuests?: number;
  priceMax?: number;
}): Promise<(RoomType & { hotelName: string; hotelSlug: string; hotelStars: number | null })[]> {
  const db = await getDb();
  if (!db) return [];
  
  const conditions = [eq(roomTypes.isActive, true), eq(hotels.isActive, true)];
  
  if (params.hotelId) conditions.push(eq(roomTypes.hotelId, params.hotelId));
  if (params.balcony) conditions.push(eq(roomTypes.balcony, true));
  if (params.babyCot) conditions.push(eq(roomTypes.babyCot, true));
  if (params.mountainView) conditions.push(eq(roomTypes.mountainView, true));
  if (params.maxGuests) conditions.push(gte(roomTypes.maxGuests, params.maxGuests));
  if (params.priceMax) conditions.push(lte(roomTypes.pricePerNight, params.priceMax.toString()));
  
  const result = await db
    .select({
      id: roomTypes.id,
      hotelId: roomTypes.hotelId,
      name: roomTypes.name,
      description: roomTypes.description,
      maxGuests: roomTypes.maxGuests,
      beds: roomTypes.beds,
      sizeSqm: roomTypes.sizeSqm,
      pricePerNight: roomTypes.pricePerNight,
      priceWeekend: roomTypes.priceWeekend,
      currency: roomTypes.currency,
      balcony: roomTypes.balcony,
      terrace: roomTypes.terrace,
      mountainView: roomTypes.mountainView,
      cityView: roomTypes.cityView,
      bathroom: roomTypes.bathroom,
      shower: roomTypes.shower,
      bathtub: roomTypes.bathtub,
      tv: roomTypes.tv,
      safe: roomTypes.safe,
      minibar: roomTypes.minibar,
      coffeemaker: roomTypes.coffeemaker,
      airConditioning: roomTypes.airConditioning,
      heating: roomTypes.heating,
      desk: roomTypes.desk,
      babyCot: roomTypes.babyCot,
      babyCotFee: roomTypes.babyCotFee,
      childBed: roomTypes.childBed,
      imageUrl: roomTypes.imageUrl,
      images: roomTypes.images,
      totalRooms: roomTypes.totalRooms,
      isActive: roomTypes.isActive,
      createdAt: roomTypes.createdAt,
      updatedAt: roomTypes.updatedAt,
      hotelName: hotels.name,
      hotelSlug: hotels.slug,
      hotelStars: hotels.stars,
    })
    .from(roomTypes)
    .innerJoin(hotels, eq(roomTypes.hotelId, hotels.id))
    .where(and(...conditions))
    .orderBy(roomTypes.pricePerNight);
  
  return result;
}
