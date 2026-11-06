import assert from "node:assert/strict";
import { readdirSync, readFileSync } from "node:fs";
import { resolve } from "node:path";
import { it } from "node:test";

it("stories use the documented responsibility tiers and do not create an UX catch-all", () => {
  const directory = resolve(".rnstorybook/stories");
  const files = readdirSync(directory).filter((file) => file.endsWith(".stories.tsx"));
  const categories = new Set(["Foundations", "Components", "Patterns", "Legacy"]);
  for (const file of files) {
    const source = readFileSync(resolve(directory, file), "utf8");
    const title = source.match(/title:\s*"([^"]+)"/)?.[1];
    assert.ok(title, `Missing explicit story title in ${file}`);
    assert.ok(categories.has(title.split("/")[0]), `Unclassified story ${file}: ${title}`);
    assert.ok(
      !title.split("/").includes("UX"),
      `UX is a cross-cutting quality, not a component category: ${file}`,
    );
  }
});
