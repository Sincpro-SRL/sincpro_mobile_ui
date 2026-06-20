import { TouchableOpacity, View } from "react-native";

import { cn } from "../theme/tw";
import { Typography } from "../Typography";
import { IRowItemProps } from "../views/types/IListView";

function RowItem({ item, className }: IRowItemProps<any> & { className?: string }) {
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

  return item.readonly ? (
    <View className={cn("flex-row items-center py-2.5", className)}>{rowContent()}</View>
  ) : (
    <TouchableOpacity
      className={cn("flex-row items-center py-2.5", className)}
      onPress={item.onPress}
    >
      {rowContent()}
    </TouchableOpacity>
  );
}

export default RowItem;
