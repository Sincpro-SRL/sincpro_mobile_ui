import { AppSplashView } from "@sincpro/mobile-ui/views/AppSplashView";
import type { Meta, StoryObj } from "@storybook/react-native";
import { View } from "react-native";

const meta: Meta = { title: "Views/Splash" };
export default meta;

type Story = StoryObj;

export const Default: Story = {
  render: () => (
    <View style={{ height: 520, borderRadius: 24, overflow: "hidden" }}>
      <AppSplashView />
    </View>
  ),
};

export const WithGradientAndPattern: Story = {
  render: () => (
    <View style={{ height: 520, borderRadius: 24, overflow: "hidden" }}>
      <AppSplashView
        background={{
          colors: ["#022B14", "#065E2B", "#0DAF57"],
          pattern: "grid",
          patternOpacity: 0.12,
          patternColor: "#FFFFFF",
        }}
      />
    </View>
  ),
};

export const LoadingDots: Story = {
  render: () => (
    <View style={{ height: 520, borderRadius: 24, overflow: "hidden" }}>
      <AppSplashView loadingVariant="dots" />
    </View>
  ),
};

export const LoadingRipple: Story = {
  render: () => (
    <View style={{ height: 520, borderRadius: 24, overflow: "hidden" }}>
      <AppSplashView loadingVariant="ripple" />
    </View>
  ),
};

export const LoadingRippleWithPattern: Story = {
  render: () => (
    <View style={{ height: 520, borderRadius: 24, overflow: "hidden" }}>
      <AppSplashView
        background={{
          colors: ["#022B14", "#065E2B", "#0DAF57"],
          pattern: "grid",
          patternOpacity: 0.12,
          patternColor: "#FFFFFF",
        }}
        loadingVariant="ripple"
      />
    </View>
  ),
};
