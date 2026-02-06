import "dotenv/config";
import mysql from "mysql2/promise";

/**
 * Komplettes Seed-Skript für SmartStayChur.
 * Spielt alle Hotel- und Restaurant-Daten ein, inklusive:
 * - Hotel-Preise, Beschreibungen, Amenities
 * - Restaurant-Öffnungszeiten, Menü-URLs, Kontaktdaten
 * 
 * Dieses Skript ist idempotent (kann mehrfach ausgeführt werden).
 * Verwendung: node scripts/seed-all-data.mjs
 */

// ============================================
// HOTEL-DATEN
// ============================================
const hotels = [
  { slug: "hotel-abc", name: "Hotel ABC", type: "hotel", stars: 4, address: "Ottostrasse 8", postalCode: "7000", city: "Chur", phone: "+41 81 254 13 13", email: "abc@hotelabc.ch", website: "https://www.hotelabc.ch/", bookingUrl: "https://www.hotelabc.ch/", priceFrom: "235", priceTo: "320", description: "Das sehr zentral gelegene 4-Stern-Hotel ABC in Chur ist mit schlichten, aber edlen Materialien und stilvoller Kunst eingerichtet. 48 Zimmer, 1 Suite und 9 Studios, alle modern, hell und mit allem Komfort und gratis WLAN ausgestattet.", shortDescription: "Modernes 4-Stern Boutique-Hotel im Zentrum von Chur.", petsAllowed: false, familyFriendly: true, parking: true, wifi: true, breakfast: true, spa: false, pool: false },
  { slug: "stern-chur", name: "Hotel Stern Chur", type: "hotel", stars: 3, address: "Reichsgasse 11", postalCode: "7000", city: "Chur", phone: "+41 81 258 57 57", email: "info@stern-chur.ch", website: "https://www.stern-chur.ch/", bookingUrl: "https://www.stern-chur.ch/", priceFrom: "130", priceTo: "200", description: "Das Hotel Stern liegt mitten in der Altstadt von Chur und verbindet historischen Charme mit modernem Komfort.", shortDescription: "Historisches Hotel in der Churer Altstadt.", petsAllowed: true, familyFriendly: true, parking: false, wifi: true, breakfast: true, spa: false, pool: false },
  { slug: "romantik-hotel-stern", name: "Romantik Hotel Stern", type: "hotel", stars: 4, address: "Reichsgasse 11", postalCode: "7000", city: "Chur", phone: "+41 81 258 57 57", email: "info@stern-chur.ch", website: "https://www.stern-chur.ch/", bookingUrl: "https://www.stern-chur.ch/", priceFrom: "180", priceTo: "320", description: "Das Romantik Hotel Stern ist ein historisches Juwel in der Altstadt von Chur.", shortDescription: "Romantisches 4-Stern-Hotel in der Altstadt.", petsAllowed: false, familyFriendly: true, parking: false, wifi: true, breakfast: true, spa: false, pool: false },
  { slug: "hotel-drei-koenige", name: "Hotel Drei Könige", type: "hotel", stars: 3, address: "Reichsgasse 18", postalCode: "7000", city: "Chur", phone: "+41 81 252 17 25", email: "info@dreikoenige-chur.ch", website: "https://www.dreikoenige-chur.ch/", bookingUrl: "https://www.dreikoenige-chur.ch/", priceFrom: "110", priceTo: "180", description: "Traditionelles Hotel im Herzen der Churer Altstadt.", shortDescription: "Traditionelles Hotel in der Altstadt.", petsAllowed: false, familyFriendly: true, parking: false, wifi: true, breakfast: true, spa: false, pool: false },
  { slug: "hotel-chur", name: "Hotel Chur", type: "hotel", stars: 3, address: "Welschdörfli 2", postalCode: "7000", city: "Chur", phone: "+41 81 255 55 55", website: "https://www.hotelchur.ch/", bookingUrl: "https://www.hotelchur.ch/", priceFrom: "100", priceTo: "160", description: "Modernes Stadthotel in Chur.", shortDescription: "Modernes Stadthotel nahe dem Bahnhof.", petsAllowed: false, familyFriendly: true, parking: true, wifi: true, breakfast: true, spa: false, pool: false },
  { slug: "hotel-post", name: "Hotel & Restaurant Post Chur", type: "hotel", stars: 3, address: "Poststrasse 27", postalCode: "7000", city: "Chur", phone: "+41 81 252 14 44", website: "https://www.hotel-post-chur.ch/", priceFrom: "95", priceTo: "170", description: "Traditionsreiches Hotel mit Restaurant.", shortDescription: "Traditionsreiches Hotel mit eigenem Restaurant.", petsAllowed: false, familyFriendly: true, parking: false, wifi: true, breakfast: true, spa: false, pool: false },
  { slug: "ibis-chur", name: "ibis Chur", type: "hotel", stars: 2, address: "Comercialstrasse 32", postalCode: "7000", city: "Chur", phone: "+41 81 354 80 00", website: "https://all.accor.com/hotel/9070/index.de.shtml", bookingUrl: "https://all.accor.com/hotel/9070/index.de.shtml", priceFrom: "89", priceTo: "140", description: "Das Hotel Ibis Chur bietet funktionale Zimmer zu günstigen Preisen.", shortDescription: "Budget-Hotel beim Bahnhof Chur.", petsAllowed: false, familyFriendly: false, parking: true, wifi: true, breakfast: true, spa: false, pool: false },
  { slug: "hotel-sommerau", name: "Sommerau Ticino", type: "hotel", stars: 4, address: "Comercialstrasse 36", postalCode: "7000", city: "Chur", phone: "+41 81 252 12 44", website: "https://www.sommerau.ch/", bookingUrl: "https://www.sommerau.ch/", priceFrom: "160", priceTo: "280", description: "Elegantes 4-Stern-Hotel mit mediterranem Flair.", shortDescription: "Elegantes Hotel mit mediterranem Restaurant.", petsAllowed: true, familyFriendly: true, parking: true, wifi: true, breakfast: true, spa: true, pool: false },
  { slug: "hotel-marsoel", name: "Hotel & Restaurant Marsöl", type: "hotel", stars: 3, address: "Süsswinkelgasse 25", postalCode: "7000", city: "Chur", phone: "+41 81 252 97 37", website: "https://restaurant-marsoel.ch/", priceFrom: "100", priceTo: "170", description: "Gemütliches Hotel mit traditionellem Restaurant.", shortDescription: "Gemütliches Hotel mit Bündner Küche.", petsAllowed: false, familyFriendly: true, parking: false, wifi: true, breakfast: true, spa: false, pool: false },
  { slug: "zunfthaus-rebleuten", name: "Zunfthaus zur Rebleuten", type: "hotel", stars: 3, address: "Pfisterplatz 1", postalCode: "7000", city: "Chur", phone: "+41 81 255 11 44", website: "https://www.rebleutenchur.ch/", bookingUrl: "https://www.rebleutenchur.ch/", priceFrom: "120", priceTo: "190", description: "Historisches Zunfthaus mit modernen Zimmern.", shortDescription: "Historisches Zunfthaus in der Altstadt.", petsAllowed: false, familyFriendly: true, parking: false, wifi: true, breakfast: true, spa: false, pool: false },
  { slug: "hotel-frueewald", name: "Hotel Freieck", type: "hotel", stars: 3, address: "Reichsgasse 44", postalCode: "7000", city: "Chur", phone: "+41 81 252 17 92", website: "https://www.freieck.ch/", priceFrom: "100", priceTo: "160", description: "Traditionelles Hotel in der Altstadt.", shortDescription: "Gemütliches Hotel in der Churer Altstadt.", petsAllowed: false, familyFriendly: true, parking: false, wifi: true, breakfast: true, spa: false, pool: false },
  { slug: "hotel-ambiente", name: "Hotel Ambiente", type: "hotel", stars: 3, address: "Malixerstrasse 1", postalCode: "7000", city: "Chur", phone: "+41 81 252 10 25", website: "https://www.hotel-ambiente.ch/", priceFrom: "110", priceTo: "175", description: "Ruhiges Hotel am Stadtrand von Chur.", shortDescription: "Ruhiges Hotel am Stadtrand.", petsAllowed: false, familyFriendly: true, parking: true, wifi: true, breakfast: true, spa: false, pool: false },
  { slug: "hotel-ruetli", name: "Haus zum Rütli", type: "pension", stars: 3, address: "Welschdörfli 18", postalCode: "7000", city: "Chur", phone: "+41 77 425 69 69", website: "https://api.whatsapp.com/send/?phone=41774256969", priceFrom: "90", priceTo: "140", description: "Gemütliche Pension im Welschdörfli.", shortDescription: "Günstige Pension in Chur.", petsAllowed: false, familyFriendly: false, parking: false, wifi: true, breakfast: false, spa: false, pool: false },
  { slug: "chur-youth-hostel", name: "Jugendherberge Chur", type: "hostel", stars: null, address: "Brandisstrasse 12", postalCode: "7000", city: "Chur", phone: "+41 81 252 99 44", website: "https://www.youthhostel.ch/chur/", bookingUrl: "https://www.youthhostel.ch/chur/", priceFrom: "35", priceTo: "80", description: "Moderne Jugendherberge mit Mehrbettzimmern und Privatzimmern.", shortDescription: "Moderne Jugendherberge für Budget-Reisende.", petsAllowed: false, familyFriendly: true, parking: false, wifi: true, breakfast: true, spa: false, pool: false },
  { slug: "hotel-alpina", name: "The Alpina Mountain Resort & Spa", type: "hotel", stars: 5, address: "Arosastrasse", postalCode: "7064", city: "Tschiertschen", phone: "+41 81 330 00 00", website: "https://www.the-alpina.com/", bookingUrl: "https://www.the-alpina.com/", priceFrom: "200", priceTo: "380", description: "Luxuriöses 5-Stern-Resort mit Spa und Bergpanorama.", shortDescription: "Luxus-Resort mit Spa in den Bergen.", petsAllowed: false, familyFriendly: true, parking: true, wifi: true, breakfast: true, spa: true, pool: true },
];

