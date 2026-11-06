import ButtonWithIcon from "@sincpro/mobile-ui/Actions/Actions.Button";
import FAB from "@sincpro/mobile-ui/Actions/Actions.FAB";
import {
  FilterButton,
  FilterButtonGroup,
} from "@sincpro/mobile-ui/Actions/Actions.FilterButton";
import IconButton from "@sincpro/mobile-ui/Actions/Actions.IconButton";

export const Actions = {
  /** Primary action button. The filled one is gold; navy is text. Supports confirm dialog. */
  Button: ButtonWithIcon,
  /** Small icon-only tap target — ghost, primary, secondary, tertiary variants. */
  IconButton,
  /** Floating Action Button — fixed bottom-right/left, label-optional. */
  FAB,
  /** Chip-style active/inactive toggle — use inside `Actions.FilterButtonGroup`. */
  FilterButton,
  /** Filter chip layout; opt into horizontal scrolling or wrapping with `layout`. */
  FilterButtonGroup,
};

export type { ButtonIconProps, ButtonProps } from "@sincpro/mobile-ui/Actions/Actions.Button";
export type { FABProps } from "@sincpro/mobile-ui/Actions/Actions.FAB";
export type {
  FilterButtonGroupProps,
  FilterButtonProps,
} from "@sincpro/mobile-ui/Actions/Actions.FilterButton";
export type { IconButtonProps } from "@sincpro/mobile-ui/Actions/Actions.IconButton";

export default Actions;
