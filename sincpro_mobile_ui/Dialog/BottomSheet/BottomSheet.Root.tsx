import { theme } from "@sincpro/mobile-ui/theme";
import { createContext, type ReactNode, useContext, useEffect, useRef } from "react";
import {
  Animated,
  Dimensions,
  type GestureResponderHandlers,
  Modal,
  PanResponder,
  Pressable,
  ScrollView,
  Text,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

/**
 * Available sizes for the BottomSheet.
 * - `auto`: Fits content height (max 90% screen)
 * - `small`: 30% of screen height
 * - `medium`: 50% of screen height
 * - `large`: 75% of screen height
 * - `full`: 90% of screen height
 */
type BottomSheetSize = "auto" | "small" | "medium" | "large" | "full";

export interface BottomSheetContextValue {
  close: () => void;
  panHandlers: GestureResponderHandlers;
}

const BottomSheetContext = createContext<BottomSheetContextValue | null>(null);

/**
 * Hook to access BottomSheet context from compound components.
 * Provides `close()` function and `panHandlers` for gesture support.
 *
 * @throws Error if used outside BottomSheet.Root
 *
 * @example
 * ```tsx
 * function CustomHeader() {
 *   const { close, panHandlers } = BottomSheet.useBottomSheet();
 *   return (
 *     <View {...panHandlers}>
 *       <Button onPress={close} title="Close" />
 *     </View>
 *   );
 * }
 * ```
 */
function useBottomSheet() {
  const context = useContext(BottomSheetContext);
  if (!context) {
    throw new Error("BottomSheet compound components must be used within BottomSheet.Root");
  }
  return context;
}

export interface RootProps {
  visible: boolean;
  onClose: () => void;
  size?: BottomSheetSize;
  dismissible?: boolean;
  children: ReactNode;
}

const SIZE_MAP: Record<BottomSheetSize, number> = {
  auto: 0,
  small: 0.3,
  medium: 0.5,
  large: 0.75,
  full: 0.9,
};

/**
 * Root container for the BottomSheet modal with swipe-to-dismiss gesture support.
 *
 * Features:
 * - Spring animation on open/close
 * - Swipe down to dismiss (configurable)
 * - Backdrop tap to dismiss (configurable)
 * - Safe area insets handling
 * - Configurable sizes
 *
 * @param visible - Controls visibility of the bottom sheet
 * @param onClose - Callback when sheet is dismissed (swipe, backdrop tap, or programmatic)
 * @param size - Height preset: 'auto' | 'small' | 'medium' | 'large' | 'full'
 * @param dismissible - If false, disables swipe and backdrop dismiss (default: true)
 * @param children - Compound components (Header, Content, Actions, etc.)
 *
 * @example Basic usage with Header and Content
 * ```tsx
 * <BottomSheet.Root visible={isOpen} onClose={() => setIsOpen(false)}>
 *   <BottomSheet.Header>
 *     <BottomSheet.Title>Select Option</BottomSheet.Title>
 *   </BottomSheet.Header>
 *   <BottomSheet.Content>
 *     <Text>Your content here</Text>
 *   </BottomSheet.Content>
 * </BottomSheet.Root>
 * ```
 *
 * @example With Actions footer
 * ```tsx
 * <BottomSheet.Root visible={isOpen} onClose={close} size="medium">
 *   <BottomSheet.Header>
 *     <BottomSheet.Title subtitle="Choose one">Options</BottomSheet.Title>
 *   </BottomSheet.Header>
 *   <BottomSheet.Content scrollable>
 *     {items.map(item => <ItemRow key={item.id} item={item} />)}
 *   </BottomSheet.Content>
 *   <BottomSheet.Actions layout="horizontal">
 *     <Button title="Cancel" onPress={close} />
 *     <Button title="Confirm" onPress={handleConfirm} />
 *   </BottomSheet.Actions>
 * </BottomSheet.Root>
 * ```
 *
 * @example Non-dismissible (must use button to close)
 * ```tsx
 * <BottomSheet.Root visible={isOpen} onClose={close} dismissible={false}>
 *   <BottomSheet.Content>
 *     <Text>You must tap the button to close</Text>
 *     <Button title="Close" onPress={close} />
 *   </BottomSheet.Content>
 * </BottomSheet.Root>
 * ```
 */
/**
 * @deprecated Custom PanResponder implementation (limited gestures/scroll). The modern
 * replacement is `Dialog.Sheet` (on RN Modal, no provider). Kept for backwards compatibility.
 */
function Root({ visible, onClose, size = "auto", dismissible = true, children }: RootProps) {
  const insets = useSafeAreaInsets();
  const screenHeight = Dimensions.get("window").height;
  const translateY = useRef(new Animated.Value(screenHeight)).current;

  const maxHeight = size === "auto" ? screenHeight * 0.9 : screenHeight * SIZE_MAP[size];
  const minHeight = size === "auto" ? 0 : screenHeight * SIZE_MAP[size];

  useEffect(() => {
    if (visible) {
      Animated.spring(translateY, {
        toValue: 0,
        useNativeDriver: true,
        damping: 20,
        stiffness: 300,
      }).start();
    } else {
      translateY.setValue(screenHeight);
    }
  }, [visible, screenHeight, translateY]);

  const panResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => dismissible,
      onMoveShouldSetPanResponder: (_, gestureState) => {
        return dismissible && Math.abs(gestureState.dy) > 10;
      },
      onPanResponderMove: (_, gestureState) => {
        if (gestureState.dy > 0) {
          translateY.setValue(gestureState.dy);
        }
      },
      onPanResponderRelease: (_, gestureState) => {
        if (gestureState.dy > 100 || gestureState.vy > 0.5) {
          Animated.timing(translateY, {
            toValue: screenHeight,
            duration: 200,
            useNativeDriver: true,
          }).start(() => onClose());
        } else {
          Animated.spring(translateY, {
            toValue: 0,
            useNativeDriver: true,
            damping: 20,
            stiffness: 300,
          }).start();
        }
      },
    }),
  ).current;

  function handleBackdropPress() {
    if (dismissible) {
      Animated.timing(translateY, {
        toValue: screenHeight,
        duration: 200,
        useNativeDriver: true,
      }).start(() => onClose());
    }
  }

  const contextValue: BottomSheetContextValue = {
    close: onClose,
    panHandlers: panResponder.panHandlers,
  };

  return (
    <Modal
      animationType="fade"
      onRequestClose={onClose}
      presentationStyle="overFullScreen"
      transparent
      visible={visible}
    >
      <View className="flex-1 bg-black/50">
        <Pressable className="flex-1" onPress={handleBackdropPress} />

        <Animated.View
          className="rounded-t-3xl overflow-hidden"
          style={{
            backgroundColor: theme.bg.popover,
            maxHeight,
            minHeight: minHeight || undefined,
            paddingBottom: insets.bottom,
            transform: [{ translateY }],
          }}
        >
          <BottomSheetContext.Provider value={contextValue}>
            {children}
          </BottomSheetContext.Provider>
        </Animated.View>
      </View>
    </Modal>
  );
}

