import { ConfirmationProvider } from "@sincpro/mobile-ui/Dialog";
import {
  DEFAULT_DARK_THEME,
  DEFAULT_THEME,
  setActiveTheme,
  themeToVars,
} from "@sincpro/mobile-ui/theme";
import type { Preview } from "@storybook/react-native";
import { vars } from "nativewind";
import { type ReactNode, useLayoutEffect, useState } from "react";
import { Pressable, Text, View } from "react-native";
import { KeyboardAwareScrollView } from "react-native-keyboard-controller";

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

function ThemeFrame({
  children,
  screen = false,
  ownsScroll = false,
}: {
  children: ReactNode;
  screen?: boolean;
  ownsScroll?: boolean;
}) {
  const [mode, setMode] = useState<ThemeKey>("light");
  const tokens = THEMES[mode];
  useLayoutEffect(() => setActiveTheme(tokens), [tokens]);

  const toggle = () => {
    const next = ORDER[(ORDER.indexOf(mode) + 1) % ORDER.length];
    setMode(next);
  };

  return (
    <View style={[vars(themeToVars(tokens)), { flex: 1, backgroundColor: tokens.bg.page }]}>
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
      {ownsScroll ? (
        <View style={{ flex: 1 }}>{children}</View>
      ) : (
        <KeyboardAwareScrollView
          bottomOffset={20}
          contentContainerStyle={{
            flexGrow: 1,
            justifyContent: screen ? "flex-start" : "center",
            padding: 16,
          }}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
          style={{ flex: 1, backgroundColor: tokens.bg.page }}
        >
          {children}
        </KeyboardAwareScrollView>
      )}
    </View>
  );
}

const preview: Preview = {
  decorators: [
    (Story, context) => (
      <ThemeFrame
        ownsScroll={context.parameters.ownsScroll === true}
        screen={context.parameters.layout === "fullscreen"}
      >
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
