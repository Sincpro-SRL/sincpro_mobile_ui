import assert from "node:assert/strict";
import { test } from "node:test";

import { matchesSearch, searchKey } from "../../sincpro_mobile_ui/utils/search.ts";

test("search keys ignore accents, case and extra spaces", () => {
  assert.equal(searchKey("  Páez   NÚÑEZ "), "paez nunez");
});

test("every query word must appear in some field", () => {
  assert.equal(matchesSearch("nunez paez", "José Páez Núñez"), true);
  assert.equal(matchesSearch("nunez lopez", "José Páez Núñez"), false);
  assert.equal(matchesSearch("cbba", "Cliente", "Cochabamba CBBA"), true);
  assert.equal(matchesSearch("   ", "cualquiera"), true);
});
