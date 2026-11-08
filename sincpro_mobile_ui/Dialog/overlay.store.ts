import type { ReactNode } from "react";

export type OverlayLayer = "sheet" | "toast";

export interface OverlayEntry {
  key: string;
  layer: OverlayLayer;
  element: ReactNode;
  /** Returns true when the overlay consumed the Android back press. */
  onBack?: () => boolean;
}

const LAYER_ORDER: Record<OverlayLayer, number> = { sheet: 0, toast: 1 };

let entries: OverlayEntry[] = [];
let hosts = 0;
const listeners = new Set<() => void>();

function emit() {
  for (const listener of [...listeners]) listener();
}

function byLayer(a: OverlayEntry, b: OverlayEntry) {
  return LAYER_ORDER[a.layer] - LAYER_ORDER[b.layer];
}

/**
 * One store for every overlay of the app. Components declare overlays where
 * they live; the single OverlayHost draws them above the screen in the same
 * native window, so touches, keyboard tracking and CSS variables keep working.
 */
export const overlayStore = {
  subscribe(listener: () => void) {
    listeners.add(listener);
    return () => {
      listeners.delete(listener);
    };
  },
  entries(): OverlayEntry[] {
    return entries;
  },
  hasHost(): boolean {
    return hosts > 0;
  },
  attachHost() {
    hosts += 1;
    emit();
    return () => {
      hosts -= 1;
      emit();
    };
  },
  upsert(entry: OverlayEntry) {
    const index = entries.findIndex((current) => current.key === entry.key);
    entries =
      index === -1
        ? [...entries, entry].sort(byLayer)
        : entries.map((current, position) => (position === index ? entry : current));
    emit();
  },
  remove(key: string) {
    if (!entries.some((entry) => entry.key === key)) return;
    entries = entries.filter((entry) => entry.key !== key);
    emit();
  },
  /** Topmost overlay with a back handler decides. */
  handleBack(): boolean {
    for (let index = entries.length - 1; index >= 0; index -= 1) {
      const onBack = entries[index].onBack;
      if (onBack) return onBack();
    }
    return false;
  },
};
