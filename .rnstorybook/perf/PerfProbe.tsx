import {
  Profiler,
  type ProfilerOnRenderCallback,
  type ReactNode,
  useEffect,
  useRef,
  useState,
} from "react";
import { StyleSheet, Text, View } from "react-native";

type PerfTotals = { commits: number; renderMs: number; maxMs: number; longTasks: number };

const EMPTY: PerfTotals = { commits: 0, renderMs: 0, maxMs: 0, longTasks: 0 };

/**
 * Storybook-only probe. Counts React commits and render time of the story with
 * the Profiler API (dev and profiling builds) and long tasks with
 * PerformanceObserver (also in release). The summary is drawn as a HUD and
 * logged as `[perf] {json}` so Maestro or `adb logcat` can read it.
 */
export function PerfProbe({ id, children }: { id: string; children: ReactNode }) {
  const totals = useRef<PerfTotals>({ ...EMPTY });
  const [snapshot, setSnapshot] = useState<PerfTotals>(EMPTY);

  const onRender: ProfilerOnRenderCallback = (_id, _phase, actualDuration) => {
    const current = totals.current;
    current.commits += 1;
    current.renderMs += actualDuration;
    current.maxMs = Math.max(current.maxMs, actualDuration);
  };

  useEffect(() => {
    let observer: PerformanceObserver | undefined;
    if (typeof PerformanceObserver !== "undefined") {
      try {
        observer = new PerformanceObserver((list) => {
          totals.current.longTasks += list.getEntries().length;
        });
        observer.observe({ type: "longtask" });
      } catch {
        observer = undefined;
      }
    }
    let reported = "";
    const timer = setInterval(() => {
      const next = { ...totals.current };
      const line = JSON.stringify({ id, ...next });
      if (line === reported) return;
      reported = line;
      setSnapshot(next);
      console.log(`[perf] ${line}`);
    }, 1000);
    return () => {
      clearInterval(timer);
      observer?.disconnect();
    };
  }, [id]);

  return (
    <View style={styles.root}>
      <Profiler id={id} onRender={onRender}>
        {children}
      </Profiler>
      <View pointerEvents="none" style={styles.hud}>
        <Text style={styles.hudText} testID="perf-summary">
          {`commits ${snapshot.commits} · ${snapshot.renderMs.toFixed(0)} ms · max ${snapshot.maxMs.toFixed(1)} ms · long ${snapshot.longTasks}`}
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1 },
  hud: {
    position: "absolute",
    right: 8,
    bottom: 8,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
    backgroundColor: "rgba(0,0,0,0.7)",
  },
  hudText: { color: "#FFFFFF", fontSize: 11, fontVariant: ["tabular-nums"] },
});
