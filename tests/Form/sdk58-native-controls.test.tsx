import "@shopify/flash-list/jestSetup";

import type { PickerItemProps, PickerProps } from "@expo/ui";
import type { DateTimePickerProps } from "@expo/ui/community/datetime-picker";
import type { MenuComponentProps } from "@expo/ui/community/menu";
import type { SegmentedControlProps } from "@expo/ui/community/segmented-control";
import type { SliderProps } from "@expo/ui/community/slider";
import { afterEach, expect, jest, test } from "@jest/globals";
import { Actions } from "@sincpro/mobile-ui/Actions";
import Dock from "@sincpro/mobile-ui/Actions/Actions.Dock";
import {
  ConfirmationProvider,
  useConfirmationContext,
} from "@sincpro/mobile-ui/Dialog/Confirmation.context";
import ActionSheet from "@sincpro/mobile-ui/Dialog/Dialog.ActionSheet";
import Confirmation from "@sincpro/mobile-ui/Dialog/Dialog.Confirmation";
import EditValue from "@sincpro/mobile-ui/Dialog/Dialog.EditValue";
import { requestConfirmation } from "@sincpro/mobile-ui/Dialog/requestConfirmation";
import ControlledDropdown from "@sincpro/mobile-ui/Form/Form.ControlledDropdown";
import DatePicker from "@sincpro/mobile-ui/Form/Form.DatePicker";
import Dropdown from "@sincpro/mobile-ui/Form/Form.Dropdown";
import Select from "@sincpro/mobile-ui/Form/Form.Select";
import Slider from "@sincpro/mobile-ui/Form/Form.Slider";
import Menu from "@sincpro/mobile-ui/Navigation/Navigation.Menu";
import SegmentedControl from "@sincpro/mobile-ui/Navigation/Navigation.SegmentedControl";
import Pressable from "@sincpro/mobile-ui/primitives/Pressable";
import { DEFAULT_DARK_THEME, getActiveTheme, setActiveTheme } from "@sincpro/mobile-ui/theme";
import type { CollectionQuery } from "@sincpro/mobile-ui/utils/criteria";
import CollectionOptions from "@sincpro/mobile-ui/widgets/CollectionOptions";
import {
  act,
  fireEvent,
  render as renderComponent,
  screen,
  waitFor,
} from "@testing-library/react-native";
import { type ReactElement, type ReactNode, useState } from "react";
import { useForm } from "react-hook-form";
import { Alert, Platform, Text, View } from "react-native";

jest.mock("@sincpro/mobile-ui/Display/Display.Icon", () => () => null);
jest.mock("expo-symbols", () => ({
  unstable_getMaterialSymbolSourceAsync: async (symbol: string) => ({
    uri: `material://${symbol}`,
  }),
}));
jest.mock("react-native-safe-area-context", () => ({
  useSafeAreaInsets: () => ({ top: 24, bottom: 16, left: 0, right: 0 }),
}));
jest.mock("react-native-keyboard-controller", () => {
  const mockReact = jest.requireActual<typeof import("react")>("react");
  const { View } = jest.requireActual<typeof import("react-native")>("react-native");
  return {
    KeyboardStickyView: (props: { children?: ReactNode }) =>
      mockReact.createElement(View, props),
  };
});
jest.mock("@sincpro/mobile-ui/Form/Form.KeyboardForm", () => {
  const mockReact = jest.requireActual<typeof import("react")>("react");
  const { View } = jest.requireActual<typeof import("react-native")>("react-native");
  return ({ children }: { children: ReactNode }) =>
    mockReact.createElement(View, { style: { flex: 1 } }, children);
});
jest.mock("@sincpro/mobile-ui/widgets/FilterBuilder", () => () => null);
jest.mock("@sincpro/mobile-ui/widgets/QueryChoice", () => () => null);
jest.mock("@expo/ui/community/bottom-sheet", () => {
  const mockReact = jest.requireActual<typeof import("react")>("react");
  const { View } = jest.requireActual<typeof import("react-native")>("react-native");
  return {
    __esModule: true,
    default: ({
      children,
      index,
      onClose,
      enablePanDownToClose,
    }: {
      children: ReactNode;
      index: number;
      onClose: () => void;
      enablePanDownToClose: boolean;
    }) => {
      const props = { testID: "native-sheet", index, onClose, enablePanDownToClose };
      return mockReact.createElement(View, props, index >= 0 ? children : null);
    },
    BottomSheetView: View,
  };
});
jest.mock("@expo/ui", () => {
  const mockReact = jest.requireActual<typeof import("react")>("react");
  const { Text, View } = jest.requireActual<typeof import("react-native")>("react-native");
  const picker = ({
    children,
    testID,
    selectedValue,
    onValueChange,
    enabled,
  }: PickerProps<string>) => {
    const props = {
      testID: testID ?? "native-picker",
      selectedValue,
      onValueChange,
      enabled,
    };
    return mockReact.createElement(View, props, children);
  };
  return {
    Host: (props: { children: ReactNode }) =>
      mockReact.createElement(View, { ...props, testID: "picker-host" }),
    Picker: Object.assign(picker, {
      Item: ({ label }: PickerItemProps<string>) => mockReact.createElement(Text, {}, label),
    }),
  };
});
jest.mock("@expo/ui/community/datetime-picker", () => {
  const mockReact = jest.requireActual<typeof import("react")>("react");
  const { View } = jest.requireActual<typeof import("react-native")>("react-native");
  return {
    __esModule: true,
    default: (props: DateTimePickerProps) => mockReact.createElement(View, props),
  };
});
jest.mock("@expo/ui/community/slider", () => {
  const mockReact = jest.requireActual<typeof import("react")>("react");
  const { View } = jest.requireActual<typeof import("react-native")>("react-native");
  return {
    __esModule: true,
    default: (props: SliderProps) => mockReact.createElement(View, props),
  };
});
jest.mock("@expo/ui/community/segmented-control", () => {
  const mockReact = jest.requireActual<typeof import("react")>("react");
  const { View } = jest.requireActual<typeof import("react-native")>("react-native");
  return {
    __esModule: true,
    default: (props: SegmentedControlProps) => mockReact.createElement(View, props),
  };
});
jest.mock("@expo/ui/community/menu", () => {
  const mockReact = jest.requireActual<typeof import("react")>("react");
  const { View } = jest.requireActual<typeof import("react-native")>("react-native");
  return {
    MenuView: ({ children, ...props }: MenuComponentProps) =>
      mockReact.createElement(View, props, children),
  };
});

