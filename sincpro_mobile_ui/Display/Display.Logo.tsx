import { tv, type VariantProps } from "@sincpro/mobile-ui/theme/tw";
import { FC } from "react";
import { Image, type ImageSourcePropType, View } from "react-native";

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
  source?: ImageSourcePropType;
  className?: string;
}

function renderImage(imageClassName: string, source?: ImageSourcePropType) {
  if (!source) {
    return null;
  }
  return <Image className={imageClassName} resizeMode="contain" source={source} />;
}

const Logo: FC<LogoProps> = ({ source, size = "medium", className }) => {
  const styles = logo({ size });

  return (
    <View className={styles.container({ className })}>
      {renderImage(styles.image(), source)}
    </View>
  );
};

export default Logo;
