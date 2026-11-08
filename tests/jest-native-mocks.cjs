const mockReact = require("react");
const { Text, View } = require("react-native");

jest.mock("react-native-keyboard-controller", () => {
  const Container = ({ children, ...props }) => mockReact.createElement(View, props, children);
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
    useReanimatedKeyboardAnimation: () => ({ height: { value: 0 }, progress: { value: 0 } }),
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
    mockReact.createElement(View, { ...rest, testID: rest.testID ?? "native-picker" }, children);
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
