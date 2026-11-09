import Sheet from "@sincpro/mobile-ui/Dialog/Dialog.Sheet";
import Icon from "@sincpro/mobile-ui/Display/Display.Icon";
import { useKeyboardToolbarInset } from "@sincpro/mobile-ui/Form/Form.KeyboardToolbarHost";
import Pressable from "@sincpro/mobile-ui/primitives/Pressable";
import { useTheme } from "@sincpro/mobile-ui/theme";
import { cn } from "@sincpro/mobile-ui/theme/tw";
import { Typography } from "@sincpro/mobile-ui/Typography";
import { type ReactNode, useState } from "react";
import { View } from "react-native";
import { KeyboardStickyView } from "react-native-keyboard-controller";
import { useSafeAreaInsets } from "react-native-safe-area-context";

export type DockProps = {
  primaryAction: ReactNode;
  children: ReactNode;
  summary?: ReactNode;
  title?: string;
  moreLabel?: string;
  collapseLabel?: string;
  expanded?: boolean;
  defaultExpanded?: boolean;
  onExpandedChange?: (expanded: boolean) => void;
  dismissible?: boolean;
  snapPoints?: (string | number)[];
  placement?: "fixed" | "footer";
  safeAreaBottom?: boolean;
  className?: string;
  testID?: string;
};

function Dock({
  primaryAction,
  children,
  summary,
  title = "Más opciones",
  moreLabel = "Más opciones",
  collapseLabel = "Ocultar opciones",
  expanded: controlledExpanded,
  defaultExpanded = false,
  onExpandedChange,
  dismissible = true,
  snapPoints,
  placement = "fixed",
  safeAreaBottom: safeAreaBottomProp,
  className,
  testID,
}: DockProps) {
  const safeAreaBottom = safeAreaBottomProp ?? placement === "fixed";
  const theme = useTheme();
  const insets = useSafeAreaInsets();
  const toolbarInset = useKeyboardToolbarInset();
  const [internalExpanded, setInternalExpanded] = useState(defaultExpanded);
  const expanded = controlledExpanded ?? internalExpanded;
  const requestExpanded = (next: boolean) => {
    if (next === expanded) return;
    if (!next && !dismissible) return;
    if (controlledExpanded === undefined) setInternalExpanded(next);
    onExpandedChange?.(next);
  };
  const bar = (
    <View
      className={cn(
        "gap-3 bg-bg-card py-2",
        !expanded && "border-t border-border-light px-4",
        className,
      )}
      style={{ paddingBottom: !expanded && safeAreaBottom ? insets.bottom + 8 : 8 }}
      testID={testID ? `${testID}-bar` : undefined}
    >
      {summary}
      <View className="flex-row items-center gap-3">
        <Pressable
          accessibilityLabel={expanded ? collapseLabel : moreLabel}
          accessibilityRole="button"
          accessibilityState={{ expanded, disabled: expanded && !dismissible }}
          className="flex-1 flex-row items-center justify-center gap-2 rounded-md bg-bg-muted px-3"
          disabled={expanded && !dismissible}
          onPress={() => requestExpanded(!expanded)}
          style={{ minWidth: 48, minHeight: 48 }}
          testID={testID ? `${testID}-more` : undefined}
        >
          <Typography.Text
            className={expanded && !dismissible ? "text-text-disabled" : "text-text-primary"}
            variant="buttonSmall"
          >
            {expanded ? collapseLabel : moreLabel}
          </Typography.Text>
          <Icon
            color={expanded && !dismissible ? theme.icon.disabled : theme.icon.secondary}
            name={expanded ? "expand" : "collapse"}
            size={16}
          />
        </Pressable>
        <View className="flex-1">{primaryAction}</View>
      </View>
    </View>
  );

  return (
    <>
      <KeyboardStickyView
        enabled={placement === "fixed" && !expanded}
        offset={{ opened: (safeAreaBottom ? insets.bottom : 0) - toolbarInset }}
        style={
          placement === "fixed"
            ? { position: "absolute", bottom: 0, left: 0, right: 0, zIndex: 20 }
            : undefined
        }
        testID={testID}
      >
        {!expanded ? bar : null}
      </KeyboardStickyView>
      <Sheet
        dismissible={dismissible}
        footer={expanded ? bar : undefined}
        onClose={() => requestExpanded(false)}
        snapPoints={snapPoints}
        testID={testID ? `${testID}-sheet` : undefined}
        title={title}
        visible={expanded}
      >
        {children}
      </Sheet>
    </>
  );
}

export default Dock;