export interface HandleProps {
  children?: ReactNode;
}

/**
 * Standalone drag handle for minimal bottom sheets without a header.
 * Includes the visual "pill" indicator and swipe gesture support.
 *
 * Use this when you want a simple drag indicator without a full header.
 * For sheets with titles, use `BottomSheet.Header` instead.
 *
 * @param children - Optional content below the handle pill
 *
 * @example Minimal sheet with just a handle
 * ```tsx
 * <BottomSheet.Root visible={isOpen} onClose={close}>
 *   <BottomSheet.Handle />
 *   <BottomSheet.Content>
 *     <Text>Simple content</Text>
 *   </BottomSheet.Content>
 * </BottomSheet.Root>
 * ```
 */
function Handle({ children }: HandleProps) {
  const { panHandlers } = useBottomSheet();

  return (
    <View {...panHandlers} className="items-center pt-3 pb-2">
      <View className="w-10 h-1 bg-border-light rounded-full mb-2" />
      {children}
    </View>
  );
}

export interface HeaderProps {
  children: ReactNode;
}

/**
 * Header section with integrated drag handle and bottom border.
 * Automatically includes the drag pill indicator and gesture support.
 *
 * Use with `BottomSheet.Title` for consistent styling, or provide custom content.
 *
 * @param children - Header content (typically BottomSheet.Title or custom layout)
 *
 * @example With Title component
 * ```tsx
 * <BottomSheet.Header>
 *   <BottomSheet.Title subtitle="Select your preference">
 *     Settings
 *   </BottomSheet.Title>
 * </BottomSheet.Header>
 * ```
 *
 * @example Custom header content
 * ```tsx
 * <BottomSheet.Header>
 *   <View className="flex-row justify-between px-4 py-2">
 *     <Text>Custom Title</Text>
 *     <TouchableOpacity onPress={close}>
 *       <Icon name="close" />
 *     </TouchableOpacity>
 *   </View>
 * </BottomSheet.Header>
 * ```
 */
