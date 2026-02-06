# SmartStayChur TODO

## Datenbank & Schema
- [x] Hotels-Tabelle (name, slug, stars, address, priceFrom, priceTo, description, amenities, images, contact)
- [x] Restaurants-Tabelle (name, slug, cuisineTypes, openingHours, menuUrl, description, images, contact)
- [x] Providers-Tabelle (username, passwordHash, role, linkedHotelId/linkedRestaurantId)
- [x] DB-Migration ausführen

## Backend - Auth
- [x] Passwort-basiertes Login (POST /api/auth/login)
- [x] Passwort ändern (POST /api/auth/change-password)
- [x] Provider-Session via JWT-Cookie
- [x] Admin kann Anbieter-Konten erstellen

## Backend - tRPC Routen
- [x] hotel.list (öffentlich, mit Filter nach Sternen)
- [x] hotel.getBySlug (öffentlich)
- [x] hotel.update (geschützt, nur eigenes Hotel)
- [x] restaurant.list (öffentlich, mit Filter nach Küchen-Typ)
- [x] restaurant.getBySlug (öffentlich)
- [x] restaurant.update (geschützt, nur eigenes Restaurant)
- [x] provider.list (nur Admin)
- [x] provider.create (nur Admin)

## Frontend - Öffentliche Seiten
- [x] Home-Seite (Landingpage mit Suche und Featured Hotels/Restaurants)
- [x] Hotels-Übersicht (Karten mit Sternen-Filter)
- [x] Hotel-Detailseite (Preise, Beschreibung, Ausstattung, Kontakt, Bilder)
- [x] Restaurants-Übersicht (Karten mit Küchen-Typ-Filter)
- [x] Restaurant-Detailseite (Öffnungszeiten, Menü-Link, Küchen-Typ, Kontakt)

## Frontend - Admin-Bereich
- [x] Login-Seite (Benutzername/Passwort)
- [x] Admin-Dashboard (Übersicht)
- [x] Hotel-Bearbeitung (Preise, Beschreibung, Ausstattung, Bilder)
- [x] Restaurant-Bearbeitung (Öffnungszeiten, Menü-URL, Küchen-Typ)
- [x] Anbieter-Verwaltung (nur Admin: Konten erstellen/verwalten)
- [x] Passwort ändern

## Seed-Daten
- [x] Hotel-Seed mit Preisen und Ausstattung
- [x] Restaurant-Seed mit Öffnungszeiten und Menü-URLs

## Tests
- [x] Auth-Tests (Login, Passwort ändern)
- [x] Hotel-Routen-Tests
- [x] Restaurant-Routen-Tests
