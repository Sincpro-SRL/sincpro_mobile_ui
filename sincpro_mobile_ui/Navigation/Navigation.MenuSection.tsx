import { useTheme } from "@sincpro/mobile-ui/theme";
import { Typography } from "@sincpro/mobile-ui/Typography";
import { ReactNode } from "react";
import { View } from "react-native";

export interface MenuSectionProps {
  /** Section heading above the card. */
  title?: string;
  /** Footer note below the card (hints, disclaimers). */
  footer?: string;
  children: ReactNode;
}

/**
 * Titled card that groups `Display.MenuButton` rows into a visual section.
 * Mirrors iOS grouped-table-view style: title above, card surface, optional footer note.
 *
 * Usage:
 *   <MenuSection title="General">
 *     <Display.MenuButton label="Impresora" icon={PrinterIcon} onPress={...} />
 *     <Display.MenuButton label="Ajustes" icon={SettingsIcon} onPress={...} showDivider={false} />
 *   </MenuSection>
 */
export function MenuSection({ title, footer, children }: MenuSectionProps) {
  const theme = useTheme();

  return (
    <View style={{ marginHorizontal: 16, marginBottom: 20 }}>
      {title ? (
        <Typography.Text
          semibold
          style={{ color: theme.text.secondary, marginBottom: 6, paddingHorizontal: 4 }}
          variant="caption"
        >
          {title.toUpperCase()}
        </Typography.Text>
      ) : null}

      <View
        style={{
          backgroundColor: theme.bg.card,
          borderRadius: 14,
          borderWidth: 1,
          borderColor: theme.border.default,
          overflow: "hidden",
          ...theme.shadow.sm,
        }}
      >
        {children}
      </View>

      {footer ? (
        <Typography.Text
          style={{ color: theme.text.tertiary, marginTop: 6, paddingHorizontal: 4 }}
          variant="caption"
        >
          {footer}
        </Typography.Text>
      ) : null}
    </View>
  );
}
