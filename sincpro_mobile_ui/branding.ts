import { type ImageSourcePropType } from "react-native";

export interface BrandingConfig {
  logo?: ImageSourcePropType;
}

let activeLogo: ImageSourcePropType | undefined;

export function setBranding(config: BrandingConfig): void {
  activeLogo = config.logo;
}

export function getBrandingLogo(): ImageSourcePropType | undefined {
  return activeLogo;
}
