# SmartStayChur - Project TODO

## Phase 1: Datenbankschema
- [x] Hotels-Tabelle mit erweiterten Feldern
- [x] Zimmertypen-Tabelle (Name, Preis, Betten, Ausstattung wie Balkon, Babybett, Minibar)
- [x] Restaurants-Tabelle mit Öffnungszeiten (pro Wochentag)
- [x] Menükarten-Tabelle (Kategorien, Gerichte, Preise, vegetarisch/vegan)
- [x] Tagesmenü-Tabelle (Daily Specials mit Datum)
- [x] Erlebnisse-Tabelle
- [x] Seed-Daten für 19 Hotels
- [x] Seed-Daten für 75 Restaurants
- [x] Seed-Daten für 15 Erlebnisse

## Phase 2: Startseite
- [x] Header mit Navigation (Hotels, Restaurants, Erlebnisse, Admin)
- [x] Hero-Bereich mit Statistiken (19/75/15)
- [x] KI-Reiseassistent Suchfeld
- [x] Kategoriekarten (Hotels, Restaurants, Erlebnisse)
- [x] Footer mit Links

## Phase 3: Hotels
- [x] Hotels-Übersichtsseite mit Suche und Sterne-Filter
- [x] Hotel-Detailseiten mit Zimmertypen
- [x] Preisanzeige pro Zimmertyp
- [x] Ausstattungsdetails (Balkon, Babybett, WLAN etc.)
- [x] Direktbuchungs-Link

## Phase 4: Restaurants
- [x] Restaurants-Übersichtsseite mit Suche
- [x] Restaurant-Detailseiten
- [ ] Öffnungszeiten-Anzeige (Mo-So) - Struktur vorhanden, Daten fehlen
- [ ] Menükarte mit Kategorien und Preisen - Struktur vorhanden, Daten fehlen
- [ ] Tagesmenü / Daily Specials - Struktur vorhanden, Daten fehlen
- [ ] Reservierungslink

## Phase 5: Erlebnisse
- [x] Erlebnisse-Übersichtsseite
- [x] 15 Erlebnisse (Stadtführungen, Wanderungen, Kultur)
- [ ] Erlebnis-Detailseiten

## Phase 6: Admin-Portal für Anbieter
- [x] Login mit OAuth
- [x] Dashboard nach Login
- [ ] Hotels: eigene Daten bearbeiten (Formular)
- [ ] Hotels: Zimmertypen hinzufügen/bearbeiten
- [ ] Restaurants: eigene Daten bearbeiten
- [ ] Restaurants: Menükarte pflegen
- [ ] Restaurants: Tagesmenü aktualisieren

## Phase 7: KI-Optimierung
- [x] llms.txt erstellt
- [x] ai.txt erstellt
- [x] API-Feed /api/feeds/hotels.json
- [x] API-Feed /api/feeds/restaurants.json
- [x] API-Feed /api/feeds/experiences.json
- [x] API-Feed /api/feeds/daily-specials.json
- [ ] Schema.org JSON-LD auf Detailseiten

## Behobene Probleme
- [x] Erlebnisse-Seite funktioniert jetzt
- [x] API-Feeds funktionieren jetzt
- [x] Hotels haben Preisstruktur (Daten müssen noch ergänzt werden)
- [x] Zimmertypen-Struktur vorhanden

## Tests
- [x] API-Tests für Hotels, Restaurants, Erlebnisse
- [x] Statistik-API Test
- [x] Daily Specials API Test
- [x] Alle Tests bestanden (10/10)

## Noch zu erledigen
- [ ] Zimmertypen mit Beispieldaten befüllen
- [ ] Menükarten mit Beispieldaten befüllen
- [ ] Tagesmenüs mit Beispieldaten befüllen
- [ ] Öffnungszeiten für Restaurants eintragen
- [ ] Admin-Formulare für Datenpflege
- [ ] Erlebnis-Detailseiten

## Neue Aufgaben (05.02.2026)
- [ ] Admin-Seite reparieren (funktioniert nicht)
- [x] Öffnungszeiten für alle 75 Restaurants recherchiert (46 aktualisiert, 27 ohne Daten)
- [ ] Menükarten für Restaurants hochladen

## Erweiterungen (05.02.2026 - Abend)
- [x] Speisekarten-URLs in Datenbank eintragen (31 Restaurants)
- [x] Speisekarten KI-lesbar auf Restaurant-Seiten anzeigen
- [x] Daily Specials Eingabeformular für Restaurants
- [x] Hotel-Zimmertypen mit Preisen recherchiert (14 Hotels aktualisiert)
- [x] Hotel-Buchungslinks hinzugefügt
- [ ] Restaurant-Reservierungsmöglichkeiten (Link/Tel/Email)
- [x] API-Feeds für KI-Agenten optimiert (Hotels, Restaurants, Daily Specials)
- [x] llms.txt und ai.txt mit detaillierten Anweisungen aktualisiert

## KI-Auffindbarkeit (05.02.2026 - Priorität HOCH)
- [x] robots.txt für KI-Crawler optimiert (GPTBot, Google-Extended, Claude-Web, etc.)
- [x] sitemap.xml dynamisch generiert für alle Seiten
- [x] Schema.org JSON-LD auf allen Seiten eingebettet (WebSite, TouristInformationCenter)
- [x] Meta-Tags und OpenGraph für KI-Referenzierung (inkl. ai:purpose, ai:api)
- [x] API-Dokumentation für KI-Agenten (ai-plugin.json, openapi.json)
- [x] On-Site KI-Suchfunktion implementiert
