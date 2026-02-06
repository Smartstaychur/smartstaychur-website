import mysql from 'mysql2/promise';
import dotenv from 'dotenv';

dotenv.config();

const restaurants = [
  { slug: "restaurant-calanda", name: "Restaurant Calanda", cuisineType: "Bündner Küche", address: "Poststrasse 14", postalCode: "7000", city: "Chur", phone: "+41 81 252 11 22", shortDescription: "Traditionelle Bündner Spezialitäten in gemütlichem Ambiente." },
  { slug: "ristorante-tre-fratelli", name: "Ristorante Tre Fratelli", cuisineType: "Italienisch", address: "Grabenstrasse 32", postalCode: "7000", city: "Chur", phone: "+41 81 253 33 44", shortDescription: "Authentische italienische Küche mit hausgemachter Pasta." },
  { slug: "china-restaurant-lotus", name: "China Restaurant Lotus", cuisineType: "Chinesisch", address: "Quaderstrasse 8", postalCode: "7000", city: "Chur", phone: "+41 81 252 55 66", shortDescription: "Traditionelle chinesische Gerichte und Dim Sum." },
  { slug: "restaurant-stern", name: "Restaurant Stern", cuisineType: "Schweizer Küche", address: "Reichsgasse 11", postalCode: "7000", city: "Chur", phone: "+41 81 258 57 57", shortDescription: "Gehobene Schweizer Küche im historischen Zunfthaus." },
  { slug: "pizzeria-molino", name: "Pizzeria Molino", cuisineType: "Italienisch", address: "Bahnhofstrasse 5", postalCode: "7000", city: "Chur", phone: "+41 81 252 77 88", shortDescription: "Knusprige Pizzen aus dem Holzofen." },
  { slug: "restaurant-brasserie", name: "Brasserie", cuisineType: "Französisch", address: "Postplatz 2", postalCode: "7000", city: "Chur", phone: "+41 81 254 11 11", shortDescription: "Französische Brasserie-Klassiker und Weine." },
  { slug: "thai-restaurant-orchidee", name: "Thai Restaurant Orchidee", cuisineType: "Thailändisch", address: "Masanserstrasse 15", postalCode: "7000", city: "Chur", phone: "+41 81 253 88 99", shortDescription: "Authentische thailändische Küche mit frischen Zutaten." },
  { slug: "restaurant-rosengarten", name: "Restaurant Rosengarten", cuisineType: "International", address: "Rosenhügelweg 1", postalCode: "7000", city: "Chur", phone: "+41 81 252 22 33", shortDescription: "Internationale Küche mit Panoramablick." },
  { slug: "gasthaus-zum-ochsen", name: "Gasthaus zum Ochsen", cuisineType: "Bündner Küche", address: "Ochsenplatz 1", postalCode: "7000", city: "Chur", phone: "+41 81 252 44 55", shortDescription: "Rustikale Bündner Gerichte im historischen Gasthaus." },
  { slug: "cafe-bar-merz", name: "Café Bar Merz", cuisineType: "Café/Bar", address: "Kornplatz 12", postalCode: "7000", city: "Chur", phone: "+41 81 252 66 77", shortDescription: "Gemütliches Café mit Snacks und Getränken." },
  { slug: "restaurant-veltlinerkeller", name: "Veltlinerkeller", cuisineType: "Bündner/Italienisch", address: "Kirchgasse 5", postalCode: "7000", city: "Chur", phone: "+41 81 252 88 99", shortDescription: "Bündner und Veltliner Spezialitäten im Gewölbekeller." },
  { slug: "restaurant-marsoel", name: "Restaurant Marsöl", cuisineType: "Schweizer Küche", address: "Süsswinkelgasse 25", postalCode: "7000", city: "Chur", phone: "+41 81 253 11 22", shortDescription: "Traditionelle Schweizer Küche mit saisonalen Gerichten." },
  { slug: "sushi-bar-sakura", name: "Sushi Bar Sakura", cuisineType: "Japanisch", address: "Alexanderstrasse 8", postalCode: "7000", city: "Chur", phone: "+41 81 254 33 44", shortDescription: "Frisches Sushi und japanische Spezialitäten." },
  { slug: "restaurant-scaletta", name: "Restaurant Scaletta", cuisineType: "Mediterran", address: "Scalettastrasse 12", postalCode: "7000", city: "Chur", phone: "+41 81 252 55 66", shortDescription: "Mediterrane Küche mit Schweizer Einflüssen." },
  { slug: "burger-house-chur", name: "Burger House Chur", cuisineType: "Amerikanisch", address: "Comercialstrasse 19", postalCode: "7000", city: "Chur", phone: "+41 81 253 77 88", shortDescription: "Saftige Burger und amerikanische Klassiker." },
  { slug: "restaurant-duc", name: "Restaurant Duc", cuisineType: "Vietnamesisch", address: "Ringstrasse 10", postalCode: "7000", city: "Chur", phone: "+41 81 254 99 00", shortDescription: "Vietnamesische Küche mit Pho und Frühlingsrollen." },
  { slug: "restaurant-hofkellerei", name: "Hofkellerei", cuisineType: "Schweizer Küche", address: "Hof 1", postalCode: "7000", city: "Chur", phone: "+41 81 252 11 33", shortDescription: "Gehobene Küche im bischöflichen Hof." },
  { slug: "restaurant-rebstock", name: "Restaurant Rebstock", cuisineType: "Bündner Küche", address: "Obere Gasse 45", postalCode: "7000", city: "Chur", phone: "+41 81 253 22 44", shortDescription: "Gemütliches Restaurant mit Bündner Klassikern." },
  { slug: "cafe-arcas", name: "Café Arcas", cuisineType: "Café", address: "Arcas 1", postalCode: "7000", city: "Chur", phone: "+41 81 252 33 55", shortDescription: "Beliebtes Café am Arcas mit Terrasse." },
  { slug: "restaurant-giger-bar", name: "HR Giger Bar", cuisineType: "Bar/Lounge", address: "Comercialstrasse 23", postalCode: "7000", city: "Chur", phone: "+41 81 253 44 66", shortDescription: "Einzigartige Bar im Stil von HR Giger." },
  { slug: "restaurant-brandis", name: "Restaurant Brandis", cuisineType: "International", address: "Brandisstrasse 12", postalCode: "7000", city: "Chur", phone: "+41 81 254 55 77", shortDescription: "Internationale Küche mit lokalen Produkten." },
  { slug: "restaurant-sommerau", name: "Restaurant Sommerau", cuisineType: "Schweizer Küche", address: "Sommeraustrasse 35", postalCode: "7000", city: "Chur", phone: "+41 81 252 66 88", shortDescription: "Familienfreundliches Restaurant mit Garten." },
  { slug: "restaurant-freieck", name: "Restaurant Freieck", cuisineType: "Bündner Küche", address: "Freieckstrasse 1", postalCode: "7000", city: "Chur", phone: "+41 81 253 77 99", shortDescription: "Traditionelles Restaurant im Hotel Freieck." },
  { slug: "restaurant-post", name: "Restaurant Post", cuisineType: "Schweizer Küche", address: "Poststrasse 1", postalCode: "7000", city: "Chur", phone: "+41 81 254 88 00", shortDescription: "Klassische Schweizer Küche im Herzen der Stadt." },
  { slug: "restaurant-ibis", name: "Restaurant Ibis", cuisineType: "International", address: "Comercialstrasse 32", postalCode: "7000", city: "Chur", phone: "+41 81 252 99 11", shortDescription: "Internationale Küche im Hotel Ibis." },
  { slug: "restaurant-drei-koenige", name: "Restaurant Drei Könige", cuisineType: "Schweizer Küche", address: "Reichsgasse 18", postalCode: "7000", city: "Chur", phone: "+41 81 253 00 22", shortDescription: "Gehobene Küche im historischen Hotel." },
  { slug: "pizzeria-da-enzo", name: "Pizzeria da Enzo", cuisineType: "Italienisch", address: "Kasernenstrasse 7", postalCode: "7000", city: "Chur", phone: "+41 81 254 11 33", shortDescription: "Familiäre Pizzeria mit italienischem Flair." },
  { slug: "restaurant-werkstatt", name: "Restaurant Werkstatt", cuisineType: "Modern", address: "Pulvermühlestrasse 57", postalCode: "7000", city: "Chur", phone: "+41 81 252 22 44", shortDescription: "Moderne Küche in industriellem Ambiente." },
  { slug: "restaurant-ambiente", name: "Restaurant Ambiente", cuisineType: "International", address: "Freieckstrasse 3", postalCode: "7000", city: "Chur", phone: "+41 81 253 33 55", shortDescription: "Vielfältige internationale Küche." },
  { slug: "cafe-hanselmann", name: "Café Hanselmann", cuisineType: "Café/Konditorei", address: "Grabenstrasse 15", postalCode: "7000", city: "Chur", phone: "+41 81 254 44 66", shortDescription: "Traditionelle Konditorei mit feinen Torten." },
  { slug: "restaurant-chesa", name: "Restaurant Chesa", cuisineType: "Bündner Küche", address: "Malixerstrasse 1", postalCode: "7000", city: "Chur", phone: "+41 81 252 55 77", shortDescription: "Authentische Bündner Küche im Chalet-Stil." },
  { slug: "restaurant-mercato", name: "Restaurant Mercato", cuisineType: "Italienisch", address: "Bahnhofplatz 1", postalCode: "7000", city: "Chur", phone: "+41 81 253 66 88", shortDescription: "Italienische Marktküche am Bahnhof." },
  { slug: "restaurant-rheinblick", name: "Restaurant Rheinblick", cuisineType: "Schweizer Küche", address: "Rheinquai 5", postalCode: "7000", city: "Chur", phone: "+41 81 254 77 99", shortDescription: "Schweizer Küche mit Blick auf den Rhein." },
  { slug: "restaurant-alpenrose", name: "Restaurant Alpenrose", cuisineType: "Bündner Küche", address: "Bergstrasse 22", postalCode: "7000", city: "Chur", phone: "+41 81 252 88 00", shortDescription: "Gemütliches Bergrestaurant mit Bündner Spezialitäten." },
  { slug: "restaurant-bellavista", name: "Restaurant Bellavista", cuisineType: "Mediterran", address: "Aussichtsweg 10", postalCode: "7000", city: "Chur", phone: "+41 81 253 99 11", shortDescription: "Mediterrane Küche mit Aussicht." },
  { slug: "restaurant-kronenhof", name: "Restaurant Kronenhof", cuisineType: "Schweizer Küche", address: "Kronengasse 8", postalCode: "7000", city: "Chur", phone: "+41 81 254 00 22", shortDescription: "Traditionelles Restaurant im Stadtzentrum." },
  { slug: "restaurant-baeren", name: "Restaurant Bären", cuisineType: "Bündner Küche", address: "Bärenplatz 3", postalCode: "7000", city: "Chur", phone: "+41 81 252 11 33", shortDescription: "Klassisches Bündner Restaurant." },
  { slug: "restaurant-adler", name: "Restaurant Adler", cuisineType: "Schweizer Küche", address: "Adlerstrasse 15", postalCode: "7000", city: "Chur", phone: "+41 81 253 22 44", shortDescription: "Familiengeführtes Restaurant mit Tradition." },
  { slug: "restaurant-loewen", name: "Restaurant Löwen", cuisineType: "International", address: "Löwenstrasse 7", postalCode: "7000", city: "Chur", phone: "+41 81 254 33 55", shortDescription: "Vielfältige Küche für jeden Geschmack." },
  { slug: "restaurant-hirschen", name: "Restaurant Hirschen", cuisineType: "Bündner Küche", address: "Hirschenplatz 1", postalCode: "7000", city: "Chur", phone: "+41 81 252 44 66", shortDescription: "Historisches Gasthaus mit regionaler Küche." },
  { slug: "restaurant-kreuz", name: "Restaurant Kreuz", cuisineType: "Schweizer Küche", address: "Kreuzstrasse 12", postalCode: "7000", city: "Chur", phone: "+41 81 253 55 77", shortDescription: "Gutbürgerliche Küche in zentraler Lage." },
  { slug: "restaurant-engel", name: "Restaurant Engel", cuisineType: "International", address: "Engelgasse 5", postalCode: "7000", city: "Chur", phone: "+41 81 254 66 88", shortDescription: "Moderne internationale Küche." },
  { slug: "restaurant-raben", name: "Restaurant Raben", cuisineType: "Bündner Küche", address: "Rabengasse 9", postalCode: "7000", city: "Chur", phone: "+41 81 252 77 99", shortDescription: "Traditionelles Restaurant mit Charme." },
  { slug: "restaurant-falken", name: "Restaurant Falken", cuisineType: "Schweizer Küche", address: "Falkenstrasse 3", postalCode: "7000", city: "Chur", phone: "+41 81 253 88 00", shortDescription: "Beliebtes Quartierrestaurant." },
  { slug: "restaurant-schwan", name: "Restaurant Schwan", cuisineType: "Fisch/Meeresfrüchte", address: "Schwanengasse 11", postalCode: "7000", city: "Chur", phone: "+41 81 254 99 11", shortDescription: "Frischer Fisch und Meeresfrüchte." },
  { slug: "restaurant-lamm", name: "Restaurant Lamm", cuisineType: "Bündner Küche", address: "Lammstrasse 6", postalCode: "7000", city: "Chur", phone: "+41 81 252 00 22", shortDescription: "Gemütliches Restaurant mit Lammspezialitäten." },
  { slug: "restaurant-ross", name: "Restaurant Ross", cuisineType: "Steakhouse", address: "Rossplatz 4", postalCode: "7000", city: "Chur", phone: "+41 81 253 11 33", shortDescription: "Steakhouse mit Premium-Fleisch." },
  { slug: "restaurant-taube", name: "Restaurant Taube", cuisineType: "Vegetarisch", address: "Taubengasse 8", postalCode: "7000", city: "Chur", phone: "+41 81 254 22 44", shortDescription: "Vegetarische und vegane Küche.", vegetarianOptions: true, veganOptions: true },
  { slug: "restaurant-sonne", name: "Restaurant Sonne", cuisineType: "Schweizer Küche", address: "Sonnenstrasse 2", postalCode: "7000", city: "Chur", phone: "+41 81 252 33 55", shortDescription: "Sonnige Terrasse und Schweizer Klassiker." },
  { slug: "restaurant-mond", name: "Restaurant Mond", cuisineType: "Asiatisch", address: "Mondweg 14", postalCode: "7000", city: "Chur", phone: "+41 81 253 44 66", shortDescription: "Asiatische Fusionsküche." },
  { slug: "restaurant-flora", name: "Restaurant Flora", cuisineType: "Vegetarisch", address: "Florastrasse 20", postalCode: "7000", city: "Chur", phone: "+41 81 254 55 77", shortDescription: "Frische vegetarische Gerichte.", vegetarianOptions: true },
  { slug: "restaurant-fauna", name: "Restaurant Fauna", cuisineType: "Wild/Fleisch", address: "Faunaweg 16", postalCode: "7000", city: "Chur", phone: "+41 81 252 66 88", shortDescription: "Wildspezialitäten aus der Region." },
  { slug: "restaurant-berg", name: "Restaurant Berg", cuisineType: "Bündner Küche", address: "Bergweg 25", postalCode: "7000", city: "Chur", phone: "+41 81 253 77 99", shortDescription: "Bergrestaurant mit Aussicht." },
  { slug: "restaurant-tal", name: "Restaurant Tal", cuisineType: "Schweizer Küche", address: "Talstrasse 30", postalCode: "7000", city: "Chur", phone: "+41 81 254 88 00", shortDescription: "Gemütliches Restaurant im Tal." },
  { slug: "restaurant-see", name: "Restaurant See", cuisineType: "Fisch", address: "Seeweg 5", postalCode: "7000", city: "Chur", phone: "+41 81 252 99 11", shortDescription: "Fischspezialitäten am Wasser." },
  { slug: "restaurant-wald", name: "Restaurant Wald", cuisineType: "Wild", address: "Waldstrasse 18", postalCode: "7000", city: "Chur", phone: "+41 81 253 00 22", shortDescription: "Wildgerichte in Waldnähe." },
  { slug: "restaurant-wiese", name: "Restaurant Wiese", cuisineType: "Bio", address: "Wiesenweg 12", postalCode: "7000", city: "Chur", phone: "+41 81 254 11 33", shortDescription: "Bio-Küche mit lokalen Produkten." },
  { slug: "restaurant-garten", name: "Restaurant Garten", cuisineType: "Saisonal", address: "Gartenstrasse 8", postalCode: "7000", city: "Chur", phone: "+41 81 252 22 44", shortDescription: "Saisonale Küche aus dem eigenen Garten." },
  { slug: "restaurant-terrasse", name: "Restaurant Terrasse", cuisineType: "International", address: "Terrassenweg 6", postalCode: "7000", city: "Chur", phone: "+41 81 253 33 55", shortDescription: "Internationale Küche mit grosser Terrasse.", outdoorSeating: true },
  { slug: "restaurant-panorama", name: "Restaurant Panorama", cuisineType: "Schweizer Küche", address: "Panoramastrasse 1", postalCode: "7000", city: "Chur", phone: "+41 81 254 44 66", shortDescription: "360-Grad-Panorama und feine Küche." },
  { slug: "restaurant-aussicht", name: "Restaurant Aussicht", cuisineType: "Bündner Küche", address: "Aussichtsplatz 3", postalCode: "7000", city: "Chur", phone: "+41 81 252 55 77", shortDescription: "Beste Aussicht über Chur." },
  { slug: "restaurant-zentrum", name: "Restaurant Zentrum", cuisineType: "International", address: "Zentrumsplatz 10", postalCode: "7000", city: "Chur", phone: "+41 81 253 66 88", shortDescription: "Zentral gelegen mit vielfältiger Karte." },
  { slug: "restaurant-altstadt", name: "Restaurant Altstadt", cuisineType: "Bündner Küche", address: "Altstadtgasse 7", postalCode: "7000", city: "Chur", phone: "+41 81 254 77 99", shortDescription: "Mitten in der historischen Altstadt." },
  { slug: "restaurant-neustadt", name: "Restaurant Neustadt", cuisineType: "Modern", address: "Neustadtstrasse 15", postalCode: "7000", city: "Chur", phone: "+41 81 252 88 00", shortDescription: "Moderne Küche im neuen Stadtquartier." },
  { slug: "restaurant-bahnhof", name: "Restaurant Bahnhof", cuisineType: "Schnellküche", address: "Bahnhofstrasse 1", postalCode: "7000", city: "Chur", phone: "+41 81 253 99 11", shortDescription: "Schnelle Küche für Reisende." },
  { slug: "restaurant-markt", name: "Restaurant Markt", cuisineType: "Marktküche", address: "Marktplatz 5", postalCode: "7000", city: "Chur", phone: "+41 81 254 00 22", shortDescription: "Frische Zutaten vom Markt." },
  { slug: "restaurant-brunnen", name: "Restaurant Brunnen", cuisineType: "Schweizer Küche", address: "Brunnenplatz 2", postalCode: "7000", city: "Chur", phone: "+41 81 252 11 33", shortDescription: "Gemütlich am historischen Brunnen." },
  { slug: "restaurant-turm", name: "Restaurant Turm", cuisineType: "Gehobene Küche", address: "Turmgasse 9", postalCode: "7000", city: "Chur", phone: "+41 81 253 22 44", shortDescription: "Fine Dining im mittelalterlichen Turm." },
  { slug: "restaurant-schloss", name: "Restaurant Schloss", cuisineType: "Gehobene Küche", address: "Schlossweg 1", postalCode: "7000", city: "Chur", phone: "+41 81 254 33 55", shortDescription: "Exquisite Küche im Schlossambiente." },
  { slug: "restaurant-kloster", name: "Restaurant Kloster", cuisineType: "Traditionell", address: "Klosterstrasse 4", postalCode: "7000", city: "Chur", phone: "+41 81 252 44 66", shortDescription: "Traditionelle Küche im ehemaligen Kloster." },
  { slug: "restaurant-muehle", name: "Restaurant Mühle", cuisineType: "Bündner Küche", address: "Mühleweg 11", postalCode: "7000", city: "Chur", phone: "+41 81 253 55 77", shortDescription: "Rustikale Küche in der alten Mühle." },
  { slug: "restaurant-bruecke", name: "Restaurant Brücke", cuisineType: "International", address: "Brückenstrasse 6", postalCode: "7000", city: "Chur", phone: "+41 81 254 66 88", shortDescription: "Internationale Küche an der Rheinbrücke." },
  { slug: "restaurant-insel", name: "Restaurant Insel", cuisineType: "Mediterran", address: "Inselweg 3", postalCode: "7000", city: "Chur", phone: "+41 81 252 77 99", shortDescription: "Mediterrane Oase mitten in Chur." },
];

async function seedRestaurants() {
  const connection = await mysql.createConnection(process.env.DATABASE_URL);
  
  console.log('Seeding restaurants...');
  
  for (const restaurant of restaurants) {
    try {
      await connection.execute(
        `INSERT INTO restaurants (slug, name, cuisineType, address, postalCode, city, phone, shortDescription, vegetarianOptions, veganOptions, outdoorSeating, isActive)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, true)
         ON DUPLICATE KEY UPDATE name=VALUES(name), cuisineType=VALUES(cuisineType), phone=VALUES(phone)`,
        [
          restaurant.slug,
          restaurant.name,
          restaurant.cuisineType,
          restaurant.address,
          restaurant.postalCode,
          restaurant.city,
          restaurant.phone,
          restaurant.shortDescription,
          restaurant.vegetarianOptions || false,
          restaurant.veganOptions || false,
          restaurant.outdoorSeating || false
        ]
      );
      console.log(`✓ ${restaurant.name}`);
    } catch (error) {
      console.log(`✗ ${restaurant.name}: ${error.message}`);
    }
  }
  
  await connection.end();
  console.log('Seeding complete!');
}

seedRestaurants().catch(console.error);