afterEach(() => {
  jest.restoreAllMocks();
});

function render(component: ReactElement) {
  return renderComponent(component, { wrapper: ConfirmationProvider });
}

test("select applies the tapped numeric original and closing changes nothing", async () => {
  const change = jest.fn<(value: number) => void>();
  await render(
    <Select
      label="Cantidad"
      onChange={change}
      options={[
        { label: "Diez", value: 10 },
        { label: "Veinte", value: 20 },
      ]}
      testID="quantity"
      value={10}
    />,
  );
  await fireEvent.press(screen.getByRole("button", { name: "Cantidad: Diez" }));
  expect(screen.getByRole("radio", { name: "Diez" }).props.accessibilityState).toMatchObject({
    selected: true,
  });
  await fireEvent.press(screen.getByRole("button", { name: "Cerrar" }));
  expect(change).not.toHaveBeenCalled();
  await fireEvent.press(screen.getByRole("button", { name: "Cantidad: Diez" }));
  await fireEvent.press(screen.getByRole("radio", { name: "Veinte" }));
  await waitFor(() => expect(change).toHaveBeenCalledWith(20));
  expect(screen.queryByTestId("native-sheet")).toBeNull();
});

test("select is the same list on Android and iOS: every option is readable whole", async () => {
  const long = "Notificación en el teléfono para avisos importantes y recordatorios";
  for (const os of ["ios", "android"] as const) {
    jest.replaceProperty(Platform, "OS", os);
    const { unmount } = await render(
      <Select
        label="Canal"
        onChange={jest.fn<(value: string) => void>()}
        options={[{ label: long, value: "push" }]}
        value={null}
      />,
    );
    await fireEvent.press(screen.getByRole("button", { name: "Canal: Seleccionar…" }));
    expect(screen.getByRole("radio", { name: long })).toBeTruthy();
    expect(screen.queryByTestId("native-picker")).toBeNull();
    await unmount();
  }
});

test("select failure keeps the sheet and the choice; read-only and empty cannot commit", async () => {
  const change = jest
    .fn<() => Promise<void>>()
    .mockRejectedValueOnce(new Error("Sin conexión"))
    .mockResolvedValueOnce();
  const props = {
    label: "Estado",
    options: [{ label: "Activo", value: "active" }],
    value: null,
    onChange: change,
  };
  const { rerender } = await render(<Select {...props} />);
  await fireEvent.press(screen.getByRole("button", { name: "Estado: Seleccionar…" }));
  await fireEvent.press(screen.getByRole("radio", { name: "Activo" }));
  await waitFor(() => expect(screen.getByText("Sin conexión")).toBeTruthy());
  expect(screen.getByRole("radio", { name: "Activo" }).props.accessibilityState).toMatchObject({
    selected: true,
  });
  await fireEvent.press(screen.getByRole("radio", { name: "Activo" }));
  await waitFor(() => expect(change).toHaveBeenCalledTimes(2));
  await rerender(<Select {...props} readOnly />);
  await fireEvent.press(screen.getByRole("button", { name: "Estado: Seleccionar…" }));
  expect(screen.queryByTestId("native-sheet")).toBeNull();
  await rerender(<Select {...props} options={[]} />);
  await fireEvent.press(screen.getByRole("button", { name: "Estado: Seleccionar…" }));
  expect(screen.getByText("No hay opciones disponibles.")).toBeTruthy();
});

