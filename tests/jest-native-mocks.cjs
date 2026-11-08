const mockReact = require("react");
const { Text, View } = require("react-native");

jest.mock("react-native-gesture-handler", () => {
  const actual = jest.requireActual("react-native-gesture-handler");
  const overrides = {
    GestureDetector: ({ children }) => children,
    usePanGesture: (config) => config,
  };
  return new Proxy(actual, {
    get: (target, property) =>
      property in overrides ? overrides[property] : target[property],
  });
});

// Component tests check how a control configures its sheet. The real surface
// (animation, backdrop, back) is covered by tests/Dialog/overlay-host.test.tsx.
jest.mock("@sincpro/mobile-ui/Dialog/SheetSurface", () => {
  const actual = jest.requireActual("@sincpro/mobile-ui/Dialog/SheetSurface");
  const { useTheme } = jest.requireActual("@sincpro/mobile-ui/theme");
  function SheetSurface({
    visible,
    snapPoints,
    dismissible,
    onRequestClose,
    onExited,
    header,
    footer,
    children,
    testID,
  }) {
    const theme = useTheme();
    mockReact.useEffect(() => {
      if (!visible) onExited();
    }, [visible, onExited]);
    const requestClose = () => {
      if (visible && dismissible) onRequestClose();
    };
    return mockReact.createElement(
      View,
      {
        testID: "native-sheet",
        index: visible ? 0 : -1,
        snapPoints,
        enablePanDownToClose: dismissible,
        backgroundStyle: { backgroundColor: theme.bg.card },
        onClose: requestClose,
      },
      visible
        ? mockReact.createElement(
            View,
            { accessibilityViewIsModal: true, onAccessibilityEscape: requestClose, testID },
            header,
            children,
            footer,
          )
        : null,
    );
  }
  return { ...actual, SheetSurface };
});

jest.mock("react-native-worklets", () => ({
  scheduleOnRN: (fn, ...args) => fn(...args),
}));

jest.mock("react-native-reanimated", () => {
  const { ScrollView, Text, View } = require("react-native");
  const shared = (initial) => {
    const box = { value: initial };
    return Object.assign(box, {
      get: () => box.value,
      set: (next) => {
        box.value = typeof next === "function" ? next(box.value) : next;
      },
    });
  };
  const transition = { duration: () => transition, delay: () => transition };
  const identity = (value) => value;
  return {
    __esModule: true,
    default: {
      View,
      Text,
      ScrollView,
      createAnimatedComponent: identity,
    },
    Easing: {
      linear: identity,
      quad: identity,
      cubic: identity,
      in: () => identity,
      out: () => identity,
      inOut: () => identity,
      bezier: () => identity,
    },
    FadeInDown: transition,
    FadeInUp: transition,
    FadeOutDown: transition,
    FadeOutUp: transition,
    cancelAnimation: () => undefined,
    Extrapolation: { CLAMP: "clamp", EXTEND: "extend", IDENTITY: "identity" },
    useAnimatedScrollHandler: () => () => undefined,
    isSharedValue: (value) => Boolean(value && typeof value.get === "function"),
    interpolate: (value, input, output) => {
      if (value <= input[0]) return output[0];
      if (value >= input[input.length - 1]) return output[output.length - 1];
      const ratio = (value - input[0]) / (input[input.length - 1] - input[0]);
      return output[0] + ratio * (output[output.length - 1] - output[0]);
    },
    useAnimatedStyle: (factory) => factory(),
    useSharedValue: (initial) => mockReact.useState(() => shared(initial))[0],
    withDelay: (_delay, animation) => animation,
    withRepeat: (animation) => animation,
    withSequence: (...animations) => animations[animations.length - 1],
    withTiming: (value, _config, callback) => {
      callback?.(true);
      return value;
    },
  };
});

jest.mock("react-native-keyboard-controller", () => {
  const Container = ({ children, ...props }) =>
    mockReact.createElement(View, props, children);
  const Part = ({ button: Button, children, text }) =>
    mockReact.createElement(Button, {
      onPress: jest.fn(),
      children: children ?? (text ? mockReact.createElement(Text, {}, text) : null),
    });
  return {
    KeyboardProvider: Container,
    KeyboardAwareScrollView: Container,
    KeyboardStickyView: Container,
    KeyboardAvoidingView: Container,
    KeyboardController: { setFocusTo: jest.fn(), dismiss: jest.fn() },
    FocusedInputEvents: { addListener: jest.fn(() => ({ remove: jest.fn() })) },
    KeyboardToolbar: Object.assign(Container, {
      Group: Container,
      Prev: Part,
      Next: Part,
      Done: Part,
    }),
    useKeyboardState: (selector) => selector({ isVisible: false, height: 0 }),
    useReanimatedKeyboardAnimation: () => ({
      height: { value: 0, get: () => 0 },
      progress: { value: 0, get: () => 0 },
    }),
  };
});

function sheet({ children, index = 0, ...rest }) {
  return mockReact.createElement(
    View,
    { ...rest, index, testID: rest.testID ?? "native-sheet" },
    index >= 0 ? children : null,
  );
}

jest.mock("@expo/ui/community/bottom-sheet", () => ({
  __esModule: true,
  default: sheet,
  BottomSheetView: View,
  BottomSheetTextInput: require("react-native").TextInput,
}));

jest.mock("@expo/ui", () => {
  const picker = ({ children, ...rest }) =>
    mockReact.createElement(
      View,
      { ...rest, testID: rest.testID ?? "native-picker" },
      children,
    );
  return {
    Host: ({ children, ...rest }) => mockReact.createElement(View, rest, children),
    Picker: Object.assign(picker, {
      Item: ({ label }) => mockReact.createElement(Text, {}, label),
    }),
  };
});

jest.mock("@expo/ui/community/datetime-picker", () => ({
  __esModule: true,
  default: (props) => mockReact.createElement(View, props),
}));

jest.mock("@expo/ui/community/slider", () => ({
  __esModule: true,
  default: (props) => mockReact.createElement(View, props),
}));

jest.mock("@expo/ui/community/segmented-control", () => ({
  __esModule: true,
  default: (props) => mockReact.createElement(View, props),
}));

jest.mock("@expo/ui/community/menu", () => ({
  __esModule: true,
  default: ({ children, ...rest }) => mockReact.createElement(View, rest, children),
  MenuView: ({ children, ...rest }) => mockReact.createElement(View, rest, children),
}));
