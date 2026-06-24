import Icon from "@sincpro/mobile-ui/Display/Display.Icon";
import Pressable from "@sincpro/mobile-ui/primitives/Pressable";
import { useTheme } from "@sincpro/mobile-ui/theme";
import { cn } from "@sincpro/mobile-ui/theme/tw";
import { Typography } from "@sincpro/mobile-ui/Typography";
import { cloneElement, type ReactElement, type ReactNode, useRef, useState } from "react";
import { Dimensions, Modal, Pressable as RNPressable, View } from "react-native";

export interface MenuItem {
  label: string;
  icon?: string;
  destructive?: boolean;
  disabled?: boolean;
  onPress: () => void;
}

export interface MenuSeparator {
  separator: true;
}

export type MenuEntry = MenuItem | MenuSeparator;

export interface MenuProps {
  items: MenuEntry[];
  trigger?: ReactNode;
  menuWidth?: number;
  testID?: string;
}

interface Anchor {
  x: number;
  y: number;
  width: number;
  height: number;
}

function Menu({ items, trigger, menuWidth = 220, testID }: MenuProps) {
  const theme = useTheme();
  const triggerRef = useRef<View>(null);
  const [anchor, setAnchor] = useState<Anchor | null>(null);

  const open = () => {
    triggerRef.current?.measureInWindow((x, y, width, height) => {
      setAnchor({ x, y, width, height });
    });
  };

  const close = () => setAnchor(null);

  const screen = Dimensions.get("window");
  const right = anchor ? Math.max(8, screen.width - (anchor.x + anchor.width)) : 8;
  const top = anchor ? anchor.y + anchor.height + 4 : 0;

  return (
    <View collapsable={false} ref={triggerRef} testID={testID}>
      {trigger ? (
        // eslint-disable-next-line react-hooks/refs
        cloneElement(trigger as ReactElement<{ onPress: () => void }>, { onPress: open })
      ) : (
        <Pressable
          accessibilityLabel="Más opciones"
          accessibilityRole="button"
          onPress={open}
        >
          <Icon color={theme.icon.secondary} name="ellipsis-vertical" size={22} />
        </Pressable>
      )}

      <Modal
        animationType="fade"
        onRequestClose={close}
        transparent
        visible={anchor !== null}
      >
        <RNPressable onPress={close} style={{ flex: 1 }}>
          <View
            className="rounded-lg py-1"
            style={{
              position: "absolute",
              top,
              right,
              width: menuWidth,
              backgroundColor: theme.bg.popover,
              borderWidth: 1,
              borderColor: theme.border.light,
              ...theme.shadow.lg,
            }}
          >
            {items.map((entry, index) => {
              if ("separator" in entry && entry.separator) {
                return <View className="my-1 h-px bg-border-default" key={`sep-${index}`} />;
              }
              const item = entry as MenuItem;
              return (
                <Pressable
                  accessibilityRole="menuitem"
                  accessibilityState={{ disabled: item.disabled }}
                  className="flex-row items-center gap-3 px-4 py-3"
                  disabled={item.disabled}
                  key={item.label}
                  onPress={() => {
                    close();
                    item.onPress();
                  }}
                >
                  {item.icon ? (
                    <Icon
                      color={item.destructive ? theme.danger : theme.icon.secondary}
                      name={item.icon}
                      size={18}
                    />
                  ) : null}
                  <Typography.Text
                    className={cn(
                      "flex-1 text-sm",
                      item.destructive ? "text-danger" : "text-text-primary",
                      item.disabled && "text-text-disabled",
                    )}
                  >
                    {item.label}
                  </Typography.Text>
                </Pressable>
              );
            })}
          </View>
        </RNPressable>
      </Modal>
    </View>
  );
}

export default Menu;
export { Menu };
