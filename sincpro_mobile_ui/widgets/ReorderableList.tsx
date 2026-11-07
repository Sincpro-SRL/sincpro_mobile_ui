import Icon from "@sincpro/mobile-ui/Display/Display.Icon";
import Pressable from "@sincpro/mobile-ui/primitives/Pressable";
import { cn } from "@sincpro/mobile-ui/theme/tw";
import { Typography } from "@sincpro/mobile-ui/Typography";
import { moveCollectionEntry } from "@sincpro/mobile-ui/utils/criteria";
import {
  applyReorder,
  moveReorderItem,
  reorderKeys,
  sameOrder,
} from "@sincpro/mobile-ui/utils/reorder";
import { type ReactNode, useCallback, useEffect, useMemo, useRef, useState } from "react";
import {
  AccessibilityInfo,
  type StyleProp,
  useWindowDimensions,
  View,
  type ViewStyle,
} from "react-native";
import Sortable, { type SortableGridProps } from "react-native-sortables";

export interface ReorderEvent {
  key: string;
  fromIndex: number;
  toIndex: number;
  source: "drag" | "button";
}

export interface ReorderItemContext<T> {
  item: T;
  index: number;
  canMoveUp: boolean;
  canMoveDown: boolean;
  moveUp: () => void;
  moveDown: () => void;
}

export interface ReorderControlsContext<T> extends ReorderItemContext<T> {
  dragHandle: ReactNode;
}

export interface ReorderableListProps<T> {
  items: readonly T[];
  keyExtractor: (item: T) => string;
  getItemLabel: (item: T) => string;
  onChange: (items: T[], event: ReorderEvent) => void;
  renderItem: (context: ReorderItemContext<T>) => ReactNode;
  renderControls?: (context: ReorderControlsContext<T>) => ReactNode;
  renderHandleContent?: (context: ReorderItemContext<T>) => ReactNode;
  disabled?: boolean;
  className?: string;
  style?: StyleProp<ViewStyle>;
  itemStyle?: StyleProp<ViewStyle>;
  contentStyle?: StyleProp<ViewStyle>;
  controlsStyle?: StyleProp<ViewStyle>;
  handleStyle?: StyleProp<ViewStyle>;
  actionStyle?: StyleProp<ViewStyle>;
  testID?: string;
  labels?: {
    drag?: (label: string) => string;
    up?: (label: string) => string;
    down?: (label: string) => string;
    moved?: (label: string, position: number, count: number) => string;
    changedDuringDrag?: string;
    disabledDuringDrag?: string;
  };
  onDragStart?: (key: string) => void;
  onDragEnd?: () => void;
  onReorderRejected?: (reason: "data-changed" | "disabled") => void;
  sortableProps?: Omit<
    SortableGridProps<T>,
    | "data"
    | "renderItem"
    | "keyExtractor"
    | "rows"
    | "rowHeight"
    | "columns"
    | "onDragStart"
    | "onDragEnd"
    | "onOrderChange"
    | "sortEnabled"
    | "customHandle"
    | "strategy"
  >;
}

