import type { ImageSource } from "@sincpro/mobile-ui/utils/image";
import { type ImageSourcePropType } from "react-native";

/**
 * Centralized brand assets. Set once at app boot via `setBranding({ ... })`. Components
 * that need the brand logo or mesh symbol read these getters — no need to thread an
 * asset through every consumer.
 *
 * @example
 *   // app boot (e.g. createAppShell / app entrypoint)
 *   setBranding({
 *     logo: require("./assets/logo.png"),
 *     mesh: require("./assets/brand-mesh.png"),
 *     meshSize: 56,
 *   });
 */
export interface BrandingConfig {
  /** Brand logo (used by `Display.Logo`, `widgets.ScreenHeader`, etc.). */
  logo?: ImageSource;
  /** Brand symbol / icon used by `Display.Pattern kind="mesh"` as the tiled texture. */
  mesh?: ImageSourcePropType;
  /** Tile size in px (overrides `theme.pattern.size` for the brand mesh). */
  meshSize?: number;
}

interface BrandingState {
  logo: ImageSource | undefined;
  mesh: ImageSourcePropType | undefined;
  meshSize: number | undefined;
}

const state: BrandingState = { logo: undefined, mesh: undefined, meshSize: undefined };

export function setBranding(config: BrandingConfig): void {
  if (config.logo !== undefined) state.logo = config.logo;
  if (config.mesh !== undefined) state.mesh = config.mesh;
  if (config.meshSize !== undefined) state.meshSize = config.meshSize;
}

export function getBrandingLogo(): ImageSource | undefined {
  return state.logo;
}

export function getBrandingMesh(): ImageSourcePropType | undefined {
  return state.mesh;
}

export function getBrandingMeshSize(): number | undefined {
  return state.meshSize;
}

/** Test-only — reset to initial empty state. Not part of the public API. */
export function __resetBranding(): void {
  state.logo = undefined;
  state.mesh = undefined;
  state.meshSize = undefined;
}
