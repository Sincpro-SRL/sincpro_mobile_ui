import { OverlayPortal } from "@sincpro/mobile-ui/Dialog/OverlayHost";
import {
  SheetSurface,
  type SnapPoint,
  useSheetRestingOffset,
} from "@sincpro/mobile-ui/Dialog/SheetSurface";
import Pressable from "@sincpro/mobile-ui/primitives/Pressable";
import { Typography } from "@sincpro/mobile-ui/Typography";
import { type ReactNode, useState } from "react";
import { ScrollView, View } from "react-native";

export type SheetProps = {
  visible: boolean;
  /** The user asked to close (Cerrar, backdrop, drag, Android back). Set `visible` to false. */
  onClose: () => void;
  /** Runs after the close animation. Navigate or open another overlay from here. */
  onClosed?: () => void;
  title?: string;
  children: ReactNode;
  footer?: ReactNode;
  snapPoints?: SnapPoint[];
  scrollable?: boolean;
  dismissible?: boolean;
  testID?: string;
};

/** Scroll content gets the hidden part of a resting panel as room at its end. */
function SheetScroll({ children }: { children: ReactNode }) {
  const restingOffset = useSheetRestingOffset();
  return (
    <ScrollView
      contentContainerStyle={{ paddingHorizontal: 16, paddingBottom: 16 + restingOffset }}
      keyboardDismissMode="on-drag"
      keyboardShouldPersistTaps="handled"
      style={{ flex: 1, minHeight: 0 }}
    >
      {children}
    </ScrollView>
  );
}

const SNAP_POINTS: SnapPoint[] = ["60%", "90%"];

function Sheet({
  visible,
  onClose,
  onClosed,
  title,
  children,
  footer,
  snapPoints = SNAP_POINTS,
  scrollable = true,
  dismissible = true,
  testID,
}: SheetProps) {
  const [present, setPresent] = useState(visible);
  if (visible && !present) setPresent(true);
  if (!present) return null;

  const close = () => {
    if (visible && dismissible) onClose();
  };
  const exited = () => {
    setPresent(false);
    onClosed?.();
  };
  const back = () => {
    close();
    return true;
  };

  const header = (
    <View className="flex-row items-center gap-3 px-4 pb-2">
      {title ? (
        <Typography.Text
          accessibilityRole="header"
          className="flex-1 text-text-primary"
          semibold
          variant="subtitle"
        >
          {title}
        </Typography.Text>
      ) : (
        <View className="flex-1" />
      )}
      <Pressable
        accessibilityLabel="Cerrar"
        accessibilityRole="button"
        accessibilityState={{ disabled: !dismissible }}
        disabled={!dismissible}
        onPress={close}
        style={{
          minHeight: 48,
          minWidth: 48,
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <Typography.Text
          className={dismissible ? "text-text-accent" : "text-text-disabled"}
          variant="bodySmall"
        >
          Cerrar
        </Typography.Text>
      </Pressable>
    </View>
  );

  return (
    <OverlayPortal onBack={visible ? back : undefined}>
      <SheetSurface
        dismissible={dismissible}
        footer={
          footer ? (
            <View className="border-t border-border-light px-4 py-3">{footer}</View>
          ) : undefined
        }
        header={header}
        onExited={exited}
        onRequestClose={close}
        snapPoints={snapPoints}
        testID={testID}
        visible={visible}
      >
        {scrollable ? (
          <SheetScroll>{children}</SheetScroll>
        ) : (
          <View style={{ flex: 1, minHeight: 0, paddingHorizontal: 16 }}>{children}</View>
        )}
      </SheetSurface>
    </OverlayPortal>
  );
}

export default Sheet;
