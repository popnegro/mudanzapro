import assert from "node:assert/strict";
import test from "node:test";
import { validateLeadPayload } from "../src/lib/leadPayload.ts";

test("valid lead payload is normalized", () => {
  const lead = validateLeadPayload({
    id: "lead-test",
    brand: "mendoza",
    customerName: "Ana Pérez",
    email: "ana@example.com",
    phone: "+54 261 555 1234",
    originDept: "capital",
    destDept: "godoy_cruz",
    moveSize: "mediano",
    furnitureList: [],
    servicesSelected: [],
    distanceKm: 8,
    scheduledDate: "2026-10-10",
    estimatedCost: 85000,
  });

  assert.equal(lead.id, "lead-test");
  assert.equal(lead.customerName, "Ana Pérez");
  assert.equal(lead.brand, "mendoza");
  assert.equal(lead.moveSize, "mediano");
});

test("invalid contact data is rejected", () => {
  assert.throws(
    () => validateLeadPayload({ customerName: "A", phone: "123", originDept: "capital", destDept: "godoy_cruz", moveSize: "mediano", scheduledDate: "2026-10-10" }),
    /Invalid customer name/,
  );
});

test("invalid email is rejected", () => {
  assert.throws(
    () => validateLeadPayload({ customerName: "Ana", phone: "2615551234", email: "not-an-email", originDept: "capital", destDept: "godoy_cruz", moveSize: "mediano", scheduledDate: "2026-10-10" }),
    /Invalid email/,
  );
});