// ============================================
// RESTAURANT-DATEN MIT ÖFFNUNGSZEITEN UND MENÜ-URLS
// ============================================
const restaurantUpdates = [
  { slug: "restaurant-calanda", openingHours: { monday: "11:00-14:00, 17:00-23:00", tuesday: "11:00-14:00, 17:00-23:00", wednesday: "11:00-14:00, 17:00-23:00", thursday: "11:00-14:00, 17:00-23:00", friday: "11:00-14:00, 17:00-23:00", saturday: "11:00-23:00", sunday: "Geschlossen" }, menuUrl: "https://cdn.prod.website-files.com/64638135cb0abe58f760d7a5/696517044c244b9d88024ada_Winterkarte25_26_neueVersion.pdf" },
  { slug: "ristorante-tre-fratelli", openingHours: { monday: "11:00-14:00, 17:30-22:00", tuesday: "11:00-14:00, 17:30-22:00", wednesday: "11:00-14:00, 17:30-22:00", thursday: "11:00-14:00, 17:30-22:00", friday: "11:00-14:00, 17:30-22:30", saturday: "11:00-22:30", sunday: "Geschlossen" } },
  { slug: "restaurant-stern", openingHours: { monday: "11:30-14:00, 18:00-21:30", tuesday: "11:30-14:00, 18:00-21:30", wednesday: "11:30-14:00, 18:00-21:30", thursday: "11:30-14:00, 18:00-21:30", friday: "11:30-14:00, 18:00-21:30", saturday: "18:00-21:30", sunday: "Geschlossen" }, menuUrl: "https://www.stern-chur.ch/files/inhalte/pdf/a-la-carte-karte/2025-11_Winter%20Deutsch.pdf" },
  { slug: "brasserie", openingHours: { monday: "07:00-23:30", tuesday: "07:00-23:30", wednesday: "07:00-23:30", thursday: "07:00-23:30", friday: "07:00-23:30", saturday: "07:00-23:30", sunday: "07:00-23:30" }, menuUrl: "https://cdn.prod.website-files.com/64638135cb0abe58f760d7a5/696517044c244b9d88024ada_Winterkarte25_26_neueVersion.pdf" },
  { slug: "thai-restaurant-orchidee", openingHours: { monday: "Geschlossen", tuesday: "11:30-14:00, 17:30-22:00", wednesday: "11:30-14:00, 17:30-22:00", thursday: "11:30-14:00, 17:30-22:00", friday: "11:30-14:00, 17:30-22:00", saturday: "17:30-22:00", sunday: "Geschlossen" } },
  { slug: "restaurant-rosengarten", openingHours: { monday: "Geschlossen", tuesday: "11:30-14:00, 17:30-22:00", wednesday: "11:30-14:00, 17:30-22:00", thursday: "11:30-14:00, 17:30-22:00", friday: "11:30-14:00, 17:30-22:30", saturday: "17:30-22:30", sunday: "Geschlossen" }, menuUrl: "http://www.hotel-rosenhuegel.ch/Speisekarte.95.0.html" },
  { slug: "gasthaus-zum-ochsen", openingHours: { monday: "Geschlossen", tuesday: "11:30-14:00, 17:30-22:00", wednesday: "11:30-14:00, 17:30-22:00", thursday: "11:30-14:00, 17:30-22:00", friday: "11:30-14:00, 17:30-22:00", saturday: "11:30-22:00", sunday: "11:30-14:00" }, menuUrl: "https://www.zum-ochsen.ch/speisekarte" },
  { slug: "veltlinerkeller", openingHours: { monday: "Geschlossen", tuesday: "11:30-14:00, 18:00-22:00", wednesday: "11:30-14:00, 18:00-22:00", thursday: "11:30-14:00, 18:00-22:00", friday: "11:30-14:00, 18:00-22:00", saturday: "18:00-22:00", sunday: "Geschlossen" }, menuUrl: "https://www.stern-chur.ch/files/inhalte/pdf/a-la-carte-karte/2025-11_Winter%20Deutsch.pdf" },
  { slug: "restaurant-marsoel", openingHours: { monday: "Geschlossen", tuesday: "11:30-14:00, 17:30-22:00", wednesday: "11:30-14:00, 17:30-22:00", thursday: "11:30-14:00, 17:30-22:00", friday: "11:30-14:00, 17:30-22:00", saturday: "17:30-22:00", sunday: "Geschlossen" }, menuUrl: "https://restaurant-marsoel.ch/wp-content/uploads/2025/08/Marsoel_Aktuelle_Speisekarte_02_2025.pdf" },
  { slug: "sushi-bar-sakura", openingHours: { monday: "Geschlossen", tuesday: "11:30-14:00, 17:30-21:30", wednesday: "11:30-14:00, 17:30-21:30", thursday: "11:30-14:00, 17:30-21:30", friday: "11:30-14:00, 17:30-22:00", saturday: "17:30-22:00", sunday: "Geschlossen" } },
  { slug: "restaurant-scaletta", openingHours: { monday: "Geschlossen", tuesday: "11:30-14:00, 18:00-22:00", wednesday: "11:30-14:00, 18:00-22:00", thursday: "11:30-14:00, 18:00-22:00", friday: "11:30-14:00, 18:00-22:00", saturday: "18:00-22:00", sunday: "Geschlossen" }, menuUrl: "http://www.restaurant-scaletta.ch/menu" },
  { slug: "restaurant-duc", openingHours: { monday: "Geschlossen", tuesday: "11:00-14:00, 17:00-22:00", wednesday: "11:00-14:00, 17:00-22:00", thursday: "11:00-14:00, 17:00-22:00", friday: "11:00-14:00, 17:00-22:00", saturday: "11:00-22:00", sunday: "Geschlossen" }, menuUrl: "http://www.gasthof-duc.ch/bankette.htm" },
  { slug: "hofkellerei", openingHours: { monday: "Geschlossen", tuesday: "11:30-14:00, 18:00-22:00", wednesday: "11:30-14:00, 18:00-22:00", thursday: "11:30-14:00, 18:00-22:00", friday: "11:30-14:00, 18:00-22:00", saturday: "18:00-22:00", sunday: "Geschlossen" }, menuUrl: "https://www.hofkellerei.ch/_files/ugd/210226_71017146c503461ab9a941ff65f7cb5a.pdf" },
  { slug: "restaurant-rebstock", openingHours: { monday: "Geschlossen", tuesday: "11:30-14:00, 17:30-22:00", wednesday: "11:30-14:00, 17:30-22:00", thursday: "11:30-14:00, 17:30-22:00", friday: "11:30-14:00, 17:30-22:00", saturday: "11:30-22:00", sunday: "Geschlossen" }, menuUrl: "https://www.rebleutenchur.ch/speisekarte" },
  { slug: "cafe-arcas", openingHours: { monday: "07:30-18:00", tuesday: "07:30-18:00", wednesday: "07:30-18:00", thursday: "07:30-18:00", friday: "07:30-18:00", saturday: "08:00-17:00", sunday: "Geschlossen" }, menuUrl: "https://weur-cdn.menuweb.menu/storage/media/companies_menu_pdf/77153330/arcas-cafe-chur-speisekarte.pdf" },
  { slug: "restaurant-sommerau", openingHours: { monday: "Geschlossen", tuesday: "11:30-14:00, 18:00-22:00", wednesday: "11:30-14:00, 18:00-22:00", thursday: "11:30-14:00, 18:00-22:00", friday: "11:30-14:00, 18:00-22:00", saturday: "18:00-22:00", sunday: "Geschlossen" }, menuUrl: "https://m.sommerau.ch/fileadmin/user_upload/customers/sommerau/Dokumente/Karten/Sommerau_Karte_Winter_2025-2026.pdf" },
  { slug: "restaurant-freieck", openingHours: { monday: "Geschlossen", tuesday: "11:30-14:00, 17:30-22:00", wednesday: "11:30-14:00, 17:30-22:00", thursday: "11:30-14:00, 17:30-22:00", friday: "11:30-14:00, 17:30-22:30", saturday: "11:30-22:30", sunday: "Geschlossen" }, menuUrl: "https://speisekarte.menu/restaurants/chur/freieck-hotel-restaurant" },
  { slug: "restaurant-post", openingHours: { monday: "Geschlossen", tuesday: "11:30-14:00, 17:30-22:00", wednesday: "11:30-14:00, 17:30-22:00", thursday: "11:30-14:00, 17:30-22:00", friday: "11:30-14:00, 17:30-22:00", saturday: "17:30-22:00", sunday: "Geschlossen" }, menuUrl: "https://flavoursrestaurant.ch/speisekarte/" },
  { slug: "restaurant-drei-koenige", openingHours: { monday: "Geschlossen", tuesday: "11:30-14:00, 17:30-22:00", wednesday: "11:30-14:00, 17:30-22:00", thursday: "11:30-14:00, 17:30-22:00", friday: "11:30-14:00, 17:30-22:00", saturday: "11:30-22:00", sunday: "Geschlossen" }, menuUrl: "https://www.restaurant3koenige.ch/menue.html" },
  { slug: "restaurant-alpenrose", openingHours: { monday: "Geschlossen", tuesday: "11:30-14:00, 17:30-22:00", wednesday: "11:30-14:00, 17:30-22:00", thursday: "11:30-14:00, 17:30-22:00", friday: "11:30-14:00, 17:30-22:00", saturday: "17:30-22:00", sunday: "Geschlossen" }, menuUrl: "https://www.restaurantalpenrose.ch/fileadmin/user_upload/pdf/alpenrose/Angebote/2512_Abendkarte_01.pdf" },
  { slug: "restaurant-falken", openingHours: { monday: "Geschlossen", tuesday: "11:30-14:00, 17:30-22:00", wednesday: "11:30-14:00, 17:30-22:00", thursday: "11:30-14:00, 17:30-22:00", friday: "11:30-14:00, 17:30-22:00", saturday: "17:30-22:00", sunday: "Geschlossen" }, menuUrl: "https://restaurant-falken.ch/speisekarten/" },
  { slug: "restaurant-kreuz", openingHours: { monday: "11:00-14:00", tuesday: "11:00-14:00", wednesday: "11:00-14:00", thursday: "11:00-14:00", friday: "11:00-14:00", saturday: "Geschlossen", sunday: "Geschlossen" }, menuUrl: "https://www.ksgr.ch/sites/default/files/2026-01/Tavulin-Mittag-KW-6_0.pdf" },
  { slug: "restaurant-raben", openingHours: { monday: "Geschlossen", tuesday: "11:30-14:00, 17:30-22:00", wednesday: "11:30-14:00, 17:30-22:00", thursday: "11:30-14:00, 17:30-22:00", friday: "11:30-14:00, 17:30-22:00", saturday: "17:30-22:00", sunday: "Geschlossen" }, menuUrl: "https://dreibuende.ch/wp-content/uploads/2025/03/essen.pdf" },
  { slug: "restaurant-rheinblick", openingHours: { monday: "Geschlossen", tuesday: "11:30-14:00, 17:30-22:00", wednesday: "11:30-14:00, 17:30-22:00", thursday: "11:30-14:00, 17:30-22:00", friday: "11:30-14:00, 17:30-22:00", saturday: "11:30-22:00", sunday: "Geschlossen" }, menuUrl: "https://restaurant-rheinfels.ch/wp-content/uploads/2024/03/Speisekarte.pdf" },
  { slug: "restaurant-mercato", openingHours: { monday: "11:00-14:00, 17:00-22:00", tuesday: "11:00-14:00, 17:00-22:00", wednesday: "11:00-14:00, 17:00-22:00", thursday: "11:00-14:00, 17:00-22:00", friday: "11:00-14:00, 17:00-22:30", saturday: "11:00-22:30", sunday: "Geschlossen" }, menuUrl: "https://www.tresamigos.ch/pdf/default/pdf?pdfLayout=tresamigos-chur" },
  { slug: "pizzeria-da-enzo", openingHours: { monday: "Geschlossen", tuesday: "11:00-14:00, 17:00-22:00", wednesday: "11:00-14:00, 17:00-22:00", thursday: "11:00-14:00, 17:00-22:00", friday: "11:00-14:00, 17:00-22:30", saturday: "11:00-22:30", sunday: "Geschlossen" }, menuUrl: "https://www.restaurant-da-enzo.com/speisekarte/" },
  { slug: "restaurant-garten", openingHours: { monday: "11:00-14:00", tuesday: "11:00-14:00", wednesday: "11:00-14:00", thursday: "11:00-14:00", friday: "11:00-14:00", saturday: "Geschlossen", sunday: "Geschlossen" }, menuUrl: "https://www.argo-gr.ch/men%C3%BCplan-chur.html" },
  { slug: "restaurant-panorama", openingHours: { monday: "Geschlossen", tuesday: "11:30-14:00, 18:00-22:00", wednesday: "11:30-14:00, 18:00-22:00", thursday: "11:30-14:00, 18:00-22:00", friday: "11:30-14:00, 18:00-22:00", saturday: "18:00-22:00", sunday: "Geschlossen" }, menuUrl: "https://www.the-alpina.com/en/_files/ugd/27cc25_a46bfb0bc74a48fb87b4c488a8b8b06e.pdf" },
  { slug: "restaurant-bahnhof", openingHours: { monday: "06:30-22:00", tuesday: "06:30-22:00", wednesday: "06:30-22:00", thursday: "06:30-22:00", friday: "06:30-22:00", saturday: "07:00-22:00", sunday: "07:00-22:00" }, menuUrl: "https://www.maron-chur.ch/wp-content/uploads/2025/06/Menue-fuer-Homepage.pdf" },
  { slug: "restaurant-berg", openingHours: { monday: "Geschlossen", tuesday: "11:30-14:00, 17:30-22:00", wednesday: "11:30-14:00, 17:30-22:00", thursday: "11:30-14:00, 17:30-22:00", friday: "11:30-14:00, 17:30-22:00", saturday: "11:30-22:00", sunday: "Geschlossen" }, menuUrl: "https://bergbaiz.ch/speisekarte/" },
  { slug: "restaurant-brunnen", openingHours: { monday: "Geschlossen", tuesday: "11:30-14:00, 17:30-22:00", wednesday: "11:30-14:00, 17:30-22:00", thursday: "11:30-14:00, 17:30-22:00", friday: "11:30-14:00, 17:30-22:00", saturday: "11:30-22:00", sunday: "Geschlossen" }, menuUrl: "https://www.restaurantzumkornplatz.ch/speisekarte" },
  { slug: "restaurant-kloster", openingHours: { monday: "Geschlossen", tuesday: "11:30-14:00, 18:00-22:00", wednesday: "11:30-14:00, 18:00-22:00", thursday: "11:30-14:00, 18:00-22:00", friday: "11:30-14:00, 18:00-22:00", saturday: "18:00-22:00", sunday: "Geschlossen" }, menuUrl: "https://www.hofkellerei.ch/_files/ugd/210226_71017146c503461ab9a941ff65f7cb5a.pdf" },
  { slug: "restaurant-turm", openingHours: { monday: "Geschlossen", tuesday: "11:30-14:00, 18:00-22:00", wednesday: "11:30-14:00, 18:00-22:00", thursday: "11:30-14:00, 18:00-22:00", friday: "11:30-14:00, 18:00-22:00", saturday: "18:00-22:00", sunday: "Geschlossen" }, menuUrl: "https://www.hofkellerei.ch/_files/ugd/210226_71017146c503461ab9a941ff65f7cb5a.pdf" },
  { slug: "restaurant-neustadt", openingHours: { monday: "11:00-14:00, 17:00-22:00", tuesday: "11:00-14:00, 17:00-22:00", wednesday: "11:00-14:00, 17:00-22:00", thursday: "11:00-14:00, 17:00-22:00", friday: "11:00-14:00, 17:00-22:30", saturday: "11:00-22:30", sunday: "Geschlossen" }, menuUrl: "https://speisekarte.menu/restaurants/chur/restaurant-neustadt/menu" },
];

