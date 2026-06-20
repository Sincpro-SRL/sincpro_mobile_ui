import { Display } from "@sincpro/mobile-ui/Display";
import Container from "@sincpro/mobile-ui/layouts/Container";
import { Typography } from "@sincpro/mobile-ui/Typography";
import React, { Children, isValidElement, ReactElement, ReactNode } from "react";
import { TouchableOpacity, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

interface TabNavigatorLayoutProps {
  className?: string;
  children?: ReactNode;
  content?: ReactNode;
  currentPath?: string;
  onTabPress?: (path: string) => void;
  persistentComponent?: ReactNode;
  persistentRoutePath?: string;
}

export interface TabProps {
  path: string;
  label: string;
  Icon: any;
  onReselect?: () => void;
}

interface TabNavigatorProps {
  items: TabProps[];
  currentPath?: string;
  onTabPress?: (path: string) => void;
}

function TabIcon({ focused, Icon }: { focused: boolean; Icon: any }): ReactElement {
  return (
    <View className="justify-center items-center w-10 h-10">
      {focused && <View className="absolute w-10 h-10 rounded-full bg-primary" />}
      <Display.Icon
        color={focused ? "#FFFFFF" : "#6B7280"}
        customIcon={Icon}
        size={24}
        type="custom"
      />
    </View>
  );
}

function TabNavigator({
  items,
  currentPath,
  onTabPress,
}: TabNavigatorProps): ReactElement | null {
  const insets = useSafeAreaInsets();
  const Text = Typography.Text;

  if (!items.length) return null;

  return (
    <View
      className="border-t border-border-default bg-bg-card"
      style={{ paddingBottom: Math.max(insets.bottom, 8) }}
    >
      <View className="mt-2 h-16 flex-row justify-around items-center px-2">
        {items.map(({ path, label, Icon, onReselect }) => {
          const focused = currentPath === path;

          return (
            <TouchableOpacity
              className="items-center justify-center flex-1"
              key={path}
              onPress={() => {
                if (focused && onReselect) {
                  onReselect();
                  return;
                }
                onTabPress?.(path);
              }}
            >
              <TabIcon focused={focused} Icon={Icon} />
              <Text
                className={`text-xs mt-1.5 font-medium ${focused ? "text-primary" : "text-text-secondary"}`}
              >
                {label}
              </Text>
            </TouchableOpacity>
          );
        })}
      </View>
    </View>
  );
}

function Tabs({ children: tabsChildren }: { children?: ReactNode }) {
  return <>{tabsChildren}</>;
}

function Tab(_props: TabProps) {
  return null;
}

function TabNavigatorLayoutComponent({
  className,
  children,
  content,
  currentPath,
  onTabPress,
  persistentComponent,
  persistentRoutePath,
}: TabNavigatorLayoutProps): ReactElement {
  const tabs: TabProps[] = [];

  Children.forEach(children, (child) => {
    if (!isValidElement(child)) return;
    if (child.type === Tabs) {
      const tabsChildren = (child.props as { children?: ReactNode }).children;

      Children.forEach(tabsChildren, (tabChild) => {
        if (!isValidElement(tabChild)) return;
        if (tabChild.type === Tab) {
          tabs.push(tabChild.props as TabProps);
        }
      });
    }
  });

  const isPersistentRouteActive =
    persistentRoutePath && currentPath ? currentPath.includes(persistentRoutePath) : false;

  return (
    <Container className={className} edges={["top", "left", "right"]}>
      <View className="flex-1 bg-bg-page">
        {persistentComponent && (
          <View style={{ flex: 1, display: isPersistentRouteActive ? "flex" : "none" }}>
            {persistentComponent}
          </View>
        )}
        <View style={{ flex: 1, display: isPersistentRouteActive ? "none" : "flex" }}>
          {content}
        </View>
      </View>
      <TabNavigator currentPath={currentPath} items={tabs} onTabPress={onTabPress} />
    </Container>
  );
}

type TabLayoutComponent = ((props: TabNavigatorLayoutProps) => ReactElement) & {
  Tabs: typeof Tabs;
  Tab: typeof Tab;
};

const TabNavigatorLayout = Object.assign(TabNavigatorLayoutComponent, {
  Tabs,
  Tab,
}) as TabLayoutComponent;

export default TabNavigatorLayout;
