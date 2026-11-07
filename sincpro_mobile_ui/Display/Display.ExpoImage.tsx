import { useReducedMotion } from "@sincpro/mobile-ui/utils/useReducedMotion";
import { Image } from "expo-image";
import { cssInterop } from "nativewind";
import type { ComponentPropsWithRef } from "react";

const StyledImage = cssInterop(Image, { className: "style" });

export type ExpoImageProps = ComponentPropsWithRef<typeof Image> & {
  className?: string;
};

function ExpoImage({
  cachePolicy = "disk",
  transition = 0,
  autoplay = true,
  sfEffect,
  onError,
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
      sfEffect={reducedMotion ? null : sfEffect}
      transition={reducedMotion ? 0 : transition}
    />
  );
}

export default ExpoImage;
export { ExpoImage };
