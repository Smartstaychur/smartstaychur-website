import mysql from 'mysql2/promise';
import dotenv from 'dotenv';

dotenv.config();

const experiences = [
  { slug: "altstadt-fuehrung-chur", name: "Altstadtführung Chur", category: "tour", location: "Chur Altstadt", shortDescription: "Entdecken Sie die älteste Stadt der Schweiz bei einer geführten Tour durch die historische Altstadt.", duration: "1.5 Stunden", priceAdult: "25", priceChild: "12", familyFriendly: true },
  { slug: "brambrueesch-wanderung", name: "Brambrüesch Wanderung", category: "hiking", location: "Brambrüesch", shortDescription: "Panoramawanderung auf dem Churer Hausberg mit atemberaubender Aussicht auf die Alpen.", duration: "3 Stunden", priceAdult: "0", familyFriendly: true },
  { slug: "museum-chur-besuch", name: "Bündner Kunstmuseum", category: "culture", location: "Chur", shortDescription: "Besuchen Sie das renommierte Bündner Kunstmuseum mit Werken regionaler und internationaler Künstler.", duration: "2 Stunden", priceAdult: "15", priceChild: "8", familyFriendly: true },
  { slug: "rheinschlucht-rafting", name: "Rheinschlucht Rafting", category: "adventure", location: "Rheinschlucht", shortDescription: "Adrenalin pur beim Rafting durch den Grand Canyon der Schweiz.", duration: "4 Stunden", priceAdult: "145", priceChild: "95", familyFriendly: false },
  { slug: "weinprobe-buendner-herrschaft", name: "Weinprobe Bündner Herrschaft", category: "culture", location: "Bündner Herrschaft", shortDescription: "Degustieren Sie edle Weine in den Rebbergen der Bündner Herrschaft.", duration: "3 Stunden", priceAdult: "75", familyFriendly: false },
  { slug: "mountainbike-tour", name: "Mountainbike Tour", category: "sport", location: "Chur/Lenzerheide", shortDescription: "Geführte Mountainbike-Tour durch die spektakuläre Berglandschaft.", duration: "4 Stunden", priceAdult: "85", familyFriendly: false },
  { slug: "wellness-tag-7132", name: "Wellness Tag 7132 Therme", category: "wellness", location: "Vals", shortDescription: "Entspannung pur in der weltberühmten Therme Vals von Peter Zumthor.", duration: "Ganztägig", priceAdult: "95", familyFriendly: true },
  { slug: "familien-erlebnis-maienfeld", name: "Heidi-Erlebnis Maienfeld", category: "family", location: "Maienfeld", shortDescription: "Auf den Spuren von Heidi - ein unvergessliches Erlebnis für die ganze Familie.", duration: "3 Stunden", priceAdult: "18", priceChild: "9", familyFriendly: true },
  { slug: "kathedrale-fuehrung", name: "Kathedrale Chur Führung", category: "culture", location: "Chur", shortDescription: "Führung durch die romanische Kathedrale mit ihren wertvollen Kunstschätzen.", duration: "1 Stunde", priceAdult: "15", priceChild: "0", familyFriendly: true },
  { slug: "gleitschirm-tandemflug", name: "Gleitschirm Tandemflug", category: "adventure", location: "Brambrüesch", shortDescription: "Erleben Sie Chur aus der Vogelperspektive bei einem Tandem-Gleitschirmflug.", duration: "2 Stunden", priceAdult: "180", familyFriendly: false },
  { slug: "kaese-degustation", name: "Bündner Käse Degustation", category: "culture", location: "Chur", shortDescription: "Probieren Sie die besten Käsesorten aus Graubünden mit Expertenführung.", duration: "1.5 Stunden", priceAdult: "45", familyFriendly: true },
  { slug: "schneeschuh-wanderung", name: "Schneeschuh Wanderung", category: "hiking", location: "Arosa", shortDescription: "Winterwanderung durch verschneite Landschaften mit Schneeschuhen.", duration: "3 Stunden", priceAdult: "65", priceChild: "35", familyFriendly: true },
  { slug: "rhaetische-bahn-erlebnis", name: "Rhätische Bahn Erlebnis", category: "tour", location: "Graubünden", shortDescription: "Fahrt mit der UNESCO-Welterbe Rhätischen Bahn über spektakuläre Viadukte.", duration: "4 Stunden", priceAdult: "89", priceChild: "45", familyFriendly: true },
  { slug: "klettersteig-pinut", name: "Klettersteig Pinut", category: "adventure", location: "Flims", shortDescription: "Der älteste Klettersteig der Schweiz - ein Abenteuer für Schwindelfreie.", duration: "5 Stunden", priceAdult: "120", familyFriendly: false },
  { slug: "yoga-retreat-berge", name: "Yoga Retreat in den Bergen", category: "wellness", location: "Lenzerheide", shortDescription: "Finden Sie innere Ruhe bei Yoga-Sessions mit Bergpanorama.", duration: "Halbtag", priceAdult: "85", familyFriendly: true },
];

async function seedExperiences() {
  const connection = await mysql.createConnection(process.env.DATABASE_URL);
  
  console.log('Seeding experiences...');
  
  for (const exp of experiences) {
    try {
      await connection.execute(
        `INSERT INTO experiences (slug, name, category, location, shortDescription, duration, priceAdult, priceChild, familyFriendly, isActive)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, true)
         ON DUPLICATE KEY UPDATE name=VALUES(name), category=VALUES(category), location=VALUES(location)`,
        [
          exp.slug,
          exp.name,
          exp.category,
          exp.location,
          exp.shortDescription,
          exp.duration,
          exp.priceAdult || null,
          exp.priceChild || null,
          exp.familyFriendly || false
        ]
      );
      console.log(`✓ ${exp.name}`);
    } catch (error) {
      console.log(`✗ ${exp.name}: ${error.message}`);
    }
  }
  
  await connection.end();
  console.log('Seeding complete!');
}

seedExperiences().catch(console.error);
