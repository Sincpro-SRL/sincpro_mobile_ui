import { beforeEach, expect, jest, test } from "@jest/globals";
import Button from "@sincpro/mobile-ui/Actions/Actions.Button";
import { requestConfirmation } from "@sincpro/mobile-ui/Dialog/requestConfirmation";
import { setActiveTheme } from "@sincpro/mobile-ui/theme/active";
import { DEFAULT_THEME } from "@sincpro/mobile-ui/theme/default";
import { fireEvent, render } from "@testing-library/react-native";

jest.mock("@sincpro/mobile-ui/Display/Display.Icon", () => () => null);
jest.mock("@sincpro/mobile-ui/Dialog/requestConfirmation", () => ({
  requestConfirmation: jest.fn(),
}));

beforeEach(() => {
  jest.mocked(requestConfirmation).mockReset();
  setActiveTheme(DEFAULT_THEME);
});

test.each(["text", "icon"] as const)(
  "%s button works without a confirmation provider",
  async (kind) => {
    const onPress = jest.fn();
    const screen = await render(
      kind === "text" ? (
        <Button onPress={onPress} testID="action" title="Continuar" />
      ) : (
        <Button.Icon icon="next" onPress={onPress} testID="action" />
      ),
    );
    await fireEvent.press(screen.getByTestId("action"));
    expect(onPress).toHaveBeenCalledTimes(1);
    expect(requestConfirmation).not.toHaveBeenCalled();
  },
);

test.each(["text", "icon"] as const)(
  "%s button waits for the native confirmation and respects cancellation",
  async (kind) => {
    const onPress = jest.fn();
    jest.mocked(requestConfirmation).mockResolvedValueOnce(false).mockResolvedValueOnce(true);
    const screen = await render(
      kind === "text" ? (
        <Button confirm="¿Eliminar?" onPress={onPress} testID="action" title="Eliminar" />
      ) : (
        <Button.Icon confirm="¿Eliminar?" icon="delete" onPress={onPress} testID="action" />
      ),
    );
    await fireEvent.press(screen.getByTestId("action"));
    expect(onPress).not.toHaveBeenCalled();
    await fireEvent.press(screen.getByTestId("action"));
    expect(onPress).toHaveBeenCalledTimes(1);
    expect(requestConfirmation).toHaveBeenCalledWith({
      title: "Confirmar acción",
      message: "¿Eliminar?",
      confirmText: "Confirmar",
      cancelText: "Cancelar",
    });
  },
);
