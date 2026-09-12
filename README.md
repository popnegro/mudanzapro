<div align="center">
<img width="1200" height="475" alt="GHBanner" src="https://ai.google.dev/static/site-assets/images/share-ais-513315318.png" />
</div>

# MudanzaPro

Herramientas para planificar y preparar una mudanza en Mendoza antes de solicitar presupuesto.

## Run Locally

**Prerequisites:** Node.js

1. Install dependencies:
   `npm install`
2. Set the required environment variables in `.env.local` when needed.
3. Run the app:
   `npm run dev`

## Google Routes API

The calculator uses Google Maps Platform Routes API only for objective route data: road distance and estimated driving duration. It does not calculate or invent a service price.

Configure this server-side environment variable in Vercel/local development:

`GOOGLE_ROUTES_API_KEY=...`

The API key must have access to Routes API and should remain server-side. The frontend calls `/api/route`; it does not call the Routes API directly.

Google requires a response field mask for Compute Routes. This implementation requests only distance, duration and localized display values.