test("select ignores other taps while the chosen option is being saved", async () => {
  let release: () => void = () => {};
  const task = new Promise<void>((resolve) => {
    release = resolve;
  });
  const change = jest.fn<(value: number) => Promise<void>>(() => task);
  await render(
    <Select
      label="Cantidad"
      onChange={change}
      options={[
        { label: "Diez", value: 10 },
        { label: "Veinte", value: 20 },
      ]}
      value={10}
    />,
  );
  await fireEvent.press(screen.getByRole("button", { name: "Cantidad: Diez" }));
  await fireEvent.press(screen.getByRole("radio", { name: "Veinte" }));
  await fireEvent.press(screen.getByRole("radio", { name: "Diez" }));
  expect(change).toHaveBeenCalledTimes(1);
  expect(change).toHaveBeenCalledWith(20);
  await act(async () => release());
  expect(screen.queryByTestId("native-sheet")).toBeNull();
});

test("ControlledDropdown is a real react-hook-form selection field", async () => {
  function Form() {
    const { control, watch } = useForm({ defaultValues: { status: "pending" } });
    return (
      <>
        <ControlledDropdown
          control={control}
          label="Estado"
          name="status"
          options={[
            { label: "Pendiente", value: "pending" },
            { label: "Activo", value: "active" },
          ]}
        />
        <Text testID="form-value">{watch("status")}</Text>
      </>
    );
  }
  await render(<Form />);
  await fireEvent.press(screen.getByRole("button", { name: "Estado: Pendiente" }));
  await fireEvent.press(screen.getByRole("radio", { name: "Activo" }));
  await waitFor(() => expect(screen.getByTestId("form-value").props.children).toBe("active"));
});

test("dropdown rich options respect disabled state and preserve failed async actions", async () => {
  const choose = jest
    .fn<() => Promise<void>>()
    .mockRejectedValueOnce(new Error("Reintentar"))
    .mockResolvedValueOnce();
  const blocked = jest.fn<() => void>();
  await render(
    <Dropdown
      options={[
        { id: "choose", title: "Guardar", onPress: choose },
        { id: "blocked", title: "Bloqueado", disabled: true, onPress: blocked },
      ]}
      renderOption={(option) => <Text>{`Opción ${option.title}`}</Text>}
      title="Acciones"
    />,
  );
  await fireEvent.press(screen.getByRole("button", { name: "Acciones" }));
  expect(screen.getByText("Opción Guardar")).toBeTruthy();
  await fireEvent.press(screen.getByRole("button", { name: "Bloqueado" }));
  expect(blocked).not.toHaveBeenCalled();
  await fireEvent.press(screen.getByRole("button", { name: "Guardar" }));
  await waitFor(() => expect(screen.getByText("Reintentar")).toBeTruthy());
  expect(screen.getByTestId("native-sheet").props.index).toBe(0);
  await fireEvent.press(screen.getByRole("button", { name: "Guardar" }));
  await waitFor(() => expect(screen.queryByTestId("native-sheet")).toBeNull());
});

test("action sheet waits for a successful action and disables duplicate and cancel requests", async () => {
  let release: (value: void) => void = () => {
    throw new Error("Not initialized");
  };
  const request = new Promise<void>((resolve) => {
    release = resolve;
  });
  const choose = jest.fn<() => Promise<void>>(() => request);
  const close = jest.fn();
  await render(
    <ActionSheet actions={[{ label: "Guardar", onPress: choose }]} onClose={close} visible />,
  );
  await fireEvent.press(screen.getByRole("button", { name: "Guardar" }));
  await fireEvent.press(screen.getByRole("button", { name: "Guardar" }));
  await fireEvent.press(screen.getByRole("button", { name: "Cancelar" }));
  expect(screen.getByTestId("native-sheet").props.enablePanDownToClose).toBe(false);
  expect(choose).toHaveBeenCalledTimes(1);
  expect(close).not.toHaveBeenCalled();
  await act(() => release());
  await waitFor(() => expect(close).toHaveBeenCalledTimes(1));
});

class PrivateOption {
  #label: string;
  constructor(
    readonly key: string,
    readonly value: string,
    label: string,
  ) {
    this.#label = label;
  }
  get label() {
    return this.#label;
  }
}

test("action sheet marks only the selected row busy when labels are identical", async () => {
  let release: () => void = () => {};
  const task = new Promise<void>((resolve) => {
    release = resolve;
  });
  const save = jest.fn<() => Promise<void>>(() => task);
  const close = jest.fn();
  await render(
    <ActionSheet
      actions={[
        { label: "Guardar", onPress: save },
        { label: "Guardar", onPress: save },
      ]}
      onClose={close}
      visible
    />,
  );
  await fireEvent.press(screen.getAllByRole("button", { name: "Guardar" })[1]);
  const rows = screen.getAllByRole("button", { name: "Guardar" });
  expect(rows[0].props.accessibilityState.busy).toBe(false);
  expect(rows[1].props.accessibilityState.busy).toBe(true);
  await fireEvent.press(rows[0]);
  expect(save).toHaveBeenCalledTimes(1);
  await act(async () => release());
  expect(close).toHaveBeenCalledTimes(1);
});

