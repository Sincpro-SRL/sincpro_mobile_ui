import Icon from "@sincpro/mobile-ui/Display/Display.Icon";
import Pressable from "@sincpro/mobile-ui/primitives/Pressable";
import { theme } from "@sincpro/mobile-ui/theme";
import { View } from "react-native";

export interface RatingProps {
  value: number;
  max?: number;
  size?: number;
  onChange?: (value: number) => void;
  readOnly?: boolean;
  className?: string;
  testID?: string;
}

function Rating({
  value,
  max = 5,
  size = 24,
  onChange,
  readOnly = false,
  className,
  testID,
}: RatingProps) {
  const interactive = !readOnly && !!onChange;

  return (
    <View
      accessibilityLabel={`Calificación ${value} de ${max}`}
      accessibilityRole={interactive ? "adjustable" : "image"}
      className={className}
      style={{ flexDirection: "row", gap: 4 }}
      testID={testID}
    >
      {Array.from({ length: max }).map((_, index) => {
        const filled = index < Math.round(value);
        const star = (
          <Icon
            color={filled ? theme.warning : theme.icon.disabled}
            name={filled ? "star" : "star-outline"}
            size={size}
          />
        );

        if (!interactive) return <View key={index}>{star}</View>;

        return (
          <Pressable
            accessibilityLabel={`${index + 1} estrellas`}
            hitSlop={6}
            key={index}
            onPress={() => onChange?.(index + 1)}
          >
            {star}
          </Pressable>
        );
      })}
    </View>
  );
}

export default Rating;
