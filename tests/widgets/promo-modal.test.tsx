import { expect, jest, test } from "@jest/globals";
import { PromoModal } from "@sincpro/mobile-ui/widgets/PromoModal";
import { fireEvent, render, screen } from "@testing-library/react-native";
import { StyleSheet } from "react-native";

jest.mock("@sincpro/mobile-ui/Display/Display.Icon", () => () => null);
jest.mock("react-native-safe-area-context", () => ({
  useSafeAreaInsets: () => ({ top: 47, bottom: 34, left: 0, right: 0 }),
}));

test("the card scroll covers the whole modal, so the backdrop dims the full screen", async () => {
  const onDismiss = jest.fn();
  await render(
    <PromoModal
      body="Ahora podés filtrar rutas por color."
      ctaLabel="Explorar"
      onDismiss={onDismiss}
      title="Nueva función disponible"
      visible
    />,
  );
  let scroll = screen.getByText("Nueva función disponible").parent;
  while (scroll && scroll.props.pointerEvents !== "box-none") scroll = scroll.parent;
  if (!scroll) throw new Error("card scroll not found");
  expect(StyleSheet.flatten(scroll.props.style)).toMatchObject({
    position: "absolute",
    top: 0,
    right: 0,
    bottom: 0,
    left: 0,
  });
  expect(scroll.props.pointerEvents).toBe("box-none");

  await fireEvent.press(screen.getByText("Ahora no"));
  expect(onDismiss).toHaveBeenCalledTimes(1);
});
