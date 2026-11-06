import Banner from "@sincpro/mobile-ui/Feedback/Feedback.Banner";
import Empty from "@sincpro/mobile-ui/Feedback/Feedback.Empty";
import EmptyState from "@sincpro/mobile-ui/Feedback/Feedback.EmptyState";
import Error from "@sincpro/mobile-ui/Feedback/Feedback.Error";
import Loading from "@sincpro/mobile-ui/Feedback/Feedback.Loading";
import PermissionCard from "@sincpro/mobile-ui/Feedback/Feedback.PermissionCard";
import Progress from "@sincpro/mobile-ui/Feedback/Feedback.Progress";
import ProgressCircle from "@sincpro/mobile-ui/Feedback/Feedback.ProgressCircle";
import Skeleton from "@sincpro/mobile-ui/Feedback/Feedback.Skeleton";
import Spinner from "@sincpro/mobile-ui/Feedback/Feedback.Spinner";
import SplashScreen from "@sincpro/mobile-ui/Feedback/Feedback.Splash";
import { Toast } from "@sincpro/mobile-ui/Feedback/Toast.context";

export { ErrorBoundary } from "@sincpro/mobile-ui/Feedback/ErrorBoundary";
export type { ProgressProps } from "@sincpro/mobile-ui/Feedback/Feedback.Progress";
export type { ProgressCircleProps } from "@sincpro/mobile-ui/Feedback/Feedback.ProgressCircle";
export type { SkeletonProps } from "@sincpro/mobile-ui/Feedback/Feedback.Skeleton";
export type {
  SpinnerProps,
  SpinnerVariant,
} from "@sincpro/mobile-ui/Feedback/Feedback.Spinner";
export {
  Toast,
  type ToastAction,
  type ToastActionProps,
  type ToastCloseProps,
  type ToastContentProps,
  type ToastContextValue,
  type ToastCustomOptions,
  type ToastIconProps,
  type ToastOptions,
  type ToastPromiseMessages,
  ToastProvider,
  type ToastRenderProps,
  type ToastRootProps,
  type ToastTextProps,
  type ToastVariant,
  useToast,
} from "@sincpro/mobile-ui/Feedback/Toast.context";
export { useReducedMotion } from "@sincpro/mobile-ui/utils/useReducedMotion";

export const Feedback = {
  Loading,
  Spinner,
  Skeleton,
  Progress,
  ProgressCircle,
  Banner,
  PermissionCard,
  Empty,
  EmptyState,
  Error,
  SplashScreen,
  Toast,
};

export default Feedback;
