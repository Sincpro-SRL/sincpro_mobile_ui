/* eslint-disable react-hooks/refs */
// useRef(new Animated.Value()).current and PanResponder-in-useState are intentional RN patterns.
import Icon from "@sincpro/mobile-ui/Display/Display.Icon";
import Pressable from "@sincpro/mobile-ui/primitives/Pressable";
import { useTheme } from "@sincpro/mobile-ui/theme";
import { cn } from "@sincpro/mobile-ui/theme/tw";
import { Typography } from "@sincpro/mobile-ui/Typography";
import { type ReactNode, useEffect, useRef, useState } from "react";
import {
  Animated,
  type GestureResponderEvent,
  PanResponder,
  type PanResponderGestureState,
  ScrollView,
  useWindowDimensions,
  View,
} from "react-native";

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
  const panelHeightRef = useRef(panelHeight);
  panelHeightRef.current = panelHeight;
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
  const shouldHandleSwipe = (_: GestureResponderEvent, gesture: PanResponderGestureState) => {
    const isVerticalSwipe =
      Math.abs(gesture.dy) > 8 && Math.abs(gesture.dy) > Math.abs(gesture.dx);
    return isVerticalSwipe && (expandedRef.current ? gesture.dy > 0 : gesture.dy < 0);
  };
  const settleAfterSwipe = (nextExpanded: boolean) => {
    if (expandedRef.current === nextExpanded) {
      Animated.spring(translateY, {
        toValue: nextExpanded ? 0 : panelHeightRef.current,
        useNativeDriver: true,
        damping: 24,
        stiffness: 260,
      }).start();
      return;
    }
    setExpanded(nextExpanded);
  };
  const [pan] = useState(() =>
    PanResponder.create({
      onStartShouldSetPanResponder: () => false,
      onMoveShouldSetPanResponder: shouldHandleSwipe,
      onMoveShouldSetPanResponderCapture: shouldHandleSwipe,
      onPanResponderTerminationRequest: () => false,
      onPanResponderMove: (_, gesture) => {
        const currentPanelHeight = panelHeightRef.current;
        const startY = expandedRef.current ? 0 : currentPanelHeight;
        translateY.setValue(Math.max(0, Math.min(currentPanelHeight, startY + gesture.dy)));
      },
      onPanResponderRelease: (_, gesture) => {
        const nextExpanded = expandedRef.current
          ? !(gesture.dy > 40 || gesture.vy > 0.5)
          : gesture.dy < -40 || gesture.vy < -0.5;
        settleAfterSwipe(nextExpanded);
      },
      onPanResponderTerminate: () => {
        settleAfterSwipe(expandedRef.current);
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
      style={placement === "fixed" ? { elevation: 10, zIndex: 20 } : undefined}
      testID={testID}
    >
      <View
        className="min-h-11 items-center justify-center py-2"
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
          zIndex: 21,
          elevation: 11,
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
