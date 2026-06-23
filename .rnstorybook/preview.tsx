import { ConfirmationProvider } from "@sincpro/mobile-ui/Dialog";
import {
  DEFAULT_DARK_THEME,
  DEFAULT_THEME,
  extendTheme,
  setActiveTheme,
  themeToVars,
} from "@sincpro/mobile-ui/theme";
import type { Preview } from "@storybook/react-native";
import { vars } from "nativewind";
import { type ReactNode, useState } from "react";
import { Pressable, ScrollView, Text, View } from "react-native";

// SINCPRO brand palette (img "THEME · TOKENS"): verde marca + neutros + semánticos.
// Each app overrides via createTheme(); this previews the DS in the real brand colors.
// SINCPRO brand manual (literal): color-brand = NEGRO #0B0B0B (primary). CTA = VERDE NEÓN
// #00F58C con texto/ícono OSCURO (#06170E). success = #00C357 (estado-ok, distinto del CTA).
const BRAND_THEME = extendTheme({
  primary: "#0B0B0B", // color-brand · negro (fondos oscuros, texto, botón neutro)
  secondary: "#6B6963", // muted / neutro
  accent: "#00F58C", // verde neón · CTA (texto oscuro encima)
  success: "#00C357", // estado-ok (verde marca, diferenciado del CTA neón)
  warning: "#FFB020",
  info: "#201DC4",
  danger: "#FF4D1F",
  ring: "#00C357",
  input: "#E4E2DD",
  bg: { page: "#FAFAFA", card: "#FFFFFF", muted: "#EDEBE6", accent: "#E6FFF2" },
  // onAccent OSCURO → texto/ícono sobre el verde neón (contraste, look fintech).
  text: { primary: "#0B0B0B", secondary: "#6B6963", onAccent: "#06170E" },
  border: { default: "#E4E2DD", light: "#EFEDE8", focus: "#00C357" },
  // primary gradient = negro; accent gradient = verde neón (CTA).
  gradient: { primary: ["#1A1A1A", "#0B0B0B"], accent: ["#22E584", "#00F58C"] },
});

const THEMES = {
  brand: BRAND_THEME,
  light: DEFAULT_THEME,
  dark: DEFAULT_DARK_THEME,
} as const;
type ThemeKey = keyof typeof THEMES;
const ORDER: ThemeKey[] = ["brand", "light", "dark"];
const NEXT_LABEL: Record<ThemeKey, string> = {
  brand: "☀ Light",
  light: "☾ Dark",
  dark: "✦ Brand",
};

function ThemeFrame({ children }: { children: ReactNode }) {
  const [mode, setMode] = useState<ThemeKey>("brand");
  const tokens = THEMES[mode];

  const toggle = () => {
    const next = ORDER[(ORDER.indexOf(mode) + 1) % ORDER.length];
    setActiveTheme(THEMES[next]);
    setMode(next);
  };

  return (
    <View style={{ flex: 1 }}>
      {/*
        Scrollable canvas: short stories stay vertically centered (flexGrow:1 +
        justifyContent:center), tall ones (e.g. AppBar's stacked frames) scroll to the
        end instead of overflowing off-screen. The theme `vars()` go on the ScrollView so
        they cascade to all story descendants.
      */}
      <ScrollView
        contentContainerStyle={{
          flexGrow: 1,
          justifyContent: "center",
          padding: 16,
        }}
        key={mode}
        showsVerticalScrollIndicator={false}
        style={[vars(themeToVars(tokens)), { flex: 1, backgroundColor: tokens.bg.page }]}
      >
        {children}
      </ScrollView>
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
          {NEXT_LABEL[mode]}
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
