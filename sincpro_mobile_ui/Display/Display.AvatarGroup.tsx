import Avatar from "@sincpro/mobile-ui/Display/Display.Avatar";
import { theme } from "@sincpro/mobile-ui/theme";
import { Typography } from "@sincpro/mobile-ui/Typography";
import { View } from "react-native";

export interface AvatarGroupItem {
  initials: string;
}

export interface AvatarGroupProps {
  items: AvatarGroupItem[];
  max?: number;
  size?: number;
  className?: string;
  testID?: string;
}

function AvatarGroup({ items, max = 4, size = 36, className, testID }: AvatarGroupProps) {
  const visible = items.slice(0, max);
  const overflow = items.length - visible.length;
  const overlap = Math.round(size / 3);

  return (
    <View className={className} style={{ flexDirection: "row" }} testID={testID}>
      {visible.map((item, index) => (
        <View
          key={`${item.initials}-${index}`}
          style={{
            marginLeft: index === 0 ? 0 : -overlap,
            borderRadius: size,
            borderWidth: 2,
            borderColor: theme.bg.card,
          }}
        >
          <Avatar initials={item.initials} size={size} />
        </View>
      ))}
      {overflow > 0 ? (
        <View
          className="items-center justify-center rounded-full bg-bg-muted"
          style={{
            width: size,
            height: size,
            marginLeft: -overlap,
            borderWidth: 2,
            borderColor: theme.bg.card,
          }}
        >
          <Typography.Text className="text-text-secondary font-semibold text-xs">
            +{overflow}
          </Typography.Text>
        </View>
      ) : null}
    </View>
  );
}

export default AvatarGroup;
