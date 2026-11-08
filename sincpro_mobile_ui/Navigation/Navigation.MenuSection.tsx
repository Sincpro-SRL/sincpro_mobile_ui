import Card from "@sincpro/mobile-ui/Display/Display.Card";
import { GroupTitle } from "@sincpro/mobile-ui/Display/group-title";
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
        <GroupTitle style={{ marginBottom: 6, paddingHorizontal: 4 }}>{title}</GroupTitle>
      ) : null}

      <Card className="overflow-hidden" elevation="sm" padding="none">
        {children}
      </Card>

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
