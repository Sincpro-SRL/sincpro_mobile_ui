import "@shopify/flash-list/jestSetup";

import type BottomSheet from "@expo/ui/community/bottom-sheet";
import { expect, jest, test } from "@jest/globals";
import { ConfirmationProvider } from "@sincpro/mobile-ui/Dialog/Confirmation.context";
import {
  DEFAULT_DARK_THEME,
  DEFAULT_THEME,
  getActiveTheme,
  setActiveTheme,
} from "@sincpro/mobile-ui/theme";
import type { TimezoneLocale } from "@sincpro/mobile-ui/utils/timezone";
import { TimeZoneSelectorModal } from "@sincpro/mobile-ui/widgets/TimeZoneSelectorModal";
import { act, fireEvent, render, screen } from "@testing-library/react-native";
import type { ComponentProps } from "react";
import { StyleSheet } from "react-native";

jest.mock("@sincpro/mobile-ui/Display/Display.Icon", () => () => null);
jest.mock("@expo/ui/community/bottom-sheet", () => {
  const mockReact = jest.requireActual<typeof import("react")>("react");
  const { View } = jest.requireActual<typeof import("react-native")>("react-native");
  return {
    __esModule: true,
    default: ({
      children,
      index,
      onClose,
      snapPoints,
      enablePanDownToClose,
      backgroundStyle,
    }: ComponentProps<typeof BottomSheet>) =>
      mockReact.createElement(
        View,
        {
          testID: "native-sheet",
          ...{ index, onClose, snapPoints, enablePanDownToClose, backgroundStyle },
        },
        children,
      ),
    BottomSheetView: View,
  };
});

function timezoneSelector(props: ComponentProps<typeof TimeZoneSelectorModal>) {
  return (
    <ConfirmationProvider>
      <TimeZoneSelectorModal {...props} />
    </ConfirmationProvider>
  );
}

function getScrollOwners() {
  return screen.root?.queryAll((node) => node.type.endsWith("ScrollView")) ?? [];
}

test("timezone selection uses the canonical native sheet with one virtualized scroll owner", async () => {
  await render(
    timezoneSelector({
      visible: true,
      currentTimezone: "America/La_Paz",
      onClose: jest.fn(),
      onSelect: jest.fn(),
    }),
  );
  const nativeSheet = screen.getByTestId("native-sheet");
  expect(nativeSheet.props.index).toBe(0);
  expect(nativeSheet.props.snapPoints).toEqual(["90%"]);
  expect(nativeSheet.props.enablePanDownToClose).toBe(true);
  expect(screen.getByRole("header", { name: "Zona Horaria" })).toBeTruthy();
  expect(getScrollOwners()).toHaveLength(1);
  expect(screen.getAllByRole("radio")).toHaveLength(7);
  const props = screen.getByTestId("timezone-list").props;
  expect(props.keyboardShouldPersistTaps).toBe("handled");
  expect(props.keyboardDismissMode).toBe("on-drag");
  expect(props.scrollEnabled).not.toBe(false);
  expect(screen.getByTestId("timezone-America/La_Paz")).toBeTruthy();
  expect(
    screen.getByRole("radio", { name: "La Paz" }).props.accessibilityState,
  ).toMatchObject({
    checked: true,
    selected: true,
  });
  expect(
    screen.getByRole("radio", { name: "Costa Rica" }).props.accessibilityState.checked,
  ).toBe(false);
});

test("search normalizes accents and whitespace without losing the selected timezone", async () => {
  await render(
    timezoneSelector({
      visible: true,
      currentTimezone: "America/La_Paz",
      onClose: jest.fn(),
      onSelect: jest.fn(),
    }),
  );
  const search = screen.getByLabelText("Buscar zona horaria");
  await fireEvent.changeText(search, " ÁrGéntina ");
  expect(screen.getAllByRole("radio")).toHaveLength(1);
  expect(screen.getByRole("radio", { name: "Argentina/Buenos Aires" })).toBeTruthy();
  expect(screen.getByRole("button", { name: "Confirmar" })).toBeTruthy();
  await fireEvent.changeText(search, "");
  expect(screen.getAllByRole("radio")).toHaveLength(7);
  expect(screen.getByRole("radio", { name: "La Paz" }).props.accessibilityState.checked).toBe(
    true,
  );
});

