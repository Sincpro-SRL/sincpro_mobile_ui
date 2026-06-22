import { theme } from "@sincpro/mobile-ui/theme";
import { cn } from "@sincpro/mobile-ui/theme/tw";
import { type ReactNode, useState } from "react";
import {
  type NativeScrollEvent,
  type NativeSyntheticEvent,
  ScrollView,
  View,
} from "react-native";

export interface CarouselProps<T> {
  data: T[];
  renderItem: (item: T, index: number) => ReactNode;
  keyExtractor: (item: T, index: number) => string;
  itemWidth: number;
  gap?: number;
  showDots?: boolean;
  className?: string;
  testID?: string;
}

function Carousel<T>({
  data,
  renderItem,
  keyExtractor,
  itemWidth,
  gap = 12,
  showDots = true,
  className,
  testID,
}: CarouselProps<T>) {
  const [active, setActive] = useState(0);
  const snap = itemWidth + gap;

  const onScroll = (e: NativeSyntheticEvent<NativeScrollEvent>) => {
    const index = Math.round(e.nativeEvent.contentOffset.x / snap);
    if (index !== active) setActive(index);
  };

  return (
    <View className={className} testID={testID}>
      <ScrollView
        decelerationRate="fast"
        horizontal
        onMomentumScrollEnd={onScroll}
        showsHorizontalScrollIndicator={false}
        snapToInterval={snap}
      >
        {data.map((item, index) => (
          <View
            key={keyExtractor(item, index)}
            style={{ width: itemWidth, marginRight: index < data.length - 1 ? gap : 0 }}
          >
            {renderItem(item, index)}
          </View>
        ))}
      </ScrollView>

      {showDots && data.length > 1 ? (
        <View className="flex-row justify-center gap-1.5 mt-3">
          {data.map((item, index) => (
            <View
              className={cn("h-1.5 rounded-full")}
              key={keyExtractor(item, index)}
              style={{
                width: index === active ? 16 : 6,
                backgroundColor: index === active ? theme.primary : theme.border.strong,
              }}
            />
          ))}
        </View>
      ) : null}
    </View>
  );
}

export default Carousel;
