import {
  ConfirmationProvider,
  useConfirmationContext,
} from "@sincpro/mobile-ui/Dialog/Confirmation.context";
import ActionSheet from "@sincpro/mobile-ui/Dialog/Dialog.ActionSheet";
import Confirmation from "@sincpro/mobile-ui/Dialog/Dialog.Confirmation";
import EditValue from "@sincpro/mobile-ui/Dialog/Dialog.EditValue";
import Sheet from "@sincpro/mobile-ui/Dialog/Dialog.Sheet";
import { requestConfirmation } from "@sincpro/mobile-ui/Dialog/requestConfirmation";

export const Dialog = {
  Confirmation,
  Sheet,
  EditValue,
  ActionSheet,
  requestConfirmation,
};

export { ConfirmationProvider, requestConfirmation, Sheet, useConfirmationContext };
export type { ConfirmationOptions } from "@sincpro/mobile-ui/Dialog/Confirmation.context";
export type {
  ActionSheetAction,
  ActionSheetProps,
} from "@sincpro/mobile-ui/Dialog/Dialog.ActionSheet";
export type { ConfirmationProps } from "@sincpro/mobile-ui/Dialog/Dialog.Confirmation";
export type {
  EditValueOption,
  EditValueProps,
} from "@sincpro/mobile-ui/Dialog/Dialog.EditValue";
export type { SheetProps } from "@sincpro/mobile-ui/Dialog/Dialog.Sheet";
export type { NativeConfirmationOptions } from "@sincpro/mobile-ui/Dialog/requestConfirmation";

export default Dialog;
