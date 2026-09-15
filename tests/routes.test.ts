import assert from "node:assert/strict";
import test from "node:test";

import { ALL_ROUTES, ROUTES, getPageFromPath, getRouteById } from "../src/routes.ts";

test("MudanzaPro route map exposes the action layer", () => {
  assert.equal(getRouteById("calculadora")?.seoTitle, "Calculadora de Mudanza en Mendoza | MudanzaPro");
  assert.equal(getPageFromPath("/calculadora/"), "calculadora");
  assert.equal(getPageFromPath("/ruta-inexistente"), "inicio");
});

test("public navigation keeps only intended primary routes", () => {
  const publicRouteIds = ROUTES.map((route) => route.id);

  assert.deepEqual(publicRouteIds, [
    "inicio",
    "calculadora",
    "servicios",
    "directorio",
    "contacto",
  ]);
  assert.equal(ALL_ROUTES.length >= ROUTES.length, true);
});