test("EditValue FlashList v2 receives original private-field rows and cancellation discards drafts", async () => {
  const options = [
    new PrivateOption("one", "1", "Uno"),
    new PrivateOption("two", "2", "Dos"),
  ];
  const save = jest.fn<(value: string) => Promise<void>>().mockResolvedValue();
  const close = jest.fn();
  const props = {
    title: "Cantidad",
    value: "1",
    onConfirm: save,
    onClose: close,
    options,
    autoFocus: false,
  };
  const { rerender } = await render(<EditValue {...props} visible />);
  await waitFor(() => expect(screen.getByRole("radio", { name: "Dos" })).toBeTruthy());
  await fireEvent.press(screen.getByRole("radio", { name: "Dos" }));
  expect(screen.getByLabelText("Cantidad").props.value).toBe("2");
  await fireEvent.press(screen.getByRole("button", { name: "Cancelar" }));
  expect(save).not.toHaveBeenCalled();
  expect(close).toHaveBeenCalledTimes(1);
  await rerender(<EditValue {...props} visible={false} />);
  await rerender(<EditValue {...props} value="3" visible />);
  expect(screen.getByLabelText("Cantidad").props.value).toBe("3");
});

test("EditValue failed saves preserve text and retry dismisses only on success", async () => {
  const save = jest
    .fn<(value: string) => Promise<void>>()
    .mockRejectedValueOnce(new Error("Sin red"))
    .mockResolvedValueOnce();
  const close = jest.fn();
  await render(
    <EditValue
      autoFocus={false}
      onClose={close}
      onConfirm={save}
      title="Importe"
      value="1"
      visible
    />,
  );
  await fireEvent.changeText(screen.getByLabelText("Importe"), "12.50");
  await fireEvent.press(screen.getByRole("button", { name: "Aplicar" }));
  await waitFor(() => expect(screen.getByText("Sin red")).toBeTruthy());
  expect(close).not.toHaveBeenCalled();
  expect(screen.getByLabelText("Importe").props.value).toBe("12.50");
  await fireEvent.press(screen.getByRole("button", { name: "Aplicar" }));
  await waitFor(() => expect(close).toHaveBeenCalledTimes(1));
  expect(save).toHaveBeenLastCalledWith("12.50");
});

test("controlled EditValue increments the currently typed draft and preserves it after a failed save", async () => {
  let rejectSave: (cause: Error) => void = () => {};
  const request = new Promise<void>((_resolve, reject) => {
    rejectSave = reject;
  });
  const save = jest
    .fn<(value: string) => Promise<void>>()
    .mockImplementationOnce(() => request)
    .mockResolvedValueOnce();
  const change = jest.fn<(value: string) => void>();
  const close = jest.fn();
  function Example() {
    const [visible, setVisible] = useState(true);
    const [draft, setDraft] = useState("1");
    return (
      <EditValue
        autoFocus={false}
        footerAdornment={
          <View testID="increments">
            <Actions.Button
              onPress={() => setDraft((current) => String(Number(current) + 0.5))}
              title="Sumar medio"
            />
            <Actions.Button
              onPress={() => setDraft((current) => String(Number(current) + 1))}
              title="Sumar uno"
            />
          </View>
        }
        keyboardType="numeric"
        onChange={(next) => {
          change(next);
          setDraft(next);
        }}
        onClose={() => {
          close();
          setVisible(false);
        }}
        onConfirm={save}
        options={[{ key: "four", label: "Cuatro", value: "4" }]}
        rightAdornment={<Text>kg</Text>}
        title="Cantidad"
        value={draft}
        visible={visible}
      />
    );
  }
  await render(<Example />);
  expect(screen.getByLabelText("Cantidad").props.keyboardType).toBe("numeric");
  expect(screen.getByText("kg")).toBeTruthy();
  await fireEvent.changeText(screen.getByLabelText("Cantidad"), "3.25");
  expect(change).toHaveBeenLastCalledWith("3.25");
  await waitFor(() => expect(screen.getByRole("radio", { name: "Cuatro" })).toBeTruthy());
  await fireEvent.press(screen.getByRole("radio", { name: "Cuatro" }));
  expect(change).toHaveBeenLastCalledWith("4");
  await fireEvent.changeText(screen.getByLabelText("Cantidad"), "6.25");
  await fireEvent.press(screen.getByRole("button", { name: "Sumar medio" }));
  await fireEvent.press(screen.getByRole("button", { name: "Sumar uno" }));
  expect(screen.getByLabelText("Cantidad").props.value).toBe("7.75");
  expect(change).toHaveBeenCalledTimes(3);
  expect(save).not.toHaveBeenCalled();
  await fireEvent.press(screen.getByRole("button", { name: "Aplicar" }));
  expect(save).toHaveBeenCalledWith("7.75");
  const increments = screen.getByTestId("increments", { includeHiddenElements: true });
  expect(increments.parent?.props.pointerEvents).toBe("none");
  expect(increments.parent?.props.accessibilityElementsHidden).toBe(true);
  await act(async () => rejectSave(new Error("Sin red")));
  expect(screen.getByText("Sin red")).toBeTruthy();
  expect(screen.getByLabelText("Cantidad").props.value).toBe("7.75");
  expect(close).not.toHaveBeenCalled();
  await fireEvent.press(screen.getByRole("button", { name: "Aplicar" }));
  await waitFor(() => expect(close).toHaveBeenCalledTimes(1));
  expect(save).toHaveBeenLastCalledWith("7.75");
  expect(screen.queryByTestId("native-sheet")).toBeNull();
});

