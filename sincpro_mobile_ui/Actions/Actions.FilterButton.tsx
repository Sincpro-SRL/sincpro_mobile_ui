import { tv } from "@sincpro/mobile-ui/theme/tw";
import { Typography } from "@sincpro/mobile-ui/Typography";
import { FC, ReactNode } from "react";
import { TouchableOpacity, View } from "react-native";

const filterButton = tv({
  base: "rounded-lg items-center justify-center py-2 px-3 min-h-[36px]",
  variants: {
    active: {
      true: "bg-primary border-0",
      false: "bg-transparent border border-brand-primary",
    },
  },
  defaultVariants: { active: false },
});

const filterText = tv({
  base: "font-bold",
  variants: {
    active: {
      true: "text-white",
      false: "text-primary",
    },
  },
  defaultVariants: { active: false },
});

export interface FilterButtonProps {
  title: string;
  active: boolean;
  onPress: () => void;
}

export const FilterButton: FC<FilterButtonProps> = ({ title, active, onPress }) => (
  <TouchableOpacity
    activeOpacity={0.8}
    className={filterButton({ active })}
    onPress={onPress}
  >
    <Typography.Text className={filterText({ active })} variant="buttonSmall">
      {title}
    </Typography.Text>
  </TouchableOpacity>
);

export function FilterButtonGroup({ children }: { children: ReactNode }) {
  return <View className="flex-row gap-2 p-3">{children}</View>;
}
