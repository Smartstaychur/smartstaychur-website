import { getDb } from "./db";
import { hotels, restaurants } from "../drizzle/schema";
import { eq } from "drizzle-orm";

/**
 * Seed-Skript um Bilder zu Hotels und Restaurants hinzuzufügen
 * Wird nach dem initialen Seed ausgeführt
 */

const hotelImages: Record<string, string[]> = {
  "romantik-hotel-stern": [
    "https://files.manuscdn.com/user_upload_by_module/session_file/310519663271891494/hbLrqApTBBFAGjap.jpeg",
    "https://files.manuscdn.com/user_upload_by_module/session_file/310519663271891494/MfKvMrlDWmlVWBIi.jpg",
    "https://files.manuscdn.com/user_upload_by_module/session_file/310519663271891494/eRlaBTHfUsMfwsLd.jpg",
  ],
  "hotel-drei-koenige": [
    "https://files.manuscdn.com/user_upload_by_module/session_file/310519663271891494/MXjEpJujYQsRDXDq.jpg",
    "https://files.manuscdn.com/user_upload_by_module/session_file/310519663271891494/VzhNHafYhrqfwUEm.jpg",
    "https://files.manuscdn.com/user_upload_by_module/session_file/310519663271891494/zYSwiSdlykZOeZjK.jpg",
  ],
  "zunfthaus-zur-rebleuten": [
    "https://files.manuscdn.com/user_upload_by_module/session_file/310519663271891494/GUyBZHtBNOgpshpA.jpg",
    "https://files.manuscdn.com/user_upload_by_module/session_file/310519663271891494/gzjtgpyhkvCzHGtM.jpg",
  ],
  "hotel-chur": [
    "https://files.manuscdn.com/user_upload_by_module/session_file/310519663271891494/eMMzfwxxmWfqFTSy.jpg",
    "https://files.manuscdn.com/user_upload_by_module/session_file/310519663271891494/uqOIJKwjsYdswjgf.jpg",
    "https://files.manuscdn.com/user_upload_by_module/session_file/310519663271891494/RoiCMeSfEZIpPYbk.jpg",
  ],
  "ibis-budget-chur": [
    "https://files.manuscdn.com/user_upload_by_module/session_file/310519663271891494/sSVkdCwZtqMStYki.jpg",
    "https://files.manuscdn.com/user_upload_by_module/session_file/310519663271891494/KlqncVrNRBnJxXGC.jpg",
    "https://files.manuscdn.com/user_upload_by_module/session_file/310519663271891494/pzgTZvBKxlqrilPr.jpg",
  ],
  "hotel-abc": [
    "https://files.manuscdn.com/user_upload_by_module/session_file/310519663271891494/fIzuPTazicKOsuHK.jpg",
    "https://files.manuscdn.com/user_upload_by_module/session_file/310519663271891494/DJSWdnhVLHRYtZUi.jpg",
  ],
  "ambiente-hotel-freieck": [
    "https://files.manuscdn.com/user_upload_by_module/session_file/310519663271891494/ZTRVRpBUMJdhKzgk.jpg",
    "https://files.manuscdn.com/user_upload_by_module/session_file/310519663271891494/OdDhHXpyBpFPJmCg.jpg",
    "https://files.manuscdn.com/user_upload_by_module/session_file/310519663271891494/HYYpffdFLhDDpUMc.jpg",
  ],
  "hotel-marsoel": [
    "https://files.manuscdn.com/user_upload_by_module/session_file/310519663271891494/DiVIEgglTnnOLOSR.jpg",
    "https://files.manuscdn.com/user_upload_by_module/session_file/310519663271891494/lgIVVmOytHmzJXQg.jpg",
    "https://files.manuscdn.com/user_upload_by_module/session_file/310519663271891494/seIDAUNEwmHUayYv.jpeg",
  ],
};

