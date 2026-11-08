import { expect, jest, test } from "@jest/globals";
import CollapsingHeader from "@sincpro/mobile-ui/Navigation/Navigation.CollapsingHeader";
import { render, screen } from "@testing-library/react-native";
import { StyleSheet, Text } from "react-native";

jest.mock("@sincpro/mobile-ui/Display/Display.Icon", () => () => null);
jest.mock("react-native-safe-area-context", () => ({
  useSafeAreaInsets: () => ({ top: 0, bottom: 0, left: 0, right: 0 }),
}));

type Node = ReturnType<typeof screen.getByText>;

/** Closest ancestor whose style sets `key`: the animated surface around a title. */
function animated(node: Node, key: "opacity" | "height") {
  for (let current = node.parent; current; current = current.parent) {
    const style = StyleSheet.flatten(current.props.style);
    if (style && key in style) return style[key];
  }
  throw new Error(`no ancestor animates ${key}`);
}

function surfaces() {
  const [compact, large] = screen.getAllByText("Inicio");
  return { compactOpacity: animated(compact, "opacity"), largeHeight: animated(large, "height") };
}

test.each([
  { y: 0, compactOpacity: 0, largeHeight: 56 },
  { y: 56, compactOpacity: 1, largeHeight: 0 },
  { y: 400, compactOpacity: 1, largeHeight: 0 },
])("offset $y: compact title $compactOpacity, large title height $largeHeight", async (c) => {
  await render(<CollapsingHeader safeArea={false} scrollY={{ get: () => c.y }} title="Inicio" />);
  expect(surfaces()).toEqual({ compactOpacity: c.compactOpacity, largeHeight: c.largeHeight });
});

test("Root wires the header to its ScrollView without the host touching scroll events", async () => {
  await render(
    <CollapsingHeader.Root>
      <CollapsingHeader safeArea={false} title="Inicio" />
      <CollapsingHeader.ScrollView testID="collapsing-scroll">
        <Text>Contenido</Text>
      </CollapsingHeader.ScrollView>
    </CollapsingHeader.Root>,
  );
  expect(surfaces()).toEqual({ compactOpacity: 0, largeHeight: 56 });
  expect(screen.getByTestId("collapsing-scroll")).toBeTruthy();
  expect(screen.getByText("Contenido")).toBeTruthy();
});

test("a header without Root or scrollY fails loudly", async () => {
  jest.spyOn(console, "error").mockImplementation(() => {});
  await expect(render(<CollapsingHeader title="Inicio" />)).rejects.toThrow(
    "CollapsingHeader needs CollapsingHeader.Root or scrollY",
  );
});
