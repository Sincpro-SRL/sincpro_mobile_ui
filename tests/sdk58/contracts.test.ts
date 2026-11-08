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

test("KeyboardAwareScrollView lives only in Form.KeyboardForm", () => {
  // keyboard-controller wraps its scroll and sends `style` to the inner view, so an
  // absolute or margin style is silently lost (PromoModal showed half a backdrop).
  // Every keyboard-aware scroll goes through KeyboardForm; the rest use ScrollView.
  for (const file of sourceFiles(sourceRoot)) {
    const relative = path.relative(sourceRoot, file);
    if (relative === path.join("Form", "Form.KeyboardForm.tsx")) continue;
    assert(
      !/\bKeyboardAwareScrollView\b/.test(readFileSync(file, "utf8")),
      `${relative}: use Form.KeyboardForm (or a plain ScrollView when there are no inputs)`,
    );
  }
});

test("DS text goes through Typography so it gets the configured fonts", () => {
  // The tailwind preset cannot follow configureFonts: a raw RN Text with `font-*`
  // classes falls back to the system font (Badge and Chip rendered San Francisco).
  const allowed = new Set([
    path.join("Typography", "Typography.Text.tsx"),
    path.join("Display", "Display.Icon.tsx"),
    path.join("widgets", "JSONViewer.tsx"),
  ]);
  for (const file of sourceFiles(sourceRoot)) {
    if (!file.endsWith(".tsx")) continue;
    const relative = path.relative(sourceRoot, file);
    if (allowed.has(relative)) continue;
    const source = ts.createSourceFile(
      file,
      readFileSync(file, "utf8"),
      ts.ScriptTarget.Latest,
      true,
      ts.ScriptKind.TSX,
    );
    for (const statement of source.statements) {
      if (
        !ts.isImportDeclaration(statement) ||
        !ts.isStringLiteral(statement.moduleSpecifier) ||
        statement.moduleSpecifier.text !== "react-native"
      ) {
        continue;
      }
      const bindings = statement.importClause?.namedBindings;
      if (!bindings || !ts.isNamedImports(bindings)) continue;
      for (const binding of bindings.elements) {
        if (binding.isTypeOnly || statement.importClause?.isTypeOnly) continue;
        assert.notEqual(
          binding.propertyName?.text ?? binding.name.text,
          "Text",
          `${relative}: render text with Typography.Text`,
        );
      }
    }
  }
});

test("typed text uses the DS font in every field", () => {
  // A TextInput without fontFamily renders the system font next to DS labels.
  // PinInput's input is invisible: its digits are drawn by Typography cells.
  const hidden = new Set([path.join("Form", "Form.PinInput.tsx")]);
  for (const file of sourceFiles(sourceRoot)) {
    if (!file.endsWith(".tsx")) continue;
    const relative = path.relative(sourceRoot, file);
    const text = readFileSync(file, "utf8");
    if (hidden.has(relative) || !/<(TextInput|CurrencyInput)\b/.test(text)) continue;
    assert(
      /\b(inputTextStyle|appliedTextStyle|fontFamilies)\b/.test(text),
      `${relative}: give the TextInput inputTextStyle() from Form/input-text`,
    );
  }
});

test("every touchable tells screen readers what it is", () => {
  // primitives/Pressable defaults to role "button"; raw RN touchables must say it, or
  // opt out with accessible={false} when they only dismiss the keyboard.
  for (const file of sourceFiles(sourceRoot)) {
    if (!file.endsWith(".tsx")) continue;
    const relative = path.relative(sourceRoot, file);
    const text = readFileSync(file, "utf8");
    for (const match of text.matchAll(
      /<(TouchableOpacity|TouchableWithoutFeedback|TouchableHighlight)\b([^>]*)>/gs,
    )) {
      assert(
        /accessibilityRole|accessible=\{false\}/.test(match[2]),
        `${relative}: ${match[1]} needs accessibilityRole (or accessible={false})`,
      );
    }
  }
});

test("color classes only name tokens the tailwind preset defines", async () => {
  // A missing token draws nothing: Divider used `bg-border-divider` and was invisible.
  const preset = (await import(path.join(root, "tailwind.preset.js"))).default;
  const names = new Set(["transparent", "current", "black", "white", "inherit"]);
  const collect = (node: Record<string, unknown>, prefix: string) => {
    for (const [key, value] of Object.entries(node)) {
      const name = key === "DEFAULT" ? prefix : prefix ? `${prefix}-${key}` : key;
      if (typeof value === "object" && value) collect(value as Record<string, unknown>, name);
      else names.add(name);
    }
  };
  collect((preset.theme.extend ?? preset.theme).colors, "");
  const notColors =
    /^(xs|sm|base|lg|[2-9]?xl|left|right|center|justify|[0-9]+|[tblrxy]|solid|dashed|dotted|none|only)$/;
  for (const file of sourceFiles(sourceRoot)) {
    const relative = path.relative(sourceRoot, file);
    for (const match of readFileSync(file, "utf8").matchAll(
      /(?<![\w-])(bg|text|border|border-[tblrxy])-([a-z][a-z0-9-]*)(?:\/\d+)?(?![\w-])/g,
    )) {
      if (notColors.test(match[2])) continue;
      assert(names.has(match[2]), `${relative}: ${match[0]} names no color token`);
    }
  }
});

test("Typography.Text never asks for a size or weight by className", () => {
  // The variant goes to `style`, which wins: `text-sm` or `font-semibold` would do nothing
  // and lie about the rendered text. Use `variant`, `semibold`, `bold` or `style`.
  for (const file of sourceFiles(sourceRoot)) {
    if (!file.endsWith(".tsx")) continue;
    const relative = path.relative(sourceRoot, file);
    for (const match of readFileSync(file, "utf8").matchAll(/<Typography\.Text\b([^>]*)>/gs)) {
      const classes = match[1].match(/className=(?:"([^"]*)"|\{([^}]*)\})/)?.[0] ?? "";
      assert(
        !/\b(font-(light|regular|medium|semibold|bold|extrabold)|text-(xs|sm|base|lg|[2-9]?xl))\b/.test(
          classes,
        ),
        `${relative}: ${classes} — use variant/semibold instead of a className size or weight`,
      );
    }
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
