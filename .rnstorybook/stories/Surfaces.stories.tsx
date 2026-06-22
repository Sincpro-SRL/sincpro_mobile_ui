import { Display } from "@sincpro/mobile-ui/Display";
import Splash from "@sincpro/mobile-ui/Feedback/Feedback.Splash";
import { Form } from "@sincpro/mobile-ui/Form";
import { Typography } from "@sincpro/mobile-ui/Typography";
import type { Meta, StoryObj } from "@storybook/react-native";
import { View } from "react-native";

const meta: Meta = { title: "Foundations/Surfaces" };
export default meta;

type Story = StoryObj;

function Label({ children }: { children: string }) {
  return (
    <Typography.Text className="text-text-tertiary px-1" variant="caption">
      {children}
    </Typography.Text>
  );
}

export const Gradients: Story = {
  render: () => (
    <View style={{ gap: 14, padding: 4 }}>
      <Label>neón → teal</Label>
      <Display.GradientSurface preset="neon-teal" style={{ height: 90 }} />
      <Label>noche + verde</Label>
      <Display.GradientSurface preset="night-green" style={{ height: 90 }} />
      <Label>mesh / aurora</Label>
      <Display.GradientSurface preset="mesh" style={{ height: 90 }} />
      <Label>emerald</Label>
      <Display.GradientSurface preset="emerald" style={{ height: 90 }} />
    </View>
  ),
};

export const Textures: Story = {
  render: () => (
    <View style={{ gap: 14, padding: 4 }}>
      <Label>puntos (sobre superficie oscura)</Label>
      <View
        style={{
          height: 90,
          borderRadius: 16,
          overflow: "hidden",
          backgroundColor: "#0B1410",
        }}
      >
        <Display.Pattern color="#22E584" kind="dots" opacity={0.5} />
      </View>
      <Label>grilla (sobre superficie clara)</Label>
      <View
        style={{
          height: 90,
          borderRadius: 16,
          overflow: "hidden",
          backgroundColor: "#FAFAFA",
        }}
      >
        <Display.Pattern color="#0B0B0B" kind="grid" opacity={0.12} />
      </View>
      <Label>diagonales (sobre superficie oscura)</Label>
      <View
        style={{
          height: 90,
          borderRadius: 16,
          overflow: "hidden",
          backgroundColor: "#0B1410",
        }}
      >
        <Display.Pattern color="#22E584" kind="diagonals" opacity={0.25} />
      </View>
    </View>
  ),
};

// Real use case: a "hero" dashboard card (gradient + dotted texture + content on top).
export const HeroCardUseCase: Story = {
  render: () => (
    <View style={{ padding: 4 }}>
      <Label>Caso de uso · tarjeta hero (gradiente + textura + contenido)</Label>
      <Display.GradientSurface padding="lg" preset="night-green" style={{ marginTop: 6 }}>
        <Display.Pattern color="#22E584" kind="dots" opacity={0.18} size={24} />
        <Typography.Text style={{ color: "#22E584", fontSize: 13, marginBottom: 4 }}>
          Caja de hoy
        </Typography.Text>
        <Typography.Text bold style={{ color: "#FFFFFF", fontSize: 30 }}>
          Bs 4.280
        </Typography.Text>
        <View style={{ marginTop: 16, alignSelf: "flex-start" }}>
          <Form.Button
            onPress={() => {}}
            size="small"
            title="Registrar venta"
            variant="cta"
          />
        </View>
      </Display.GradientSurface>
    </View>
  ),
};

export const SplashHero: Story = {
  render: () => (
    <View style={{ height: 520, borderRadius: 24, overflow: "hidden" }}>
      <Splash isReady={false} subtitle="gestión · v2.0" title="SINCPRO" variant="hero" />
    </View>
  ),
};
