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
import { Pressable, ScrollView, Text, View } from "react-native";

const THEMES = {
  light: DEFAULT_THEME,
  dark: DEFAULT_DARK_THEME,
} as const;
type ThemeKey = keyof typeof THEMES;
const ORDER: ThemeKey[] = ["light", "dark"];
const NEXT_LABEL: Record<ThemeKey, string> = {
  light: "☾ Dark",
  dark: "☀ Light",
};

function ThemeFrame({ children, screen = false }: { children: ReactNode; screen?: boolean }) {
  const [mode, setMode] = useState<ThemeKey>("light");
  const tokens = THEMES[mode];

  const toggle = () => {
    const next = ORDER[(ORDER.indexOf(mode) + 1) % ORDER.length];
    setActiveTheme(THEMES[next]);
    setMode(next);
  };

  return (
    <View style={{ flex: 1, backgroundColor: tokens.bg.page }}>
      <Pressable
        accessibilityLabel={mode === "light" ? "Activar tema oscuro" : "Activar tema claro"}
        accessibilityRole="button"
        onPress={toggle}
        style={{
          position: screen ? "relative" : "absolute",
          alignSelf: "flex-end",
          zIndex: 1,
          top: screen ? undefined : 8,
          right: screen ? undefined : 8,
          margin: screen ? 8 : undefined,
          minHeight: screen ? 48 : undefined,
          justifyContent: "center",
          paddingHorizontal: 12,
          paddingVertical: 6,
          borderRadius: 999,
          backgroundColor: mode === "dark" ? "#F1F5F9" : "#0F172A",
        }}
        testID="storybook-theme-toggle"
      >
        <Text style={{ color: mode === "dark" ? "#0F172A" : "#F1F5F9", fontSize: 12 }}>
          {NEXT_LABEL[mode]}
        </Text>
      </Pressable>
      {/*
        Scrollable canvas: short stories stay vertically centered (flexGrow:1 +
        justifyContent:center), tall ones (e.g. AppBar's stacked frames) scroll to the
        end instead of overflowing off-screen. The theme `vars()` go on the ScrollView so
        they cascade to all story descendants.
      */}
      <ScrollView
        contentContainerStyle={{
          flexGrow: 1,
          justifyContent: screen ? "flex-start" : "center",
          padding: 16,
        }}
        key={mode}
        showsVerticalScrollIndicator={false}
        style={[vars(themeToVars(tokens)), { flex: 1, backgroundColor: tokens.bg.page }]}
      >
        {children}
      </ScrollView>
    </View>
  );
}

const preview: Preview = {
  decorators: [
    (Story, context) => (
      <ThemeFrame screen={context.parameters.layout === "fullscreen"}>
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