test("EditValue disables editing and cancellation until its save resolves", async () => {
  let release: (value: void) => void = () => {
    throw new Error("Not initialized");
  };
  const request = new Promise<void>((resolve) => {
    release = resolve;
  });
  const save = jest.fn<(value: string) => Promise<void>>(() => request);
  const close = jest.fn();
  await render(
    <EditValue
      autoFocus={false}
      onClose={close}
      onConfirm={save}
      title="Importe"
      value="1"
      visible
    />,
  );
  await fireEvent.press(screen.getByRole("button", { name: "Aplicar" }));
  expect(screen.getByLabelText("Importe").props.editable).toBe(false);
  await fireEvent.press(screen.getByRole("button", { name: "Cancelar" }));
  await fireEvent.press(screen.getByRole("button", { name: "Cerrar" }));
  await fireEvent.press(screen.getByRole("button", { name: "Aplicar" }));
  expect(close).not.toHaveBeenCalled();
  expect(save).toHaveBeenCalledTimes(1);
  await act(() => release());
  await waitFor(() => expect(close).toHaveBeenCalledTimes(1));
});

test("Android datetime confirms in Material dialogs and drops a cancelled time", async () => {
  jest.replaceProperty(Platform, "OS", "android");
  const change = jest.fn<(date: Date) => void>();
  await render(
    <DatePicker
      label="Entrega"
      mode="datetime"
      onChange={change}
      testID="delivery"
      value={new Date(2026, 0, 2, 9, 30)}
    />,
  );
  await fireEvent.press(screen.getByRole("button", { name: "Entrega" }));
  const datePicker = screen.getByTestId("delivery-date-picker");
  expect(datePicker.props.presentation).toBe("dialog");
  expect(datePicker.props.display).toBe("default");
  expect(screen.queryByTestId("native-sheet")).toBeNull();
  const date = new Date(2026, 1, 4, 9, 30);
  await fireEvent(datePicker, "valueChange", {}, date);
  expect(change).not.toHaveBeenCalled();
  await fireEvent(screen.getByTestId("delivery-time-picker"), "dismiss");
  expect(change).not.toHaveBeenCalled();
  await fireEvent.press(screen.getByRole("button", { name: "Entrega" }));
  await fireEvent(screen.getByTestId("delivery-date-picker"), "valueChange", {}, date);
  await fireEvent(
    screen.getByTestId("delivery-time-picker"),
    "valueChange",
    {},
    new Date(2030, 2, 5, 16, 45),
  );
  await waitFor(() => expect(change).toHaveBeenCalledWith(new Date(2026, 1, 4, 16, 45)));
});

test("Android select applies the tapped option and dismissal publishes nothing", async () => {
  jest.replaceProperty(Platform, "OS", "android");
  const change = jest.fn<(value: number) => void>();
  await render(
    <Select
      label="Cantidad"
      onChange={change}
      options={[
        { label: "Diez", value: 10 },
        { label: "Veinte", value: 20 },
      ]}
      value={10}
    />,
  );
  await fireEvent.press(screen.getByRole("button", { name: "Cantidad: Diez" }));
  expect(screen.queryByRole("button", { name: "Aplicar" })).toBeNull();
  expect(screen.queryByTestId("native-picker")).toBeNull();
  await fireEvent.press(screen.getByRole("button", { name: "Cerrar" }));
  expect(change).not.toHaveBeenCalled();
  await fireEvent.press(screen.getByRole("button", { name: "Cantidad: Diez" }));
  await fireEvent.press(screen.getByRole("radio", { name: "Veinte" }));
  await waitFor(() => expect(change).toHaveBeenCalledWith(20));
  expect(screen.queryByTestId("native-sheet")).toBeNull();
});

test("date limits are checked before applying and cancellation does not publish a draft", async () => {
  const change = jest.fn<(value: Date) => void>();
  await render(
    <DatePicker
      label="Entrega"
      maximumDate={new Date(2026, 0, 5)}
      onChange={change}
      testID="delivery"
      value={new Date(2026, 0, 2)}
    />,
  );
  await fireEvent.press(screen.getByRole("button", { name: "Entrega" }));
  await fireEvent(
    screen.getByTestId("delivery-date-picker"),
    "valueChange",
    {},
    new Date(2026, 0, 10),
  );
  await fireEvent.press(screen.getByRole("button", { name: "Aplicar" }));
  expect(
    screen.getByText("Selecciona una fecha y hora dentro del rango permitido."),
  ).toBeTruthy();
  await fireEvent.press(screen.getByRole("button", { name: "Cerrar" }));
  expect(change).not.toHaveBeenCalled();
});

