import { View } from "react-native";

import { cn } from "../theme/tw";
import { Typography } from "../Typography";

interface IProps {
  name?: string;
  count: number;
  withPadding?: boolean;
  className?: string;
}

function CountRecords({ name, count, withPadding = true, className }: IProps) {
  return (
    <View className={cn("flex-row py-2", withPadding && "px-4", className)}>
      <Typography.Text semibold variant="bodySmall">
        {"Total "} {`${name || "Registros"} `}
      </Typography.Text>
      <Typography.Text className="text-text-secondary" variant="bodySmall">
        ( {count} )
      </Typography.Text>
    </View>
  );
}

export default CountRecords;
