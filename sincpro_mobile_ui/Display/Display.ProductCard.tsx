import DisplayImage from "@sincpro/mobile-ui/Display/Display.Image";
import PriceTag from "@sincpro/mobile-ui/Display/Display.PriceTag";
import Rating from "@sincpro/mobile-ui/Display/Display.Rating";
import Pressable from "@sincpro/mobile-ui/primitives/Pressable";
import { theme } from "@sincpro/mobile-ui/theme";
import { cn } from "@sincpro/mobile-ui/theme/tw";
import { Typography } from "@sincpro/mobile-ui/Typography";
import type { ReactNode } from "react";
import { type ImageSourcePropType, View } from "react-native";

export interface ProductCardProps {
  title: string;
  image: ImageSourcePropType;
  price: number;
  originalPrice?: number;
  currency?: string;
  subtitle?: string;
  rating?: number;
  badge?: ReactNode;
  onPress?: () => void;
  className?: string;
  testID?: string;
}

function ProductCard({
  title,
  image,
  price,
  originalPrice,
  currency,
  subtitle,
  rating,
  badge,
  onPress,
  className,
  testID,
}: ProductCardProps) {
  return (
    <Pressable
      accessibilityLabel={title}
      className={cn(
        "bg-bg-card rounded-xl overflow-hidden border border-border-light",
        className,
      )}
      onPress={onPress}
      style={theme.shadow.sm}
      testID={testID}
    >
      <View>
        <DisplayImage aspectRatio={1} radius={0} source={image} />
        {badge ? <View className="absolute top-2 left-2">{badge}</View> : null}
      </View>
      <View className="p-3 gap-1">
        <Typography.Text
          className="text-text-primary"
          numberOfLines={1}
          semibold
          variant="body"
        >
          {title}
        </Typography.Text>
        {subtitle ? (
          <Typography.Text
            className="text-text-secondary"
            numberOfLines={1}
            variant="bodySmall"
          >
            {subtitle}
          </Typography.Text>
        ) : null}
        {typeof rating === "number" ? <Rating readOnly size={14} value={rating} /> : null}
        <View className="mt-1">
          <PriceTag
            amount={price}
            currency={currency}
            originalAmount={originalPrice}
            size="sm"
          />
        </View>
      </View>
    </Pressable>
  );
}

export default ProductCard;
