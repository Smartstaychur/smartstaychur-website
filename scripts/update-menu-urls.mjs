import "dotenv/config";
import mysql from "mysql2/promise";
import fs from "fs";

const pool = mysql.createPool(process.env.DATABASE_URL);

// Mapping von Restaurant-Namen zu IDs
const restaurantMapping = {
  "Brasserie": 6,
  "Café Arcas": 19,
  "Gasthaus zum Ochsen": 9,
  "Hofkellerei": 17,
  "Pizzeria da Enzo": 27,
  "Restaurant Alpenrose": 34,
  "Restaurant Bahnhof": 65,
  "Restaurant Berg": 53,
  "Restaurant Brunnen": 67,
  "Restaurant Calanda": 1,
  "Restaurant Drei Könige": 26,
  "Restaurant Duc": 16,
  "Restaurant Falken": 44,
  "Restaurant Freieck": 23,
  "Restaurant Garten": 58,
  "Restaurant Kloster": 70,
  "Restaurant Kreuz": 41,
  "Restaurant Marsöl": 12,
  "Restaurant Mercato": 32,
  "Restaurant Neustadt": 64,
  "Restaurant Panorama": 60,
  "Restaurant Post": 24,
  "Restaurant Raben": 43,
  "Restaurant Rebstock": 18,
  "Restaurant Rheinblick": 33,
  "Restaurant Rosengarten": 8,
  "Restaurant Scaletta": 14,
  "Restaurant Sommerau": 22,
  "Restaurant Stern": 4,
  "Restaurant Turm": 68,
  "Veltlinerkeller": 11
};

// Menükarten-URLs
const menuUrls = {
  6: "https://cdn.prod.website-files.com/64638135cb0abe58f760d7a5/696517044c244b9d88024ada_Winterkarte25_26_neueVersion.pdf",
  19: "https://weur-cdn.menuweb.menu/storage/media/companies_menu_pdf/77153330/arcas-cafe-chur-speisekarte.pdf",
  9: "https://www.zum-ochsen.ch/speisekarte",
  17: "https://www.hofkellerei.ch/_files/ugd/210226_71017146c503461ab9a941ff65f7cb5a.pdf",
  27: "https://www.restaurant-da-enzo.com/speisekarte/",
  34: "https://www.restaurantalpenrose.ch/fileadmin/user_upload/pdf/alpenrose/Angebote/2512_Abendkarte_01.pdf",
  65: "https://www.maron-chur.ch/wp-content/uploads/2025/06/Menue-fuer-Homepage.pdf",
  53: "https://bergbaiz.ch/speisekarte/",
  67: "https://www.restaurantzumkornplatz.ch/speisekarte",
  1: "https://cdn.prod.website-files.com/64638135cb0abe58f760d7a5/696517044c244b9d88024ada_Winterkarte25_26_neueVersion.pdf",
  26: "https://www.restaurant3koenige.ch/menue.html",
  16: "http://www.gasthof-duc.ch/bankette.htm",
  44: "https://restaurant-falken.ch/speisekarten/",
  23: "https://speisekarte.menu/restaurants/chur/freieck-hotel-restaurant",
  58: "https://www.argo-gr.ch/men%C3%BCplan-chur.html",
  70: "https://www.hofkellerei.ch/_files/ugd/210226_71017146c503461ab9a941ff65f7cb5a.pdf",
  41: "https://www.ksgr.ch/sites/default/files/2026-01/Tavulin-Mittag-KW-6_0.pdf",
  12: "https://restaurant-marsoel.ch/wp-content/uploads/2025/08/Marsoel_Aktuelle_Speisekarte_02_2025.pdf",
  32: "https://www.tresamigos.ch/pdf/default/pdf?pdfLayout=tresamigos-chur",
  64: "https://speisekarte.menu/restaurants/chur/restaurant-neustadt/menu",
  60: "https://www.the-alpina.com/en/_files/ugd/27cc25_a46bfb0bc74a48fb87b4c488a8b8b06e.pdf",
  24: "https://flavoursrestaurant.ch/speisekarte/",
  43: "https://dreibuende.ch/wp-content/uploads/2025/03/essen.pdf",
  18: "https://www.rebleutenchur.ch/speisekarte",
  33: "https://restaurant-rheinfels.ch/wp-content/uploads/2024/03/Speisekarte.pdf",
  8: "http://www.hotel-rosenhuegel.ch/Speisekarte.95.0.html",
  14: "http://www.restaurant-scaletta.ch/menu",
  22: "https://m.sommerau.ch/fileadmin/user_upload/customers/sommerau/Dokumente/Karten/Sommerau_Karte_Winter_2025-2026.pdf",
  4: "https://www.stern-chur.ch/files/inhalte/pdf/a-la-carte-karte/2025-11_Winter%20Deutsch.pdf",
  68: "https://www.hofkellerei.ch/_files/ugd/210226_71017146c503461ab9a941ff65f7cb5a.pdf",
  11: "https://www.stern-chur.ch/files/inhalte/pdf/a-la-carte-karte/2025-11_Winter%20Deutsch.pdf"
};

async function main() {
  let updated = 0;
  
  for (const [id, menuUrl] of Object.entries(menuUrls)) {
    try {
      await pool.query("UPDATE restaurants SET menuUrl = ? WHERE id = ?", [menuUrl, parseInt(id)]);
      console.log(`✓ Restaurant ID ${id} - Menükarte hinzugefügt`);
      updated++;
    } catch (err) {
      console.log(`✗ Restaurant ID ${id}: ${err.message}`);
    }
  }
  
  console.log(`\nFertig! ${updated} Menükarten-URLs hinzugefügt.`);
  await pool.end();
}

main().catch(console.error);
