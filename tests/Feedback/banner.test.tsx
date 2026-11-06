import { expect, jest, test } from "@jest/globals";
import Banner from "@sincpro/mobile-ui/Feedback/Feedback.Banner";
import { fireEvent, render, screen } from "@testing-library/react-native";

jest.mock("@sincpro/mobile-ui/Display/Display.Icon", () => () => null);

test("banner announces status and exposes its close action as a button", async () => {
  const onClose = jest.fn();
  await render(
    <Banner
      message="No se pudo guardar"
      onClose={onClose}
      testID="critical-banner"
      tone="danger"
    />,
  );

  expect(screen.getByTestId("critical-banner").props).toMatchObject({
    accessibilityLiveRegion: "assertive",
    accessibilityRole: "alert",
  });
  await fireEvent.press(screen.getByRole("button", { name: "Cerrar" }));
  expect(onClose).toHaveBeenCalledTimes(1);
});
