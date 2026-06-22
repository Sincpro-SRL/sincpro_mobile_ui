import { theme } from "@sincpro/mobile-ui/theme";
import { cn } from "@sincpro/mobile-ui/theme/tw";
import { Typography } from "@sincpro/mobile-ui/Typography";
import { createContext, type ReactNode, useCallback, useContext, useState } from "react";
import { TouchableOpacity, View } from "react-native";

interface TabsContextValue {
  value: string;
  setValue: (value: string) => void;
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
  className?: string;
  children: ReactNode;
}

function TabsRoot({ value, defaultValue, onValueChange, className, children }: TabsProps) {
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
    <TabsContext.Provider value={{ value: current, setValue }}>
      <View className={cn("flex-1", className)}>{children}</View>
    </TabsContext.Provider>
  );
}

function TabsList({ children, className }: { children: ReactNode; className?: string }) {
  return (
    <View
      accessibilityRole="tablist"
      className={cn("flex-row border-b border-border-default", className)}
    >
      {children}
    </View>
  );
}

function TabsTrigger({ value, children }: { value: string; children: ReactNode }) {
  const { value: active, setValue } = useTabs();
  const selected = active === value;

  return (
    <TouchableOpacity
      accessibilityRole="tab"
      accessibilityState={{ selected }}
      activeOpacity={0.7}
      className="flex-1 items-center"
      onPress={() => setValue(value)}
    >
      <View className="py-3">
        <Typography.Text
          semibold={selected}
          style={{ color: selected ? theme.primary : theme.text.secondary }}
        >
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
