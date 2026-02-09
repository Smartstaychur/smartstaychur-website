import { getDb } from "./db";
import { hotels } from "../drizzle/schema";

const newHotels = [
  {
    slug: "hotel-franziskaner",
    name: "Hotel Franziskaner",
    category: "Romantik Hotel",
    stars: 3,
    address: "Kupfergasse 18",
    postalCode: "7000",
    city: "Chur",
    phone: "+41 81 252 12 61",
    email: "info@hotelfranziskaner.ch",
    website: "https://www.franziskanerchur.ch",
    description: "Historisches Hotel im Herzen der Altstadt beim Obertor. Familiäres Ambiente mit typischem Bündner Restaurant und Fonduestübli. Genießen Sie einen wunderbaren Aufenthalt in historischer und familiärer Umgebung mit regionalen Produkten.",
    shortDescription: "Historisches Hotel mit Bündner Restaurant in der Altstadt",
    priceFrom: 110,
    priceTo: 180,
    mainImage: "https://files.manuscdn.com/user_upload_by_module/session_file/310519663271891494/XZjJUasEOhJtDSxn.jpg",
    galleryImages: [
      "https://files.manuscdn.com/user_upload_by_module/session_file/310519663271891494/CNRnVtNvxuFoBfRd.jpg",
      "https://files.manuscdn.com/user_upload_by_module/session_file/310519663271891494/mEEGVYHUDEPYTvTh.jpg",
    ],
    amenities: {
      wifi: true,
      parking: false,
      breakfast: true,
      petsAllowed: true,
    },
  },
  {
    slug: "hotel-rosenhuegel",
    name: "Hotel Rosenhügel",
    category: "Boutique Hotel",
    stars: 3,
    address: "Masanserstrasse 87",
    postalCode: "7000",
    city: "Chur",
    phone: "+41 81 284 17 44",
    email: "info@rosenhuegel.ch",
    website: "https://www.rosenhuegel.ch",
    description: "Kleines, charmantes Hotel etwas oberhalb der Stadt Chur mit herrlichem Blick auf die Berge. Ruhige Lage mit persönlichem Service und gemütlichen Zimmern. Ideal für Gäste, die Ruhe und Natur schätzen.",
    shortDescription: "Kleines Hotel oberhalb der Stadt mit Bergblick",
    priceFrom: 95,
    priceTo: 150,
    mainImage: "https://files.manuscdn.com/user_upload_by_module/session_file/310519663271891494/vvglaHZbuapmVPvA.jpg",
    galleryImages: [
      "https://files.manuscdn.com/user_upload_by_module/session_file/310519663271891494/BVTsKyKGFNABAUXY.jpg",
    ],
    amenities: {
      wifi: true,
      parking: true,
      breakfast: true,
      petsAllowed: true,
    },
  },
  {
    slug: "mercure-chur-city-west",
    name: "Mercure Chur City West",
    category: "Business Hotel",
    stars: 4,
    address: "Comercialstrasse 32",
    postalCode: "7000",
    city: "Chur",
    phone: "+41 81 258 18 18",
    email: "h5436@accor.com",
    website: "https://all.accor.com/hotel/B7Z9/index.de.shtml",
    description: "Modernes 4-Sterne-Hotel im Geschäftsviertel mit 49 Zimmern und Bergblick. Grosszügige Zimmer mit modernem Komfort, Klimaanlage und elektrischen Jalousien. Restaurant mit Panoramablick, Dachterrasse, Bowling und Shopping-Center vor Ort. Kostenlose Buskarte für Gäste. Nur 5 Minuten vom Stadtzentrum entfernt.",
    shortDescription: "Modernes Hotel mit Bergblick, Restaurant und Dachterrasse",
    priceFrom: 140,
    priceTo: 250,
    mainImage: "https://files.manuscdn.com/user_upload_by_module/session_file/310519663271891494/PlOMNpHJfizQjtaf.jpg",
    galleryImages: [
      "https://files.manuscdn.com/user_upload_by_module/session_file/310519663271891494/EgeZbxzDazvKmgfh.jpg",
    ],
    amenities: {
      wifi: true,
      parking: true,
      breakfast: true,
      petsAllowed: false,
    },
  },
  {
    slug: "central-hotel-post",
    name: "Central Hotel Post",
    category: "Stadthotel",
    stars: 3,
    address: "Poststrasse 11",
    postalCode: "7000",
    city: "Chur",
    phone: "+41 81 255 11 00",
    email: "info@hotelpostchur.ch",
    website: "https://www.hotelpostchur.ch",
    description: "Komfortables Hotel Garni in der Fussgängerzone der Altstadt. Erbaut 1925, renoviert 2016. 50 Zimmer über 5 Etagen. Nur 7 Gehminuten vom Bahnhof Chur entfernt. Zentrale Lage in der ältesten Stadt der Schweiz mit direktem Zugang zu Museen, Restaurants und Geschäften. Kostenloses WLAN.",
    shortDescription: "Hotel Garni in der Fussgängerzone der Altstadt",
    priceFrom: 120,
    priceTo: 200,
    mainImage: "https://files.manuscdn.com/user_upload_by_module/session_file/310519663271891494/gEiIJQRgSxtiNgZk.jpg",
    galleryImages: [
      "https://files.manuscdn.com/user_upload_by_module/session_file/310519663271891494/ShrXNhnTcsatgfPq.jpg",
    ],
    amenities: {
      wifi: true,
      parking: false,
      breakfast: true,
      petsAllowed: true,
    },
  },
  {
    slug: "gartenhotel-sternen",
    name: "Gartenhotel Sternen",
    category: "Gartenhotel",
    stars: 3,
    address: "Reichsgasse 44",
    postalCode: "7013",
    city: "Domat/Ems",
    phone: "+41 81 630 14 14",
    email: "info@sternen-domat.ch",
    website: "https://www.sternen-domat.ch",
    description: "Charmantes Gartenhotel in Domat/Ems, nur 5 km von Chur entfernt. Ruhige Lage mit großem Garten und Terrasse. Familiäre Atmosphäre mit persönlichem Service. Idealer Ausgangspunkt für Ausflüge in die Bündner Bergwelt. Restaurant mit regionaler Küche.",
    shortDescription: "Gartenhotel mit Terrasse nahe Chur",
    priceFrom: 100,
    priceTo: 160,
    mainImage: "https://files.manuscdn.com/user_upload_by_module/session_file/310519663271891494/KFQNRaXVfbTKXAIT.jpg",
    galleryImages: [
      "https://files.manuscdn.com/user_upload_by_module/session_file/310519663271891494/JXiAIlEaZLPTZUuP.jpg",
    ],
    amenities: {
      wifi: true,
      parking: true,
      breakfast: true,
      petsAllowed: true,
    },
  },
];

export async function seedNewHotels() {
  const db = await getDb();
  if (!db) {
    console.error("[Seed New Hotels] Datenbank nicht verfügbar");
    return;
  }

  console.log("[Seed New Hotels] Füge 5 neue Hotels hinzu...");

  for (const hotel of newHotels) {
    try {
      await db.insert(hotels).values(hotel);
      console.log(`[Seed New Hotels] ✅ ${hotel.name} hinzugefügt`);
    } catch (error) {
      console.error(`[Seed New Hotels] ❌ Fehler bei ${hotel.name}:`, error);
    }
  }

  console.log("[Seed New Hotels] Abgeschlossen");
}

// Wenn direkt ausgeführt
if (import.meta.url === `file://${process.argv[1]}`) {
  seedNewHotels()
    .then(() => {
      console.log("✅ Seed New Hotels abgeschlossen");
      process.exit(0);
    })
    .catch((error) => {
      console.error("❌ Fehler beim Seeden:", error);
      process.exit(1);
    });
}
