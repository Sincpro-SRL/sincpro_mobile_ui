import { Display } from "@sincpro/mobile-ui/Display";
import Splash from "@sincpro/mobile-ui/Feedback/Feedback.Splash";
import { Form } from "@sincpro/mobile-ui/Form";
import { useTheme } from "@sincpro/mobile-ui/theme";
import { Typography } from "@sincpro/mobile-ui/Typography";
import type { Meta, StoryObj } from "@storybook/react-native";
import { View } from "react-native";

// Demo "walls" for the brand texture showcase. Fixed (not theme-aware) so the contrast
// is always visible regardless of which theme the storybook is set to.
const DEMO_WALL_BONE = "#FAF8F3";
const DEMO_WALL_INK = "#0C0C0C";

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
      <Label>warm (default brand preset)</Label>
      <Display.GradientSurface preset="warm" style={{ height: 90 }} />
      <Label>info (#0F5C6E → #5CC4D8)</Label>
      <Display.GradientSurface preset="neon-teal" style={{ height: 90 }} />
      <Label>chrome (#0B101E → #18223A)</Label>
      <Display.GradientSurface preset="night-green" style={{ height: 90 }} />
      <Label>navy (#1C3765 → #8FA9E8)</Label>
      <Display.GradientSurface preset="mesh" style={{ height: 90 }} />
      <Label>good (#2F6B3C → #6FCF8B)</Label>
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
        <Display.Pattern color="#2A4A85" kind="dots" opacity={0.5} />
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
        <Display.Pattern color="#2A4A85" kind="diagonals" opacity={0.25} />
      </View>
    </View>
  ),
};

// Brand-mesh textures — the three default variants for the brand symbol. Consumers can
// swap the asset via the `meshSrc` prop on `<Display.Pattern />` or by overriding
// `theme.pattern.source`. The bundled default is a black symbol on transparent bg, so the
// dark modes flip it via SVG ColorMatrix to produce a light symbol on the ink surface.
function BrandTexturesBody() {
  const theme = useTheme();
  return (
    <View style={{ gap: 14, padding: 4 }}>
      <Label>brand · light-pattern (bone wall + gold border · showcase)</Label>
      <View
        style={{
          height: 140,
          borderRadius: 16,
          overflow: "hidden",
          backgroundColor: DEMO_WALL_BONE,
          borderWidth: 1,
          borderColor: theme.primary,
        }}
      >
        <Display.Pattern kind="mesh" mode="light-pattern" />
      </View>
      <Label>brand · dark-pattern (ink wall · hero subtle)</Label>
      <View
        style={{
          height: 140,
          borderRadius: 16,
          overflow: "hidden",
          backgroundColor: DEMO_WALL_INK,
        }}
      >
        <Display.Pattern kind="mesh" mode="dark-pattern" />
      </View>
      <Label>brand · dark-full (ink wall · signature 55%)</Label>
      <View
        style={{
          height: 140,
          borderRadius: 16,
          overflow: "hidden",
          backgroundColor: DEMO_WALL_INK,
        }}
      >
        <Display.Pattern kind="mesh" mode="dark-full" />
      </View>
    </View>
  );
}

export const BrandTextures: Story = { render: BrandTexturesBody };

// Real use case: a "hero" dashboard card (ink surface + brand texture inverted + content on top).
// Matches the dark-pattern brand texture — black background, light symbol subtle.
function HeroCardBody() {
  const theme = useTheme();
  return (
    <View style={{ padding: 4 }}>
      <Label>Caso de uso · tarjeta hero (ink wall + brand dark-pattern + contenido)</Label>
      <View
        style={{
          marginTop: 6,
          borderRadius: 16,
          overflow: "hidden",
          backgroundColor: DEMO_WALL_INK,
          padding: 24,
          minHeight: 140,
        }}
      >
        <Display.Pattern kind="mesh" mode="dark-pattern" />
        <Typography.Text style={{ color: theme.text.primary, fontSize: 13, marginBottom: 4 }}>
          Caja de hoy
        </Typography.Text>
        <Typography.Text bold style={{ color: theme.text.inverse, fontSize: 30 }}>
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
      </View>
    </View>
  );
}

export const HeroCardUseCase: Story = { render: HeroCardBody };

export const SplashHero: Story = {
  render: () => (
    <View style={{ height: 520, borderRadius: 24, overflow: "hidden" }}>
      <Splash isReady={false} subtitle="gestión · v2.0" title="BRAND" variant="hero" />
    </View>
  ),
};

// Brand textures at different tile densities — pick what fits the surface.
export const BrandTextureSizes: Story = {
  render: () => (
    <View style={{ gap: 14, padding: 4 }}>
      <Label>size 40px (watermark · muy denso)</Label>
      <View
        style={{
          height: 110,
          borderRadius: 16,
          overflow: "hidden",
          backgroundColor: DEMO_WALL_INK,
        }}
      >
        <Display.Pattern kind="mesh" mode="dark-pattern" size={40} />
      </View>
      <Label>size 56px (default mobile · brand)</Label>
      <View
        style={{
          height: 110,
          borderRadius: 16,
          overflow: "hidden",
          backgroundColor: DEMO_WALL_INK,
        }}
      >
        <Display.Pattern kind="mesh" mode="dark-pattern" size={56} />
      </View>
      <Label>size 80px (más aire · hero)</Label>
      <View
        style={{
          height: 110,
          borderRadius: 16,
          overflow: "hidden",
          backgroundColor: DEMO_WALL_INK,
        }}
      >
        <Display.Pattern kind="mesh" mode="dark-pattern" size={80} />
      </View>
    </View>
  ),
};
