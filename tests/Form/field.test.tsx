import { expect, jest, test } from "@jest/globals";
import Field from "@sincpro/mobile-ui/Form/Form.Field";
import ControlledInput from "@sincpro/mobile-ui/Form/Form.ControlledInput";
import Input from "@sincpro/mobile-ui/Form/Form.Input";
import { act, fireEvent, render, screen } from "@testing-library/react-native";
import { type Control, useForm } from "react-hook-form";

jest.mock("@sincpro/mobile-ui/Display/Display.Icon", () => () => null);

type Values = { email: string };

function Harness({
  children,
  onReady,
}: {
  children: (control: Control<Values>) => React.ReactNode;
  onReady: (trigger: () => Promise<boolean>) => void;
}) {
  const form = useForm<Values>({ defaultValues: { email: "" } });
  onReady(() => form.trigger());
  return <>{children(form.control)}</>;
}

test("Form.Field gives any control its value, change, blur and validation message", async () => {
  let validate: () => Promise<boolean> = async () => true;
  await render(
    <Harness onReady={(trigger) => (validate = trigger)}>
      {(control) => (
        <Field
          control={control}
          name="email"
          render={({ value, onChange, onBlur, error }) => (
            <Input
              error={error}
              label="Correo"
              onBlur={onBlur}
              onChangeText={onChange}
              value={value}
            />
          )}
          rules={{ required: "El correo es requerido" }}
        />
      )}
    </Harness>,
  );
  await act(async () => {
    await validate();
  });
  expect(screen.getByText("El correo es requerido")).toBeTruthy();
  await fireEvent.changeText(screen.getByLabelText("Correo"), "ana@sincpro.com");
  await act(async () => {
    await validate();
  });
  expect(screen.queryByText("El correo es requerido")).toBeNull();
});

test("an explicit error wins over the validation message", async () => {
  await render(
    <Harness onReady={() => undefined}>
      {(control) => (
        <Field
          control={control}
          error="El servidor rechazó el correo"
          name="email"
          render={({ error }) => <Input error={error} label="Correo" value="" />}
        />
      )}
    </Harness>,
  );
  expect(screen.getByText("El servidor rechazó el correo")).toBeTruthy();
});

test("ControlledInput now shows its rule errors, not only the explicit one", async () => {
  let validate: () => Promise<boolean> = async () => true;
  await render(
    <Harness onReady={(trigger) => (validate = trigger)}>
      {(control) => (
        <ControlledInput
          control={control}
          label="Correo"
          name="email"
          rules={{ required: "Falta el correo" }}
        />
      )}
    </Harness>,
  );
  await act(async () => {
    await validate();
  });
  expect(screen.getByText("Falta el correo")).toBeTruthy();
});
