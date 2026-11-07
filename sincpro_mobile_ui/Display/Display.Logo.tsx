import { getBrandingLogo } from "@sincpro/mobile-ui/branding";
import ExpoImage from "@sincpro/mobile-ui/Display/Display.ExpoImage";
import { tv, type VariantProps } from "@sincpro/mobile-ui/theme/tw";
import type { ImageSource } from "@sincpro/mobile-ui/utils/image";
import { FC } from "react";
import { View } from "react-native";

const logo = tv({
  slots: {
    container: "items-center justify-center",
    image: "",
  },
  variants: {
    size: {
      small: {
        image: "w-[120px] h-[80px]",
      },
      medium: {
        image: "w-[180px] h-[100px]",
      },
      large: {
        image: "w-[250px] h-[250px]",
      },
    },
  },
  defaultVariants: {
    size: "medium",
  },
});

export interface LogoProps extends VariantProps<typeof logo> {
  source?: ImageSource;
  className?: string;
}

function renderImage(imageClassName: string, source?: ImageSource) {
  if (!source) {
    return null;
  }
  return <ExpoImage className={imageClassName} contentFit="contain" source={source} />;
}

const Logo: FC<LogoProps> = ({ source, size = "medium", className }) => {
  const styles = logo({ size });
  const resolvedSource = source ?? getBrandingLogo();

  return (
    <View className={styles.container({ className })}>
      {renderImage(styles.image(), resolvedSource)}
    </View>
  );
};

export default Logo;
