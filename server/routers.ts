import { COOKIE_NAME } from "@shared/const";
import { getSessionCookieOptions } from "./_core/cookies";
import { systemRouter } from "./_core/systemRouter";
import { publicProcedure, protectedProcedure, router } from "./_core/trpc";
import { z } from "zod";
import * as db from "./db";

export const appRouter = router({
  system: systemRouter,
  
  auth: router({
    me: publicProcedure.query(opts => opts.ctx.user),
    logout: publicProcedure.mutation(({ ctx }) => {
      const cookieOptions = getSessionCookieOptions(ctx.req);
      ctx.res.clearCookie(COOKIE_NAME, { ...cookieOptions, maxAge: -1 });
      return { success: true } as const;
    }),
  }),

  // Statistics
  stats: router({
    get: publicProcedure.query(async () => {
      return db.getStatistics();
    }),
  }),

  // Hotels
  hotels: router({
    list: publicProcedure.query(async () => {
      return db.getAllHotels();
    }),
    
    getBySlug: publicProcedure
      .input(z.object({ slug: z.string() }))
      .query(async ({ input }) => {
        return db.getHotelBySlug(input.slug);
      }),
    
    search: publicProcedure
      .input(z.object({ 
        query: z.string().optional(),
        stars: z.number().optional()
      }))
      .query(async ({ input }) => {
        return db.searchHotels(input.query, input.stars);
      }),
    
    searchAdvanced: publicProcedure
      .input(z.object({
        query: z.string().optional(),
        stars: z.number().optional(),
        petsAllowed: z.boolean().optional(),
        familyFriendly: z.boolean().optional(),
        wheelchairAccessible: z.boolean().optional(),
        parking: z.boolean().optional(),
        wifi: z.boolean().optional(),
        breakfast: z.boolean().optional(),
        priceMin: z.number().optional(),
        priceMax: z.number().optional(),
      }))
      .query(async ({ input }) => {
        return db.searchHotelsAdvanced(input);
      }),

    // Admin operations
    create: protectedProcedure
      .input(z.object({
        slug: z.string(),
        name: z.string(),
        type: z.enum(["hotel", "hostel", "pension", "apartment", "b_and_b"]),
        stars: z.number().nullable().optional(),
        address: z.string(),
        postalCode: z.string(),
        city: z.string(),
        shortDescription: z.string().optional(),
        description: z.string().optional(),
        phone: z.string().optional(),
        email: z.string().optional(),
        website: z.string().optional(),
        bookingUrl: z.string().optional(),
        priceFrom: z.string().optional(),
        priceTo: z.string().optional(),
      }))
      .mutation(async ({ input }) => {
        return db.createHotel(input);
      }),

    update: protectedProcedure
      .input(z.object({
        id: z.number(),
        data: z.object({
          name: z.string().optional(),
          shortDescription: z.string().optional(),
          description: z.string().optional(),
          phone: z.string().optional(),
          email: z.string().optional(),
          website: z.string().optional(),
          bookingUrl: z.string().optional(),
          priceFrom: z.string().optional(),
          priceTo: z.string().optional(),
        }),
      }))
      .mutation(async ({ input }) => {
        return db.updateHotel(input.id, input.data);
      }),
  }),

  // Room Types
  roomTypes: router({
    getByHotelId: publicProcedure
      .input(z.object({ hotelId: z.number() }))
      .query(async ({ input }) => {
        return db.getRoomTypesByHotelId(input.hotelId);
      }),
    
    search: publicProcedure
      .input(z.object({
        hotelId: z.number().optional(),
        balcony: z.boolean().optional(),
        babyCot: z.boolean().optional(),
        mountainView: z.boolean().optional(),
        maxGuests: z.number().optional(),
        priceMax: z.number().optional(),
      }))
      .query(async ({ input }) => {
        return db.searchRoomTypes(input);
      }),

    create: protectedProcedure
      .input(z.object({
        hotelId: z.number(),
        name: z.string(),
        description: z.string().optional(),
        maxGuests: z.number().optional(),
        beds: z.string().optional(),
        sizeSqm: z.number().optional(),
        pricePerNight: z.string().optional(),
        balcony: z.boolean().optional(),
        babyCot: z.boolean().optional(),
        mountainView: z.boolean().optional(),
      }))
      .mutation(async ({ input }) => {
        return db.createRoomType(input);
      }),

    update: protectedProcedure
      .input(z.object({
        id: z.number(),
        data: z.object({
          name: z.string().optional(),
          description: z.string().optional(),
          pricePerNight: z.string().optional(),
          balcony: z.boolean().optional(),
          babyCot: z.boolean().optional(),
        }),
      }))
      .mutation(async ({ input }) => {
        return db.updateRoomType(input.id, input.data);
      }),
  }),

  // Restaurants
  restaurants: router({
    list: publicProcedure.query(async () => {
      return db.getAllRestaurants();
    }),
    
    getBySlug: publicProcedure
      .input(z.object({ slug: z.string() }))
      .query(async ({ input }) => {
        return db.getRestaurantBySlug(input.slug);
      }),
    
    search: publicProcedure
      .input(z.object({ query: z.string().optional() }))
      .query(async ({ input }) => {
        return db.searchRestaurants(input.query);
      }),

    create: protectedProcedure
      .input(z.object({
        slug: z.string(),
        name: z.string(),
        cuisineType: z.string().optional(),
        address: z.string(),
        postalCode: z.string(),
        city: z.string(),
        shortDescription: z.string().optional(),
        description: z.string().optional(),
        phone: z.string().optional(),
        email: z.string().optional(),
        website: z.string().optional(),
      }))
      .mutation(async ({ input }) => {
        return db.createRestaurant(input);
      }),

    update: protectedProcedure
      .input(z.object({
        id: z.number(),
        data: z.object({
          name: z.string().optional(),
          cuisineType: z.string().optional(),
          shortDescription: z.string().optional(),
          description: z.string().optional(),
          phone: z.string().optional(),
          email: z.string().optional(),
          website: z.string().optional(),
          menuUrl: z.string().optional(),
          reservationUrl: z.string().optional(),
          openingHours: z.any().optional(),
        }),
      }))
      .mutation(async ({ input }) => {
        return db.updateRestaurant(input.id, input.data);
      }),
  }),

  // Menu Items
  menuItems: router({
    getByRestaurantId: publicProcedure
      .input(z.object({ restaurantId: z.number() }))
      .query(async ({ input }) => {
        return db.getMenuItemsByRestaurantId(input.restaurantId);
      }),
    
    search: publicProcedure
      .input(z.object({ query: z.string() }))
      .query(async ({ input }) => {
        return db.searchMenuItems(input.query);
      }),

    create: protectedProcedure
      .input(z.object({
        restaurantId: z.number(),
        categoryId: z.number().optional(),
        name: z.string(),
        description: z.string().optional(),
        price: z.string(),
        isVegetarian: z.boolean().optional(),
        isVegan: z.boolean().optional(),
      }))
      .mutation(async ({ input }) => {
        return db.createMenuItem(input);
      }),
  }),

  // Menu Categories
  menuCategories: router({
    getByRestaurantId: publicProcedure
      .input(z.object({ restaurantId: z.number() }))
      .query(async ({ input }) => {
        return db.getMenuCategoriesByRestaurantId(input.restaurantId);
      }),

    create: protectedProcedure
      .input(z.object({
        restaurantId: z.number(),
        name: z.string(),
        sortOrder: z.number().optional(),
      }))
      .mutation(async ({ input }) => {
        return db.createMenuCategory(input);
      }),
  }),

  // Daily Specials
  dailySpecials: router({
    getByRestaurantId: publicProcedure
      .input(z.object({ restaurantId: z.number() }))
      .query(async ({ input }) => {
        return db.getDailySpecialsByRestaurantId(input.restaurantId);
      }),
    
    getToday: publicProcedure.query(async () => {
      return db.getTodaysDailySpecials();
    }),

    create: protectedProcedure
      .input(z.object({
        restaurantId: z.number(),
        date: z.string(),
        name: z.string(),
        description: z.string().optional(),
        price: z.string(),
        isVegetarian: z.boolean().optional(),
        isVegan: z.boolean().optional(),
      }))
      .mutation(async ({ input }) => {
        return db.createDailySpecial({
          ...input,
          date: new Date(input.date),
        });
      }),

    delete: protectedProcedure
      .input(z.object({ id: z.number() }))
      .mutation(async ({ input }) => {
        return db.deleteDailySpecial(input.id);
      }),
  }),

  // Experiences
  experiences: router({
    list: publicProcedure.query(async () => {
      return db.getAllExperiences();
    }),
    
    getBySlug: publicProcedure
      .input(z.object({ slug: z.string() }))
      .query(async ({ input }) => {
        return db.getExperienceBySlug(input.slug);
      }),
    
    search: publicProcedure
      .input(z.object({ 
        query: z.string().optional(),
        category: z.string().optional()
      }))
      .query(async ({ input }) => {
        return db.searchExperiences(input.query, input.category);
      }),

    create: protectedProcedure
      .input(z.object({
        slug: z.string(),
        name: z.string(),
        category: z.enum(["tour", "hiking", "culture", "sport", "wellness", "family", "adventure", "food_wine"]),
        shortDescription: z.string().optional(),
        description: z.string().optional(),
        duration: z.string().optional(),
        location: z.string().optional(),
        priceAdult: z.string().optional(),
      }))
      .mutation(async ({ input }) => {
        return db.createExperience(input);
      }),
  }),

  // KI-Suche (natürlichsprachliche Anfragen)
  aiSearch: router({
    query: publicProcedure
      .input(z.object({ query: z.string() }))
      .query(async ({ input }) => {
        const query = input.query.toLowerCase();
        const results: Array<{
          type: 'hotel' | 'restaurant' | 'experience' | 'daily_special';
          name: string;
          description: string;
          url: string;
          relevance: number;
          details?: Record<string, unknown>;
        }> = [];
        
        // Suche in Hotels
        const hotels = await db.getAllHotels();
        for (const hotel of hotels) {
          let relevance = 0;
          const searchText = `${hotel.name} ${hotel.shortDescription || ''} ${hotel.description || ''} ${hotel.roomTypesText || ''} ${hotel.amenitiesText || ''}`.toLowerCase();
          
          if (searchText.includes(query)) relevance += 50;
          
          // Spezifische Begriffe
          if (query.includes('familienzimmer') && searchText.includes('familie')) relevance += 30;
          if (query.includes('babybett') && searchText.includes('babybett')) relevance += 40;
          if (query.includes('balkon') && searchText.includes('balkon')) relevance += 30;
          if (query.includes('parking') && hotel.parking) relevance += 20;
          if (query.includes('frühstück') && hotel.breakfast) relevance += 20;
          if (query.includes('haustier') && hotel.petsAllowed) relevance += 30;
          
          // Sterne-Suche
          const starsMatch = query.match(/(\d)\s*stern/);
          if (starsMatch && hotel.stars === parseInt(starsMatch[1])) relevance += 40;
          
          if (relevance > 0) {
            results.push({
              type: 'hotel',
              name: hotel.name,
              description: hotel.shortDescription || '',
              url: `/hotels/${hotel.slug}`,
              relevance,
              details: {
                stars: hotel.stars,
                priceFrom: hotel.priceFrom,
                priceTo: hotel.priceTo,
                bookingUrl: hotel.bookingUrl,
                phone: hotel.phone,
              }
            });
          }
        }
        
        // Suche in Restaurants
        const restaurants = await db.getAllRestaurants();
        for (const restaurant of restaurants) {
          let relevance = 0;
          const searchText = `${restaurant.name} ${restaurant.shortDescription || ''} ${restaurant.cuisineType || ''}`.toLowerCase();
          
          if (searchText.includes(query)) relevance += 50;
          if (query.includes('vegetarisch') && searchText.includes('vegetarisch')) relevance += 40;
          if (query.includes('italienisch') && searchText.includes('italienisch')) relevance += 30;
          if (query.includes('bündner') && searchText.includes('bündner')) relevance += 30;
          
          if (relevance > 0) {
            results.push({
              type: 'restaurant',
              name: restaurant.name,
              description: restaurant.shortDescription || '',
              url: `/restaurants/${restaurant.slug}`,
              relevance,
              details: {
                cuisineType: restaurant.cuisineType,
                phone: restaurant.phone,
                menuUrl: restaurant.menuUrl,
              }
            });
          }
        }
        
        // Suche in Tagesmenüs
        const dailySpecials = await db.getTodaysDailySpecials();
        for (const special of dailySpecials) {
          let relevance = 0;
          const searchText = `${special.name} ${special.description || ''}`.toLowerCase();
          
          if (searchText.includes(query)) relevance += 60;
          
          // Spezifische Gerichte
          const dishes = ['schnitzel', 'spaghetti', 'pizza', 'salat', 'suppe', 'pommes', 'burger', 'steak', 'fisch', 'poulet'];
          for (const dish of dishes) {
            if (query.includes(dish) && searchText.includes(dish)) relevance += 50;
          }
          
          if (query.includes('vegetarisch') && special.isVegetarian) relevance += 40;
          if (query.includes('vegan') && special.isVegan) relevance += 40;
          
          if (relevance > 0) {
            results.push({
              type: 'daily_special',
              name: special.name,
              description: `${special.description || ''} - CHF ${special.price}`,
              url: `/restaurants/${special.restaurantSlug}`,
              relevance,
              details: {
                price: special.price,
                restaurant: special.restaurantName,
                isVegetarian: special.isVegetarian,
                isVegan: special.isVegan,
              }
            });
          }
        }
        
        // Suche in Erlebnissen
        const experiences = await db.getAllExperiences();
        for (const exp of experiences) {
          let relevance = 0;
          const searchText = `${exp.name} ${exp.shortDescription || ''} ${exp.description || ''} ${exp.category}`.toLowerCase();
          
          if (searchText.includes(query)) relevance += 50;
          if (query.includes('stadtführung') && exp.category === 'tour') relevance += 40;
          if (query.includes('wanderung') && exp.category === 'hiking') relevance += 40;
          if (query.includes('kultur') && exp.category === 'culture') relevance += 40;
          
          if (relevance > 0) {
            results.push({
              type: 'experience',
              name: exp.name,
              description: exp.shortDescription || '',
              url: `/erlebnisse/${exp.slug}`,
              relevance,
              details: {
                category: exp.category,
                duration: exp.duration,
                priceAdult: exp.priceAdult,
              }
            });
          }
        }
        
        // Sortieren nach Relevanz
        results.sort((a, b) => b.relevance - a.relevance);
        
        return {
          query: input.query,
          totalResults: results.length,
          results: results.slice(0, 10),
        };
      }),
  }),

  // Experience Dates
  experienceDates: router({
    getByExperienceId: publicProcedure
      .input(z.object({ experienceId: z.number() }))
      .query(async ({ input }) => {
        return db.getExperienceDatesByExperienceId(input.experienceId);
      }),
  }),
});

export type AppRouter = typeof appRouter;
