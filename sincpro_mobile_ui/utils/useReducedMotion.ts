import { useSyncExternalStore } from "react";
import { AccessibilityInfo } from "react-native";

const listeners = new Set<() => void>();
let reducedMotion = true;
let generation = 0;
let subscription: ReturnType<typeof AccessibilityInfo.addEventListener> | undefined;

function publish(enabled: boolean) {
  if (reducedMotion === enabled) return;
  reducedMotion = enabled;
  for (const listener of [...listeners]) listener();
}

function subscribe(listener: () => void) {
  listeners.add(listener);
  if (listeners.size === 1) {
    const request = ++generation;
    let receivedChange = false;
    subscription = AccessibilityInfo.addEventListener("reduceMotionChanged", (enabled) => {
      receivedChange = true;
      publish(enabled);
    });

    AccessibilityInfo.isReduceMotionEnabled().then(
      (enabled) => {
        if (request === generation && !receivedChange) publish(enabled);
      },
      (error) => {
        if (request === generation)
          console.warn("[useReducedMotion] Could not read accessibility preference", error);
      },
    );
  }

  return () => {
    listeners.delete(listener);
    if (listeners.size === 0) {
      generation += 1;
      subscription?.remove();
      subscription = undefined;
      reducedMotion = true;
    }
  };
}

export function useReducedMotion(): boolean {
  return useSyncExternalStore(
    subscribe,
    () => reducedMotion,
    () => true,
  );
}
