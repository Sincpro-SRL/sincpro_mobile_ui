import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { createRequire } from "node:module";
import { dirname, join, resolve } from "node:path";
import { test } from "node:test";

import {
  ICON_MAP,
  type IconDefinition,
  type IconName,
} from "@sincpro/mobile-ui/Display/icon-map";

const semanticNames = [
  "add",
  "add-circle",
  "archive",
  "back",
  "bicycle",
  "book",
  "bookmark",
  "bookmark-empty",
  "calendar",
  "camera",
  "card",
  "cart",
  "cash",
  "check",
  "circle",
  "close",
  "collapse",
  "copy",
  "dark-mode",
  "database",
  "delete",
  "dismiss",
  "document",
  "down",
  "download",
  "download-cloud",
  "edit",
  "empty",
  "error",
  "expand",
  "filter",
  "folder",
  "grid",
  "help",
  "hidden",
  "home",
  "image",
  "inbox",
  "info",
  "link",
  "list",
  "location",
  "location-disabled",
  "lock",
  "logout",
  "mail",
  "map",
  "menu",
  "more",
  "more-vertical",
  "mute",
  "next",
  "notifications",
  "package",
  "pause",
  "people",
  "play",
  "printer",
  "profile",
  "profile-circle",
  "rating",
  "rating-empty",
  "receipt",
  "remove",
  "reorder",
  "save",
  "search",
  "search-empty",
  "server",
  "settings",
  "share",
  "stop",
  "success",
  "sync",
  "time",
  "unlink",
  "up",
  "upload",
  "upload-cloud",
  "visibility",
  "volume",
  "wallet",
  "warning",
  "wifi",
] as const satisfies readonly IconName[];

test("the semantic catalog is complete and each entry has exactly SF and Material sources", () => {
  assert.deepEqual(Object.keys(ICON_MAP).sort(), [...semanticNames].sort());
  for (const name of semanticNames) {
    const icon: IconDefinition = ICON_MAP[name];
    assert.deepEqual(Object.keys(icon).sort(), ["md", "sf"]);
    assert.ok(icon.sf.length > 0, `${name} requires an iOS source`);
    assert.match(icon.md, /^[a-z0-9_]+$/, `${name} requires an Android Material source`);
  }
});

test("navigation sources expose an iOS symbol and an Android material name", () => {
  assert.deepEqual(ICON_MAP.home, { sf: "house.fill", md: "home" });
  assert.deepEqual(ICON_MAP.settings, { sf: "gearshape", md: "settings" });
  assert.deepEqual(ICON_MAP.profile, { sf: "person", md: "person" });
  assert.deepEqual(ICON_MAP.back, { sf: "chevron.left", md: "arrow_back" });
});

test("every Android source exists in the installed Expo Material catalog", () => {
  const packagePath = createRequire(resolve("package.json")).resolve(
    "expo-symbols/package.json",
  );
  const symbols: unknown = JSON.parse(
    readFileSync(join(dirname(packagePath), "build/android/symbols.json"), "utf8"),
  );
  assert.ok(symbols !== null && typeof symbols === "object");
  for (const [name, icon] of Object.entries(ICON_MAP)) {
    assert.ok(Object.hasOwn(symbols, icon.md), `${name} requires a real Material symbol`);
  }
});

test("family-specific names and custom artwork are not semantic aliases", () => {
  for (const name of [
    "home-outline",
    "chevron-back",
    "checkmark",
    "ionicons",
    "fontawesome",
    "material",
    "custom",
    "odoo",
    "logo",
  ]) {
    assert.equal(Object.hasOwn(ICON_MAP, name), false);
  }
});

test("the generated Android glyph table matches the installed Material Symbols codepoints", async () => {
  const { MATERIAL_CODEPOINTS } = await import("@sincpro/mobile-ui/Display/icon-glyphs");
  const packagePath = createRequire(resolve("package.json")).resolve(
    "expo-symbols/package.json",
  );
  const symbols = JSON.parse(
    readFileSync(join(dirname(packagePath), "build/android/symbols.json"), "utf8"),
  ) as Record<string, number>;
  assert.deepEqual(Object.keys(MATERIAL_CODEPOINTS).sort(), Object.keys(ICON_MAP).sort());
  for (const [name, icon] of Object.entries(ICON_MAP)) {
    assert.equal(
      MATERIAL_CODEPOINTS[name as keyof typeof MATERIAL_CODEPOINTS],
      symbols[icon.md],
      `${name}: run node scripts/generate-icon-glyphs.mjs`,
    );
  }
});
