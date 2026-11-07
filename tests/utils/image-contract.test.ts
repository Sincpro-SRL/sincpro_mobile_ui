import { strict as assert } from "node:assert";
import { readFileSync } from "node:fs";
import { readdirSync } from "node:fs";
import { join } from "node:path";
import { test } from "node:test";
import ts from "typescript";

test("Expo Image is required and shared by the Display namespace", () => {
  const manifest = JSON.parse(readFileSync("package.json", "utf8"));
  assert.equal(manifest.peerDependenciesMeta["expo-image"], undefined);
  assert.ok(Number(manifest.version.split(".")[0]) >= 2);
  assert.equal(
    manifest.exports["./Display/ExpoImage"],
    "./dist/Display/Display.ExpoImage.js",
  );
  assert.match(readFileSync("sincpro_mobile_ui/Display/index.ts", "utf8"), /ExpoImage/);
  assert.match(
    readFileSync("sincpro_mobile_ui/Display/Display.Image.tsx", "utf8"),
    /<ExpoImage/,
  );
});

test("catalog uses Expo Image without accessing deprecated ImageBackground", () => {
  function checkDirectory(directory: string) {
    for (const entry of readdirSync(directory, { withFileTypes: true })) {
      const path = join(directory, entry.name);
      if (entry.isDirectory()) {
        checkDirectory(path);
        continue;
      }
      if (!/\.[jt]sx?$/.test(entry.name)) continue;
      const file = ts.createSourceFile(
        path,
        readFileSync(path, "utf8"),
        ts.ScriptTarget.Latest,
        true,
        ts.ScriptKind.TSX,
      );
      const nativeImages = new Set<string>();
      const nativeNamespaces = new Set<string>();
      for (const statement of file.statements) {
        if (
          !ts.isImportDeclaration(statement) ||
          !ts.isStringLiteral(statement.moduleSpecifier) ||
          statement.moduleSpecifier.text !== "react-native"
        )
          continue;
        const bindings = statement.importClause?.namedBindings;
        if (statement.importClause?.name)
          nativeNamespaces.add(statement.importClause.name.text);
        if (bindings && ts.isNamespaceImport(bindings))
          nativeNamespaces.add(bindings.name.text);
        if (!bindings || !ts.isNamedImports(bindings)) continue;
        for (const imported of bindings.elements) {
          assert.notEqual(
            (imported.propertyName ?? imported.name).text,
            "ImageBackground",
            `Deprecated ImageBackground import in ${path}`,
          );
          if ((imported.propertyName ?? imported.name).text === "Image")
            nativeImages.add(imported.name.text);
        }
      }
      const visit = (node: ts.Node) => {
        if (
          ts.isPropertyAccessExpression(node) &&
          ts.isIdentifier(node.expression) &&
          nativeNamespaces.has(node.expression.text)
        )
          assert.notEqual(
            node.name.text,
            "ImageBackground",
            `Deprecated ImageBackground access in ${path}`,
          );
        if (
          ts.isElementAccessExpression(node) &&
          ts.isIdentifier(node.expression) &&
          nativeNamespaces.has(node.expression.text) &&
          ts.isStringLiteral(node.argumentExpression)
        )
          assert.notEqual(
            node.argumentExpression.text,
            "ImageBackground",
            `Deprecated ImageBackground access in ${path}`,
          );
        if (ts.isJsxOpeningElement(node) || ts.isJsxSelfClosingElement(node))
          assert.ok(
            !nativeImages.has(node.tagName.getText(file)),
            `Native Image renderer in ${path}`,
          );
        ts.forEachChild(node, visit);
      };
      visit(file);
    }
  }
  checkDirectory("sincpro_mobile_ui");
});
