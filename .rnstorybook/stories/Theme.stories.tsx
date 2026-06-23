import { Display } from "@sincpro/mobile-ui/Display";
import { Form } from "@sincpro/mobile-ui/Form";
import {
  DEFAULT_DARK_THEME,
  DEFAULT_THEME,
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
      <Form.Button title="Secondary" variant="secondary" />
      <Form.Button title="Outline" variant="outline" />
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
  { hex: "#00C357", label: "primary · CTA", note: "verde marca" },
  { hex: "#FFFFFF", label: "on-primary", note: "texto sobre CTA" },
  { hex: "#000000", label: "bg", note: "base negra" },
  { hex: "#FAFAFA", label: "surface", note: "tarjetas / UI light" },
  { hex: "#0B0B0B", label: "ink", note: "texto" },
  { hex: "#6B6963", label: "muted", note: "texto secundario" },
  { hex: "#E4E2DD", label: "border", note: "bordes" },
  { hex: "#00C357", label: "success", note: "semántico" },
  { hex: "#FFB020", label: "warning", note: "semántico" },
  { hex: "#201DC4", label: "info", note: "semántico" },
  { hex: "#FF4D1F", label: "danger", note: "semántico" },
];

const HANDOFF_SPEC = `:root {
  /* Marca · base negra, UI light */
  --color-bg:        #000000;
  --color-surface:   #FAFAFA;
  --color-ink:       #0B0B0B;
  --color-muted:     #6B6963;
  --color-border:    #E4E2DD;

  /* Acción · CTA */
  --color-primary:    #00C357;
  --color-on-primary: #FFFFFF;

  /* Semánticos */
  --color-success: #00C357;
  --color-warning: #FFB020;
  --color-info:    #201DC4;
  --color-danger:  #FF4D1F;

  /* Tipografía por rol */
  --font-title:   "Satoshi";
  --font-body:    "Inter";
  --font-caption: "Fira Code";

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