test("date-only bounds compare calendar days rather than rejecting a boundary day's time", async () => {
  const change = jest.fn<(value: Date) => void>();
  await render(
    <DatePicker
      label="Entrega"
      maximumDate={new Date(2026, 0, 5)}
      onChange={change}
      testID="delivery"
      value={new Date(2026, 0, 2, 14, 30)}
    />,
  );
  await fireEvent.press(screen.getByRole("button", { name: "Entrega" }));
  const date = new Date(2026, 0, 5, 14, 30);
  await fireEvent(screen.getByTestId("delivery-date-picker"), "valueChange", {}, date);
  await fireEvent.press(screen.getByRole("button", { name: "Aplicar" }));
  await waitFor(() => expect(change).toHaveBeenCalledWith(date));
});

test("the iOS calendar opens whole at one tall detent; the time wheel keeps the default", async () => {
  jest.replaceProperty(Platform, "OS", "ios");
  const { unmount } = await render(
    <DatePicker
      label="Entrega"
      onChange={jest.fn<(value: Date) => void>()}
      value={new Date(2026, 0, 2)}
    />,
  );
  await fireEvent.press(screen.getByRole("button", { name: "Entrega" }));
  expect(screen.getByTestId("native-sheet").props.snapPoints).toEqual(["90%"]);
  await unmount();
  await render(
    <DatePicker
      label="Hora"
      mode="time"
      onChange={jest.fn<(value: Date) => void>()}
      value={new Date(2026, 0, 2)}
    />,
  );
  await fireEvent.press(screen.getByRole("button", { name: "Hora" }));
  expect(screen.getByTestId("native-sheet").props.snapPoints).toEqual(["60%", "90%"]);
});

test("native slider preserves tokens, ranges, steps and read-only state", async () => {
  const change = jest.fn();
  const { rerender } = await render(
    <Slider
      label="Cantidad"
      max={10}
      min={0}
      onChange={change}
      step={2}
      testID="range"
      value={4}
    />,
  );
  const slider = screen.getByTestId("range-slider");
  expect(slider.props.minimumTrackTintColor).toBe(getActiveTheme().primary);
  expect(slider.props.maximumTrackTintColor).toBe(getActiveTheme().container.primary);
  expect(slider.props.style.minHeight).toBe(48);
  await fireEvent(slider, "valueChange", 5.1);
  expect(change).toHaveBeenCalledWith(6);
  await rerender(<Slider onChange={change} readOnly testID="range" value={4} />);
  expect(screen.getByTestId("range-slider").props.disabled).toBe(true);
  await fireEvent(screen.getByTestId("range-slider"), "valueChange", 50);
  expect(change).toHaveBeenCalledTimes(1);
});

test("native segments map indexes to values and keep disabled options natively disabled", async () => {
  const change = jest.fn();
  const { rerender } = await render(
    <SegmentedControl
      onChange={change}
      options={[
        { label: "Lista", value: "list" },
        { label: "Mapa", value: "map" },
      ]}
      testID="view"
      value="list"
    />,
  );
  expect(screen.getByTestId("view-segments-0").props.values).toEqual(["Lista", "Mapa"]);
  await fireEvent(screen.getByTestId("view-segments-0"), "change", {
    nativeEvent: { selectedSegmentIndex: 1, value: "Mapa" },
  });
  expect(change).toHaveBeenCalledWith("map");
  await rerender(
    <SegmentedControl
      onChange={change}
      options={[
        { label: "Lista", value: "list" },
        { label: "Mapa", value: "map", disabled: true },
      ]}
      testID="view"
      value="list"
    />,
  );
  expect(screen.getByTestId("view-segments-1").props.enabled).toBe(false);
  await fireEvent(screen.getByTestId("view-segments-1"), "change", {
    nativeEvent: { selectedSegmentIndex: 0, value: "Mapa" },
  });
  expect(change).toHaveBeenCalledTimes(1);
});

test("native menu preserves action indexes, separators, disabled flags and Android icons", async () => {
  jest.replaceProperty(Platform, "OS", "android");
  const choose = jest.fn<() => void>();
  const blocked = jest.fn<() => void>();
  await render(
    <Menu
      items={[
        { label: "Editar", icon: "edit", onPress: choose },
        { separator: true },
        { label: "Eliminar", icon: "delete", destructive: true, onPress: choose },
        { label: "Bloqueado", disabled: true, onPress: blocked },
      ]}
      testID="actions"
    />,
  );
  await waitFor(() => {
    const actions = screen.getByTestId("actions-native-menu").props.actions;
    expect(actions[0].subactions[0].image).toEqual({ uri: "material://edit" });
  });
  const actions = screen.getByTestId("actions-native-menu").props.actions;
  expect(actions[1].subactions[0].id).toBe("2");
  expect(actions[1].subactions[0].attributes.destructive).toBe(true);
  await fireEvent(screen.getByTestId("actions-native-menu"), "pressAction", {
    nativeEvent: { event: "3" },
  });
  expect(blocked).not.toHaveBeenCalled();
  await fireEvent(screen.getByTestId("actions-native-menu"), "pressAction", {
    nativeEvent: { event: "2" },
  });
  await waitFor(() => expect(choose).toHaveBeenCalledTimes(1));
});

