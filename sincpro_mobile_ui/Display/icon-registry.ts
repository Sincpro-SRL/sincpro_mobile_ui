import type { ReactNode } from "react";
import type { ColorValue } from "react-native";

/**
 * Apps add their own icons (brand SVGs, product glyphs) by name:
 *
 *   declare module "@sincpro/mobile-ui/Display/icon-registry" {
 *     interface CustomIconRegistry { odoo: true }
 *   }
 *   registerIcons({ odoo: ({ size, color }) => <OdooLogo color={color} size={size} /> });
 *
 * Then `<Display.Icon name="odoo" />` works like any built-in icon.
 */
// eslint-disable-next-line @typescript-eslint/no-empty-object-type
export interface CustomIconRegistry {}

export type CustomIconName = Extract<keyof CustomIconRegistry, string>;

export type CustomIconRenderer = (props: { size: number; color: ColorValue }) => ReactNode;

const renderers = new Map<string, CustomIconRenderer>();

export function registerIcons(icons: Partial<Record<CustomIconName, CustomIconRenderer>>) {
  for (const [name, renderer] of Object.entries(icons)) {
    if (renderer) renderers.set(name, renderer as CustomIconRenderer);
  }
}

export function customIconRenderer(name: string): CustomIconRenderer | undefined {
  return renderers.get(name);
}
