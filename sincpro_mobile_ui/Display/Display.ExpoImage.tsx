import { imageSourceKey } from "@sincpro/mobile-ui/utils/image";
import { useReducedMotion } from "@sincpro/mobile-ui/utils/useReducedMotion";
import { Image } from "expo-image";
import { cssInterop } from "nativewind";
import type { ComponentPropsWithRef } from "react";

const StyledImage = cssInterop(Image, { className: "style" });

export type ExpoImageProps = Omit<
  ComponentPropsWithRef<typeof Image>,
  "resizeMode" | "defaultSource" | "loadingIndicatorSource"
> & {
  className?: string;
};

function ExpoImage({
  cachePolicy = "disk",
  transition = 0,
  autoplay = true,
  sfEffect,
  onError,
  source,
  recyclingKey,
  ...props
}: ExpoImageProps) {
  const reducedMotion = useReducedMotion();

  return (
    <StyledImage
      {...props}
      autoplay={autoplay && !reducedMotion}
      cachePolicy={cachePolicy}
      onError={(event) => {
        console.error("[ExpoImage] Image load failed", event.error);
        onError?.(event);
      }}
      recyclingKey={recyclingKey === undefined ? imageSourceKey(source) : recyclingKey}
      sfEffect={reducedMotion ? null : sfEffect}
      source={source}
      transition={reducedMotion ? 0 : transition}
    />
  );
}

export default ExpoImage;
export { ExpoImage };
