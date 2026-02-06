# SmartStayChur.ch

Die offizielle Webseite von **SmartStayChur** – eine KI-optimierte Plattform für Hotels, Restaurants und Erlebnisse in Chur, Graubünden.

## Beschreibung

SmartStayChur ist ein innovatives Verzeichnis für Tourismus und Gastronomie in Chur. Die Plattform ist speziell darauf ausgelegt, von KI-Agenten (ChatGPT, Gemini, Claude etc.) gefunden und abgefragt zu werden, um Besuchern und Einheimischen die besten Empfehlungen zu liefern.

## Domains

- [www.smartstaychur.ch](https://www.smartstaychur.ch)
- [www.smartstaychur.com](https://www.smartstaychur.com)

## Funktionen

- Hotel-Verzeichnis mit Verfügbarkeit und Preisen
- Restaurant-Verzeichnis mit Menüs und Öffnungszeiten
- Erlebnisse und Aktivitäten in Chur
- KI-optimierte Datenstruktur (ai.txt, llms.txt, OpenAPI)
- Mehrsprachig (DE, FR, IT, EN)
- Interaktive Karte
- AI-Chatbox für Besucheranfragen

## Technologie

- **Frontend:** React + TypeScript + Vite
- **Backend:** Node.js / Express
- **Datenbank:** MySQL / TiDB (via Drizzle ORM)
- **Styling:** TailwindCSS + shadcn/ui
- **KI-Integration:** OpenAPI-Schema, ai.txt, llms.txt

## Projektstruktur

```
smartstaychur/
├── client/          # Frontend (React SPA)
│   ├── public/      # Statische Dateien (robots.txt, ai.txt, llms.txt)
│   └── src/         # React-Komponenten und Seiten
├── server/          # Backend API
├── shared/          # Gemeinsame Typen und Utilities
├── scripts/         # Datenbank-Seeds und Migrations-Skripte
├── drizzle/         # Datenbank-Migrationen
└── package.json
```

## Lizenz

Alle Rechte vorbehalten.
