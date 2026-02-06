import { describe, expect, it } from "vitest";
import { appRouter } from "./routers";
import type { TrpcContext } from "./_core/context";

function createPublicContext(): TrpcContext {
  return {
    user: null,
    req: {
      protocol: "https",
      headers: {},
    } as TrpcContext["req"],
    res: {
      clearCookie: () => {},
    } as TrpcContext["res"],
  };
}

describe("Hotels API", () => {
  it("should return hotel list", async () => {
    const ctx = createPublicContext();
    const caller = appRouter.createCaller(ctx);
    
    const hotels = await caller.hotels.list();
    
    expect(Array.isArray(hotels)).toBe(true);
  });

  it("should search hotels by query", async () => {
    const ctx = createPublicContext();
    const caller = appRouter.createCaller(ctx);
    
    const hotels = await caller.hotels.search({ query: "Chur" });
    
    expect(Array.isArray(hotels)).toBe(true);
  });

  it("should filter hotels by stars", async () => {
    const ctx = createPublicContext();
    const caller = appRouter.createCaller(ctx);
    
    const hotels = await caller.hotels.search({ stars: 4 });
    
    expect(Array.isArray(hotels)).toBe(true);
    // All returned hotels should have 4 stars
    hotels.forEach(hotel => {
      if (hotel.stars !== null) {
        expect(hotel.stars).toBe(4);
      }
    });
  });
});

describe("Restaurants API", () => {
  it("should return restaurant list", async () => {
    const ctx = createPublicContext();
    const caller = appRouter.createCaller(ctx);
    
    const restaurants = await caller.restaurants.list();
    
    expect(Array.isArray(restaurants)).toBe(true);
  });

  it("should search restaurants by query", async () => {
    const ctx = createPublicContext();
    const caller = appRouter.createCaller(ctx);
    
    const restaurants = await caller.restaurants.search({ query: "Italienisch" });
    
    expect(Array.isArray(restaurants)).toBe(true);
  });
});

describe("Experiences API", () => {
  it("should return experience list", async () => {
    const ctx = createPublicContext();
    const caller = appRouter.createCaller(ctx);
    
    const experiences = await caller.experiences.list();
    
    expect(Array.isArray(experiences)).toBe(true);
  });

  it("should search experiences by category", async () => {
    const ctx = createPublicContext();
    const caller = appRouter.createCaller(ctx);
    
    const experiences = await caller.experiences.search({ category: "hiking" });
    
    expect(Array.isArray(experiences)).toBe(true);
  });
});

describe("Statistics API", () => {
  it("should return statistics", async () => {
    const ctx = createPublicContext();
    const caller = appRouter.createCaller(ctx);
    
    const stats = await caller.stats.get();
    
    expect(stats).toHaveProperty("hotelCount");
    expect(stats).toHaveProperty("restaurantCount");
    expect(stats).toHaveProperty("experienceCount");
    expect(typeof stats.hotelCount).toBe("number");
    expect(typeof stats.restaurantCount).toBe("number");
    expect(typeof stats.experienceCount).toBe("number");
  });
});

describe("Daily Specials API", () => {
  it("should return today's specials", async () => {
    const ctx = createPublicContext();
    const caller = appRouter.createCaller(ctx);
    
    const specials = await caller.dailySpecials.getToday();
    
    expect(Array.isArray(specials)).toBe(true);
  });
});
