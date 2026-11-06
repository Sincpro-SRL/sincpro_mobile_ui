/* eslint-disable react-hooks/refs */
import Icon from "@sincpro/mobile-ui/Display/Display.Icon";
import Pressable from "@sincpro/mobile-ui/primitives/Pressable";
import { themeToVars, useTheme } from "@sincpro/mobile-ui/theme";
import { cn } from "@sincpro/mobile-ui/theme/tw";
import { Typography } from "@sincpro/mobile-ui/Typography";
import { vars } from "nativewind";
import { type ReactNode, useEffect, useRef, useState } from "react";
import {
  Animated,
  KeyboardAvoidingView,
  Modal,
  PanResponder,
  Platform,
  ScrollView,
  useWindowDimensions,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

export interface DockProps {
  primaryAction: ReactNode;
  children: ReactNode;
  summary?: ReactNode;
  title?: string;
  moreLabel?: string;
  collapseLabel?: string;
  backdropLabel?: string;
  expanded?: boolean;
  defaultExpanded?: boolean;
  onExpandedChange?: (expanded: boolean) => void;
  dismissOnBackdrop?: boolean;
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
  backdropLabel = "Cerrar panel",
  expanded: controlledExpanded,
  defaultExpanded = false,
  onExpandedChange,
  dismissOnBackdrop = true,
  maxExpandedHeightRatio = 0.6,
  placement = "fixed",
  className,
  testID,
}: DockProps) {
  const [internalExpanded, setInternalExpanded] = useState(defaultExpanded);
  const expanded = controlledExpanded ?? internalExpanded;
  const theme = useTheme();
  const insets = useSafeAreaInsets();
  const { height } = useWindowDimensions();
  const [barHeight, setBarHeight] = useState(0);
  const translateY = useRef(new Animated.Value(0)).current;
  const requestExpanded = (next: boolean) => {
    if (next === expanded) return;
    if (controlledExpanded === undefined) setInternalExpanded(next);
    onExpandedChange?.(next);
  };
  const gestureRef = useRef({ expanded, requestExpanded });
  gestureRef.current = { expanded, requestExpanded };
  const resolvedRatio = Number.isFinite(maxExpandedHeightRatio)
    ? Math.min(0.9, Math.max(0.1, maxExpandedHeightRatio))
    : 0.6;
  const maxPanelHeight = Math.max(
    0,
    Math.min(height * resolvedRatio, height - insets.top - insets.bottom - barHeight),
  );
  const resetDrag = () => {
    Animated.spring(translateY, {
      toValue: 0,
      useNativeDriver: true,
      damping: 24,
      stiffness: 260,
    }).start();
  };

  useEffect(() => {
    translateY.setValue(0);
  }, [expanded, translateY]);

  const [pan] = useState(() =>
    PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onPanResponderGrant: () => translateY.stopAnimation(),
      onPanResponderTerminationRequest: () => false,
      onPanResponderMove: (_, gesture) => {
        if (gestureRef.current.expanded) translateY.setValue(Math.max(0, gesture.dy));
      },
      onPanResponderRelease: (_, gesture) => {
        const isVertical = Math.abs(gesture.dy) > Math.abs(gesture.dx);
        const shouldChange = gestureRef.current.expanded
          ? gesture.dy > 40 || gesture.vy > 0.5
          : gesture.dy < -40 || gesture.vy < -0.5;
        if (isVertical && shouldChange) {
          gestureRef.current.requestExpanded(!gestureRef.current.expanded);
        }
        resetDrag();
      },
      onPanResponderTerminate: resetDrag,
    }),
  );

  const handle = (
    <View
      className="min-h-12 items-center justify-center"
      {...pan.panHandlers}
      testID={testID ? `${testID}-handle` : undefined}
    >
      <View className="h-1 w-10 rounded-full bg-border-strong" />
    </View>
  );
  const bar = (
    <View
      className={cn("gap-3 border-t border-border-light bg-bg-card px-4 pb-2", className)}
      onLayout={(event) => setBarHeight(event.nativeEvent.layout.height)}
      testID={testID ? `${testID}-bar` : undefined}
    >
      {!expanded ? handle : null}
      {summary}
      <View className="flex-row items-center gap-3">
        <Pressable
          accessibilityLabel={expanded ? collapseLabel : moreLabel}
          accessibilityRole="button"
          accessibilityState={{ expanded }}
          className="min-h-12 flex-1 flex-row items-center justify-center gap-1 rounded-lg bg-bg-muted px-3"
          onPress={() => requestExpanded(!expanded)}
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

  return (
    <>
      <View
        className={cn(placement === "fixed" && "absolute bottom-0 left-0 right-0 z-20")}
        style={expanded ? { height: barHeight } : undefined}
        testID={testID}
      >
        {!expanded ? bar : null}
      </View>
      <Modal
        animationType="none"
        onRequestClose={() => requestExpanded(false)}
        presentationStyle="overFullScreen"
        testID={testID ? `${testID}-modal` : undefined}
        transparent
        visible={expanded}
      >
        <KeyboardAvoidingView
          behavior={Platform.OS === "ios" ? "padding" : "height"}
          style={{ flex: 1 }}
          testID={testID ? `${testID}-keyboard` : undefined}
        >
          <View accessibilityViewIsModal style={{ flex: 1, justifyContent: "flex-end" }}>
            <Pressable
              accessibilityLabel={backdropLabel}
              accessibilityRole="button"
              className="absolute inset-0 bg-black/50"
              disabled={!dismissOnBackdrop}
              onPress={dismissOnBackdrop ? () => requestExpanded(false) : undefined}
              testID={testID ? `${testID}-backdrop` : undefined}
            />
            <View
              onAccessibilityEscape={() => requestExpanded(false)}
              style={[
                vars(themeToVars(theme)),
                {
                  paddingBottom: insets.bottom,
                  backgroundColor: theme.bg.card,
                  maxHeight: height - insets.top,
                  flexShrink: 1,
                },
              ]}
            >
              <View style={{ overflow: "hidden", flexShrink: 1 }}>
                <Animated.View
                  style={{
                    maxHeight: maxPanelHeight,
                    flexShrink: 1,
                    transform: [{ translateY }],
                  }}
                  testID={testID ? `${testID}-expanded-content` : undefined}
                >
                  {handle}
                  <ScrollView
                    contentContainerStyle={{ paddingHorizontal: 16, paddingBottom: 16 }}
                    keyboardShouldPersistTaps="handled"
                    nestedScrollEnabled
                    style={{ flexShrink: 1 }}
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
              </View>
              {bar}
            </View>
          </View>
        </KeyboardAvoidingView>
      </Modal>
    </>
  );
}

export default Dock;