const restaurantImages: Record<string, string[]> = {
  "restaurant-calanda": [
    "https://files.manuscdn.com/user_upload_by_module/session_file/310519663271891494/SwztsSVYMmRxxFZv.jpg",
    "https://files.manuscdn.com/user_upload_by_module/session_file/310519663271891494/trFErxmMixzIuSSh.jpg",
    "https://files.manuscdn.com/user_upload_by_module/session_file/310519663271891494/fKKWBxhAkOEpPreR.jpg",
  ],
  "brasserie-suesswinkel": [
    "https://files.manuscdn.com/user_upload_by_module/session_file/310519663271891494/DrKYAczMMJFfzmwB.jpg",
    "https://files.manuscdn.com/user_upload_by_module/session_file/310519663271891494/gGhXnlWsvSckcCBT.jpg",
    "https://files.manuscdn.com/user_upload_by_module/session_file/310519663271891494/QTuAjDjMDgCKCrei.jpg",
  ],
  "veltliner-weinstube": [
    "https://files.manuscdn.com/user_upload_by_module/session_file/310519663271891494/HodUKZZnSCKgfzVR.jpg",
    "https://files.manuscdn.com/user_upload_by_module/session_file/310519663271891494/ltBqwtOEoNjHiOLn.jpg",
  ],
  "ristorante-tre-fratelli": [
    "https://files.manuscdn.com/user_upload_by_module/session_file/310519663271891494/yicPCdxKRoEfoNhJ.jpg",
    "https://files.manuscdn.com/user_upload_by_module/session_file/310519663271891494/ysHXPZEnCFBRfhfi.jpg",
    "https://files.manuscdn.com/user_upload_by_module/session_file/310519663271891494/UpDskyyLOwkKymNS.jpg",
  ],
  "gasthaus-marsoel": [
    "https://files.manuscdn.com/user_upload_by_module/session_file/310519663271891494/TeRTHTmZwdJgsQgt.jpg",
    "https://files.manuscdn.com/user_upload_by_module/session_file/310519663271891494/OqOKfGTTKQmhFWuR.jpeg",
    "https://files.manuscdn.com/user_upload_by_module/session_file/310519663271891494/jbfbXOpzwMCgwKxu.jpg",
  ],
  "thai-garden": [
    "https://files.manuscdn.com/user_upload_by_module/session_file/310519663271891494/CkcaCKIeEnsJTQKr.jpg",
    "https://files.manuscdn.com/user_upload_by_module/session_file/310519663271891494/EPCMBchxyQvPvIrT.jpg",
  ],
  "cafe-arcas": [
    "https://files.manuscdn.com/user_upload_by_module/session_file/310519663271891494/qlcpzqgYZPjbLDTy.jpg",
    "https://files.manuscdn.com/user_upload_by_module/session_file/310519663271891494/lLVHRmwQCpZqtbVW.jpg",
    "https://files.manuscdn.com/user_upload_by_module/session_file/310519663271891494/TsYmfqfKzqrnZIhs.jpg",
  ],
  "stern-restaurant": [
    "https://files.manuscdn.com/user_upload_by_module/session_file/310519663271891494/HubssThbnoOIuzLk.jpg",
    "https://files.manuscdn.com/user_upload_by_module/session_file/310519663271891494/CixOCmDOojzRqXXa.jpg",
  ],
  "tandoori-masala": [
    "https://files.manuscdn.com/user_upload_by_module/session_file/310519663271891494/FSpGapdYXwKfKJUw.jpg",
    "https://files.manuscdn.com/user_upload_by_module/session_file/310519663271891494/AnEJfhRaAVsJxvrT.jpg",
  ],
  "bieraria-buendner-herrschaft": [
    "https://files.manuscdn.com/user_upload_by_module/session_file/310519663271891494/vKflulGbektCbsez.jpg",
  ],
};

export async function seedImages() {
  const db = await getDb();
  if (!db) {
    console.warn("[Seed Images] Database not available");
    return;
  }

  console.log("[Seed Images] Aktualisiere Hotel-Bilder...");
  for (const [slug, imageUrls] of Object.entries(hotelImages)) {
    await db
      .update(hotels)
      .set({ 
        mainImage: imageUrls[0],
        galleryImages: imageUrls 
      })
      .where(eq(hotels.slug, slug));
  }

  console.log("[Seed Images] Aktualisiere Restaurant-Bilder...");
  for (const [slug, imageUrls] of Object.entries(restaurantImages)) {
    await db
      .update(restaurants)
      .set({ 
        mainImage: imageUrls[0],
        galleryImages: imageUrls 
      })
      .where(eq(restaurants.slug, slug));
  }

  console.log("[Seed Images] Bilder erfolgreich aktualisiert");
}

// Wenn direkt ausgeführt
if (import.meta.url === `file://${process.argv[1]}`) {
  seedImages()
    .then(() => {
      console.log("✅ Seed Images abgeschlossen");
      process.exit(0);
    })
    .catch((err) => {
      console.error("❌ Seed Images fehlgeschlagen:", err);
      process.exit(1);
    });
}
