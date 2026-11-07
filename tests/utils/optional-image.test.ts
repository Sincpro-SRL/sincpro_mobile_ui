import { strict as assert } from "node:assert";
import { readFileSync } from "node:fs";
import { test } from "node:test";

test("ExpoImage stays optional and isolated from root/category barrels", () => {
  const manifest = JSON.parse(readFileSync("package.json", "utf8"));
  assert.equal(manifest.peerDependenciesMeta["expo-image"].optional, true);
  assert.equal(
    manifest.exports["./Display/ExpoImage"],
    "./dist/Display/Display.ExpoImage.js",
  );
  for (const path of ["sincpro_mobile_ui/index.ts", "sincpro_mobile_ui/Display/index.ts"]) {
    const source = readFileSync(path, "utf8");
    assert.doesNotMatch(source, /expo-image|ExpoImage/);
  }
});
