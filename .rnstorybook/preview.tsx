import { ConfirmationProvider } from "@sincpro/mobile-ui/Dialog";
import {
  DEFAULT_DARK_THEME,
  DEFAULT_THEME,
  setActiveTheme,
  themeToVars,
} from "@sincpro/mobile-ui/theme";
import type { Preview } from "@storybook/react-native";
import { vars } from "nativewind";
import { type ReactNode, useState } from "react";
import { Pressable, Text, View } from "react-native";

const THEMES = { light: DEFAULT_THEME, dark: DEFAULT_DARK_THEME } as const;
type ThemeKey = keyof typeof THEMES;

function ThemeFrame({ children }: { children: ReactNode }) {
  const [mode, setMode] = useState<ThemeKey>("light");
  const tokens = THEMES[mode];

  const toggle = () => {
    const next: ThemeKey = mode === "light" ? "dark" : "light";
    setActiveTheme(THEMES[next]);
    setMode(next);
  };

  return (
    <View style={{ flex: 1 }}>
      <View
        key={mode}
        style={[
          vars(themeToVars(tokens)),
          {
            flex: 1,
            padding: 16,
            justifyContent: "center",
            backgroundColor: tokens.bg.page,
          },
        ]}
      >
        {children}
      </View>
      <Pressable
        accessibilityRole="button"
        onPress={toggle}
        style={{
          position: "absolute",
          top: 8,
          right: 8,
          paddingHorizontal: 12,
          paddingVertical: 6,
          borderRadius: 999,
          backgroundColor: mode === "dark" ? "#F1F5F9" : "#0F172A",
        }}
      >
        <Text style={{ color: mode === "dark" ? "#0F172A" : "#F1F5F9", fontSize: 12 }}>
          {mode === "dark" ? "☀ Light" : "☾ Dark"}
        </Text>
      </Pressable>
    </View>
  );
}

const preview: Preview = {
  decorators: [
    (Story) => (
      <ThemeFrame>
        <ConfirmationProvider>
          <Story />
        </ConfirmationProvider>
      </ThemeFrame>
    ),
  ],
  parameters: {
    controls: {
      matchers: { color: /(background|color)$/i, date: /Date$/ },
    },
  },
};

export default preview;
