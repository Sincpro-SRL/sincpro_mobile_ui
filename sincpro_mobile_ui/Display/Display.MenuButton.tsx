import SwipeableRow, {
  type SwipeRowAction,
} from "@sincpro/mobile-ui/Display/Display.SwipeableRow";
import Spinner from "@sincpro/mobile-ui/Feedback/Feedback.Spinner";
import { useTheme } from "@sincpro/mobile-ui/theme";
import { tv, type VariantProps } from "@sincpro/mobile-ui/theme/tw";
import { Typography } from "@sincpro/mobile-ui/Typography";
import { ComponentType, ReactNode } from "react";
import { Switch, TouchableOpacity, View } from "react-native";

// ─── Swipe actions ────────────────────────────────────────────────────────────
// Re-export SwipeRowAction shape under a MenuButton-friendly alias so callers
// don't need to know about SwipeableRow.
export type MenuButtonSwipeAction = SwipeRowAction;

// ─── Badge ───────────────────────────────────────────────────────────────────

/**
 * Inline status/count badge on the right of the row.
 * Presets: `"active"` (green pill), `"inactive"` (yellow pill), `"new"` (accent pill).
 * Any string / number renders a danger count chip.
 */
export type MenuButtonBadge = "active" | "inactive" | "new" | string | number;

function BadgeChip({ badge }: { badge: MenuButtonBadge }) {
  const theme = useTheme();

  if (badge === "active") {
    return (
      <View
        style={{
          flexDirection: "row",
          alignItems: "center",
          gap: 4,
          backgroundColor: theme.successLight,
          paddingHorizontal: 8,
          paddingVertical: 3,
          borderRadius: 999,
        }}
      >
        <View
          style={{ width: 6, height: 6, borderRadius: 999, backgroundColor: theme.success }}
        />
        <Typography.Text
          semibold
          style={{ color: theme.success, fontSize: 11 }}
          variant="caption"
        >
          Activo
        </Typography.Text>
      </View>
    );
  }

  if (badge === "inactive") {
    return (
      <View
        style={{
          flexDirection: "row",
          alignItems: "center",
          gap: 4,
          backgroundColor: theme.warningLight,
          paddingHorizontal: 8,
          paddingVertical: 3,
          borderRadius: 999,
        }}
      >
        <View
          style={{ width: 6, height: 6, borderRadius: 999, backgroundColor: theme.warning }}
        />
        <Typography.Text
          semibold
          style={{ color: theme.warning, fontSize: 11 }}
          variant="caption"
        >
          Inactivo
        </Typography.Text>
      </View>
    );
  }

  if (badge === "new") {
    return (
      <View
        style={{
          backgroundColor: theme.accent,
          paddingHorizontal: 8,
          paddingVertical: 3,
          borderRadius: 999,
        }}
      >
        <Typography.Text
          semibold
          style={{ color: theme.text.onAccent, fontSize: 11 }}
          variant="caption"
        >
          Nuevo
        </Typography.Text>
      </View>
    );
  }

  return (
    <View
      style={{
        backgroundColor: theme.danger,
        minWidth: 20,
        height: 20,
        borderRadius: 999,
        alignItems: "center",
        justifyContent: "center",
        paddingHorizontal: 6,
      }}
    >
      <Typography.Text
        style={{ color: "#FFFFFF", fontSize: 11, lineHeight: 14 }}
        variant="caption"
      >
        {badge}
      </Typography.Text>
    </View>
  );
}

// ─── Tailwind slots ───────────────────────────────────────────────────────────

const menuButton = tv({
  slots: {
    container: "flex-row items-center py-3 px-4 bg-bg-card",
    iconContainer: "mr-3 w-8 h-8 rounded-lg items-center justify-center",
    content: "flex-1",
    label: "",
    rightContainer: "ml-2 flex-row items-center gap-2",
  },
  variants: {
    variant: {
      default: {
        iconContainer: "bg-bg-hover",
        label: "text-text-primary",
      },
      danger: {
        iconContainer: "bg-danger-light",
        label: "text-danger",
      },
      success: {
        iconContainer: "bg-success-light",
        label: "text-success",
      },
    },
    showDivider: {
      true: { container: "border-b border-border-default" },
    },
    disabled: {
      true: { container: "opacity-40" },
    },
  },
  defaultVariants: {
    variant: "default",
    showDivider: true,
    disabled: false,
  },
});

