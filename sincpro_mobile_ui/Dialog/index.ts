import { BottomSheet } from "@sincpro/mobile-ui/Dialog/BottomSheet";
import {
  ConfirmationProvider,
  useConfirmationContext,
} from "@sincpro/mobile-ui/Dialog/Confirmation.context";
import ActionSheet from "@sincpro/mobile-ui/Dialog/Dialog.ActionSheet";
import Confirmation from "@sincpro/mobile-ui/Dialog/Dialog.Confirmation";
import EditValue, {
  type EditableValueModalChip,
  type EditableValueModalProps,
} from "@sincpro/mobile-ui/Dialog/Dialog.EditValue";

export const Dialog = {
  Confirmation,
  BottomSheet,
  EditValue,
  ActionSheet,
};

export {
  BottomSheet,
  ConfirmationProvider,
  type EditableValueModalChip,
  type EditableValueModalProps,
  useConfirmationContext,
};

export default Dialog;
