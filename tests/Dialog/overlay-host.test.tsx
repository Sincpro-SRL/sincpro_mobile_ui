import { expect, jest, test } from "@jest/globals";
import Sheet from "@sincpro/mobile-ui/Dialog/Dialog.Sheet";
import { overlayStore } from "@sincpro/mobile-ui/Dialog/overlay.store";
import { OverlayHost } from "@sincpro/mobile-ui/Dialog/OverlayHost";
import { sheetGeometry } from "@sincpro/mobile-ui/Dialog/SheetSurface";
import { act, fireEvent, render, screen } from "@testing-library/react-native";
import { BackHandler, Dimensions, StyleSheet, Text } from "react-native";

jest.unmock("@sincpro/mobile-ui/Dialog/SheetSurface");
jest.mock("react-native-safe-area-context", () => ({
  useSafeAreaInsets: () => ({ top: 0, bottom: 0, left: 0, right: 0 }),
}));

const addBackListener = jest.spyOn(BackHandler, "addEventListener");
const hidden = { includeHiddenElements: true };

function backListeners() {
  return addBackListener.mock.calls.map(([, handler]) => handler as () => boolean);
}

test("without a host the sheet renders in place, so isolated stories and tests still reach it", async () => {
  await render(
    <Sheet onClose={jest.fn()} testID="filters" title="Filtros" visible>
      <Text>Contenido</Text>
    </Sheet>,
  );
  expect(screen.getByText("Contenido")).toBeTruthy();
  expect(screen.getByTestId("filters").props.accessibilityViewIsModal).toBe(true);
});

test("the host draws the sheet above the screen and hides the screen from accessibility", async () => {
  await render(
    <OverlayHost>
      <Text testID="screen">Pantalla</Text>
      <Sheet onClose={jest.fn()} title="Filtros" visible>
        <Text>Contenido</Text>
      </Sheet>
    </OverlayHost>,
  );
  expect(screen.getByText("Contenido", hidden)).toBeTruthy();
  const screenLayer = screen.getByTestId("screen", hidden).parent;
  expect(screenLayer?.props.importantForAccessibility).toBe("no-hide-descendants");
});

test("a closed sheet mounts nothing: no window, no backdrop, no touch target", async () => {
  await render(
    <OverlayHost>
      <Text>Pantalla</Text>
      <Sheet onClose={jest.fn()} testID="filters" title="Filtros" visible={false}>
        <Text>Contenido</Text>
      </Sheet>
    </OverlayHost>,
  );
  expect(screen.queryByTestId("filters")).toBeNull();
  expect(screen.queryByTestId("filters-backdrop", hidden)).toBeNull();
});

test("backdrop asks to close; closing unmounts and runs onClosed once", async () => {
  const onClose = jest.fn();
  const onClosed = jest.fn();
  const view = (visible: boolean) => (
    <OverlayHost>
      <Sheet
        onClose={onClose}
        onClosed={onClosed}
        testID="filters"
        title="Filtros"
        visible={visible}
      >
        <Text>Contenido</Text>
      </Sheet>
    </OverlayHost>
  );
  jest.useFakeTimers();
  const { rerender } = await render(view(true));
  await fireEvent.press(screen.getByTestId("filters-backdrop", hidden));
  expect(onClose).toHaveBeenCalledTimes(1);
  await rerender(view(false));
  expect(screen.getByTestId("filters", hidden).parent?.props.pointerEvents).toBe("none");
  expect(onClosed).not.toHaveBeenCalled();
  await act(async () => {
    jest.advanceTimersByTime(300);
  });
  expect(screen.queryByTestId("filters", hidden)).toBeNull();
  expect(onClosed).toHaveBeenCalledTimes(1);
  jest.useRealTimers();
});

test("a non-dismissible sheet ignores the backdrop and consumes Android back", async () => {
  const onClose = jest.fn();
  await render(
    <OverlayHost>
      <Sheet dismissible={false} onClose={onClose} testID="saving" title="Guardando" visible>
        <Text>Guardando…</Text>
      </Sheet>
    </OverlayHost>,
  );
  await fireEvent.press(screen.getByTestId("saving-backdrop", hidden));
  const handlers = backListeners();
  expect(handlers.length).toBeGreaterThan(0);
  let consumed = false;
  await act(async () => {
    consumed = handlers[handlers.length - 1]();
  });
  expect(consumed).toBe(true);
  expect(onClose).not.toHaveBeenCalled();
});

