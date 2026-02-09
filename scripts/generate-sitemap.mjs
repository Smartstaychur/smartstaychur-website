import { drizzle } from "drizzle-orm/mysql2";
import { hotels, restaurants } from "../drizzle/schema.ts";
import fs from "fs";

const db = drizzle(process.env.DATABASE_URL);

async function generateSitemap() {
  const allHotels = await db.select({ slug: hotels.slug, updatedAt: hotels.updatedAt }).from(hotels);
  const allRestaurants = await db.select({ slug: restaurants.slug, updatedAt: restaurants.updatedAt }).from(restaurants);

  const baseUrl = "https://smartstaychur.ch";
  const now = new Date().toISOString();

  const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <!-- Homepage -->
  <url>
    <loc>${baseUrl}/</loc>
    <lastmod>${now}</lastmod>
    <changefreq>daily</changefreq>
    <priority>1.0</priority>
  </url>
  
  <!-- Hotels Übersicht -->
  <url>
    <loc>${baseUrl}/hotels</loc>
    <lastmod>${now}</lastmod>
    <changefreq>daily</changefreq>
    <priority>0.9</priority>
  </url>
  
  <!-- Restaurants Übersicht -->
  <url>
    <loc>${baseUrl}/restaurants</loc>
    <lastmod>${now}</lastmod>
    <changefreq>daily</changefreq>
    <priority>0.9</priority>
  </url>
  
  <!-- Hotel Detailseiten -->
${allHotels.map(h => `  <url>
    <loc>${baseUrl}/hotels/${h.slug}</loc>
    <lastmod>${h.updatedAt.toISOString()}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.8</priority>
  </url>`).join('\n')}
  
  <!-- Restaurant Detailseiten -->
${allRestaurants.map(r => `  <url>
    <loc>${baseUrl}/restaurants/${r.slug}</loc>
    <lastmod>${r.updatedAt.toISOString()}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.8</priority>
  </url>`).join('\n')}
</urlset>`;

  fs.writeFileSync("client/public/sitemap.xml", sitemap);
  console.log("✅ Sitemap generiert: client/public/sitemap.xml");
  console.log(`   ${allHotels.length} Hotels, ${allRestaurants.length} Restaurants`);
}

generateSitemap().catch(console.error).finally(() => process.exit(0));
