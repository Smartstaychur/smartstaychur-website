import { z } from "zod";
import { COOKIE_NAME } from "@shared/const";
import { getSessionCookieOptions } from "./_core/cookies";
import { systemRouter } from "./_core/systemRouter";
import { publicProcedure, protectedProcedure, router } from "./_core/trpc";
import {
  listHotels, getHotelBySlug, getHotelById, updateHotel, createHotel,
  listRestaurants, getRestaurantBySlug, getRestaurantById, updateRestaurant, createRestaurant,
  listAllHotels, listAllRestaurants,
} from "./db";
import { getProviderFromRequest, type ProviderSession } from "./passwordAuth";
import { TRPCError } from "@trpc/server";

// Helper: get provider session from request context
async function requireProvider(req: any): Promise<ProviderSession> {
  const provider = await getProviderFromRequest(req);
  if (!provider) throw new TRPCError({ code: "UNAUTHORIZED", message: "Nicht angemeldet" });
  return provider;
}

async function requireAdmin(req: any): Promise<ProviderSession> {
  const provider = await requireProvider(req);
  if (provider.role !== "admin") throw new TRPCError({ code: "FORBIDDEN", message: "Nur Administratoren" });
  return provider;
}

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

  // ─── Hotels (public) ───
  hotel: router({
    list: publicProcedure
      .input(z.object({
        stars: z.number().optional(),
        search: z.string().optional(),
        featured: z.boolean().optional(),
      }).optional())
      .query(async ({ input }) => {
        return listHotels(input || {});
      }),

    getBySlug: publicProcedure
      .input(z.object({ slug: z.string() }))
      .query(async ({ input }) => {
        const hotel = await getHotelBySlug(input.slug);
        if (!hotel) throw new TRPCError({ code: "NOT_FOUND", message: "Hotel nicht gefunden" });
        return hotel;
      }),

    getById: publicProcedure
      .input(z.object({ id: z.number() }))
      .query(async ({ input }) => {
        const hotel = await getHotelById(input.id);
        if (!hotel) throw new TRPCError({ code: "NOT_FOUND", message: "Hotel nicht gefunden" });
        return hotel;
      }),

    // Protected: update hotel (provider must own it or be admin)
    update: publicProcedure
      .input(z.object({
        id: z.number(),
        name: z.string().optional(),
        stars: z.number().optional(),
        address: z.string().optional(),
        city: z.string().optional(),
        postalCode: z.string().optional(),
        phone: z.string().optional(),
        email: z.string().optional(),
        website: z.string().optional(),
        bookingUrl: z.string().optional(),
        descriptionDe: z.string().optional(),
        descriptionEn: z.string().optional(),
        shortDescDe: z.string().optional(),
        shortDescEn: z.string().optional(),
        priceFrom: z.number().nullable().optional(),
        priceTo: z.number().nullable().optional(),
        currency: z.string().optional(),
        checkInFrom: z.string().optional(),
        checkInTo: z.string().optional(),
        checkOutFrom: z.string().optional(),
        checkOutTo: z.string().optional(),
        wifiFree: z.boolean().optional(),
        parkingFree: z.boolean().optional(),
        parkingPaid: z.boolean().optional(),
        breakfastIncluded: z.boolean().optional(),
        petsAllowed: z.boolean().optional(),
        petSurcharge: z.string().optional(),
        familyFriendly: z.boolean().optional(),
        wheelchairAccessible: z.boolean().optional(),
        elevator: z.boolean().optional(),
        spa: z.boolean().optional(),
        pool: z.boolean().optional(),
        gym: z.boolean().optional(),
        restaurant: z.boolean().optional(),
        bar: z.boolean().optional(),
        roomService: z.boolean().optional(),
        airConditioning: z.boolean().optional(),
        balcony: z.boolean().optional(),
        mainImage: z.string().nullable().optional(),
        galleryImages: z.array(z.string()).nullable().optional(),
        specialFeatures: z.string().optional(),
        isPublished: z.boolean().optional(),
        isFeatured: z.boolean().optional(),
      }))
      .mutation(async ({ input, ctx }) => {
        const provider = await requireProvider(ctx.req);
        if (provider.role !== "admin" && provider.linkedHotelId !== input.id) {
          throw new TRPCError({ code: "FORBIDDEN", message: "Keine Berechtigung für dieses Hotel" });
        }
        const { id, ...data } = input;
        return updateHotel(id, data);
      }),

    create: publicProcedure
      .input(z.object({
        name: z.string(),
        slug: z.string(),
        stars: z.number().optional(),
        category: z.string().optional(),
        address: z.string().optional(),
        city: z.string().optional(),
        postalCode: z.string().optional(),
        phone: z.string().optional(),
        email: z.string().optional(),
        website: z.string().optional(),
      }))
      .mutation(async ({ input, ctx }) => {
        await requireAdmin(ctx.req);
        return createHotel(input);
      }),
  }),

  // ─── Restaurants (public) ───
  restaurant: router({
    list: publicProcedure
      .input(z.object({
        cuisineType: z.string().optional(),
        search: z.string().optional(),
        featured: z.boolean().optional(),
      }).optional())
      .query(async ({ input }) => {
        return listRestaurants(input || {});
      }),

    getBySlug: publicProcedure
      .input(z.object({ slug: z.string() }))
      .query(async ({ input }) => {
        const restaurant = await getRestaurantBySlug(input.slug);
        if (!restaurant) throw new TRPCError({ code: "NOT_FOUND", message: "Restaurant nicht gefunden" });
        return restaurant;
      }),

    getById: publicProcedure
      .input(z.object({ id: z.number() }))
      .query(async ({ input }) => {
        const restaurant = await getRestaurantById(input.id);
        if (!restaurant) throw new TRPCError({ code: "NOT_FOUND", message: "Restaurant nicht gefunden" });
        return restaurant;
      }),

    update: publicProcedure
      .input(z.object({
        id: z.number(),
        name: z.string().optional(),
        address: z.string().optional(),
        city: z.string().optional(),
        postalCode: z.string().optional(),
        phone: z.string().optional(),
        email: z.string().optional(),
        website: z.string().optional(),
        menuUrl: z.string().nullable().optional(),
        cuisineTypes: z.array(z.string()).nullable().optional(),
        priceLevel: z.string().optional(),
        ambiance: z.string().optional(),
        descriptionDe: z.string().optional(),
        descriptionEn: z.string().optional(),
        shortDescDe: z.string().optional(),
        shortDescEn: z.string().optional(),
        openingHours: z.any().optional(),
        openingHoursText: z.string().nullable().optional(),
        closedDays: z.array(z.string()).nullable().optional(),
        outdoorSeating: z.boolean().optional(),
        terrace: z.boolean().optional(),
        garden: z.boolean().optional(),
        wheelchairAccessible: z.boolean().optional(),
        vegetarianOptions: z.boolean().optional(),
        veganOptions: z.boolean().optional(),
        glutenFreeOptions: z.boolean().optional(),
        reservationRequired: z.boolean().optional(),
        reservationUrl: z.string().optional(),
        mainImage: z.string().nullable().optional(),
        galleryImages: z.array(z.string()).nullable().optional(),
        isPublished: z.boolean().optional(),
        isFeatured: z.boolean().optional(),
      }))
      .mutation(async ({ input, ctx }) => {
        const provider = await requireProvider(ctx.req);
        if (provider.role !== "admin" && provider.linkedRestaurantId !== input.id) {
          throw new TRPCError({ code: "FORBIDDEN", message: "Keine Berechtigung für dieses Restaurant" });
        }
        const { id, ...data } = input;
        return updateRestaurant(id, data);
      }),

    create: publicProcedure
      .input(z.object({
        name: z.string(),
        slug: z.string(),
        address: z.string().optional(),
        city: z.string().optional(),
        postalCode: z.string().optional(),
        phone: z.string().optional(),
        email: z.string().optional(),
        website: z.string().optional(),
      }))
      .mutation(async ({ input, ctx }) => {
        await requireAdmin(ctx.req);
        return createRestaurant(input);
      }),
  }),

  // ─── Admin: list all (including unpublished) ───
  admin: router({
    allHotels: publicProcedure.query(async ({ ctx }) => {
      await requireAdmin(ctx.req);
      return listAllHotels();
    }),
    allRestaurants: publicProcedure.query(async ({ ctx }) => {
      await requireAdmin(ctx.req);
      return listAllRestaurants();
    }),
  }),
});

export type AppRouter = typeof appRouter;
