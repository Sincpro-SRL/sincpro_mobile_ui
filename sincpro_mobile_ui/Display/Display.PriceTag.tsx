import { cn } from "@sincpro/mobile-ui/theme/tw";
import { Typography } from "@sincpro/mobile-ui/Typography";
import { View } from "react-native";

export interface PriceTagProps {
  amount: number;
  originalAmount?: number;
  currency?: string;
  size?: "sm" | "md" | "lg";
  className?: string;
  testID?: string;
}

const sizeMap = {
  sm: { price: "data" as const, original: "captionSmall" as const },
  md: { price: "data" as const, original: "caption" as const },
  lg: { price: "dataLarge" as const, original: "data" as const },
};

function format(amount: number, currency: string): string {
  const formatted = amount.toLocaleString("es-BO", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
  return `${currency} ${formatted}`;
}

function PriceTag({
  amount,
  originalAmount,
  currency = "Bs",
  size = "md",
  className,
  testID,
}: PriceTagProps) {
  const variants = sizeMap[size];
  const hasDiscount = typeof originalAmount === "number" && originalAmount > amount;
  const off = hasDiscount ? Math.round((1 - amount / originalAmount) * 100) : 0;

  return (
    <View className={cn("flex-row items-baseline gap-2", className)} testID={testID}>
      <Typography.Text className="text-text-primary" semibold variant={variants.price}>
        {format(amount, currency)}
      </Typography.Text>
      {hasDiscount ? (
        <>
          <Typography.Text
            className="text-text-tertiary"
            style={{ textDecorationLine: "line-through" }}
            variant={variants.original}
          >
            {format(originalAmount, currency)}
          </Typography.Text>
          <View className="bg-danger-light rounded px-1.5 py-0.5">
            <Typography.Text className="text-danger font-semibold" variant="caption">
              -{off}%
            </Typography.Text>
          </View>
        </>
      ) : null}
    </View>
  );
}

export default PriceTag;
