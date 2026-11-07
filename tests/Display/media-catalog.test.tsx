import { afterEach, beforeEach, expect, jest, test } from "@jest/globals";
import Logo from "@sincpro/mobile-ui/Display/Display.Logo";
import MediaCard from "@sincpro/mobile-ui/Display/Display.MediaCard";
import MediaEmbed from "@sincpro/mobile-ui/Display/Display.MediaEmbed";
import ProductCard from "@sincpro/mobile-ui/Display/Display.ProductCard";
import Story from "@sincpro/mobile-ui/Display/Display.Story";
import StoryTray from "@sincpro/mobile-ui/Display/Display.StoryTray";
import StoryViewer from "@sincpro/mobile-ui/Display/Display.StoryViewer";
import EmptyState from "@sincpro/mobile-ui/Feedback/Feedback.EmptyState";
import AppSplashView from "@sincpro/mobile-ui/views/AppSplashView";
import { render, screen } from "@testing-library/react-native";
import { AccessibilityInfo, Text } from "react-native";

jest.mock("expo-image", () => {
  const React = jest.requireActual<typeof import("react")>("react");
  const { View } = jest.requireActual<typeof import("react-native")>("react-native");
  return {
    Image: (props: object) =>
      React.createElement(View, { ...props, testID: "expo-renderer" }),
  };
});
jest.mock("@sincpro/mobile-ui/Display/Display.Icon", () => () => null);
jest.mock("@sincpro/mobile-ui/Display/Display.GradientSurface", () => {
  const React = jest.requireActual<typeof import("react")>("react");
  const { View } = jest.requireActual<typeof import("react-native")>("react-native");
  return (props: object) => React.createElement(View, props);
});
jest.mock("@sincpro/mobile-ui/Display/Display.Pattern", () => ({ Pattern: () => null }));
jest.mock("@sincpro/mobile-ui/Feedback/Feedback.Skeleton", () => () => null);
jest.mock("@sincpro/mobile-ui/Feedback/Feedback.Spinner", () => () => null);
jest.mock("react-native-safe-area-context", () => ({
  useSafeAreaInsets: () => ({ top: 0, bottom: 0, left: 0, right: 0 }),
}));

beforeEach(() => {
  jest.spyOn(AccessibilityInfo, "isReduceMotionEnabled").mockResolvedValue(false);
});
afterEach(() => {
  jest.restoreAllMocks();
});

const source = "https://example.com/catalog.png";

test("catalog images, logos, illustrations and story previews share Expo caching/recycling", async () => {
  await render(
    <>
      <Logo source={source} />
      <Story image={source} label="Historia" variant="card" />
      <StoryTray
        create={{ image: source, onPress: jest.fn() }}
        stories={[{ id: "1", image: source }]}
      />
      <ProductCard image={source} price={20} title="Producto" />
      <MediaCard image={source} title="Imagen" />
      <MediaEmbed onPress={jest.fn()} thumbnail={source} />
      <EmptyState image={source} title="Vacío" />
      <AppSplashView loader={<Text>Cargando</Text>} logo={source} />
    </>,
  );
  const images = screen.getAllByTestId("expo-renderer");
  expect(images).toHaveLength(11);
  for (const image of images) {
    expect(image.props.cachePolicy).toBe("disk");
    expect(image.props.recyclingKey).toBe(JSON.stringify(source));
    expect(image.props.source).toBe(source);
  }
  expect(images[0].props.contentFit).toBe("contain");
});

test("story viewer uses the same renderer for its slide and author image", async () => {
  await render(
    <StoryViewer
      avatar={source}
      index={0}
      onClose={jest.fn()}
      onIndexChange={jest.fn()}
      slides={[{ image: source }]}
      title="Historia"
      visible
    />,
  );
  const images = screen.getAllByTestId("expo-renderer");
  expect(images).toHaveLength(2);
  expect(images[0].props.contentFit).toBe("contain");
  for (const image of images) expect(image.props.cachePolicy).toBe("disk");
});