// ─── Props ────────────────────────────────────────────────────────────────────

export interface MenuButtonProps extends VariantProps<typeof menuButton> {
  icon?: ComponentType<{ size?: number; color?: string }>;
  label: string;
  description?: string;
  onPress?: () => void;
  /** Arbitrary right-side slot — takes precedence over all built-in right elements. */
  rightComponent?: ReactNode;
  className?: string;

  /**
   * Inline toggle switch on the right.
   * The row's `onPress` is still fired when the row body is tapped.
   * The switch itself calls `onToggle` independently.
   */
  toggle?: { value: boolean; onToggle: (v: boolean) => void };

  /**
   * Current-value label shown on the right before the chevron.
   * Great for settings rows: "Siempre", "Nunca", "24 hs".
   */
  value?: string;

  /**
   * Status / count badge on the right.
   * Presets: `"active"` | `"inactive"` | `"new"`.
   * Any string or number renders a plain danger count chip.
   */
  badge?: MenuButtonBadge;

  /** Replace right content with a spinner while an async action is running. */
  loading?: boolean;

  /**
   * Swipe-left (right-side) or swipe-right (left-side) reveal actions.
   * Delegates to `Display.SwipeableRow` — same `SwipeRowAction` shape.
   */
  swipeActions?: MenuButtonSwipeAction[];
  swipeLeftActions?: MenuButtonSwipeAction[];
}

// ─── Component ───────────────────────────────────────────────────────────────

function MenuButton({
  icon: IconComp,
  label,
  description,
  onPress,
  rightComponent,
  showDivider = true,
  variant = "default",
  disabled = false,
  className,
  toggle,
  value,
  badge,
  loading = false,
  swipeActions,
  swipeLeftActions,
}: MenuButtonProps) {
  const theme = useTheme();
  const styles = menuButton({ variant, showDivider, disabled });
  const isDanger = variant === "danger";
  const isClickable = !!onPress && !disabled;
  const iconColor = isDanger ? theme.danger : theme.text.secondary;

  // Right-side priority: loading > explicit slot > toggle > badge/value/chevron
  const rightSlot = (() => {
    if (loading) return <Spinner size="small" />;
    if (rightComponent) return rightComponent;
    if (toggle) {
      return (
        <Switch
          onValueChange={toggle.onToggle}
          thumbColor={theme.bg.card}
          trackColor={{ false: theme.border.strong, true: theme.accent }}
          value={toggle.value}
        />
      );
    }

    const hasBadge = badge != null;
    const hasValue = !!value;
    const hasChevron = isClickable && !hasBadge;

    if (!hasBadge && !hasValue && !hasChevron) return null;

    return (
      <View style={{ flexDirection: "row", alignItems: "center", gap: 6 }}>
        {hasBadge ? <BadgeChip badge={badge!} /> : null}
        {hasValue ? (
          <Typography.Text style={{ color: theme.text.secondary }} variant="bodySmall">
            {value}
          </Typography.Text>
        ) : null}
        {isClickable ? (
          <Typography.Text style={{ color: theme.text.tertiary, fontSize: 20 }}>
            ›
          </Typography.Text>
        ) : null}
      </View>
    );
  })();

  const row = (
    <TouchableOpacity
      activeOpacity={0.5}
      className={styles.container({ className })}
      disabled={disabled || (!onPress && !toggle)}
      onPress={onPress}
    >
      {IconComp ? (
        <View className={styles.iconContainer()}>
          <IconComp color={iconColor} size={20} />
        </View>
      ) : null}

      <View className={styles.content()}>
        <Typography.Text className={styles.label()} variant="body">
          {label}
        </Typography.Text>
        {description ? (
          <Typography.Text className="text-text-secondary" variant="bodySmall">
            {description}
          </Typography.Text>
        ) : null}
      </View>

      {rightSlot ? <View className={styles.rightContainer()}>{rightSlot}</View> : null}
    </TouchableOpacity>
  );

  if (swipeActions?.length || swipeLeftActions?.length) {
    return (
      <SwipeableRow leftActions={swipeLeftActions} rightActions={swipeActions}>
        {row}
      </SwipeableRow>
    );
  }

  return row;
}

export default MenuButton;