async function seedAllData() {
  const connection = await mysql.createConnection(process.env.DATABASE_URL);
  
  console.log("=== SmartStayChur: Komplettes Daten-Seeding ===\n");
  
  // 1. Hotels einspielen
  console.log("--- Hotels ---");
  let hotelCount = 0;
  for (const hotel of hotels) {
    try {
      const { slug, ...data } = hotel;
      const fields = Object.keys(data);
      const placeholders = fields.map(() => "?").join(", ");
      const updateClauses = fields.map(f => `${f}=VALUES(${f})`).join(", ");
      
      await connection.execute(
        `INSERT INTO hotels (slug, ${fields.join(", ")}, isActive) 
         VALUES (?, ${placeholders}, true)
         ON DUPLICATE KEY UPDATE ${updateClauses}`,
        [slug, ...Object.values(data)]
      );
      console.log(`  ✓ ${hotel.name}`);
      hotelCount++;
    } catch (error) {
      console.log(`  ✗ ${hotel.name}: ${error.message}`);
    }
  }
  
  // 2. Restaurant-Updates (Öffnungszeiten, Menü-URLs)
  console.log("\n--- Restaurant-Updates ---");
  let restaurantCount = 0;
  for (const update of restaurantUpdates) {
    try {
      const updates = [];
      const values = [];
      
      if (update.openingHours) {
        updates.push("openingHours = ?");
        values.push(JSON.stringify(update.openingHours));
      }
      if (update.menuUrl) {
        updates.push("menuUrl = ?");
        values.push(update.menuUrl);
      }
      
      if (updates.length > 0) {
        values.push(update.slug);
        await connection.execute(
          `UPDATE restaurants SET ${updates.join(", ")} WHERE slug = ?`,
          values
        );
        console.log(`  ✓ ${update.slug}`);
        restaurantCount++;
      }
    } catch (error) {
      console.log(`  ✗ ${update.slug}: ${error.message}`);
    }
  }
  
  console.log(`\n=== Fertig! ${hotelCount} Hotels, ${restaurantCount} Restaurant-Updates ===`);
  
  await connection.end();
}

seedAllData().catch(console.error);
