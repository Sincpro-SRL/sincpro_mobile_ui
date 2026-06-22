import { Display } from "@sincpro/mobile-ui/Display";
import type { Meta, StoryObj } from "@storybook/react-native";
import { useState } from "react";
import { View } from "react-native";

const meta: Meta = { title: "Components/Media & Social" };
export default meta;

type Story = StoryObj;

const PHOTO = { uri: "https://reactnative.dev/img/oss_logo.png" };

const STORY_ITEMS = [
  { id: "1", image: PHOTO, label: "Tu historia" },
  { id: "2", image: PHOTO, label: "Usuario 1" },
  { id: "3", image: PHOTO, label: "Usuario 2", seen: true },
  { id: "4", image: PHOTO, label: "Usuario 3" },
  { id: "5", image: PHOTO, label: "Usuario 4", seen: true },
];

export const StoriesRectangular: Story = {
  render: () => (
    <Display.StoryTray
      create={{ label: "Crear historia", image: PHOTO, onPress: () => {} }}
      onStoryPress={() => {}}
      stories={STORY_ITEMS}
      variant="card"
    />
  ),
};

export const StoriesCircle: Story = {
  render: () => (
    <Display.StoryTray
      create={{ label: "Tu historia", onPress: () => {} }}
      onStoryPress={() => {}}
      stories={STORY_ITEMS}
      variant="circle"
    />
  ),
};

export const StoriesCardNoAvatar: Story = {
  render: () => (
    <Display.StoryTray
      onStoryPress={() => {}}
      showAvatar={false}
      stories={STORY_ITEMS}
      variant="card"
    />
  ),
};

export const MediaCard: Story = {
  render: () => (
    <Display.MediaCard
      badge={<Display.Badge label="Nuevo" variant="success" />}
      image={PHOTO}
      onPress={() => {}}
      subtitle="A 1.2 km · 25-35 min"
      title="Pizzería Don José"
    />
  ),
};

function StoryViewerDemo() {
  const [open, setOpen] = useState(false);
  const [index, setIndex] = useState(0);
  const [muted, setMuted] = useState(false);
  const slides = [{ image: PHOTO }, { image: PHOTO }, { image: PHOTO }];
  return (
    <View>
      <Display.Story image={PHOTO} label="Ver historia" onPress={() => setOpen(true)} />
      <Display.StoryViewer
        avatar={PHOTO}
        index={index}
        muted={muted}
        onClose={() => setOpen(false)}
        onIndexChange={setIndex}
        onMore={() => {}}
        onToggleMute={() => setMuted((m) => !m)}
        slides={slides}
        subtitle="Audio original · canción de ejemplo"
        time="1 h"
        title="Usuario 1"
        visible={open}
      />
    </View>
  );
}

export const StoryViewer: Story = { render: () => <StoryViewerDemo /> };

export const MediaEmbed: Story = {
  render: () => (
    <View style={{ flexDirection: "row", gap: 12 }}>
      <View style={{ flex: 1 }}>
        <Display.MediaEmbed
          duration="0:45"
          onPress={() => {}}
          thumbnail={PHOTO}
          title="Cómo armar tu pedido"
        />
      </View>
      <View style={{ flex: 1 }}>
        <Display.MediaEmbed duration="1:20" onPress={() => {}} thumbnail={PHOTO} />
      </View>
    </View>
  ),
};
