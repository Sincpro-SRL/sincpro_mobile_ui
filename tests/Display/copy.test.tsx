import { beforeEach, expect, jest, test } from "@jest/globals";
import CopyableText from "@sincpro/mobile-ui/Display/Display.CopyableText";
import KeyValue from "@sincpro/mobile-ui/Display/Display.KeyValue";
import { act, fireEvent, render, screen } from "@testing-library/react-native";
import * as Clipboard from "expo-clipboard";
import * as ReactNative from "react-native";

jest.mock("expo-clipboard", () => ({ setStringAsync: jest.fn() }));

const copy = jest.mocked(Clipboard.setStringAsync);

beforeEach(() => {
  jest.clearAllMocks();
  copy.mockResolvedValue(true);
});

test("copies the raw value and confirms completion", async () => {
  const onCopied = jest.fn();
  await render(<CopyableText label="Pedido" onCopied={onCopied} value="ORD-001" />);
  await act(async () =>
    fireEvent.press(screen.getByRole("button", { name: "Copiar Pedido" })),
  );
  expect(copy).toHaveBeenCalledWith("ORD-001");
  expect(onCopied).toHaveBeenCalledWith("ORD-001");
  expect(screen.getByRole("button").props.accessibilityValue.text).toBe("Copiado");
  expect(screen.queryByText("Copiado")).toBeNull();
  expect(screen.getByRole("button").props.style).toMatchObject({
    minWidth: 48,
    minHeight: 48,
  });
});

test("lazy value failures are surfaced without touching the clipboard", async () => {
  const log = jest.spyOn(console, "error").mockImplementation(() => {});
  try {
    await render(
      <CopyableText
        getValue={() => {
          throw new Error("Unavailable");
        }}
      />,
    );
    await fireEvent.press(screen.getByRole("button"));
    expect(copy).not.toHaveBeenCalled();
    expect(log).toHaveBeenCalled();
    expect(screen.getByText("No se pudo copiar. Toca para reintentar.")).toBeTruthy();
  } finally {
    log.mockRestore();
  }
});

test("does not report success while copying or repeat the operation", async () => {
  let finish: (value: boolean) => void = () => {};
  copy.mockImplementation(
    () =>
      new Promise<boolean>((resolve) => {
        finish = resolve;
      }),
  );
  await render(<CopyableText value="ORD-001" />);
  await fireEvent.press(screen.getByRole("button"));
  await fireEvent.press(screen.getByRole("button"));
  expect(copy).toHaveBeenCalledTimes(1);
  expect(screen.queryByText("Copiado")).toBeNull();
  expect(screen.getByRole("button").props.accessibilityState.busy).toBe(true);
  await act(async () => finish(true));
  expect(screen.getByRole("button").props.accessibilityValue.text).toBe("Copiado");
});

test.each(["reject", "false"])("surfaces %s failures and allows retry", async (failure) => {
  const log = jest.spyOn(console, "error").mockImplementation(() => {});
  const onCopyError = jest.fn();
  if (failure === "reject") copy.mockRejectedValueOnce(new Error("Unavailable"));
  else copy.mockResolvedValueOnce(false);
  await render(<CopyableText onCopyError={onCopyError} value="ORD-001" />);
  try {
    await act(async () => fireEvent.press(screen.getByRole("button")));
    expect(screen.getByText("No se pudo copiar. Toca para reintentar.")).toBeTruthy();
    expect(onCopyError).toHaveBeenCalledWith(expect.any(Error));
    expect(log).toHaveBeenCalled();
    expect(screen.queryByText("Copiado")).toBeNull();
    await act(async () => fireEvent.press(screen.getByRole("button")));
    expect(screen.getByRole("button").props.accessibilityValue.text).toBe("Copiado");
  } finally {
    log.mockRestore();
  }
});

