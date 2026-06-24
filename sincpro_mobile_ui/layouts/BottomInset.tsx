import { createContext, useContext } from "react";

/**
 * Extra bottom inset for scroll views, provided by the host app when a floating
 * element (e.g. position:absolute tab bar) sits above the native safe area.
 *
 * FormViewV2.Content and ListViewV2.Content add this value as extra
 * `contentContainerStyle.paddingBottom` so content can scroll fully above the bar.
 *
 * Usage in the host app:
 *   <BottomInsetContext.Provider value={72}>
 *     <Tabs.Navigator ...>
 *
 * Default: 0 — no extra inset (backwards compatible).
 * The native safe-area inset is already handled by Container (SafeAreaView edges=["bottom"]).
 */
export const BottomInsetContext = createContext<number>(0);
export const useBottomInset = () => useContext(BottomInsetContext);
