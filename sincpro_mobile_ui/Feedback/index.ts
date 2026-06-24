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

export { ErrorBoundary } from "@sincpro/mobile-ui/Feedback/ErrorBoundary";
export {
  type ToastAction,
  type ToastContextValue,
  type ToastOptions,
  type ToastPromiseMessages,
  ToastProvider,
  type ToastVariant,
  useToast,
} from "@sincpro/mobile-ui/Feedback/Toast.context";

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
};

export default Feedback;
