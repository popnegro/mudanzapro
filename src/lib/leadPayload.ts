import type { QuoteLead } from "../types";

export type LeadPayload = Omit<QuoteLead, "hasElevatorOrigin" | "hasElevatorDest" | "floorOrigin" | "floorDest"> &
  Partial<Pick<QuoteLead, "hasElevatorOrigin" | "hasElevatorDest" | "floorOrigin" | "floorDest">>;

const MAX_TEXT_LENGTH = 500;
const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export function validateLeadPayload(value: unknown): LeadPayload {
  if (!value || typeof value !== "object") throw new Error("Invalid lead payload.");

  const input = value as Partial<LeadPayload>;
  const customerName = String(input.customerName ?? "").trim();
  const phone = String(input.phone ?? "").trim();
  const email = String(input.email ?? "").trim();
  const originDept = String(input.originDept ?? "").trim();
  const destDept = String(input.destDept ?? "").trim();
  const moveSize = input.moveSize;
  const scheduledDate = String(input.scheduledDate ?? "").trim();

  if (customerName.length < 2 || customerName.length > MAX_TEXT_LENGTH) throw new Error("Invalid customer name.");
  if (phone.replace(/\D/g, "").length < 8 || phone.length > 40) throw new Error("Invalid phone.");
  if (email && (email.length > 254 || !EMAIL_PATTERN.test(email))) throw new Error("Invalid email.");
  if (!originDept || !destDept) throw new Error("Origin and destination are required.");
  if (!scheduledDate || !/^\d{4}-\d{2}-\d{2}$/.test(scheduledDate)) throw new Error("Invalid scheduled date.");
  if (moveSize !== "chico" && moveSize !== "mediano" && moveSize !== "grande") throw new Error("Invalid move size.");

  const numberFields = [input.distanceKm, input.estimatedCost, input.floorOrigin, input.floorDest];
  if (numberFields.some((field) => field !== undefined && field !== null && !Number.isFinite(Number(field)))) {
    throw new Error("Invalid numeric field.");
  }

  const furnitureList = Array.isArray(input.furnitureList)
    ? input.furnitureList
        .filter(
          (item): item is { itemId: string; count: number } =>
            Boolean(item && typeof item.itemId === "string" && Number.isFinite(item.count)),
        )
        .slice(0, 100)
    : [];
  const servicesSelected = Array.isArray(input.servicesSelected)
    ? input.servicesSelected.map(String).slice(0, 100)
    : [];

  return {
    id: String(input.id ?? crypto.randomUUID()).slice(0, 100),
    createdAt: String(input.createdAt ?? new Date().toISOString()),
    brand: input.brand === "miranda" || input.brand === "empresas" ? input.brand : "mendoza",
    customerName,
    email,
    phone,
    originDept: originDept.slice(0, 120),
    destDept: destDept.slice(0, 120),
    originAddress: String(input.originAddress ?? "").trim().slice(0, MAX_TEXT_LENGTH) || undefined,
    destinationAddress: String(input.destinationAddress ?? "").trim().slice(0, MAX_TEXT_LENGTH) || undefined,
    moveSize,
    furnitureList,
    servicesSelected,
    distanceKm: Number(input.distanceKm ?? 0),
    hasElevatorOrigin: typeof input.hasElevatorOrigin === "boolean" ? input.hasElevatorOrigin : undefined,
    hasElevatorDest: typeof input.hasElevatorDest === "boolean" ? input.hasElevatorDest : undefined,
    floorOrigin: input.floorOrigin == null ? undefined : Number(input.floorOrigin),
    floorDest: input.floorDest == null ? undefined : Number(input.floorDest),
    scheduledDate,
    estimatedCost: Number(input.estimatedCost ?? 0),
    notes: String(input.notes ?? "").trim().slice(0, 2000) || undefined,
  };
}
