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
import { Pressable, Text, View } from "react-native";

// SINCPRO brand palette (img "THEME · TOKENS"): verde marca + neutros + semánticos.
// Each app overrides via createTheme(); this previews the DS in the real brand colors.
// SINCPRO brand manual (literal): color-brand = NEGRO #0B0B0B (primary). accent = VERDE #00C357.
const BRAND_THEME = extendTheme({
  primary: "#0B0B0B", // color-brand · negro (fondos oscuros, texto, botón neutro)
  secondary: "#6B6963", // muted / neutro
  accent: "#00C357", // verde marca · CTA
  success: "#00C357",
  warning: "#FFB020",
  info: "#201DC4",
  danger: "#FF4D1F",
  // ring (focus ring) e input (borde de inputs) son tokens propios que por default eran
  // AZUL/gris → alinearlos a la marca (verde / borde neutro) mata el azul que se colaba.
  ring: "#00C357",
  input: "#E4E2DD",
  bg: { page: "#FAFAFA", card: "#FFFFFF", muted: "#F0F1EE", accent: "#E6F8EE" },
  text: { primary: "#0B0B0B", secondary: "#6B6963" },
  border: { default: "#E4E2DD", light: "#EFEDE8", focus: "#00C357" },
  // primary gradient = negro; accent gradient = verde (CTA).
  gradient: { primary: ["#1A1A1A", "#0B0B0B"], accent: ["#22E584", "#00C357"] },
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
