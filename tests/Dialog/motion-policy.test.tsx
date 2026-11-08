import "@shopify/flash-list/jestSetup";

import type { PickerItemProps, PickerProps } from "@expo/ui";
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
import type { ReactNode } from "react";
import {
  AccessibilityInfo,
  Animated,
  LayoutAnimation,
  type ModalProps,
  Text,
} from "react-native";

jest.mock("@sincpro/mobile-ui/Display/Display.Icon", () => () => null);
jest.mock("@sincpro/mobile-ui/Display/Display.ExpoImage", () => () => null);
jest.mock("react-native/Libraries/Modal/Modal", () => {
  const mockReact = jest.requireActual<typeof import("react")>("react");
  const { View } = jest.requireActual<typeof import("react-native")>("react-native");
  return {
    __esModule: true,
    default: ({ children, ...rest }: ModalProps) => {
      const props = { ...rest, testID: "fullscreen-modal" };
      return mockReact.createElement(View, props, children);
    },
  };
});
jest.mock("react-native-safe-area-context", () => ({
  useSafeAreaInsets: () => ({ top: 0, bottom: 0, left: 0, right: 0 }),
}));
jest.mock("react-native-keyboard-controller", () => {
  const mockReact = jest.requireActual<typeof import("react")>("react");
  const { View } = jest.requireActual<typeof import("react-native")>("react-native");
  const keyboardView = (props: { children?: ReactNode }) =>
    mockReact.createElement(View, props);
  return {
    KeyboardStickyView: keyboardView,
    KeyboardAwareScrollView: keyboardView,
  };
});
jest.mock("@expo/ui/community/bottom-sheet", () => {
  const mockReact = jest.requireActual<typeof import("react")>("react");
  const { View } = jest.requireActual<typeof import("react-native")>("react-native");
  return {
    __esModule: true,
    default: ({
      children,
      index,
      ...rest
    }: {
      children: ReactNode;
      index: number;
      onClose: () => void;
    }) => {
      const props = { ...rest, index, testID: "native-sheet" };
      return mockReact.createElement(View, props, index >= 0 ? children : null);
    },
    BottomSheetView: View,
  };
});
jest.mock("@expo/ui", () => {
  const mockReact = jest.requireActual<typeof import("react")>("react");
  const { Text, View } = jest.requireActual<typeof import("react-native")>("react-native");
  const picker = ({ children, ...rest }: PickerProps<string>) => {
    const props = { ...rest, testID: rest.testID ?? "native-picker" };
    return mockReact.createElement(View, props, children);
  };
  return {
    Host: (props: { children: ReactNode }) => mockReact.createElement(View, props),
    Picker: Object.assign(picker, {
      Item: ({ label }: PickerItemProps<string>) => mockReact.createElement(Text, {}, label),
    }),
  };
});

let changeMotion: (enabled: boolean) => void;
const stop = jest.fn<() => void>();
beforeEach(() => {
  stop.mockClear();
  jest.spyOn(AccessibilityInfo, "isReduceMotionEnabled").mockResolvedValue(false);
  jest.spyOn(AccessibilityInfo, "addEventListener").mockImplementation((_event, listener) => {
    changeMotion = listener;
    return { remove: jest.fn<() => void>() };
  });
  jest
    .spyOn(Animated, "spring")
    .mockReturnValue({ start: jest.fn<() => void>(), stop, reset: jest.fn<() => void>() });
});
afterEach(() => {
  jest.restoreAllMocks();
});

function modal() {
  return screen.getByTestId("fullscreen-modal");
}

test.each(["story", "promo"])(
  "%s native modal follows live motion preference and preserves its standard transition",
  async (kind) => {
    if (kind === "story")
      await render(
        <StoryViewer
          index={0}
          onClose={jest.fn<() => void>()}
          onIndexChange={jest.fn<(index: number) => void>()}
          slides={[{ image: { uri: "test" } }]}
          title="Historia"
          visible
        />,
      );
    if (kind === "promo")
      await render(
        <PromoModal onDismiss={jest.fn<() => void>()} title="Nueva función" visible />,
      );
    expect(modal().props.animationType).toBe("fade");
    await act(() => changeMotion(true));
    expect(modal().props.animationType).toBe("none");
    await act(() => changeMotion(false));
    expect(modal().props.animationType).toBe("fade");
  },
);

test.each(["confirmation", "edit", "dropdown", "sheet", "actions", "select"])(
  "%s delegates presentation motion to Expo UI and retains its native close lifecycle",
  async (kind) => {
    const close = jest.fn<() => void>();
    if (kind === "confirmation")
      await render(
        <Confirmation onClose={close} onConfirm={jest.fn<() => void>()} visible />,
      );
    if (kind === "edit")
      await render(
        <EditValue
          autoFocus={false}
          onClose={close}
          onConfirm={jest.fn<(value: string) => void>()}
          title="Editar"
          value=""
          visible
        />,
      );
    if (kind === "dropdown") {
      await render(<Dropdown options={[]} title="Opciones" />);
      await fireEvent.press(screen.getByRole("button", { name: "Opciones" }));
    }
    if (kind === "sheet")
      await render(
        <Sheet onClose={close} title="Opciones" visible>
          <Text>Contenido</Text>
        </Sheet>,
      );
    if (kind === "actions")
      await render(<ActionSheet actions={[]} onClose={close} visible />);
    if (kind === "select") {
      await render(
        <Select
          label="Elegir"
          onBlur={close}
          onChange={jest.fn<(value: number) => void>()}
          options={[{ label: "Uno", value: 1 }]}
          value={1}
        />,
      );
      await fireEvent.press(screen.getByRole("button", { name: "Elegir: Uno" }));
    }
    const sheet = screen.getByTestId("native-sheet");
    expect(sheet.props.index).toBe(0);
    // Edit keeps its actions inside its content, so it uses a single detent.
    expect(sheet.props.snapPoints).toEqual(kind === "edit" ? ["60%"] : ["60%", "90%"]);
    expect(sheet.props.animationType).toBeUndefined();
    expect(sheet.props.animateOnMount).toBeUndefined();
    expect(Animated.spring).not.toHaveBeenCalled();
    expect(stop).not.toHaveBeenCalled();
    await fireEvent.press(screen.getByRole("button", { name: "Cerrar" }));
    if (kind === "dropdown" || kind === "select")
      expect(screen.queryByTestId("native-sheet")).toBeNull();
    if (kind !== "dropdown") expect(close).toHaveBeenCalledTimes(1);
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
