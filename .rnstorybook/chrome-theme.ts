import type { Theme } from "@storybook/react-native-theming";

/**
 * Partial theme merged onto Storybook's light or dark chrome.
 * Sizes land in the on-device navigation, which renders `s2 - 1`.
 */
export const storybookChrome = {
  appBorderRadius: 14,
  brand: { title: "Sincpro" },
  typography: {
    weight: { regular: "400", bold: "600" },
    size: { s1: 13, s2: 16, s3: 18, m1: 22 },
  },
} satisfies {
  appBorderRadius: number;
  brand: { title: string };
  typography: Pick<Theme["typography"], "weight"> & {
    size: Partial<Theme["typography"]["size"]>;
  };
};
