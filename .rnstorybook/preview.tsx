import { ConfirmationProvider, OverlayHost } from "@sincpro/mobile-ui/Dialog";
import KeyboardToolbarHost from "@sincpro/mobile-ui/Form/Form.KeyboardToolbarHost";
import {
  DEFAULT_DARK_THEME,
  DEFAULT_THEME,
  setActiveTheme,
  themeToVars,
} from "@sincpro/mobile-ui/theme";
import { fontFamilies } from "@sincpro/mobile-ui/theme/typography";
import type { Preview } from "@storybook/react-native";
import type { StatusBarStyle } from "expo-status-bar";
import * as SystemUI from "expo-system-ui";
import { vars } from "nativewind";
import { type ReactNode, useLayoutEffect, useState } from "react";
import { Appearance, Pressable, StyleSheet, Text, useColorScheme, View } from "react-native";
import { KeyboardAwareScrollView } from "react-native-keyboard-controller";
import { type Edge, SafeAreaView, useSafeAreaInsets } from "react-native-safe-area-context";

import { SystemBars, useCanvasStatusBar } from "./SystemBars";

const THEMES = {
  light: DEFAULT_THEME,
  dark: DEFAULT_DARK_THEME,
} as const;
type ThemeKey = keyof typeof THEMES;
type ThemeTokens = (typeof THEMES)[ThemeKey];
const ORDER: ThemeKey[] = ["light", "dark"];
const SHOW_CHROME = process.env.EXPO_PUBLIC_STORYBOOK_TEST !== "1";

function AppearanceBar({
  mode,
  onToggle,
  tokens,
}: {
  mode: ThemeKey;
  onToggle: () => void;
  tokens: ThemeTokens;
}) {
  const nextIsDark = mode === "light";
  return (
    <View
      style={{
        alignItems: "center",
        backgroundColor: tokens.bg.card,
        borderTopColor: tokens.border.default,
        borderTopWidth: StyleSheet.hairlineWidth,
        flexDirection: "row",
        gap: 12,
        justifyContent: "space-between",
        minHeight: 52,
        paddingHorizontal: 16,
        paddingVertical: 8,
      }}
    >
      <View style={{ flex: 1 }}>
        <Text
          style={{
            color: tokens.text.primary,
            fontFamily: fontFamilies.medium,
            fontSize: 15,
            letterSpacing: -0.2,
          }}
        >
          Apariencia
        </Text>
        <Text
          style={{
            color: tokens.text.secondary,
            fontFamily: fontFamilies.regular,
            fontSize: 12,
            marginTop: 1,
          }}
        >
          {mode === "light" ? "Tema claro" : "Tema oscuro"}
        </Text>
      </View>
      <Pressable
        accessibilityLabel={nextIsDark ? "Activar tema oscuro" : "Activar tema claro"}
        accessibilityRole="button"
        onPress={onToggle}
        style={{
          alignItems: "center",
          backgroundColor: tokens.bg.inverse,
          borderRadius: 999,
          justifyContent: "center",
          minHeight: 40,
          paddingHorizontal: 16,
        }}
        testID="storybook-theme-toggle"
      >
        <Text
          style={{
            color: tokens.text.inverse,
            fontFamily: fontFamilies.medium,
            fontSize: 14,
            letterSpacing: 0.1,
          }}
        >
          {nextIsDark ? "Oscuro" : "Claro"}
        </Text>
      </Pressable>
    </View>
  );
}

function ThemeFrame({
  children,
  ownsScroll = false,
  ownsTopInset = false,
  screen = false,
  statusBarStyle,
}: {
  children: ReactNode;
  ownsScroll?: boolean;
  ownsTopInset?: boolean;
  screen?: boolean;
  statusBarStyle?: StatusBarStyle;
}) {
  const systemScheme = useColorScheme();
  useCanvasStatusBar(statusBarStyle);
  const insets = useSafeAreaInsets();
  const [manualMode, setManualMode] = useState<ThemeKey | null>(null);
  const mode = manualMode ?? (systemScheme === "dark" ? "dark" : "light");
  const tokens = THEMES[mode];
  useLayoutEffect(() => {
    setActiveTheme(tokens);
    Appearance.setColorScheme(manualMode ?? "unspecified");
    void SystemUI.setBackgroundColorAsync(tokens.bg.page).catch((error: unknown) =>
      console.error("[Storybook] Could not update system background", error),
    );
  }, [manualMode, tokens]);
  useLayoutEffect(() => () => Appearance.setColorScheme("unspecified"), []);

  const edges: Edge[] = ["left", "right"];
  if (!screen) edges.push("top");
  if (!SHOW_CHROME) edges.push("bottom");
  const topInset = screen && !ownsTopInset ? insets.top : 0;
  const toggle = () => {
    const next = ORDER[(ORDER.indexOf(mode) + 1) % ORDER.length];
    setManualMode(next);
  };

  return (
    <View style={[vars(themeToVars(tokens)), { flex: 1 }]}>
      <OverlayHost>
        <SafeAreaView edges={edges} style={{ flex: 1, backgroundColor: tokens.bg.page }}>
          <View style={{ flex: 1, paddingTop: topInset }}>
            {ownsScroll ? (
              <View style={{ flex: 1 }}>{children}</View>
            ) : (
              <KeyboardAwareScrollView
                bottomOffset={20}
                contentContainerStyle={{
                  flexGrow: 1,
                  justifyContent: "flex-start",
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
          {SHOW_CHROME ? (
            <AppearanceBar mode={mode} onToggle={toggle} tokens={tokens} />
          ) : null}
        </SafeAreaView>
      </OverlayHost>
      <KeyboardToolbarHost />
    </View>
  );
}

const preview: Preview = {
  decorators: [
    (Story, context) => (
      <SystemBars>
        <ThemeFrame
          ownsScroll={context.parameters.ownsScroll === true}
          ownsTopInset={context.parameters.ownsTopInset === true}
          screen={context.parameters.layout === "fullscreen"}
          statusBarStyle={context.parameters.statusBarStyle}
        >
          <ConfirmationProvider>
            <Story />
          </ConfirmationProvider>
        </ThemeFrame>
      </SystemBars>
    ),
  ],
  parameters: {
    noSafeArea: true,
    hideFullScreenButton: true,
    controls: {
      matchers: { color: /(background|color)$/i, date: /Date$/ },
    },
  },
};

export default preview;
