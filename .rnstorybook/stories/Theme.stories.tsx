import { Actions } from "@sincpro/mobile-ui/Actions";
import { Display } from "@sincpro/mobile-ui/Display";
import {
  DEFAULT_DARK_THEME,
  DEFAULT_THEME,
  defineTheme,
  type ThemeTokens,
  themeToVars,
  useTheme,
} from "@sincpro/mobile-ui/theme";
import { Typography } from "@sincpro/mobile-ui/Typography";
import type { Meta, StoryObj } from "@storybook/react-native";
import { vars } from "nativewind";
import { View } from "react-native";

const meta = { title: "Foundations/Theme" } satisfies Meta;

export default meta;

type Story = StoryObj<typeof meta>;

function Swatch({ color, label }: { color: string; label: string }) {
  return (
    <View style={{ alignItems: "center", width: 76, gap: 4 }}>
      <View
        style={{
          width: 48,
          height: 48,
          borderRadius: 8,
          backgroundColor: color,
          borderWidth: 1,
          borderColor: "rgba(127,127,127,0.35)",
        }}
      />
      <Typography.Text className="text-text-secondary text-xs" numberOfLines={1}>
        {label}
      </Typography.Text>
    </View>
  );
}

function Palette({ tokens }: { tokens: ThemeTokens }) {
  const swatches = [
    { color: tokens.primary, label: "primary" },
    { color: tokens.secondary, label: "secondary" },
    { color: tokens.accent, label: "accent" },
    { color: tokens.success, label: "success" },
    { color: tokens.warning, label: "warning" },
    { color: tokens.danger, label: "danger" },
    { color: tokens.info, label: "info" },
    { color: tokens.bg.page, label: "bg.page" },
    { color: tokens.bg.card, label: "bg.card" },
    { color: tokens.bg.muted, label: "bg.muted" },
    { color: tokens.text.primary, label: "text" },
    { color: tokens.border.default, label: "border" },
  ];
  return (
    <View style={{ flexDirection: "row", flexWrap: "wrap", gap: 12 }}>
      {swatches.map((s) => (
        <Swatch color={s.color} key={s.label} label={s.label} />
      ))}
    </View>
  );
}

function ThemePanel({ tokens, label }: { tokens: ThemeTokens; label: string }) {
  return (
    <View
      style={[
        vars(themeToVars(tokens)),
        { borderRadius: 12, padding: 16, gap: 12, backgroundColor: tokens.bg.page },
      ]}
    >
      <Typography.Text bold className="text-text-primary">
        {label}
      </Typography.Text>
      <View style={{ flexDirection: "row", gap: 8, flexWrap: "wrap" }}>
        <Display.Badge label="info" variant="info" />
        <Display.Badge label="success" variant="success" />
        <Display.Badge label="danger" variant="danger" />
      </View>
      <Actions.Button title="Secondary" variant="secondary" />
      <Actions.Button title="Outline" variant="outline" />
      <View className="bg-bg-card border border-border-default rounded-lg p-3">
        <Typography.Text className="text-text-primary">Card sobre bg-card</Typography.Text>
        <Typography.Text className="text-text-secondary text-sm">
          Texto secundario
        </Typography.Text>
      </View>
      <Palette tokens={tokens} />
    </View>
  );
}

function ActiveTokensView() {
  const tokens = useTheme();
  return (
    <View style={{ gap: 12 }}>
      <Typography.Text bold className="text-text-primary text-lg">
        Tokens activos — {tokens.name}
      </Typography.Text>
      <Typography.Text className="text-text-secondary text-sm">
        Cambia el tema desde la toolbar (Light / Dark). Reactivo vía useTheme().
      </Typography.Text>
      <Palette tokens={tokens} />
    </View>
  );
}

export const ActiveTokens: Story = {
  render: () => <ActiveTokensView />,
};

export const LightVsDark: Story = {
  render: () => (
    <View style={{ gap: 16 }}>
      <ThemePanel label="Light" tokens={DEFAULT_THEME} />
      <ThemePanel label="Dark" tokens={DEFAULT_DARK_THEME} />
    </View>
  ),
};

// Proposed brand palette (reference only — apps override via createTheme). Mirrors the
// handoff spec so designers/devs/AI share one source of truth for the SINCPRO look.
const BRAND_PALETTE = [
  { hex: "#2A4A85", label: "primary", note: "acción" },
  { hex: "#FFFFFF", label: "on-primary", note: "texto sobre la acción" },
  { hex: "#FAF9F7", label: "ground", note: "fondo" },
  { hex: "#FFFFFF", label: "surface", note: "tarjeta" },
  { hex: "#1A1714", label: "ink", note: "texto" },
  { hex: "#6B6459", label: "muted", note: "texto secundario" },
  { hex: "#E4DFD7", label: "line", note: "borde" },
  { hex: "#C89B3C", label: "accent", note: "relleno del botón, no borde" },
  { hex: "#2F6B3C", label: "good", note: "estado" },
  { hex: "#7E5E12", label: "warn", note: "estado" },
  { hex: "#0F5C6E", label: "info", note: "estado" },
  { hex: "#9B3B30", label: "danger", note: "estado" },
];

