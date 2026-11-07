import { afterEach, beforeEach, expect, jest, test } from "@jest/globals";
import ActionSheet from "@sincpro/mobile-ui/Dialog/Dialog.ActionSheet";
import Confirmation from "@sincpro/mobile-ui/Dialog/Dialog.Confirmation";
import EditValue from "@sincpro/mobile-ui/Dialog/Dialog.EditValue";
import Sheet from "@sincpro/mobile-ui/Dialog/Dialog.Sheet";
import Accordion from "@sincpro/mobile-ui/Display/Display.Accordion";
import StoryViewer from "@sincpro/mobile-ui/Display/Display.StoryViewer";
import Dropdown from "@sincpro/mobile-ui/Form/Form.Dropdown";
import Select from "@sincpro/mobile-ui/Form/Form.Select";
import { PromoModal } from "@sincpro/mobile-ui/widgets/PromoModal";
import { act, fireEvent, render, screen } from "@testing-library/react-native";
import { AccessibilityInfo, Animated, LayoutAnimation, Text } from "react-native";

jest.mock("@sincpro/mobile-ui/Display/Display.Icon", () => () => null);
jest.mock("@sincpro/mobile-ui/Display/Display.ExpoImage", () => () => null);
jest.mock("react-native-safe-area-context", () => ({
  useSafeAreaInsets: () => ({ top: 0, bottom: 0, left: 0, right: 0 }),
}));

let changeMotion: (enabled: boolean) => void;
const stop = jest.fn();
beforeEach(() => {
  stop.mockClear();
  jest.spyOn(AccessibilityInfo, "isReduceMotionEnabled").mockResolvedValue(false);
  jest.spyOn(AccessibilityInfo, "addEventListener").mockImplementation((_event, listener) => {
    changeMotion = listener;
    return { remove: jest.fn() };
  });
  jest
    .spyOn(Animated, "spring")
    .mockReturnValue({ start: jest.fn(), stop, reset: jest.fn() });
});
afterEach(() => {
  jest.restoreAllMocks();
});

function modal() {
  const node = screen.container
    .queryAll((node) => node.props.animationType !== undefined)
    .at(-1);
  if (!node) throw new Error("Expected a native modal");
  return node;
}

test.each(["confirmation", "edit", "story", "promo", "dropdown"])(
  "%s native modal follows live motion preference and preserves its standard transition",
  async (kind) => {
    if (kind === "confirmation")
      await render(<Confirmation onCancel={jest.fn()} onConfirm={jest.fn()} visible />);
    if (kind === "edit")
      await render(
        <EditValue
          autoFocus={false}
          onCancel={jest.fn()}
          onConfirm={jest.fn()}
          onChangeValue={jest.fn()}
          title="Editar"
          value=""
          visible
        />,
      );
    if (kind === "story")
      await render(
        <StoryViewer
          index={0}
          onClose={jest.fn()}
          onIndexChange={jest.fn()}
          slides={[{ image: { uri: "test" } }]}
          title="Historia"
          visible
        />,
      );
    if (kind === "promo")
      await render(<PromoModal onDismiss={jest.fn()} title="Nueva función" visible />);
    if (kind === "dropdown") {
      await render(<Dropdown options={[]} title="Opciones" />);
      await fireEvent.press(screen.getByRole("button", { name: "Opciones" }));
    }
    expect(modal().props.animationType).toBe("fade");
    await act(() => changeMotion(true));
    expect(modal().props.animationType).toBe("none");
    await act(() => changeMotion(false));
    expect(modal().props.animationType).toBe("fade");
  },
);

test.each(["sheet", "actions", "select"])(
  "%s native spring stops live and is never restarted under reduced motion",
  async (kind) => {
    if (kind === "sheet")
      await render(
        <Sheet onClose={jest.fn()} title="Opciones" visible>
          <Text>Contenido</Text>
        </Sheet>,
      );
    if (kind === "actions")
      await render(<ActionSheet actions={[]} onClose={jest.fn()} visible />);
    if (kind === "select") {
      await render(<Select label="Elegir" onChange={jest.fn()} options={[]} value={null} />);
      await fireEvent.press(screen.getByRole("button", { name: "Elegir: Seleccionar…" }));
    }
    expect(Animated.spring).toHaveBeenCalledTimes(1);
    await act(() => changeMotion(true));
    expect(stop).toHaveBeenCalledTimes(1);
    expect(Animated.spring).toHaveBeenCalledTimes(1);
    await act(() => changeMotion(false));
    expect(Animated.spring).toHaveBeenCalledTimes(2);
  },
);

test("accordion still opens with named 48-point actions when layout animations are suppressed", async () => {
  const animate = jest.spyOn(LayoutAnimation, "configureNext").mockImplementation(() => {});
  await render(
    <Accordion.Item title="Información">
      <Text>Contenido ampliado</Text>
    </Accordion.Item>,
  );
  await act(() => changeMotion(true));
  await fireEvent.press(screen.getByRole("button", { name: "Información" }));
  expect(screen.getByText("Contenido ampliado")).toBeTruthy();
  expect(animate).not.toHaveBeenCalled();
  await act(() => changeMotion(false));
  await fireEvent.press(screen.getByRole("button", { name: "Información" }));
  expect(animate).toHaveBeenCalledTimes(1);
});
