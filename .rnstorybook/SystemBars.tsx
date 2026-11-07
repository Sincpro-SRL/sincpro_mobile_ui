import { useTheme } from "@sincpro/mobile-ui/theme";
import { resolveOnColor } from "@sincpro/mobile-ui/theme/contrast";
import { StatusBar, type StatusBarStyle } from "expo-status-bar";
import {
  createContext,
  type Dispatch,
  type ReactNode,
  type SetStateAction,
  useContext,
  useLayoutEffect,
  useState,
} from "react";

const OverrideContext = createContext<Dispatch<SetStateAction<StatusBarStyle | null>> | null>(
  null,
);

export function SystemBars({ children }: { children: ReactNode }) {
  const theme = useTheme();
  const [override, setOverride] = useState<StatusBarStyle | null>(null);
  return (
    <OverrideContext.Provider value={setOverride}>
      {children}
      <StatusBar
        hidden={false}
        style={override ?? (resolveOnColor(theme.bg.page) === "#FFFFFF" ? "light" : "dark")}
      />
    </OverrideContext.Provider>
  );
}

export function useCanvasStatusBar(style?: StatusBarStyle) {
  const setOverride = useContext(OverrideContext);
  useLayoutEffect(() => {
    if (!setOverride) return;
    setOverride(style ?? null);
    return () => setOverride(null);
  }, [setOverride, style]);
  if (!setOverride) throw new Error("Storybook canvas must be inside SystemBars");
}
