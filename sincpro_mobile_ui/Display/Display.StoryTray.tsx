import Icon from "@sincpro/mobile-ui/Display/Display.Icon";
import Story from "@sincpro/mobile-ui/Display/Display.Story";
import Pressable from "@sincpro/mobile-ui/primitives/Pressable";
import { theme } from "@sincpro/mobile-ui/theme";
import { Typography } from "@sincpro/mobile-ui/Typography";
import { Image, type ImageSourcePropType, ScrollView, View } from "react-native";

export interface StoryTrayItem {
  id: string;
  image: ImageSourcePropType;
  label?: string;
  avatar?: ImageSourcePropType;
  seen?: boolean;
}

export interface StoryTrayCreate {
  label?: string;
  image?: ImageSourcePropType;
  onPress: () => void;
}

export interface StoryTrayProps {
  stories: StoryTrayItem[];
  onStoryPress?: (item: StoryTrayItem) => void;
  create?: StoryTrayCreate;
  variant?: "circle" | "card";
  size?: number;
  /** Mostrar el avatar del autor en cada card (solo variant="card"). */
  showAvatar?: boolean;
  className?: string;
  testID?: string;
}

function CreateCard({ create, size }: { create: StoryTrayCreate; size: number }) {
  const w = size * 1.6;
  return (
    <Pressable
      accessibilityLabel={create.label ?? "Crear historia"}
      accessibilityRole="button"
      onPress={create.onPress}
      style={{
        width: w,
        borderRadius: 14,
        overflow: "hidden",
        backgroundColor: theme.bg.card,
        borderWidth: 1,
        borderColor: theme.border.light,
      }}
    >
      {create.image ? (
        <Image source={create.image} style={{ width: "100%", height: size * 1.7 }} />
      ) : (
        <View
          style={{ width: "100%", height: size * 1.7, backgroundColor: theme.bg.muted }}
        />
      )}
      <View style={{ alignItems: "center", paddingVertical: 14 }}>
        <View
          style={{
            position: "absolute",
            top: -16,
            width: 32,
            height: 32,
            borderRadius: 16,
            backgroundColor: theme.primary,
            alignItems: "center",
            justifyContent: "center",
            borderWidth: 3,
            borderColor: theme.bg.card,
          }}
        >
          <Icon color={theme.text.inverse} name="add" size={20} />
        </View>
        <Typography.Text className="text-text-primary mt-2" semibold variant="caption">
          {create.label ?? "Crear historia"}
        </Typography.Text>
      </View>
    </Pressable>
  );
}

function CreateCircle({ create, size }: { create: StoryTrayCreate; size: number }) {
  return (
    <Pressable
      accessibilityLabel={create.label ?? "Crear historia"}
      accessibilityRole="button"
      onPress={create.onPress}
      style={{ alignItems: "center", width: size + 8, gap: 4 }}
    >
      <View
        style={{
          width: size,
          height: size,
          borderRadius: size / 2,
          backgroundColor: theme.bg.muted,
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <Icon color={theme.primary} name="add-circle" size={size * 0.5} />
      </View>
      <Typography.Text
        className="text-text-secondary"
        numberOfLines={1}
        style={{ maxWidth: size + 6 }}
        variant="caption"
      >
        {create.label ?? "Crear"}
      </Typography.Text>
    </Pressable>
  );
}

function StoryTray({
  stories,
  onStoryPress,
  create,
  variant = "card",
  size = 68,
  showAvatar = true,
  className,
  testID,
}: StoryTrayProps) {
  return (
    <ScrollView
      className={className}
      contentContainerStyle={{ gap: 8, paddingHorizontal: 12, paddingVertical: 4 }}
      horizontal
      showsHorizontalScrollIndicator={false}
      testID={testID}
    >
      {create ? (
        variant === "card" ? (
          <CreateCard create={create} size={size} />
        ) : (
          <CreateCircle create={create} size={size} />
        )
      ) : null}
      {stories.map((item) => (
        <Story
          avatar={item.avatar}
          image={item.image}
          key={item.id}
          label={item.label}
          onPress={() => onStoryPress?.(item)}
          seen={item.seen}
          showAvatar={showAvatar}
          size={size}
          variant={variant}
        />
      ))}
    </ScrollView>
  );
}

export default StoryTray;
