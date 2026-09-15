import assert from "node:assert/strict";
import test from "node:test";
import { validateLeadPayload } from "../src/lib/leadPayload.ts";

const validLead = {
  id: "lead-test",
  createdAt: "2026-09-15T00:00:00.000Z",
  brand: "mendoza",
  customerName: "Ana Pérez",
  email: "ana@example.com",
  phone: "+54 261 555 1234",
  originDept: "capital",
  destDept: "godoy_cruz",
  moveSize: "mediano",
  furnitureList: [{ itemId: "sofa", count: 1 }],
  servicesSelected: ["embalaje"],
  distanceKm: 18,
  hasElevatorOrigin: true,
  hasElevatorDest: false,
  floorOrigin: 2,
  floorDest: 0,
  scheduledDate: "2026-10-10",
  estimatedCost: 85000,
  notes: "Sin observaciones",
};

test("valid lead payload is normalized", () => {
  const lead = validateLeadPayload(validLead);

  assert.equal(lead.id, "lead-test");
  assert.equal(lead.customerName, "Ana Pérez");
  assert.equal(lead.brand, "mendoza");
  assert.equal(lead.moveSize, "mediano");
  assert.deepEqual(lead.furnitureList, [{ itemId: "sofa", count: 1 }]);
  assert.deepEqual(lead.servicesSelected, ["embalaje"]);
});

test("optional elevator and floor fields are accepted", () => {
  const lead = validateLeadPayload({ ...validLead, hasElevatorOrigin: undefined, floorOrigin: null });

  assert.equal(lead.hasElevatorOrigin, undefined);
  assert.equal(lead.floorOrigin, undefined);
});

test("invalid contact data is rejected", () => {
  assert.throws(
    () => validateLeadPayload({ ...validLead, customerName: "A" }),
    /Invalid customer name/,
  );
  assert.throws(
    () => validateLeadPayload({ ...validLead, phone: "123" }),
    /Invalid phone/,
  );
});

test("invalid email is rejected", () => {
  assert.throws(
    () => validateLeadPayload({ ...validLead, email: "not-an-email" }),
    /Invalid email/,
  );
});

test("invalid move and date values are rejected", () => {
  assert.throws(
    () => validateLeadPayload({ ...validLead, moveSize: "enorme" }),
    /Invalid move size/,
  );
  assert.throws(
    () => validateLeadPayload({ ...validLead, scheduledDate: "10-10-2026" }),
    /Invalid scheduled date/,
  );
  assert.throws(
    () => validateLeadPayload({ ...validLead, scheduledDate: "2026-02-30" }),
    /Invalid scheduled date/,
  );
});

test("invalid furniture items are discarded", () => {
  const lead = validateLeadPayload({
    ...validLead,
    furnitureList: [
      { itemId: "sofa", count: 1 },
      { itemId: "", count: 1 },
      { itemId: "table", count: -1 },
      { itemId: "chair", count: 1.5 },
      { itemId: "lamp", count: 101 },
    ],
  });

  assert.deepEqual(lead.furnitureList, [{ itemId: "sofa", count: 1 }]);
});

test("lead arrays are bounded and service values are normalized", () => {
  const furnitureList = Array.from({ length: 150 }, (_, index) => ({ itemId: `item-${index}`, count: 1 }));
  const servicesSelected = [" embalaje ", "", "  traslado  ", ...Array.from({ length: 150 }, (_, index) => `service-${index}`)];
  const lead = validateLeadPayload({ ...validLead, furnitureList, servicesSelected });

  assert.equal(lead.furnitureList.length, 100);
  assert.equal(lead.servicesSelected.length, 100);
  assert.equal(lead.servicesSelected[0], "embalaje");
  assert.equal(lead.servicesSelected[1], "traslado");
});