test("empty search results remain inside FlashList and recover on the next query", async () => {
  await render(timezoneSelector({ visible: true, onClose: jest.fn(), onSelect: jest.fn() }));
  expect(screen.queryByRole("button", { name: "Confirmar" })).toBeNull();
  const search = screen.getByLabelText("Buscar zona horaria");
  await fireEvent.changeText(search, "unsupported-timezone");
  expect(screen.getByText("No se encontraron zonas horarias")).toBeTruthy();
  expect(screen.queryAllByRole("radio")).toHaveLength(0);
  expect(getScrollOwners()).toHaveLength(1);
  await fireEvent.changeText(search, "America/New_York");
  expect(screen.getByRole("radio", { name: "New York" })).toBeTruthy();
  expect(screen.queryByText("No se encontraron zonas horarias")).toBeNull();
});

test("selection stays a draft until confirmation, even if search hides the selected row", async () => {
  const onSelect = jest.fn<(timezone: TimezoneLocale) => void>();
  const onClose = jest.fn<() => void>();
  await render(
    timezoneSelector({
      visible: true,
      currentTimezone: "America/La_Paz",
      onClose,
      onSelect,
    }),
  );
  await fireEvent.press(screen.getByRole("radio", { name: "Guatemala" }));
  expect(
    screen.getByRole("radio", { name: "Guatemala" }).props.accessibilityState.checked,
  ).toBe(true);
  expect(onSelect).not.toHaveBeenCalled();
  expect(onClose).not.toHaveBeenCalled();
  await fireEvent.changeText(screen.getByLabelText("Buscar zona horaria"), "no-match");
  await fireEvent.press(screen.getByRole("button", { name: "Confirmar" }));
  expect(onSelect).toHaveBeenCalledTimes(1);
  expect(onSelect).toHaveBeenCalledWith({
    timezone: "America/Guatemala",
    locale: "es-GT",
  });
  expect(onClose).toHaveBeenCalledTimes(1);
  expect(onSelect.mock.invocationCallOrder[0]).toBeLessThan(
    onClose.mock.invocationCallOrder[0],
  );
});

test.each(["Cancelar", "Cerrar", "native", "escape"])(
  "%s dismisses without selecting a timezone",
  async (dismissal) => {
    const onSelect = jest.fn();
    const onClose = jest.fn();
    await render(
      timezoneSelector({
        visible: true,
        currentTimezone: "America/La_Paz",
        onClose,
        onSelect,
      }),
    );
    await fireEvent.press(screen.getByRole("radio", { name: "New York" }));
    if (dismissal === "native") {
      await fireEvent(screen.getByTestId("native-sheet"), "onClose");
    } else if (dismissal === "escape") {
      await fireEvent(screen.getByTestId("timezone-sheet"), "onAccessibilityEscape");
    } else {
      await fireEvent.press(screen.getByRole("button", { name: dismissal }));
    }
    expect(onClose).toHaveBeenCalledTimes(1);
    expect(onSelect).not.toHaveBeenCalled();
  },
);

test("closing through visible unmounts the sheet without a dismissal callback", async () => {
  const onClose = jest.fn();
  const onSelect = jest.fn();
  const { rerender } = await render(timezoneSelector({ visible: true, onClose, onSelect }));
  await rerender(timezoneSelector({ visible: false, onClose, onSelect }));
  expect(screen.queryByTestId("native-sheet")).toBeNull();
  expect(onClose).not.toHaveBeenCalled();
  expect(onSelect).not.toHaveBeenCalled();
});

test("sheet surfaces, selected rows and search text react to a live dark theme", async () => {
  const previousTheme = { ...getActiveTheme() };
  try {
    await act(() => setActiveTheme(DEFAULT_THEME));
    await render(
      timezoneSelector({
        visible: true,
        currentTimezone: "America/La_Paz",
        onClose: jest.fn(),
        onSelect: jest.fn(),
      }),
    );
    await act(() => setActiveTheme(DEFAULT_DARK_THEME));
    expect(screen.getByTestId("native-sheet").props.backgroundStyle).toMatchObject({
      backgroundColor: DEFAULT_DARK_THEME.bg.card,
    });
    expect(
      StyleSheet.flatten(screen.getByRole("radio", { name: "La Paz" }).props.style),
    ).toMatchObject({ backgroundColor: DEFAULT_DARK_THEME.container.info });
    expect(
      StyleSheet.flatten(screen.getByRole("radio", { name: "Costa Rica" }).props.style),
    ).toMatchObject({ backgroundColor: DEFAULT_DARK_THEME.bg.card });
    const search = screen.getByLabelText("Buscar zona horaria");
    expect(StyleSheet.flatten(search.props.style).color).toBe(
      DEFAULT_DARK_THEME.text.primary,
    );
    expect(search.props.placeholderTextColor).toBe(DEFAULT_DARK_THEME.text.tertiary);
  } finally {
    await act(() => setActiveTheme(previousTheme));
  }
});
