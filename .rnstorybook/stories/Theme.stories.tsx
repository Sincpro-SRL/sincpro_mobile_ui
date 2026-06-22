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
import { ScrollView, View } from "react-native";

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
    <ScrollView contentContainerStyle={{ gap: 12 }}>
      <Typography.Text bold className="text-text-primary text-lg">
        Tokens activos — {tokens.name}
      </Typography.Text>
      <Typography.Text className="text-text-secondary text-sm">
        Cambia el tema desde la toolbar (Light / Dark). Reactivo vía useTheme().
      </Typography.Text>
      <Palette tokens={tokens} />
    </ScrollView>
  );
}

export const ActiveTokens: Story = {
  render: () => <ActiveTokensView />,
};

export const LightVsDark: Story = {
  render: () => (
    <ScrollView contentContainerStyle={{ gap: 16 }}>
      <ThemePanel label="Light" tokens={DEFAULT_THEME} />
      <ThemePanel label="Dark" tokens={DEFAULT_DARK_THEME} />
    </ScrollView>
  ),
};