test("native menu blocks repeated actions and exposes progress until the action resolves", async () => {
  let release: () => void = () => {};
  const task = new Promise<void>((resolve) => {
    release = resolve;
  });
  const save = jest.fn<() => Promise<void>>(() => task);
  const other = jest.fn<() => void>();
  await render(
    <Menu
      items={[
        { label: "Guardar", onPress: save },
        { label: "Otra acción", onPress: other },
      ]}
      testID="actions"
    />,
  );
  await fireEvent(screen.getByTestId("actions-native-menu"), "pressAction", {
    nativeEvent: { event: "0" },
  });
  expect(
    screen.getByRole("button", { name: "Más opciones" }).props.accessibilityState,
  ).toEqual({ disabled: true, busy: true });
  await fireEvent(screen.getByTestId("actions-native-menu"), "pressAction", {
    nativeEvent: { event: "1" },
  });
  expect(save).toHaveBeenCalledTimes(1);
  expect(other).not.toHaveBeenCalled();
  await act(async () => release());
  expect(
    screen.getByRole("button", { name: "Más opciones" }).props.accessibilityState,
  ).toEqual({ disabled: false, busy: false });
});

test("native menu failures are surfaced explicitly instead of rejecting unhandled", async () => {
  const alert = jest.spyOn(Alert, "alert").mockImplementation(() => {});
  await render(
    <Menu
      items={[
        {
          label: "Guardar",
          onPress: async () => {
            throw new Error("Sin red");
          },
        },
      ]}
      testID="actions"
    />,
  );
  await fireEvent(screen.getByTestId("actions-native-menu"), "pressAction", {
    nativeEvent: { event: "0" },
  });
  await waitFor(() =>
    expect(alert).toHaveBeenCalledWith("No se pudo completar la acción", "Sin red"),
  );
});

test("confirmation retains rich content and failed actions, then closes on success", async () => {
  const confirm = jest
    .fn<() => Promise<void>>()
    .mockRejectedValueOnce(new Error("No guardado"))
    .mockResolvedValueOnce();
  const close = jest.fn();
  await render(
    <Confirmation
      confirmText="Guardar"
      onClose={close}
      onConfirm={confirm}
      title="Confirmar"
      visible
    >
      <Text>Detalle</Text>
    </Confirmation>,
  );
  expect(screen.getByText("Detalle")).toBeTruthy();
  await fireEvent.press(screen.getByRole("button", { name: "Guardar" }));
  await waitFor(() => expect(screen.getByText("No guardado")).toBeTruthy());
  expect(close).not.toHaveBeenCalled();
  await fireEvent.press(screen.getByRole("button", { name: "Guardar" }));
  await waitFor(() => expect(close).toHaveBeenCalledTimes(1));
});

test("confirmation provider uses the canonical sheet and cancellation never confirms", async () => {
  const confirm = jest.fn<() => void>();
  function Trigger() {
    const { show } = useConfirmationContext();
    return (
      <Pressable
        accessibilityLabel="Abrir"
        accessibilityRole="button"
        onPress={() => show({ title: "Continuar", onConfirm: confirm })}
      >
        <Text>Abrir</Text>
      </Pressable>
    );
  }
  await render(
    <ConfirmationProvider>
      <Trigger />
    </ConfirmationProvider>,
  );
  await fireEvent.press(screen.getByRole("button", { name: "Abrir" }));
  await fireEvent.press(screen.getByRole("button", { name: "Cancelar" }));
  expect(confirm).not.toHaveBeenCalled();
  expect(screen.queryByTestId("native-sheet")).toBeNull();
});

test("rich confirmation defaults stay generic when optional fields are explicitly undefined", async () => {
  const confirm = jest.fn<() => void>();
  function Trigger() {
    const { show } = useConfirmationContext();
    return (
      <Pressable
        accessibilityLabel="Abrir"
        accessibilityRole="button"
        onPress={() =>
          show({
            onConfirm: confirm,
            title: undefined,
            message: undefined,
            confirmText: undefined,
            cancelText: undefined,
            destructive: undefined,
          })
        }
      >
        <Text>Abrir</Text>
      </Pressable>
    );
  }
  await render(
    <ConfirmationProvider>
      <Trigger />
    </ConfirmationProvider>,
  );
  await fireEvent.press(screen.getByRole("button", { name: "Abrir" }));
  expect(screen.getByText("Confirmación")).toBeTruthy();
  expect(screen.getByText("¿Estás seguro de que quieres continuar?")).toBeTruthy();
  expect(screen.getByRole("button", { name: "Confirmar" })).toBeTruthy();
  await fireEvent.press(screen.getByRole("button", { name: "Cancelar" }));
  expect(confirm).not.toHaveBeenCalled();
});

