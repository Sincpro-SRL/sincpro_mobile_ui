/* eslint-disable react-hooks/refs */
// useRef(new Animated.Value()).current and PanResponder-in-useState are intentional RN patterns.
import Icon from "@sincpro/mobile-ui/Display/Display.Icon";
import Pressable from "@sincpro/mobile-ui/primitives/Pressable";
import { useTheme } from "@sincpro/mobile-ui/theme";
import { cn } from "@sincpro/mobile-ui/theme/tw";
import { Typography } from "@sincpro/mobile-ui/Typography";
import { type ReactNode, useEffect, useRef, useState } from "react";
import { Animated, PanResponder, ScrollView, useWindowDimensions, View } from "react-native";

export interface DockProps {
  primaryAction: ReactNode;
  children: ReactNode;
  summary?: ReactNode;
  title?: string;
  moreLabel?: string;
  collapseLabel?: string;
  maxExpandedHeightRatio?: number;
  placement?: "fixed" | "footer";
  className?: string;
  testID?: string;
}

function Dock({
  primaryAction,
  children,
  summary,
  title = "Más opciones",
  moreLabel = "Más opciones",
  collapseLabel = "Ocultar opciones",
  maxExpandedHeightRatio = 0.6,
  placement = "fixed",
  className,
  testID,
}: DockProps) {
  const [expanded, setExpanded] = useState(false);
  const expandedRef = useRef(expanded);
  expandedRef.current = expanded;
  const theme = useTheme();
  const { height } = useWindowDimensions();
  const resolvedRatio = Number.isFinite(maxExpandedHeightRatio)
    ? Math.min(0.9, Math.max(0.1, maxExpandedHeightRatio))
    : 0.6;
  const maxExpandedHeight = Math.round(height * resolvedRatio);
  const [panelHeight, setPanelHeight] = useState(0);
  const [hasMeasuredContent, setHasMeasuredContent] = useState(false);
  const translateY = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.spring(translateY, {
      toValue: expanded ? 0 : panelHeight,
      useNativeDriver: true,
      damping: 24,
      stiffness: 260,
    }).start();
  }, [expanded, panelHeight, translateY]);

  const handleContentSizeChange = (_: number, contentHeight: number) => {
    const nextPanelHeight = Math.min(contentHeight + 32, maxExpandedHeight);
    setHasMeasuredContent(true);
    setPanelHeight((currentHeight) =>
      currentHeight === nextPanelHeight ? currentHeight : nextPanelHeight,
    );
    if (!expandedRef.current) {
      translateY.setValue(nextPanelHeight);
    }
  };

  const toggleExpanded = () => setExpanded((current) => !current);
  const [pan] = useState(() =>
    PanResponder.create({
      onStartShouldSetPanResponder: () => false,
      onMoveShouldSetPanResponder: (_, gesture) =>
        expandedRef.current ? gesture.dy > 5 : gesture.dy < -5,
      onPanResponderRelease: (_, gesture) => {
        if (expandedRef.current && (gesture.dy > 40 || gesture.vy > 0.5)) {
          setExpanded(false);
        } else if (!expandedRef.current && (gesture.dy < -40 || gesture.vy < -0.5)) {
          setExpanded(true);
        }
      },
    }),
  );

  return (
    <View
      className={cn(
        "gap-3",
        placement === "fixed" &&
          "absolute bottom-0 left-0 right-0 z-20 border-t border-border-light bg-bg-card px-4 pb-2 pt-3",
        className,
      )}
      style={placement === "fixed" ? { elevation: 10 } : undefined}
      testID={testID}
    >
      <View
        className="items-center py-1"
        {...pan.panHandlers}
        testID={testID ? `${testID}-handle` : undefined}
      >
        <View className="h-1 w-10 rounded-full bg-border-strong" />
      </View>
      <Animated.View
        accessibilityElementsHidden={!expanded}
        className="overflow-hidden rounded-t-2xl border border-border-light bg-bg-card p-4"
        importantForAccessibility={expanded ? "auto" : "no-hide-descendants"}
        onAccessibilityEscape={() => setExpanded(false)}
        pointerEvents={expanded ? "auto" : "none"}
        style={{
          position: "absolute",
          bottom: "100%",
          left: 0,
          right: 0,
          height: panelHeight,
          maxHeight: maxExpandedHeight,
          opacity: hasMeasuredContent ? 1 : 0,
          transform: [{ translateY }],
        }}
        testID={testID ? `${testID}-expanded-content` : undefined}
      >
        <ScrollView
          className="flex-1"
          contentContainerStyle={{ paddingBottom: 12 }}
          nestedScrollEnabled
          onContentSizeChange={handleContentSizeChange}
          showsVerticalScrollIndicator={false}
          testID={testID ? `${testID}-scroll` : undefined}
        >
          {title ? (
            <Typography.Text
              accessibilityRole="header"
              className="pb-2 text-text-primary"
              semibold
              variant="subtitle"
            >
              {title}
            </Typography.Text>
          ) : null}
          {children}
        </ScrollView>
      </Animated.View>
      {summary}
      <View className="flex-row items-center gap-3">
        <Pressable
          accessibilityLabel={expanded ? collapseLabel : moreLabel}
          accessibilityRole="button"
          accessibilityState={{ expanded }}
          className="min-h-11 flex-1 flex-row items-center justify-center gap-1 rounded-lg bg-bg-muted px-3"
          onPress={toggleExpanded}
          style={{ minHeight: 44 }}
          testID={testID ? `${testID}-more` : undefined}
        >
          <Typography.Text className="text-text-primary" variant="buttonSmall">
            {expanded ? collapseLabel : moreLabel}
          </Typography.Text>
          <Icon
            color={theme.icon.secondary}
            name={expanded ? "chevron-down" : "chevron-up"}
            size={16}
          />
        </Pressable>
        <View className="flex-1">{primaryAction}</View>
      </View>
    </View>
  );
}

export default Dock;
