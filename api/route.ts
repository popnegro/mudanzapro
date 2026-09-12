import type { VercelRequest, VercelResponse } from "@vercel/node";

type LatLng = {
  latitude: number;
  longitude: number;
};

type RouteLocation = {
  address?: string;
  latLng?: LatLng;
};

function isValidLatLng(value: unknown): value is LatLng {
  if (!value || typeof value !== "object") return false;
  const candidate = value as Partial<LatLng>;
  return (
    typeof candidate.latitude === "number" &&
    typeof candidate.longitude === "number" &&
    Number.isFinite(candidate.latitude) &&
    Number.isFinite(candidate.longitude) &&
    Math.abs(candidate.latitude) <= 90 &&
    Math.abs(candidate.longitude) <= 180
  );
}

function isValidLocation(value: unknown): value is RouteLocation {
  if (!value || typeof value !== "object") return false;
  const location = value as RouteLocation;
  return Boolean(
    (typeof location.address === "string" && location.address.trim()) ||
      isValidLatLng(location.latLng),
  );
}

function toGoogleLocation(location: RouteLocation) {
  if (isValidLatLng(location.latLng)) {
    return { location: { latLng: location.latLng } };
  }

  return { address: location.address!.trim() };
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method === "OPTIONS") {
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS");
    res.setHeader("Access-Control-Allow-Headers", "Content-Type");
    return res.status(204).end();
  }

  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const apiKey = process.env.GOOGLE_ROUTES_API_KEY;
  if (!apiKey) {
    return res.status(503).json({
      error: "Routes API is not configured",
      code: "ROUTES_API_NOT_CONFIGURED",
    });
  }

  const { origin, destination } = req.body ?? {};
  if (!isValidLocation(origin) || !isValidLocation(destination)) {
    return res.status(400).json({
      error: "Origin and destination are required",
      code: "INVALID_LOCATIONS",
    });
  }

  try {
    const response = await fetch(
      "https://routes.googleapis.com/directions/v2:computeRoutes",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "X-Goog-Api-Key": apiKey,
          "X-Goog-FieldMask":
            "routes.distanceMeters,routes.duration,routes.localizedValues",
        },
        body: JSON.stringify({
          origin: toGoogleLocation(origin),
          destination: toGoogleLocation(destination),
          travelMode: "DRIVE",
          routingPreference: "TRAFFIC_AWARE",
          computeAlternativeRoutes: false,
          languageCode: "es-419",
          units: "METRIC",
        }),
      },
    );

    const payload = await response.json();
    if (!response.ok) {
      console.error("Google Routes API error", response.status, payload);
      return res.status(502).json({
        error: "Unable to calculate route",
        code: "ROUTES_API_ERROR",
      });
    }

    const route = payload?.routes?.[0];
    if (!route || typeof route.distanceMeters !== "number") {
      return res.status(422).json({
        error: "No route found for the selected locations",
        code: "ROUTE_NOT_FOUND",
      });
    }

    const distanceKm = Math.round((route.distanceMeters / 1000) * 10) / 10;
    const durationSeconds =
      typeof route.duration === "string"
        ? Number.parseFloat(route.duration.replace("s", ""))
        : NaN;

    return res.status(200).json({
      distanceKm,
      durationMinutes: Number.isFinite(durationSeconds)
        ? Math.round(durationSeconds / 60)
        : null,
      distanceText:
        route.localizedValues?.distance?.text ?? `${distanceKm} km`,
      durationText:
        route.localizedValues?.duration?.text ?? null,
      source: "google-routes",
    });
  } catch (error) {
    console.error("Routes proxy failure", error);
    return res.status(500).json({
      error: "Unable to calculate route",
      code: "ROUTES_PROXY_ERROR",
    });
  }
}
