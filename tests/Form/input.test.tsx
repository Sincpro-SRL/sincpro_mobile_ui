import { expect, jest, test } from "@jest/globals";
import Input from "@sincpro/mobile-ui/Form/Form.Input";
import { fireEvent, render, screen } from "@testing-library/react-native";

jest.mock("@sincpro/mobile-ui/Display/Display.Icon", () => () => null);

const OUTLINE = "h-11 text-text-primary rounded p-2";

test("outline keeps the access-form look: bordered 44-high field, focus and error borders", async () => {
  const { rerender } = await render(<Input label="Usuario" look="outline" value="" />);
  const field = screen.getByLabelText("Usuario");
  expect(field.props.className).toBe(`${OUTLINE} border border-input`);

  await fireEvent(field, "focus");
  expect(screen.getByLabelText("Usuario").props.className).toBe(
    `${OUTLINE} border-2 border-border-focus`,
  );

  await rerender(<Input error="Requerido" label="Usuario" look="outline" value="" />);
  expect(screen.getByLabelText("Usuario").props.className).toBe(
    `${OUTLINE} border-2 border-danger`,
  );
  expect(screen.getByText("Requerido").props.accessibilityLiveRegion).toBe("polite");
});

test("secure hides the text until the toggle reveals it, in both looks", async () => {
  for (const look of ["card", "outline"] as const) {
    const { unmount } = await render(
      <Input label="Contraseña" look={look} secure value="secreto" />,
    );
    expect(screen.getByLabelText("Contraseña").props.secureTextEntry).toBe(true);

    await fireEvent.press(screen.getByRole("button", { name: "Mostrar contraseña" }));
    expect(screen.getByLabelText("Contraseña").props.secureTextEntry).toBe(false);

    await fireEvent.press(screen.getByRole("button", { name: "Ocultar contraseña" }));
    expect(screen.getByLabelText("Contraseña").props.secureTextEntry).toBe(true);
    await unmount();
  }
});

test("a plain field never hides its text and has no toggle", async () => {
  await render(<Input label="Servidor" look="outline" value="https://erp" />);
  expect(screen.getByLabelText("Servidor").props.secureTextEntry).toBe(false);
  expect(screen.queryByRole("button", { name: "Mostrar contraseña" })).toBeNull();
});

test("focus and blur still reach the caller", async () => {
  const onFocus = jest.fn();
  const onBlur = jest.fn();
  await render(
    <Input label="Correo" look="outline" onBlur={onBlur} onFocus={onFocus} value="" />,
  );
  await fireEvent(screen.getByLabelText("Correo"), "focus");
  await fireEvent(screen.getByLabelText("Correo"), "blur");
  expect(onFocus).toHaveBeenCalledTimes(1);
  expect(onBlur).toHaveBeenCalledTimes(1);
});
