import { cn } from "@sincpro/mobile-ui/theme/tw";
import { Typography } from "@sincpro/mobile-ui/Typography";
import { IRowItemProps } from "@sincpro/mobile-ui/views/types/IListView";
import { memo } from "react";
import { TouchableOpacity, View } from "react-native";

function RowItem({
  item,
  className,
  onPress: onPressProp,
  readonly: readonlyProp,
}: IRowItemProps<any> & { className?: string }) {
  const onPress = onPressProp === undefined ? item.onPress : onPressProp;
  const readonly = readonlyProp === undefined ? item.readonly : readonlyProp;
  function rowContent() {
    return (
      <View className="flex-1">
        <Typography.Text className="flex-1" variant="title">
          {item.rowTitle}
        </Typography.Text>
        <Typography.Text className="mt-0.5 text-text-secondary" variant="bodySmall">
          {item.rowSubtitle}
        </Typography.Text>
      </View>
    );
  }

  return readonly ? (
    <View className={cn("flex-row items-center py-2.5", className)}>{rowContent()}</View>
  ) : (
    <TouchableOpacity
      className={cn("flex-row items-center py-2.5", className)}
      onPress={onPress}
    >
      {rowContent()}
    </TouchableOpacity>
  );
}

export default memo(RowItem);