export default function ReorderableList<T>({
  items,
  keyExtractor,
  getItemLabel,
  onChange,
  renderItem,
  renderControls,
  renderHandleContent,
  disabled = false,
  className,
  style,
  itemStyle,
  contentStyle,
  controlsStyle,
  handleStyle,
  actionStyle,
  testID,
  labels,
  onDragStart,
  onDragEnd,
  onReorderRejected,
  sortableProps,
}: ReorderableListProps<T>) {
  const { fontScale } = useWindowDimensions();
  const keys = useMemo(() => reorderKeys(items, keyExtractor), [items, keyExtractor]);
  const data = useMemo(() => [...items], [items]);
  const dragOrder = useRef<string[] | null>(null);
  const [dragging, setDragging] = useState(false);
  const [error, setError] = useState<string>();
  const [revision, setRevision] = useState(0);
  const busy = disabled || dragging;
  const commit = (order: string[], event: ReorderEvent) => {
    if (sameOrder(keys, order)) return;
    const next = applyReorder(items, keyExtractor, order);
    onChange(next, event);
    AccessibilityInfo.announceForAccessibility(
      labels?.moved?.(getItemLabel(next[event.toIndex]), event.toIndex + 1, items.length) ??
        `${getItemLabel(next[event.toIndex])}, posición ${event.toIndex + 1} de ${items.length}`,
    );
  };
  const reject = useCallback(
    (reason: "data-changed" | "disabled") => {
      const message =
        reason === "disabled"
          ? (labels?.disabledDuringDrag ??
            "El orden se bloqueó durante el arrastre. No se aplicó el cambio.")
          : (labels?.changedDuringDrag ??
            "La lista cambió durante el arrastre. Revisa el orden e inténtalo de nuevo.");
      setError(message);
      setRevision((value) => value + 1);
      AccessibilityInfo.announceForAccessibility(message);
      onReorderRejected?.(reason);
    },
    [labels?.changedDuringDrag, labels?.disabledDuringDrag, onReorderRejected],
  );
  useEffect(() => {
    if (dragOrder.current && (disabled || !sameOrder(dragOrder.current, keys))) {
      dragOrder.current = null;
      setDragging(false);
      reject(disabled ? "disabled" : "data-changed");
      onDragEnd?.();
    }
  }, [disabled, keys, onDragEnd, reject]);
  return (
    <View className={cn("gap-2", className)} style={style} testID={testID}>
      <Sortable.Grid
        activeItemScale={1}
        activeItemShadowOpacity={0}
        key={revision}
        rowGap={8}
        {...sortableProps}
        columns={1}
        customHandle
        data={data}
        keyExtractor={keyExtractor}
        onDragEnd={({ fromIndex, toIndex }) => {
          const started = dragOrder.current;
          if (!started) return;
          dragOrder.current = null;
          setDragging(false);
          if (started && !sameOrder(started, keys)) reject("data-changed");
          else if (disabled) reject("disabled");
          else if (started)
            commit(moveReorderItem(keys, fromIndex, toIndex), {
              key: keys[fromIndex],
              fromIndex,
              toIndex,
              source: "drag",
            });
          onDragEnd?.();
        }}
        onDragStart={({ fromIndex }) => {
          dragOrder.current = keys;
          setDragging(true);
          setError(undefined);
          onDragStart?.(keys[fromIndex]);
        }}
        renderItem={({ item, index }) => {
          const key = keys[index];
          const label = getItemLabel(item);
          const move = (direction: -1 | 1) => {
            if (busy || index + direction < 0 || index + direction >= items.length) return;
            setError(undefined);
            commit(moveCollectionEntry(keys, index, direction), {
              key,
              fromIndex: index,
              toIndex: index + direction,
              source: "button",
            });
          };
          const context: ReorderItemContext<T> = {
            item,
            index,
            canMoveUp: !busy && index > 0,
            canMoveDown: !busy && index < items.length - 1,
            moveUp: () => move(-1),
            moveDown: () => move(1),
          };
          const dragHandle = (
            <Sortable.Handle mode={disabled ? "non-draggable" : "draggable"}>
              <View
                accessibilityActions={[
                  ...(context.canMoveUp ? [{ name: "decrement" }] : []),
                  ...(context.canMoveDown ? [{ name: "increment" }] : []),
                ]}
                accessibilityLabel={labels?.drag?.(label) ?? `Arrastrar ${label}`}
                accessibilityRole="adjustable"
                accessibilityState={{ disabled, busy: dragging }}
                accessibilityValue={{ min: 1, max: items.length, now: index + 1 }}
                accessible
                onAccessibilityAction={({ nativeEvent }) => {
                  if (nativeEvent.actionName === "increment") move(1);
                  if (nativeEvent.actionName === "decrement") move(-1);
                }}
                style={[
                  {
                    minHeight: 48,
                    minWidth: 48,
                    alignItems: "center",
                    justifyContent: "center",
                  },
                  handleStyle,
                ]}
                testID={testID ? `${testID}-handle-${key}` : undefined}
              >
                {renderHandleContent ? (
                  renderHandleContent(context)
                ) : (
                  <Icon name="reorder" size={20} />
                )}
              </View>
            </Sortable.Handle>
          );
          return (
            <View
              key={key}
              style={[
                {
                  width: "100%",
                  flexDirection: fontScale > 1.3 ? "column" : "row",
                  alignItems: "center",
                  gap: 8,
                },
                itemStyle,
              ]}
              testID={testID ? `${testID}-item-${key}` : undefined}
            >
              <View
                style={[
                  fontScale > 1.3 ? { alignSelf: "stretch" } : { flex: 1, minWidth: 0 },
                  contentStyle,
                ]}
              >
                {renderItem(context)}
              </View>
              <View style={[{ flexDirection: "row", alignItems: "center" }, controlsStyle]}>
                {renderControls ? (
                  renderControls({ ...context, dragHandle })
                ) : (
                  <>
                    {dragHandle}
                    <Pressable
                      accessibilityLabel={labels?.up?.(label) ?? `Subir ${label}`}
                      disabled={!context.canMoveUp}
                      onPress={context.moveUp}
                      style={[
                        {
                          minWidth: 48,
                          minHeight: 48,
                          alignItems: "center",
                          justifyContent: "center",
                        },
                        actionStyle,
                      ]}
                    >
                      <Icon name="up" size={18} />
                    </Pressable>
                    <Pressable
                      accessibilityLabel={labels?.down?.(label) ?? `Bajar ${label}`}
                      disabled={!context.canMoveDown}
                      onPress={context.moveDown}
                      style={[
                        {
                          minWidth: 48,
                          minHeight: 48,
                          alignItems: "center",
                          justifyContent: "center",
                        },
                        actionStyle,
                      ]}
                    >
                      <Icon name="down" size={18} />
                    </Pressable>
                  </>
                )}
              </View>
            </View>
          );
        }}
        sortEnabled={!disabled}
        strategy="insert"
      />
      {error ? (
        <Typography.Text accessibilityRole="alert" className="text-danger">
          {error}
        </Typography.Text>
      ) : null}
    </View>
  );
}
