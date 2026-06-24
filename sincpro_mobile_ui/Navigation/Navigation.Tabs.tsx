import Icon from "@sincpro/mobile-ui/Display/Display.Icon";
import { useTheme } from "@sincpro/mobile-ui/theme";
import { cn } from "@sincpro/mobile-ui/theme/tw";
import { Typography } from "@sincpro/mobile-ui/Typography";
import { createContext, type ReactNode, useCallback, useContext, useState } from "react";
import { TouchableOpacity, View } from "react-native";

type TabsVariant = "underline" | "filled";

interface TabsContextValue {
  value: string;
  setValue: (value: string) => void;
  variant: TabsVariant;
}

const TabsContext = createContext<TabsContextValue | null>(null);

function useTabs(): TabsContextValue {
  const ctx = useContext(TabsContext);
  if (!ctx) {
    throw new Error("Tabs.* debe usarse dentro de <Tabs>");
  }
  return ctx;
}

export interface TabsProps {
  value?: string;
  defaultValue?: string;
  onValueChange?: (value: string) => void;
  variant?: TabsVariant;
  className?: string;
  children: ReactNode;
}

function TabsRoot({
  value,
  defaultValue,
  onValueChange,
  variant = "underline",
  className,
  children,
}: TabsProps) {
  const [internal, setInternal] = useState(defaultValue ?? "");
  const current = value ?? internal;

  const setValue = useCallback(
    (next: string) => {
      if (value === undefined) setInternal(next);
      onValueChange?.(next);
    },
    [value, onValueChange],
  );

  return (
    <TabsContext.Provider value={{ value: current, setValue, variant }}>
      <View className={cn("flex-1", className)}>{children}</View>
    </TabsContext.Provider>
  );
}

function TabsList({ children, className }: { children: ReactNode; className?: string }) {
  const { variant } = useTabs();

  if (variant === "filled") {
    return (
      <View
        accessibilityRole="tablist"
        className={cn("flex-row rounded-xl p-1", className)}
        style={{ backgroundColor: "#E5E7EB" }}
      >
        {children}
      </View>
    );
  }

  return (
    <View
      accessibilityRole="tablist"
      className={cn("flex-row border-b border-border-default", className)}
    >
      {children}
    </View>
  );
}

export interface TabsTriggerProps {
  value: string;
  children: ReactNode;
  icon?: string;
  iconLayout?: "top" | "left";
}

function TabsTrigger({ value, children, icon, iconLayout = "left" }: TabsTriggerProps) {
  const theme = useTheme();
  const { value: active, setValue, variant } = useTabs();
  const selected = active === value;
  const iconColor = selected ? theme.primary : theme.text.secondary;

  if (variant === "filled") {
    return (
      <TouchableOpacity
        accessibilityRole="tab"
        accessibilityState={{ selected }}
        activeOpacity={0.7}
        className="flex-1 items-center justify-center rounded-lg py-2"
        onPress={() => setValue(value)}
        style={selected ? { backgroundColor: theme.bg.card, ...theme.shadow.sm } : {}}
      >
        <View
          className={cn(
            "items-center",
            iconLayout === "left" && icon ? "flex-row gap-1.5" : "gap-1",
          )}
        >
          {icon && iconLayout === "top" && <Icon color={iconColor} name={icon} size={16} />}
          {icon && iconLayout === "left" && <Icon color={iconColor} name={icon} size={14} />}
          <Typography.Text
            semibold={selected}
            style={{ color: iconColor }}
            variant="bodySmall"
          >
            {children}
          </Typography.Text>
        </View>
      </TouchableOpacity>
    );
  }

  // underline variant
  return (
    <TouchableOpacity
      accessibilityRole="tab"
      accessibilityState={{ selected }}
      activeOpacity={0.7}
      className="flex-1 items-center"
      onPress={() => setValue(value)}
    >
      <View
        className={cn(
          "py-3",
          iconLayout === "top" && icon
            ? "items-center gap-1"
            : "flex-row items-center gap-1.5",
        )}
      >
        {icon && iconLayout === "top" && <Icon color={iconColor} name={icon} size={18} />}
        {icon && iconLayout === "left" && <Icon color={iconColor} name={icon} size={14} />}
        <Typography.Text semibold={selected} style={{ color: iconColor }}>
          {children}
        </Typography.Text>
      </View>
      <View
        className="h-0.5 w-full"
        style={{ backgroundColor: selected ? theme.primary : "transparent" }}
      />
    </TouchableOpacity>
  );
}

function TabsContent({ value, children }: { value: string; children: ReactNode }) {
  const { value: active } = useTabs();
  if (active !== value) return null;
  return <View className="flex-1">{children}</View>;
}

const Tabs = Object.assign(TabsRoot, {
  List: TabsList,
  Trigger: TabsTrigger,
  Content: TabsContent,
});

export default Tabs;
export { Tabs };
