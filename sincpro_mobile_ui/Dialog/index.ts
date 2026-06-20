import { BottomSheet } from "./BottomSheet";
import { ConfirmationProvider, useConfirmationContext } from "./Confirmation.context";
import Confirmation from "./Dialog.Confirmation";
import EditValue, {
  type EditableValueModalChip,
  type EditableValueModalProps,
} from "./Dialog.EditValue";

export const Dialog = {
  Confirmation,
  BottomSheet,
  EditValue,
};

export {
  BottomSheet,
  ConfirmationProvider,
  type EditableValueModalChip,
  type EditableValueModalProps,
  useConfirmationContext,
};

export default Dialog;
