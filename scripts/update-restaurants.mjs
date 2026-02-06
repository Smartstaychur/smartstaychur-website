import "dotenv/config";
import mysql from "mysql2/promise";
import fs from "fs";

const pool = mysql.createPool(process.env.DATABASE_URL);

// Mapping von Restaurant-Namen zu IDs
const restaurantMapping = {
  "Brasserie": 6,
  "Burger House Chur": 15,
  "Café Arcas": 19,
  "Café Bar Merz": 10,
  "Café Hanselmann": 30,
  "China Restaurant Lotus": 3,
  "Gasthaus zum Ochsen": 9,
  "Hofkellerei": 17,
  "HR Giger Bar": 20,
  "Pizzeria da Enzo": 27,
  "Pizzeria Molino": 5,
  "Restaurant Adler": 38,
  "Restaurant Alpenrose": 34,
  "Restaurant Altstadt": 63,
  "Restaurant Ambiente": 29,
  "Restaurant Aussicht": 61,
  "Restaurant Bahnhof": 65,
  "Restaurant Bären": 37,
  "Restaurant Bellavista": 35,
  "Restaurant Berg": 53,
  "Restaurant Brandis": 21,
  "Restaurant Brücke": 72,
  "Restaurant Brunnen": 67,
  "Restaurant Calanda": 1,
  "Restaurant Chesa": 31,
  "Restaurant Drei Könige": 26,
  "Restaurant Duc": 16,
  "Restaurant Engel": 42,
  "Restaurant Falken": 44,
  "Restaurant Fauna": 52,
  "Restaurant Flora": 51,
  "Restaurant Freieck": 23,
  "Restaurant Garten": 58,
  "Restaurant Hirschen": 40,
  "Restaurant Ibis": 25,
  "Restaurant Insel": 73,
  "Restaurant Kloster": 70,
  "Restaurant Kreuz": 41,
  "Restaurant Kronenhof": 36,
  "Restaurant Lamm": 46,
  "Restaurant Löwen": 39,
  "Restaurant Markt": 66,
  "Restaurant Marsöl": 12,
  "Restaurant Mercato": 32,
  "Restaurant Mond": 50,
  "Restaurant Mühle": 71,
  "Restaurant Neustadt": 64,
  "Restaurant Panorama": 60,
  "Restaurant Post": 24,
  "Restaurant Raben": 43,
  "Restaurant Rebstock": 18,
  "Restaurant Rheinblick": 33,
  "Restaurant Rosengarten": 8,
  "Restaurant Ross": 47,
  "Restaurant Scaletta": 14,
  "Restaurant Schloss": 69,
  "Restaurant Schwan": 45,
  "Restaurant See": 55,
  "Restaurant Sommerau": 22,
  "Restaurant Sonne": 49,
  "Restaurant Stern": 4,
  "Restaurant Tal": 54,
  "Restaurant Taube": 48,
  "Restaurant Terrasse": 59,
  "Restaurant Turm": 68,
  "Restaurant Wald": 56,
  "Restaurant Werkstatt": 28,
  "Restaurant Wiese": 57,
  "Restaurant Zentrum": 62,
  "Ristorante Tre Fratelli": 2,
  "Sushi Bar Sakura": 13,
  "Thai Restaurant Orchidee": 7,
  "Veltlinerkeller": 11
};

// Extrahiere Restaurant-Name aus Input
function extractRestaurantName(input) {
  const parts = input.split(",");
  return parts[0].trim();
}

// Finde Restaurant-ID basierend auf Input
function findRestaurantId(input, outputName) {
  const inputName = extractRestaurantName(input);
  
  // Direkte Übereinstimmung
  if (restaurantMapping[inputName]) {
    return restaurantMapping[inputName];
  }
  
  // Suche nach ähnlichem Namen
  for (const [name, id] of Object.entries(restaurantMapping)) {
    if (inputName.toLowerCase().includes(name.toLowerCase()) || 
        name.toLowerCase().includes(inputName.toLowerCase())) {
      return id;
    }
  }
  
  return null;
}

async function main() {
  const data = JSON.parse(fs.readFileSync("/home/ubuntu/research_restaurant_info.json", "utf8"));
  
  let updated = 0;
  let skipped = 0;
  
  for (const result of data.results) {
    const output = result.output;
    const restaurantId = findRestaurantId(result.input, output.restaurant_name);
    
    if (!restaurantId) {
      console.log(`⚠ Keine ID gefunden für: ${result.input}`);
      skipped++;
      continue;
    }
    
    // Erstelle openingHours JSON
    const openingHours = {
      monday: output.opening_hours_mon !== "nicht gefunden" ? output.opening_hours_mon : null,
      tuesday: output.opening_hours_tue !== "nicht gefunden" ? output.opening_hours_tue : null,
      wednesday: output.opening_hours_wed !== "nicht gefunden" ? output.opening_hours_wed : null,
      thursday: output.opening_hours_thu !== "nicht gefunden" ? output.opening_hours_thu : null,
      friday: output.opening_hours_fri !== "nicht gefunden" ? output.opening_hours_fri : null,
      saturday: output.opening_hours_sat !== "nicht gefunden" ? output.opening_hours_sat : null,
      sunday: output.opening_hours_sun !== "nicht gefunden" ? output.opening_hours_sun : null
    };
    
    // Prüfe ob mindestens ein Wert vorhanden ist
    const hasOpeningHours = Object.values(openingHours).some(v => v !== null);
    
    const updates = [];
    const values = [];
    
    if (hasOpeningHours) {
      updates.push("openingHours = ?");
      values.push(JSON.stringify(openingHours));
    }
    
    if (output.website && output.website !== "nicht gefunden") {
      updates.push("website = ?");
      values.push(output.website);
    }
    
    if (output.phone && output.phone !== "nicht gefunden") {
      updates.push("phone = ?");
      values.push(output.phone);
    }
    
    if (output.cuisine_type && output.cuisine_type !== "nicht gefunden") {
      updates.push("cuisineType = ?");
      values.push(output.cuisine_type);
    }
    
    if (updates.length > 0) {
      values.push(restaurantId);
      const query = `UPDATE restaurants SET ${updates.join(", ")} WHERE id = ?`;
      
      try {
        await pool.query(query, values);
        console.log(`✓ ${extractRestaurantName(result.input)} (ID: ${restaurantId})`);
        updated++;
      } catch (err) {
        console.log(`✗ ${extractRestaurantName(result.input)}: ${err.message}`);
      }
    } else {
      console.log(`- ${extractRestaurantName(result.input)}: Keine neuen Daten`);
      skipped++;
    }
  }
  
  console.log(`\nFertig! ${updated} aktualisiert, ${skipped} übersprungen.`);
  await pool.end();
}

main().catch(console.error);
