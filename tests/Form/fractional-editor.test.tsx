import { expect, jest, test } from "@jest/globals";
import FractionalQuantityInput from "@sincpro/mobile-ui/Form/Form.FractionalQuantityInput";
import { fireEvent, render } from "@testing-library/react-native";
import type { ReactNode } from "react";

jest.mock("@sincpro/mobile-ui/Display", () => ({
  Display: { Icon: () => null },
}));
jest.mock("@sincpro/mobile-ui/Actions", () => {
  const mockReact = require("react");
  const { Pressable, Text } = require("react-native");
  return {
    Actions: {
      Button: ({ title, onPress }: { title: string; onPress: () => void }) =>
        mockReact.createElement(
          Pressable,
          { onPress, accessibilityRole: "button", accessibilityLabel: title },
          mockReact.createElement(Text, null, title),
        ),
    },
  };
});
jest.mock("@sincpro/mobile-ui/Dialog", () => {
  const mockReact = require("react");
  const { View, TextInput, Button } = require("react-native");
  return {
    Dialog: {
      EditValue: ({
        visible,
        value,
        onChange,
        onConfirm,
        onClose,
        footerAdornment,
      }: {
        visible: boolean;
        value: string;
        onChange: (value: string) => void;
        onConfirm: (value: string) => void;
        onClose: () => void;
        footerAdornment?: ReactNode;
      }) =>
        visible
          ? mockReact.createElement(
              View,
              null,
              mockReact.createElement(TextInput, {
                value,
                onChangeText: onChange,
                testID: "draft",
              }),
              footerAdornment,
              mockReact.createElement(Button, {
                title: "Aplicar",
                onPress: () => onConfirm(value),
              }),
              mockReact.createElement(Button, { title: "Cancelar", onPress: onClose }),
            )
          : null,
    },
  };
});

test("quick additions apply to the currently typed localized draft and persist only on confirm", async () => {
  const onChange = jest.fn();
  const screen = await render(
    <FractionalQuantityInput onChange={onChange} quickAddIncrements={[0.5]} value={2} />,
  );
  await fireEvent.press(screen.getByText("2.00"));
  await fireEvent.changeText(screen.getByTestId("draft"), "3,75");
  await fireEvent.press(screen.getByRole("button", { name: "+0.5" }));
  expect(screen.getByTestId("draft").props.value).toBe("4.25");
  await fireEvent.press(screen.getByRole("button", { name: "+0.5" }));
  expect(screen.getByTestId("draft").props.value).toBe("4.75");
  expect(onChange).not.toHaveBeenCalled();
  await fireEvent.press(screen.getByRole("button", { name: "Aplicar" }));
  expect(onChange).toHaveBeenCalledWith(4.75);
});

test("cancel discards draft changes and a confirmed draft still respects the maximum", async () => {
  const onChange = jest.fn();
  const screen = await render(
    <FractionalQuantityInput maxValue={5} onChange={onChange} value={2} />,
  );
  await fireEvent.press(screen.getByText("2.00"));
  await fireEvent.changeText(screen.getByTestId("draft"), "9");
  await fireEvent.press(screen.getByRole("button", { name: "Cancelar" }));
  expect(onChange).not.toHaveBeenCalled();
  await fireEvent.press(screen.getByText("2.00"));
  expect(screen.getByTestId("draft").props.value).toBe("2");
  await fireEvent.changeText(screen.getByTestId("draft"), "9");
  await fireEvent.press(screen.getByRole("button", { name: "Aplicar" }));
  expect(onChange).toHaveBeenCalledWith(5);
});