test("missing confirmation providers fail explicitly instead of returning no-op actions", async () => {
  jest.spyOn(console, "error").mockImplementation(() => {});
  function MissingProvider() {
    useConfirmationContext();
    return null;
  }
  await expect(renderComponent(<MissingProvider />)).rejects.toThrow(
    "useConfirmationContext requires ConfirmationProvider.",
  );
});

test("ordinary action confirmation uses native Alert without mounting a provider", async () => {
  const alert = jest.spyOn(Alert, "alert").mockImplementation(() => {});
  const choice = requestConfirmation({
    title: "Eliminar",
    message: "¿Eliminar el registro?",
    confirmText: "Eliminar",
    cancelText: "Volver",
    destructive: true,
  });
  const [, , buttons] = alert.mock.calls[0];
  expect(buttons?.[0].text).toBe("Volver");
  expect(buttons?.[1].style).toBe("destructive");
  buttons?.[1].onPress?.();
  await expect(choice).resolves.toBe(true);
});

test("native confirmation Cancel resolves false and never runs a domain action", async () => {
  const alert = jest.spyOn(Alert, "alert").mockImplementation(() => {});
  const choice = requestConfirmation();
  alert.mock.calls[0][2]?.[0].onPress?.();
  await expect(choice).resolves.toBe(false);
});

test("native Android Back or outside dismissal resolves confirmation as cancelled", async () => {
  const alert = jest.spyOn(Alert, "alert").mockImplementation(() => {});
  const choice = requestConfirmation();
  expect(alert.mock.calls[0][3]?.cancelable).toBe(true);
  alert.mock.calls[0][3]?.onDismiss?.();
  await expect(choice).resolves.toBe(false);
});

test("Dock uses the canonical sheet, keeps one primary action and honors controlled expansion", async () => {
  function Example() {
    const [expanded, setExpanded] = useState(false);
    return (
      <Dock
        expanded={expanded}
        onExpandedChange={setExpanded}
        primaryAction={<Text>Guardar</Text>}
        testID="dock"
      >
        <Text>Detalle</Text>
      </Dock>
    );
  }
  await render(<Example />);
  expect(screen.getAllByText("Guardar")).toHaveLength(1);
  await fireEvent.press(screen.getByRole("button", { name: "Más opciones" }));
  expect(screen.getByTestId("native-sheet").props.index).toBe(0);
  expect(screen.getAllByText("Guardar")).toHaveLength(1);
  expect(screen.getByText("Detalle")).toBeTruthy();
  await fireEvent(screen.getByTestId("native-sheet"), "close");
  expect(screen.queryByTestId("native-sheet")).toBeNull();
  expect(screen.getAllByText("Guardar")).toHaveLength(1);
});

test("non-dismissible Dock blocks both native dismissal and its expanded collapse action", async () => {
  const change = jest.fn();
  await render(
    <Dock
      defaultExpanded
      dismissible={false}
      onExpandedChange={change}
      primaryAction={<Text>Guardar</Text>}
    >
      <Text>Detalle</Text>
    </Dock>,
  );
  expect(
    screen.getByRole("button", { name: "Ocultar opciones" }).props.accessibilityState
      .disabled,
  ).toBe(true);
  await fireEvent.press(screen.getByRole("button", { name: "Ocultar opciones" }));
  await fireEvent(screen.getByTestId("native-sheet"), "close");
  expect(change).not.toHaveBeenCalled();
  expect(screen.getByTestId("native-sheet").props.index).toBe(0);
});

test("CollectionOptions keeps failed Apply drafts and closes only after applying successfully", async () => {
  const query: CollectionQuery = {
    search: "original",
    filter: { kind: "group", join: "all", children: [] },
    sort: [],
    groupBy: [],
  };
  const apply = jest
    .fn<(value: CollectionQuery) => Promise<void>>()
    .mockRejectedValueOnce(new Error("No guardado"))
    .mockResolvedValueOnce();
  const close = jest.fn();
  const log = jest.spyOn(console, "error").mockImplementation(() => {});
  await render(
    <ConfirmationProvider>
      <CollectionOptions fields={[]} onApply={apply} onClose={close} value={query} visible />
    </ConfirmationProvider>,
  );
  await fireEvent.press(screen.getByRole("button", { name: "Aplicar configuración" }));
  await waitFor(() =>
    expect(
      screen.getByText("No se pudo aplicar. Conservamos la configuración para reintentar."),
    ).toBeTruthy(),
  );
  expect(close).not.toHaveBeenCalled();
  expect(log).toHaveBeenCalled();
  await fireEvent.press(screen.getByRole("button", { name: "Aplicar configuración" }));
  await waitFor(() => expect(close).toHaveBeenCalledTimes(1));
  expect(apply).toHaveBeenLastCalledWith(query);
});
