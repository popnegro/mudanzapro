import { neon } from "@neondatabase/serverless";
import { validateLeadPayload } from "../src/lib/leadPayload";

const jsonHeaders = { "content-type": "application/json; charset=utf-8" };

function json(data: unknown, status = 200) {
  return new Response(JSON.stringify(data), {
    status,
    headers: jsonHeaders,
  });
}

export default async function handler(request: Request): Promise<Response> {
  if (request.method !== "POST") {
    return json({ error: "Method not allowed" }, 405);
  }

  if (!process.env.DATABASE_URL) {
    return json({ error: "Lead storage is not configured." }, 503);
  }

  try {
    const contentLength = Number(request.headers.get("content-length") ?? 0);
    if (contentLength > 20_000) return json({ error: "Payload too large." }, 413);

    const payload = validateLeadPayload(await request.json());
    const sql = neon(process.env.DATABASE_URL);

    await sql`
      INSERT INTO leads (
        id, created_at, brand, customer_name, email, phone,
        origin_dept, dest_dept, origin_address, destination_address,
        move_size, furniture_list, services_selected, distance_km,
        has_elevator_origin, has_elevator_dest, floor_origin, floor_dest,
        scheduled_date, estimated_cost, status, notes
      ) VALUES (
        ${payload.id}, ${payload.createdAt}, ${payload.brand}, ${payload.customerName},
        ${payload.email}, ${payload.phone}, ${payload.originDept}, ${payload.destDept},
        ${payload.originAddress ?? null}, ${payload.destinationAddress ?? null},
        ${payload.moveSize}, ${JSON.stringify(payload.furnitureList)},
        ${JSON.stringify(payload.servicesSelected)}, ${payload.distanceKm},
        ${payload.hasElevatorOrigin ?? null}, ${payload.hasElevatorDest ?? null},
        ${payload.floorOrigin ?? null}, ${payload.floorDest ?? null},
        ${payload.scheduledDate}, ${payload.estimatedCost}, 'new', ${payload.notes ?? null}
      )
      ON CONFLICT (id) DO NOTHING
    `;

    return json({ ok: true, id: payload.id }, 201);
  } catch (error) {
    console.error("Lead persistence failed", error);
    if (error instanceof SyntaxError) return json({ error: "Invalid JSON payload." }, 400);
    if (error instanceof Error && error.message.startsWith("Invalid")) {
      return json({ error: error.message }, 400);
    }
    return json({ error: "Unable to save lead." }, 500);
  }
}