function Header({ children }: HeaderProps) {
  const { panHandlers } = useBottomSheet();

  return (
    <View {...panHandlers} className="border-b border-border-light">
      <View className="items-center pt-3 pb-1">
        <View className="w-10 h-1 bg-border-divider rounded-full" />
      </View>
      {children}
    </View>
  );
}

export interface TitleProps {
  children: ReactNode;
  subtitle?: string;
}

/**
 * Title component for use inside BottomSheet.Header.
 * Provides consistent text styling with optional subtitle.
 *
 * @param children - Main title text (typically a string or Text component)
 * @param subtitle - Optional secondary text below the title
 *
 * @example Simple title
 * ```tsx
 * <BottomSheet.Title>Select Device</BottomSheet.Title>
 * ```
 *
 * @example Title with subtitle
 * ```tsx
 * <BottomSheet.Title subtitle="Choose from available devices">
 *   Bluetooth Printer
 * </BottomSheet.Title>
 * ```
 */
function Title({ children, subtitle }: TitleProps) {
  return (
    <View className="px-5 py-3">
      <Text className="text-lg font-semibold text-text-primary">{children}</Text>
      {subtitle && <Text className="text-sm text-text-secondary mt-1">{subtitle}</Text>}
    </View>
  );
}

export interface ContentProps {
  children: ReactNode;
  scrollable?: boolean;
}

/**
 * Main content area for the bottom sheet.
 * Can be static or scrollable depending on content needs.
 *
 * @param children - Content to display
 * @param scrollable - Enable ScrollView wrapper for long content (default: false)
 *
 * @example Static content
 * ```tsx
 * <BottomSheet.Content>
 *   <View className="p-4">
 *     <Text>Short content that fits</Text>
 *   </View>
 * </BottomSheet.Content>
 * ```
 *
 * @example Scrollable list
 * ```tsx
 * <BottomSheet.Content scrollable>
 *   {items.map(item => (
 *     <TouchableOpacity key={item.id} onPress={() => onSelect(item)}>
 *       <Text>{item.name}</Text>
 *     </TouchableOpacity>
 *   ))}
 * </BottomSheet.Content>
 * ```
 */
function Content({ children, scrollable = false }: ContentProps) {
  if (scrollable) {
    return (
      <ScrollView bounces={false} className="flex-1" showsVerticalScrollIndicator={false}>
        {children}
      </ScrollView>
    );
  }

  return <View className="flex-1">{children}</View>;
}

export interface ActionsProps {
  children: ReactNode;
  layout?: "auto" | "horizontal" | "vertical";
}

