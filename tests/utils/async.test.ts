import assert from "node:assert/strict";
import { test } from "node:test";

import { attempt, errorMessage } from "@sincpro/mobile-ui/utils/async";

test("attempt reports success and failure without throwing", async () => {
  assert.deepEqual(await attempt(async () => 42), { ok: true, value: 42 });
  assert.deepEqual(await attempt(() => "sync"), { ok: true, value: "sync" });
  const failure = new Error("sin red");
  assert.deepEqual(
    await attempt(async () => {
      throw failure;
    }),
    { ok: false, error: failure },
  );
});

test("errorMessage prefers the error's own text and falls back for anything else", () => {
  assert.equal(errorMessage(new Error("Servidor caído"), "Reintenta"), "Servidor caído");
  assert.equal(errorMessage(new Error("   "), "Reintenta"), "Reintenta");
  assert.equal(errorMessage("texto suelto", "Reintenta"), "Reintenta");
  assert.equal(errorMessage(undefined, "Reintenta"), "Reintenta");
});