const HANDOFF_SPEC = `:root {
  /* Web UI light */
  --color-bg:        #FAF9F7;
  --color-surface:   #FFFFFF;
  --color-ink:       #1A1714;
  --color-muted:     #6B6459;
  --color-border:    #E4DFD7;

  /* Acción */
  --color-primary:    #2A4A85;
  --color-on-primary: #FFFFFF;
  --color-accent:     #C89B3C;

  /* Semánticos */
  --color-success: #2F6B3C;
  --color-warning: #7E5E12;
  --color-info:    #0F5C6E;
  --color-danger:  #9B3B30;

  /* Tipografía por rol */
  --font-title:   "IBM Plex Sans";
  --font-body:    "IBM Plex Sans";
  --font-caption: "IBM Plex Mono";

  /* Radios */
  --radius-card: 16px;
  --radius-btn:  13px;
  --radius-pill: 30px;
}`;

export const BrandPalette: Story = {
  render: () => (
    <View style={{ gap: 16, padding: 4 }}>
      <Typography.Text bold className="text-text-primary text-lg">
        Paleta de marca (referencia)
      </Typography.Text>
      <Typography.Text className="text-text-secondary text-sm">
        Cada app la sobreescribe con createTheme(); esto es la fuente de verdad para handoff.
      </Typography.Text>

      <View style={{ flexDirection: "row", flexWrap: "wrap", gap: 12 }}>
        {BRAND_PALETTE.map((s, i) => (
          <View key={`${s.label}-${i}`} style={{ alignItems: "center", width: 92, gap: 4 }}>
            <View
              style={{
                width: 56,
                height: 56,
                borderRadius: 12,
                backgroundColor: s.hex,
                borderWidth: 1,
                borderColor: "rgba(127,127,127,0.35)",
              }}
            />
            <Typography.Text className="text-text-primary text-xs" numberOfLines={1} semibold>
              {s.label}
            </Typography.Text>
            <Typography.Text className="text-text-tertiary text-xs" numberOfLines={1}>
              {s.hex}
            </Typography.Text>
          </View>
        ))}
      </View>

      <View
        style={{ backgroundColor: "#1A1A1A", borderRadius: 12, padding: 14, marginTop: 4 }}
      >
        <Typography.Text
          style={{ color: "#E6E6E6", fontFamily: "monospace", fontSize: 11, lineHeight: 17 }}
        >
          {HANDOFF_SPEC}
        </Typography.Text>
      </View>
    </View>
  ),
};

// "Acme" brand — what a different brand consumer would look like. Demonstrates the
// rebrand recipe in code form.
const ACME_LIGHT = defineTheme({
  ...DEFAULT_THEME,
  name: "acme-light",
  primary: "#0066FF",
  secondary: "#0052CC",
  accent: "#FF6B35",
  bg: { ...DEFAULT_THEME.bg, page: "#FFFFFF", accent: "#E6F0FF" },
  text: { ...DEFAULT_THEME.text, primary: "#0A1628", accent: "#0052CC" },
  gradient: {
    primary: ["#0066FF", "#003D99"] as const,
    accent: ["#FF6B35", "#E65100"] as const,
  },
});

const ACME_DARK = defineTheme({
  ...DEFAULT_DARK_THEME,
  name: "acme-dark",
  primary: "#4D94FF",
  accent: "#FF8C5A",
  bg: { ...DEFAULT_DARK_THEME.bg, page: "#0A1628", card: "#1A2942" },
  text: { ...DEFAULT_DARK_THEME.text, primary: "#F0F4FA", accent: "#4D94FF" },
  gradient: {
    primary: ["#4D94FF", "#0066FF"] as const,
    accent: ["#FF8C5A", "#FF6B35"] as const,
  },
});

export const CustomBrand: Story = {
  render: () => (
    <View style={{ gap: 18, padding: 4 }}>
      <Typography.Text bold className="text-text-primary text-lg">
        Custom Brand (rebrand recipe)
      </Typography.Text>
      <Typography.Text className="text-text-secondary text-sm">
        Esto es cómo un consumer (Acme, ClientX, …) define su propio theme. Reemplaza paleta,
        gradientes y mantiene el resto de tokens (status, fonts, radius). Ver docs/REBRAND.md.
      </Typography.Text>
      <ThemePanel label="Acme · light" tokens={ACME_LIGHT} />
      <ThemePanel label="Acme · dark" tokens={ACME_DARK} />
    </View>
  ),
};