test("Android back closes the topmost dismissible sheet", async () => {
  const onClose = jest.fn();
  await render(
    <OverlayHost>
      <Sheet onClose={onClose} title="Filtros" visible>
        <Text>Contenido</Text>
      </Sheet>
    </OverlayHost>,
  );
  const handlers = backListeners();
  await act(async () => {
    handlers[handlers.length - 1]();
  });
  expect(onClose).toHaveBeenCalledTimes(1);
});

test("toasts always draw above sheets, even when a sheet opens later", () => {
  const detach = overlayStore.attachHost();
  overlayStore.upsert({ key: "toasts", layer: "toast", element: null });
  overlayStore.upsert({ key: "filters", layer: "sheet", element: null });
  overlayStore.upsert({ key: "date", layer: "sheet", element: null });
  expect(overlayStore.entries().map((entry) => entry.key)).toEqual([
    "filters",
    "date",
    "toasts",
  ]);
  for (const key of ["toasts", "filters", "date"]) overlayStore.remove(key);
  detach();
  expect(overlayStore.entries()).toEqual([]);
  expect(overlayStore.hasHost()).toBe(false);
});

test("the footer rises by the resting offset so it stays on screen at the lower snap point", async () => {
  await render(
    <Sheet
      footer={<Text>Aplicar</Text>}
      onClose={jest.fn()}
      snapPoints={["50%", "90%"]}
      title="Filtros"
      visible
    >
      <Text>Contenido</Text>
    </Sheet>,
  );
  const { height } = Dimensions.get("window");
  // The panel is 90% tall and rests showing 50%: the footer moves up the other 40%.
  let pinned: ReturnType<typeof screen.getByText> | null = screen.getByText("Aplicar");
  while (pinned && !StyleSheet.flatten(pinned.props.style)?.transform) pinned = pinned.parent;
  const [{ translateY }] = StyleSheet.flatten(pinned?.props.style).transform as [
    { translateY: number },
  ];
  expect(translateY).toBeCloseTo(-height * 0.4);
});

test("scroll content gets the hidden part of the panel as room at its end", async () => {
  await render(
    <Sheet onClose={jest.fn()} snapPoints={["50%", "90%"]} title="Opciones" visible>
      <Text>Última opción</Text>
    </Sheet>,
  );
  const { height } = Dimensions.get("window");
  let scroll: ReturnType<typeof screen.getByText> | null = screen.getByText("Última opción");
  while (scroll && !scroll.props.contentContainerStyle) scroll = scroll.parent;
  // Resting at 50% of a 90% panel leaves 40% below the screen; the last row can reach view.
  expect(
    StyleSheet.flatten(scroll?.props.contentContainerStyle).paddingBottom,
  ).toBeCloseTo(16 + height * 0.4);
});

test("an overlay without a host warns once in development, never in tests", async () => {
  const warn = jest.spyOn(console, "warn").mockImplementation(() => {});
  await render(
    <Sheet onClose={jest.fn()} title="Filtros" visible>
      <Text>Contenido</Text>
    </Sheet>,
  );
  await act(async () => {
    await new Promise((resolve) => setTimeout(resolve, 5));
  });
  expect(warn).not.toHaveBeenCalledWith(expect.stringContaining("OverlayHost"));
  warn.mockRestore();
});

test("the panel stays below the status bar even when the host is shorter than the window", () => {
  // iPhone: 874 tall window, 62 top inset, host ending 50 above the bottom (tab or storybook bar).
  const host = 824;
  const inset = 62;
  const { panelHeight, restOffset } = sheetGeometry(["60%", "90%"], host, inset);
  expect(host - panelHeight).toBeGreaterThanOrEqual(inset);
  // Sizing against the window instead (874) put the panel top at 38, under the island.
  expect(host - sheetGeometry(["60%", "90%"], 874, inset).panelHeight).toBeLessThan(inset);
  expect(restOffset).toBeCloseTo(host * 0.9 - host * 0.6);
});
