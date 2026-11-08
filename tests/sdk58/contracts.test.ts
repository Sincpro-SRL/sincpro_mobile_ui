import assert from "node:assert/strict";
import { existsSync, readdirSync, readFileSync } from "node:fs";
import path from "node:path";
import { test } from "node:test";
import ts from "typescript";

const root = path.resolve(import.meta.dirname, "../..");
const sourceRoot = path.join(root, "sincpro_mobile_ui");
const forbiddenImports = new Set([
  "@expo/vector-icons",
  "@react-native-community/datetimepicker",
  "@react-native-community/slider",
  "@gorhom/bottom-sheet",
  "@expo/ui/community/bottom-sheet",
]);
const forbiddenNativeComponents = new Set([
  "StatusBar",
  "SafeAreaView",
  "KeyboardAvoidingView",
  "ImageBackground",
]);
const fullscreenModals = new Set([
  "Display/Display.StoryViewer.tsx",
  "widgets/PromoModal.tsx",
]);

function sourceFiles(directory: string): string[] {
  return readdirSync(directory, { withFileTypes: true }).flatMap((entry) => {
    const file = path.join(directory, entry.name);
    return entry.isDirectory() ? sourceFiles(file) : /\.tsx?$/.test(file) ? [file] : [];
  });
}

test("SDK58 source has one native control stack and host-owned system bars", () => {
  for (const file of sourceFiles(sourceRoot)) {
    const relative = path.relative(sourceRoot, file);
    const source = ts.createSourceFile(
      file,
      readFileSync(file, "utf8"),
      ts.ScriptTarget.Latest,
      true,
    );
    function inspect(node: ts.Node) {
      if (ts.isImportDeclaration(node) && ts.isStringLiteral(node.moduleSpecifier)) {
        const module = node.moduleSpecifier.text;
        assert(!forbiddenImports.has(module), `${relative}: obsolete import ${module}`);
        assert(!module.startsWith("react-native/Libraries/"), `${relative}: RN deep import`);
        const bindings = node.importClause?.namedBindings;
        if (module === "react-native" && bindings && ts.isNamedImports(bindings)) {
          for (const binding of bindings.elements) {
            const name = binding.propertyName?.text ?? binding.name.text;
            assert(!forbiddenNativeComponents.has(name), `${relative}: RN ${name}`);
            if (name === "Modal")
              assert(fullscreenModals.has(relative), `${relative}: RN Modal`);
          }
        }
      }
      if (ts.isCallExpression(node) && ts.isPropertyAccessExpression(node.expression)) {
        assert(
          node.expression.getText(source) !== "Dimensions.get",
          `${relative}: useWindowDimensions required`,
        );
      }
      ts.forEachChild(node, inspect);
    }
    inspect(source);
  }
});

test("React Native Pressable never takes className (NativeWind interop re-renders on touch)", () => {
  for (const file of sourceFiles(sourceRoot)) {
    if (!file.endsWith(".tsx")) continue;
    const relative = path.relative(sourceRoot, file);
    const source = ts.createSourceFile(
      file,
      readFileSync(file, "utf8"),
      ts.ScriptTarget.Latest,
      true,
      ts.ScriptKind.TSX,
    );
    const aliases = new Set<string>();
    function inspect(node: ts.Node) {
      if (
        ts.isImportDeclaration(node) &&
        ts.isStringLiteral(node.moduleSpecifier) &&
        node.moduleSpecifier.text === "react-native"
      ) {
        const bindings = node.importClause?.namedBindings;
        if (bindings && ts.isNamedImports(bindings)) {
          for (const binding of bindings.elements) {
            if ((binding.propertyName?.text ?? binding.name.text) === "Pressable") {
              aliases.add(binding.name.text);
            }
          }
        }
      }
      if (
        (ts.isJsxOpeningElement(node) || ts.isJsxSelfClosingElement(node)) &&
        aliases.has(node.tagName.getText(source))
      ) {
        const hasClassName = node.attributes.properties.some(
          (attribute) =>
            ts.isJsxAttribute(attribute) && attribute.name.getText(source) === "className",
        );
        assert(!hasClassName, `${relative}: RN Pressable with className; use primitives/Pressable`);
      }
      ts.forEachChild(node, inspect);
    }
    inspect(source);
  }
});

test("SDK58 package has bounded peers, required Expo UI and no bundled React copies", () => {
  const manifest = JSON.parse(readFileSync(path.join(root, "package.json"), "utf8"));
  for (const [name, range] of Object.entries(manifest.peerDependencies)) {
    assert(
      typeof range === "string" && (/^[~^]/.test(range) || /<\d/.test(range)),
      `Unbounded peer ${name}: ${range}`,
    );
  }
  assert.equal(manifest.peerDependencies["@expo/ui"], ">=58.0.27 <59");
  assert.equal(manifest.peerDependencies.nativewind, "^4.2.7");
  assert.notEqual(manifest.peerDependenciesMeta["@expo/ui"]?.optional, true);
  for (const name of ["expo", "react", "react-native"]) {
    assert(!manifest.dependencies[name], `${name} must remain a peer/development dependency`);
  }
});

test("SDK58 removed entrypoints are not retained as compatibility aliases", () => {
  for (const relative of [
    "Dialog/BottomSheet",
    "Dialog/Dialog.NativeSheet.tsx",
    "layouts/ScreenStatusBar.tsx",
    "layouts/TabNavigatorLayout.tsx",
    "Form/Form.Button.tsx",
    "primitives/BaseButton.tsx",
    "Form/Form.SearchBar.tsx",
    "Navigation/Navigation.Header.tsx",
    "Navigation/Navigation.TabIcon.tsx",
    "utils/icon.ts",
  ]) {
    assert(
      !existsSync(path.join(sourceRoot, relative)),
      `Removed API still exists: ${relative}`,
    );
  }
});
