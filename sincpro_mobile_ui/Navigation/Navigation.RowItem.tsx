import Pressable from "@sincpro/mobile-ui/primitives/Pressable";
import { cn } from "@sincpro/mobile-ui/theme/tw";
import { Typography } from "@sincpro/mobile-ui/Typography";
import { IRowItemProps } from "@sincpro/mobile-ui/views/types/IListView";
import { memo } from "react";
import { View } from "react-native";

/** The default row of `ListViewV2.Content`: the same row as `ListViewV2.Content.Row`. */
function RowItem({
  item,
  className,
  onPress: onPressProp,
  readonly: readonlyProp,
}: IRowItemProps<any> & { className?: string }) {
  const onPress = onPressProp === undefined ? item.onPress : onPressProp;
  const readonly = readonlyProp === undefined ? item.readonly : readonlyProp;
  const content = (
    <View
      className={cn(
        "flex-row items-center py-3 px-4 bg-bg-card border-b border-border-default",
        className,
      )}
    >
      <View className="flex-1 gap-0.5">
        <Typography.Text numberOfLines={1} semibold variant="body">
          {item.rowTitle}
        </Typography.Text>
        {item.rowSubtitle ? (
          <Typography.Text className="text-text-secondary" variant="bodySmall">
            {item.rowSubtitle}
          </Typography.Text>
        ) : null}
      </View>
    </View>
  );

  if (readonly) return content;
  return (
    <Pressable hitSlop={0} onPress={onPress}>
      {content}
    </Pressable>
  );
}

export default memo(RowItem);
