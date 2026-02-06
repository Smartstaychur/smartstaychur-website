import mysql from 'mysql2/promise';
import fs from 'fs';

const hotelData = JSON.parse(fs.readFileSync('/home/ubuntu/research_hotel_info.json', 'utf8'));

// Mapping von Recherche-Namen zu Datenbank-Slugs
const nameToSlugMap = {
  'ABC Swiss Quality Hotel': 'abc-swiss-quality-hotel',
  'Ambiente Hotel Freieck': 'ambiente-hotel-freieck',
  'Best Western Hotel Sommerau': 'best-western-hotel-sommerau',
  'Bogentrakt': 'chur-youth-hostel',
  'Drei Könige Hotel': 'drei-koenige-hotel',
  'Duc de Rohan Hotel': 'duc-de-rohan-hotel',
  'Franziskaner Hotel': 'franziskaner-hotel',
  'Hotel & Hostel Marsoel': 'hotel-hostel-marsoel',
  'Hotel & Restaurant Stern': 'romantik-hotel-stern',
  'Hotel & Restaurant Zunfthaus zur Rebleuten': 'zunfthaus-rebleuten',
  'Hotel Chur': 'hotel-chur',
  'Hotel Romantik Stern': 'romantik-hotel-stern',
  'Hotel Sommerau': 'hotel-sommerau',
  'Zunfthaus zur Rebleuten': 'zunfthaus-rebleuten',
  'Ibis Chur': 'ibis-chur-hotel',
  'Central Hotel Post': 'post-hotel',
  'Romantik Hotel Stern': 'romantik-hotel-stern',
};

async function updateHotels() {
  const connection = await mysql.createConnection(process.env.DATABASE_URL);
  
  let updated = 0;
  let skipped = 0;
  
  for (const result of hotelData.results) {
    const data = result.output;
    const hotelName = data.hotel_name;
    
    // Finde den passenden Slug
    let slug = nameToSlugMap[hotelName];
    
    // Falls nicht im Mapping, versuche den Input-Namen
    if (!slug) {
      const inputName = result.input;
      slug = nameToSlugMap[inputName];
    }
    
    // Falls immer noch nicht gefunden, generiere Slug aus Namen
    if (!slug) {
      slug = hotelName.toLowerCase()
        .replace(/[äÄ]/g, 'ae')
        .replace(/[öÖ]/g, 'oe')
        .replace(/[üÜ]/g, 'ue')
        .replace(/[ß]/g, 'ss')
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/^-|-$/g, '');
    }
    
    // Prüfe ob Daten vorhanden sind
    if (data.booking_url === 'nicht gefunden' && data.price_from === 'nicht gefunden') {
      console.log(`Skipping ${hotelName} - keine Daten gefunden`);
      skipped++;
      continue;
    }
    
    // Update-Query erstellen
    const updates = [];
    const values = [];
    
    if (data.booking_url && data.booking_url !== 'nicht gefunden') {
      updates.push('bookingUrl = ?');
      values.push(data.booking_url);
    }
    
    if (data.price_from && data.price_from !== 'nicht gefunden') {
      updates.push('priceFrom = ?');
      values.push(data.price_from);
    }
    
    if (data.price_to && data.price_to !== 'nicht gefunden') {
      updates.push('priceTo = ?');
      values.push(data.price_to);
    }
    
    if (data.room_types && data.room_types !== 'nicht gefunden') {
      updates.push('roomTypesText = ?');
      values.push(data.room_types);
    }
    
    if (data.room_amenities && data.room_amenities !== 'nicht gefunden') {
      updates.push('amenitiesText = ?');
      values.push(data.room_amenities);
    }
    
    // Boolean-Werte
    if (data.has_parking === true) {
      updates.push('parking = ?');
      values.push(1);
    }
    if (data.has_restaurant === true) {
      updates.push('restaurant = ?');
      values.push(1);
    }
    if (data.has_spa === true) {
      updates.push('spa = ?');
      values.push(1);
    }
    if (data.pets_allowed === true) {
      updates.push('petsAllowed = ?');
      values.push(1);
    }
    if (data.wheelchair_accessible === true) {
      updates.push('wheelchairAccessible = ?');
      values.push(1);
    }
    
    if (updates.length === 0) {
      console.log(`Skipping ${hotelName} - keine Updates`);
      skipped++;
      continue;
    }
    
    // Versuche Update mit verschiedenen Slug-Varianten
    const slugVariants = [
      slug,
      slug.replace(/-/g, ''),
      hotelName.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, ''),
    ];
    
    let success = false;
    for (const trySlug of slugVariants) {
      try {
        const query = `UPDATE hotels SET ${updates.join(', ')} WHERE slug LIKE ?`;
        const [result] = await connection.execute(query, [...values, `%${trySlug}%`]);
        
        if (result.affectedRows > 0) {
          console.log(`Updated ${hotelName} (slug: ${trySlug})`);
          updated++;
          success = true;
          break;
        }
      } catch (error) {
        // Ignoriere Fehler und versuche nächste Variante
      }
    }
    
    if (!success) {
      // Versuche mit Namen
      try {
        const query = `UPDATE hotels SET ${updates.join(', ')} WHERE name LIKE ?`;
        const [result] = await connection.execute(query, [...values, `%${hotelName.split(' ')[0]}%`]);
        
        if (result.affectedRows > 0) {
          console.log(`Updated ${hotelName} (by name)`);
          updated++;
        } else {
          console.log(`Could not find hotel: ${hotelName}`);
          skipped++;
        }
      } catch (error) {
        console.log(`Error updating ${hotelName}: ${error.message}`);
        skipped++;
      }
    }
  }
  
  console.log(`\\nDone! Updated: ${updated}, Skipped: ${skipped}`);
  
  await connection.end();
}

updateHotels().catch(console.error);