test("long text remains selectable and copying has a separate named action", async () => {
  const value = "Texto extenso que se puede seleccionar sin disparar una acción de copia";
  await render(
    <CopyableText accessibilityLabel="Copiar descripción" selectable value={value} />,
  );
  const text = screen.getByDisplayValue(value);
  expect(text.props.editable).toBe(false);
  expect(text.props.multiline).toBe(true);
  expect(text.props.showSoftInputOnFocus).toBe(false);
  expect(copy).not.toHaveBeenCalled();
  await fireEvent.press(screen.getByRole("button", { name: "Copiar descripción" }));
  expect(copy).toHaveBeenCalledWith(value);
});

test("copied feedback is announced and returns to the copy action after three seconds", async () => {
  jest.useFakeTimers();
  const announce = jest.spyOn(ReactNative.AccessibilityInfo, "announceForAccessibility");
  try {
    await render(<CopyableText value="REF-001" />);
    await fireEvent.press(screen.getByRole("button"));
    expect(announce).toHaveBeenCalledWith("Copiado");
    expect(screen.getByRole("button").props.accessibilityValue.text).toBe("Copiado");
    await act(async () => jest.advanceTimersByTime(3000));
    expect(
      screen.getByRole("button", { name: "Copiar REF-001" }).props.accessibilityValue.text,
    ).toBe("");
  } finally {
    announce.mockRestore();
    jest.useRealTimers();
  }
});

test("a different value is not presented as already copied", async () => {
  const { rerender } = await render(<CopyableText value="REF-001" />);
  await fireEvent.press(screen.getByRole("button"));
  await rerender(<CopyableText value="REF-002" />);
  expect(
    screen.getByRole("button", { name: "Copiar REF-002" }).props.accessibilityValue.text,
  ).toBe("");
  await fireEvent.press(screen.getByRole("button"));
  expect(copy).toHaveBeenLastCalledWith("REF-002");
});

test("key-value forwards native selection to long values", async () => {
  await render(
    <KeyValue
      align="stacked"
      copyable
      label="Descripción"
      selectable
      value="Texto seleccionable"
    />,
  );
  expect(screen.getByDisplayValue("Texto seleccionable").props.readOnly).toBe(true);
  await fireEvent.press(screen.getByRole("button", { name: "Copiar Descripción" }));
  expect(copy).toHaveBeenCalledWith("Texto seleccionable");
});

test("resolves lazy content when pressed and respects disabled", async () => {
  const getValue = jest.fn(() => "Dynamic");
  const { rerender } = await render(<CopyableText disabled getValue={getValue} />);
  await fireEvent.press(screen.getByRole("button"));
  expect(getValue).not.toHaveBeenCalled();
  await rerender(<CopyableText getValue={getValue} />);
  await act(async () => fireEvent.press(screen.getByRole("button")));
  expect(copy).toHaveBeenCalledWith("Dynamic");
});

test("key-value copy action names the field and preserves the value", async () => {
  await render(<KeyValue copyable label="Referencia" value={12345} />);
  await act(async () =>
    fireEvent.press(screen.getByRole("button", { name: "Copiar Referencia" })),
  );
  expect(copy).toHaveBeenCalledWith("12345");
});

test("ordinary key-value remains read-only", async () => {
  await render(<KeyValue label="Ciudad" value="La Paz" />);
  expect(screen.getByText("La Paz")).toBeTruthy();
  expect(screen.queryByRole("button")).toBeNull();
});

test("auto layout stacks when text is enlarged and preserves explicit row layout", async () => {
  const dimensions = jest.spyOn(ReactNative, "useWindowDimensions").mockReturnValue({
    width: 390,
    height: 844,
    scale: 3,
    fontScale: 2,
  });
  try {
    const { rerender } = await render(
      <KeyValue align="auto" label="Referencia" value="ORD-001" />,
    );
    expect(
      ReactNative.StyleSheet.flatten(screen.getByText("ORD-001").props.style).fontFamily,
    ).toBe("IBMPlexSans_400Regular");
    await rerender(<KeyValue align="row" label="Referencia" value="ORD-001" />);
    expect(
      ReactNative.StyleSheet.flatten(screen.getByText("ORD-001").props.style).fontFamily,
    ).toBe("IBMPlexSans_600SemiBold");
  } finally {
    dimensions.mockRestore();
  }
});