/**
 * Action buttons section with top border, typically at the bottom of the sheet.
 * Use for confirm/cancel buttons or multiple action options.
 *
 * @param children - Button components
 * @param layout - Button arrangement: 'auto' | 'horizontal' | 'vertical' (default: 'auto')
 *
 * @example Vertical buttons (default)
 * ```tsx
 * <BottomSheet.Actions>
 *   <Button title="Option 1" onPress={handleOption1} />
 *   <Button title="Option 2" onPress={handleOption2} />
 *   <Button title="Cancel" variant="outline" onPress={close} />
 * </BottomSheet.Actions>
 * ```
 *
 * @example Horizontal buttons (confirm/cancel pattern)
 * ```tsx
 * <BottomSheet.Actions layout="horizontal">
 *   <Button title="Cancel" variant="outline" onPress={close} flex={1} />
 *   <Button title="Confirm" variant="primary" onPress={confirm} flex={1} />
 * </BottomSheet.Actions>
 * ```
 */
function Actions({ children, layout = "auto" }: ActionsProps) {
  const containerClass = layout === "horizontal" ? "flex-row gap-3" : "gap-3";

  return (
    <View className="px-5 py-4 border-t border-border-light">
      <View className={containerClass}>{children}</View>
    </View>
  );
}

export interface FooterProps {
  children: ReactNode;
}

/**
 * Footer section with gray background, for secondary information or status.
 * Different from Actions - use Footer for non-interactive content.
 *
 * @param children - Footer content (text, status indicators, etc.)
 *
 * @example Status footer
 * ```tsx
 * <BottomSheet.Footer>
 *   <Text className="text-gray-500 text-sm">
 *     Last updated: 5 minutes ago
 *   </Text>
 * </BottomSheet.Footer>
 * ```
 *
 * @example Help text footer
 * ```tsx
 * <BottomSheet.Footer>
 *   <View className="flex-row items-center">
 *     <Icon name="info" size={16} />
 *     <Text className="ml-2 text-gray-600">Swipe down to dismiss</Text>
 *   </View>
 * </BottomSheet.Footer>
 * ```
 */
function Footer({ children }: FooterProps) {
  return (
    <View className="px-5 py-3 border-t border-border-light bg-bg-hover">{children}</View>
  );
}

/**
 * BottomSheet Compound Components
 *
 * A flexible, gesture-enabled bottom sheet modal system following compound component pattern.
 * Supports swipe-to-dismiss, configurable sizes, and composable sections.
 *
 * ## Components
 *
 * | Component | Purpose |
 * |-----------|---------|
 * | `Root` | Container with gesture handling and animations |
 * | `Handle` | Standalone drag pill (minimal sheets) |
 * | `Header` | Header with integrated drag handle |
 * | `Title` | Styled title with optional subtitle |
 * | `Content` | Main content area (static or scrollable) |
 * | `Actions` | Action buttons section |
 * | `Footer` | Secondary info footer |
 * | `useBottomSheet` | Hook for custom components |
 *
 * ## Basic Structure
 *
 * ```tsx
 * <BottomSheet.Root visible={isOpen} onClose={close}>
 *   <BottomSheet.Header>
 *     <BottomSheet.Title>Title</BottomSheet.Title>
 *   </BottomSheet.Header>
 *   <BottomSheet.Content>
 *     {content}
 *   </BottomSheet.Content>
 *   <BottomSheet.Actions>
 *     {buttons}
 *   </BottomSheet.Actions>
 * </BottomSheet.Root>
 * ```
 *
 * ## Usage in Atomic Design
 *
 * - **Molecules**: Use BottomSheet to create selector modals (e.g., BluetoothDeviceSelectorModal)
 * - **Organisms**: Compose Card + SelectorModal for complete features (e.g., BluetoothPrinterSelector)
 *
 * @see BluetoothDeviceSelectorModal - Example molecule implementation
 * @see TimeZoneSelectorModal - Example molecule implementation
 */
export const BottomSheet = {
  Root,
  Handle,
  Header,
  Title,
  Content,
  Actions,
  Footer,
  useBottomSheet,
};
