// Design System - Compound Components
export { Dialog } from "@sincpro/mobile-ui/Dialog";
export { Display } from "@sincpro/mobile-ui/Display";
export { Feedback } from "@sincpro/mobile-ui/Feedback";
export { Form } from "@sincpro/mobile-ui/Form";
export { Navigation } from "@sincpro/mobile-ui/Navigation";
export { Typography } from "@sincpro/mobile-ui/Typography";

// Primitives (NativeWind-based - Layout utilities)
export { Box, Row, Stack } from "@sincpro/mobile-ui/primitives";

// Branding (logo del app, configurado una vez; Display.Logo lo usa como fallback)
export {
  type BrandingConfig,
  getBrandingLogo,
  setBranding,
} from "@sincpro/mobile-ui/branding";

// Theme
export { cn, tv, type VariantProps } from "@sincpro/mobile-ui/theme/tw";
export {
  fontFamilies,
  fontSizes,
  fontWeights,
  letterSpacing,
  lineHeights,
  typographyVariants,
} from "@sincpro/mobile-ui/theme/typography";

// Layouts
export { BottomInsetContext } from "@sincpro/mobile-ui/layouts/BottomInset";
export { default as Container } from "@sincpro/mobile-ui/layouts/Container";
export { default as GradientContainer } from "@sincpro/mobile-ui/layouts/GradientContainer";
export { default as PlainLayout } from "@sincpro/mobile-ui/layouts/PlainLayout";
export { default as ScrollContainer } from "@sincpro/mobile-ui/layouts/ScrollContainer";
export { default as TabNavigatorLayout } from "@sincpro/mobile-ui/layouts/TabNavigatorLayout";

// Views
export { default as AuthFormView } from "@sincpro/mobile-ui/views/AuthFormView";
export { default as FormViewV2 } from "@sincpro/mobile-ui/views/FormViewV2";
export { default as ListViewV2 } from "@sincpro/mobile-ui/views/ListViewV2";

// Widgets
export { default as JSONViewer } from "@sincpro/mobile-ui/widgets/JSONViewer";
export { default as ScreenHeader } from "@sincpro/mobile-ui/widgets/ScreenHeader";
export * from "@sincpro/mobile-ui/widgets/ScreenHeader";
