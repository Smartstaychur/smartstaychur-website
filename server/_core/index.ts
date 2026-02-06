import express from "express";
import { createServer } from "http";
import net from "net";
import { createExpressMiddleware } from "@trpc/server/adapters/express";
import { registerOAuthRoutes } from "./oauth";
import { appRouter } from "../routers";
import { createContext } from "./context";
import { serveStatic, setupVite } from "./vite";
import * as db from "../db";

function isPortAvailable(port: number): Promise<boolean> {
  return new Promise(resolve => {
    const server = net.createServer();
    server.listen(port, () => {
      server.close(() => resolve(true));
    });
    server.on("error", () => resolve(false));
  });
}

async function findAvailablePort(startPort: number = 3000): Promise<number> {
  for (let port = startPort; port < startPort + 20; port++) {
    if (await isPortAvailable(port)) {
      return port;
    }
  }
  throw new Error(`No available port found starting from ${startPort}`);
}

async function startServer() {
  const app = express();
  const server = createServer(app);
  // Configure body parser with larger size limit for file uploads
  app.use(express.json({ limit: "50mb" }));
  app.use(express.urlencoded({ limit: "50mb", extended: true }));
  
  // OAuth callback under /api/oauth/callback
  registerOAuthRoutes(app);
  
  // API Feeds for KI-Agenten (JSON endpoints)
  app.get("/api/feeds/hotels.json", async (req, res) => {
    try {
      const hotels = await db.getAllHotels();
      res.json({
        "@context": "https://schema.org",
        "@type": "ItemList",
        "name": "Hotels in Chur und Graubünden",
        "description": "Alle Hotels auf SmartStayChur - KI-optimiert für Buchungsanfragen",
        "numberOfItems": hotels.length,
        "lastUpdated": new Date().toISOString(),
        "itemListElement": hotels.map((hotel, index) => ({
          "@type": "ListItem",
          "position": index + 1,
          "item": {
            "@type": "LodgingBusiness",
            "name": hotel.name,
            "slug": hotel.slug,
            "detailUrl": `https://smartstaychur.ch/hotels/${hotel.slug}`,
            "address": {
              "@type": "PostalAddress",
              "streetAddress": hotel.address,
              "postalCode": hotel.postalCode,
              "addressLocality": hotel.city,
              "addressCountry": "CH"
            },
            "starRating": hotel.stars ? { "@type": "Rating", "ratingValue": hotel.stars } : undefined,
            "telephone": hotel.phone,
            "email": hotel.email,
            "url": hotel.website,
            "bookingUrl": hotel.bookingUrl,
            "description": hotel.shortDescription,
            "fullDescription": hotel.description,
            "priceRange": hotel.priceFrom && hotel.priceTo ? `CHF ${hotel.priceFrom} - ${hotel.priceTo}` : undefined,
            "priceFrom": hotel.priceFrom,
            "priceTo": hotel.priceTo,
            "currency": "CHF",
            "roomTypes": hotel.roomTypesText,
            "roomAmenities": hotel.amenitiesText,
            "checkIn": hotel.checkInFrom,
            "checkOut": hotel.checkOutUntil,
            "amenityFeature": [
              hotel.wifi && { "@type": "LocationFeatureSpecification", "name": "WiFi", "value": true },
              hotel.parking && { "@type": "LocationFeatureSpecification", "name": "Parking", "value": true },
              hotel.breakfast && { "@type": "LocationFeatureSpecification", "name": "Breakfast", "value": true },
              hotel.restaurant && { "@type": "LocationFeatureSpecification", "name": "Restaurant", "value": true },
              hotel.spa && { "@type": "LocationFeatureSpecification", "name": "Spa/Wellness", "value": true },
              hotel.petsAllowed && { "@type": "LocationFeatureSpecification", "name": "Pets Allowed", "value": true },
              hotel.wheelchairAccessible && { "@type": "LocationFeatureSpecification", "name": "Wheelchair Accessible", "value": true },
              hotel.familyFriendly && { "@type": "LocationFeatureSpecification", "name": "Family Friendly", "value": true },
            ].filter(Boolean)
          }
        }))
      });
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch hotels" });
    }
  });

  app.get("/api/feeds/restaurants.json", async (req, res) => {
    try {
      const restaurants = await db.getAllRestaurants();
      res.json({
        "@context": "https://schema.org",
        "@type": "ItemList",
        "name": "Restaurants in Chur",
        "description": "Alle Restaurants auf SmartStayChur - KI-optimiert für Reservierungsanfragen",
        "numberOfItems": restaurants.length,
        "lastUpdated": new Date().toISOString(),
        "itemListElement": restaurants.map((restaurant, index) => ({
          "@type": "ListItem",
          "position": index + 1,
          "item": {
            "@type": "Restaurant",
            "name": restaurant.name,
            "slug": restaurant.slug,
            "detailUrl": `https://smartstaychur.ch/restaurants/${restaurant.slug}`,
            "servesCuisine": restaurant.cuisineType,
            "priceLevel": restaurant.priceLevel,
            "averagePrice": restaurant.averagePrice,
            "address": {
              "@type": "PostalAddress",
              "streetAddress": restaurant.address,
              "postalCode": restaurant.postalCode,
              "addressLocality": restaurant.city,
              "addressCountry": "CH"
            },
            "telephone": restaurant.phone,
            "email": restaurant.email,
            "url": restaurant.website,
            "menuUrl": restaurant.menuUrl,
            "reservationUrl": restaurant.reservationUrl,
            "description": restaurant.shortDescription,
            "fullDescription": restaurant.description,
            "openingHours": restaurant.openingHours,
            "acceptsReservations": true,
            "reservationContact": restaurant.phone || restaurant.email
          }
        }))
      });
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch restaurants" });
    }
  });

  app.get("/api/feeds/experiences.json", async (req, res) => {
    try {
      const experiences = await db.getAllExperiences();
      res.json({
        "@context": "https://schema.org",
        "@type": "ItemList",
        "name": "Erlebnisse in Chur und Graubünden",
        "description": "Alle Erlebnisse auf SmartStayChur",
        "numberOfItems": experiences.length,
        "itemListElement": experiences.map((exp, index) => ({
          "@type": "ListItem",
          "position": index + 1,
          "item": {
            "@type": "TouristAttraction",
            "name": exp.name,
            "description": exp.shortDescription,
            "address": {
              "@type": "PostalAddress",
              "addressLocality": exp.location,
              "addressCountry": "CH"
            },
            "touristType": exp.category,
            "isAccessibleForFree": exp.priceAdult === "0" || !exp.priceAdult
          }
        }))
      });
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch experiences" });
    }
  });

  app.get("/api/feeds/daily-specials.json", async (req, res) => {
    try {
      const specials = await db.getTodaysDailySpecials();
      res.json({
        "@context": "https://schema.org",
        "@type": "ItemList",
        "name": "Tagesmenüs in Chur",
        "description": "Heutige Tagesmenüs auf SmartStayChur",
        "datePublished": new Date().toISOString().split('T')[0],
        "numberOfItems": specials.length,
        "itemListElement": specials.map((special, index) => ({
          "@type": "ListItem",
          "position": index + 1,
          "item": {
            "@type": "MenuItem",
            "name": special.name,
            "description": special.description,
            "offers": {
              "@type": "Offer",
              "price": special.price,
              "priceCurrency": special.currency || "CHF"
            },
            "suitableForDiet": [
              special.isVegetarian && "VegetarianDiet",
              special.isVegan && "VeganDiet"
            ].filter(Boolean),
            "menuAddOn": {
              "@type": "Restaurant",
              "name": special.restaurantName,
              "url": `/restaurants/${special.restaurantSlug}`
            }
          }
        }))
      });
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch daily specials" });
    }
  });
  
  // Sitemap.xml für Suchmaschinen und KI-Crawler
  app.get("/sitemap.xml", async (req, res) => {
    try {
      const hotels = await db.getAllHotels();
      const restaurants = await db.getAllRestaurants();
      const experiences = await db.getAllExperiences();
      const baseUrl = "https://smartstaychur.ch";
      const today = new Date().toISOString().split('T')[0];
      
      let xml = `<?xml version="1.0" encoding="UTF-8"?>\n`;
      xml += `<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n`;
      
      // Hauptseiten
      xml += `  <url><loc>${baseUrl}/</loc><lastmod>${today}</lastmod><changefreq>daily</changefreq><priority>1.0</priority></url>\n`;
      xml += `  <url><loc>${baseUrl}/hotels</loc><lastmod>${today}</lastmod><changefreq>daily</changefreq><priority>0.9</priority></url>\n`;
      xml += `  <url><loc>${baseUrl}/restaurants</loc><lastmod>${today}</lastmod><changefreq>daily</changefreq><priority>0.9</priority></url>\n`;
      xml += `  <url><loc>${baseUrl}/erlebnisse</loc><lastmod>${today}</lastmod><changefreq>weekly</changefreq><priority>0.8</priority></url>\n`;
      
      // KI-Dateien
      xml += `  <url><loc>${baseUrl}/llms.txt</loc><lastmod>${today}</lastmod><changefreq>weekly</changefreq><priority>0.7</priority></url>\n`;
      xml += `  <url><loc>${baseUrl}/ai.txt</loc><lastmod>${today}</lastmod><changefreq>weekly</changefreq><priority>0.7</priority></url>\n`;
      
      // Hotel-Detailseiten
      for (const hotel of hotels) {
        xml += `  <url><loc>${baseUrl}/hotels/${hotel.slug}</loc><lastmod>${today}</lastmod><changefreq>weekly</changefreq><priority>0.8</priority></url>\n`;
      }
      
      // Restaurant-Detailseiten
      for (const restaurant of restaurants) {
        xml += `  <url><loc>${baseUrl}/restaurants/${restaurant.slug}</loc><lastmod>${today}</lastmod><changefreq>daily</changefreq><priority>0.8</priority></url>\n`;
      }
      
      // Erlebnis-Detailseiten
      for (const exp of experiences) {
        xml += `  <url><loc>${baseUrl}/erlebnisse/${exp.slug}</loc><lastmod>${today}</lastmod><changefreq>weekly</changefreq><priority>0.7</priority></url>\n`;
      }
      
      xml += `</urlset>`;
      
      res.set('Content-Type', 'application/xml');
      res.send(xml);
    } catch (error) {
      res.status(500).send('Error generating sitemap');
    }
  });
  
  // tRPC API
  app.use(
    "/api/trpc",
    createExpressMiddleware({
      router: appRouter,
      createContext,
    })
  );
  
  // development mode uses Vite, production mode uses static files
  if (process.env.NODE_ENV === "development") {
    await setupVite(app, server);
  } else {
    serveStatic(app);
  }

  const preferredPort = parseInt(process.env.PORT || "3000");
  const port = await findAvailablePort(preferredPort);

  if (port !== preferredPort) {
    console.log(`Port ${preferredPort} is busy, using port ${port} instead`);
  }

  server.listen(port, () => {
    console.log(`Server running on http://localhost:${port}/`);
  });
}

startServer().catch(console.error);
