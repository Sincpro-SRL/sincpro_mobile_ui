import { type OverlayLayer, overlayStore } from "@sincpro/mobile-ui/Dialog/overlay.store";
import {
  type ReactNode,
  useEffect,
  useEffectEvent,
  useId,
  useLayoutEffect,
  useSyncExternalStore,
} from "react";
import { BackHandler, StyleSheet, View } from "react-native";

const styles = StyleSheet.create({ root: { flex: 1 } });

/**
 * Mount once at the app root, inside the theme and gesture roots.
 * Every Dialog.Sheet, Confirmation, ActionSheet, picker and toast renders
 * here, in the same native window as the screen.
 */
export function OverlayHost({ children }: { children: ReactNode }) {
  const entries = useSyncExternalStore(
    overlayStore.subscribe,
    overlayStore.entries,
    overlayStore.entries,
  );
  const blocking = entries.some((entry) => entry.layer === "sheet");
  const handlesBack = entries.some((entry) => entry.onBack);

  useLayoutEffect(() => overlayStore.attachHost(), []);

  // Registered only while an overlay listens, so it runs before the
  // navigator's handler that was registered earlier.
  useEffect(() => {
    if (!handlesBack) return;
    const subscription = BackHandler.addEventListener("hardwareBackPress", () =>
      overlayStore.handleBack(),
    );
    return () => subscription.remove();
  }, [handlesBack]);

  return (
    <View style={styles.root}>
      <View
        accessibilityElementsHidden={blocking}
        importantForAccessibility={blocking ? "no-hide-descendants" : "auto"}
        style={styles.root}
      >
        {children}
      </View>
      {entries.map((entry) => (
        <View key={entry.key} pointerEvents="box-none" style={StyleSheet.absoluteFill}>
          {entry.element}
        </View>
      ))}
    </View>
  );
}

export interface OverlayPortalProps {
  children: ReactNode;
  layer?: OverlayLayer;
  onBack?: () => boolean;
}

/**
 * Sends its children to the OverlayHost. Without a host (tests, isolated
 * stories) it renders in place so the content stays reachable.
 *
 * Content rendered in the host sees the providers above the host, not the
 * screen-level providers around the portal. Pass what it needs as props.
 */
export function OverlayPortal({ children, layer = "sheet", onBack }: OverlayPortalProps) {
  const key = useId();
  const hosted = useSyncExternalStore(
    overlayStore.subscribe,
    overlayStore.hasHost,
    overlayStore.hasHost,
  );
  const back = useEffectEvent(() => onBack?.() ?? false);
  const listensToBack = onBack !== undefined;

  useLayoutEffect(() => {
    if (!hosted) return;
    overlayStore.upsert({
      key,
      layer,
      element: children,
      onBack: listensToBack ? () => back() : undefined,
    });
  });

  useLayoutEffect(() => {
    if (!hosted) return;
    return () => overlayStore.remove(key);
  }, [hosted, key]);

  return hosted ? null : children;
}
