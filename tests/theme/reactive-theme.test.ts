import assert from "node:assert/strict";
import { readdirSync, readFileSync } from "node:fs";
import path from "node:path";
import { test } from "node:test";

const sourceRoot = path.resolve(import.meta.dirname, "../../sincpro_mobile_ui");

function components(directory: string): string[] {
  return readdirSync(directory, { withFileTypes: true }).flatMap((entry) => {
    const file = path.join(directory, entry.name);
    return entry.isDirectory() ? components(file) : file.endsWith(".tsx") ? [file] : [];
  });
}

test("components read the theme through useTheme, never the static singleton", () => {
  const binding = /import\s*\{[^}]*\btheme\b[^}]*\}\s*from\s*"@sincpro\/mobile-ui\/theme"/;
  for (const file of components(sourceRoot)) {
    assert.ok(
      !binding.test(readFileSync(file, "utf8")),
      `${path.relative(sourceRoot, file)}: the static \`theme\` never re-renders on a light/dark switch; use useTheme()`,
    );
  }
});
