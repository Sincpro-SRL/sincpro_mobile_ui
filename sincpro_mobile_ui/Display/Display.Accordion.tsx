import Icon from "@sincpro/mobile-ui/Display/Display.Icon";
import Pressable from "@sincpro/mobile-ui/primitives/Pressable";
import { theme } from "@sincpro/mobile-ui/theme";
import { cn } from "@sincpro/mobile-ui/theme/tw";
import { Typography } from "@sincpro/mobile-ui/Typography";
import { type ReactNode, useState } from "react";
import { LayoutAnimation, View } from "react-native";

export interface AccordionItemProps {
  title: string;
  children: ReactNode;
  defaultOpen?: boolean;
  className?: string;
  testID?: string;
}

function AccordionItem({
  title,
  children,
  defaultOpen = false,
  className,
  testID,
}: AccordionItemProps) {
  const [open, setOpen] = useState(defaultOpen);

  const toggle = () => {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    setOpen((prev) => !prev);
  };

  return (
    <View className={cn("border-b border-border-default", className)} testID={testID}>
      <Pressable
        accessibilityRole="button"
        accessibilityState={{ expanded: open }}
        className="flex-row items-center justify-between py-3"
        onPress={toggle}
      >
        <Typography.Text className="flex-1 text-text-primary" semibold>
          {title}
        </Typography.Text>
        <View style={{ transform: [{ rotate: open ? "180deg" : "0deg" }] }}>
          <Icon color={theme.icon.secondary} name="chevron-down" size={18} />
        </View>
      </Pressable>
      {open ? <View className="pb-3">{children}</View> : null}
    </View>
  );
}

function AccordionRoot({ children, className }: { children: ReactNode; className?: string }) {
  return <View className={cn("bg-bg-card rounded-lg", className)}>{children}</View>;
}

const Accordion = Object.assign(AccordionRoot, { Item: AccordionItem });

export default Accordion;
export { Accordion };
