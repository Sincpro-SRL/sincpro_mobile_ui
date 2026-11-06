import { expect, jest, test } from "@jest/globals";
import { refreshFormData } from "@sincpro/mobile-ui/views/FormViewV2";
import { refreshListData } from "@sincpro/mobile-ui/views/ListViewV2";

jest.mock("react-native-gesture-handler/ReanimatedSwipeable", () => ({
  __esModule: true,
  default: ({ children }: { children: React.ReactNode }) => {
    const mockReact = jest.requireActual<typeof import("react")>("react");
    return mockReact.createElement(mockReact.Fragment, null, children);
  },
}));
jest.mock("@sincpro/mobile-ui/Feedback/Feedback.Spinner", () => () => null);
jest.mock("@sincpro/mobile-ui/Feedback/Toast.context", () => ({
  ToastProvider: ({ children }: { children: React.ReactNode }) => children,
  useToast: () => ({}),
}));
jest.mock("@sincpro/mobile-ui/Feedback/ErrorBoundary", () => ({
  ErrorBoundary: ({ children }: { children: React.ReactNode }) => children,
}));
jest.mock("react-native-keyboard-controller", () => ({
  KeyboardAwareScrollView: ({ children }: { children: React.ReactNode }) => {
    const mockReact = jest.requireActual<typeof import("react")>("react");
    return mockReact.createElement(mockReact.Fragment, null, children);
  },
}));

test.each([
  ["FormViewV2", refreshFormData],
  ["ListViewV2", refreshListData],
])(
  "%s logs refresh failures, notifies the caller, and resets refreshing",
  async (name, refresh) => {
    const error = new Error("offline");
    const onRefreshError = jest.fn();
    const setRefreshing = jest.fn();
    const log = jest.spyOn(console, "error").mockImplementation(() => {});

    await refresh(() => Promise.reject(error), onRefreshError, setRefreshing);

    expect(log).toHaveBeenCalledWith(`[${name}] Refresh failed`, error);
    expect(onRefreshError).toHaveBeenCalledWith(error);
    expect(setRefreshing.mock.calls).toEqual([[true], [false]]);
    log.mockRestore();
  },
);
