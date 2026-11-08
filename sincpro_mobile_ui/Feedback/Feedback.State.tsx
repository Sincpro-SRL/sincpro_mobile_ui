import Empty from "@sincpro/mobile-ui/Feedback/Feedback.Empty";
import EmptyState, {
  type EmptyStateProps,
} from "@sincpro/mobile-ui/Feedback/Feedback.EmptyState";
import ErrorState, { type ErrorProps } from "@sincpro/mobile-ui/Feedback/Feedback.Error";
import Loading, {
  type LoadingStateProps,
} from "@sincpro/mobile-ui/Feedback/Feedback.Loading";

export type FeedbackStateProps =
  | ({ kind: "loading" } & LoadingStateProps)
  | ({ kind: "empty" } & Partial<EmptyStateProps>)
  | ({ kind: "error" } & ErrorProps);

/**
 * One entry point for the three states a screen or template can be in.
 * `empty` with a `title` is the configurable EmptyState; without one it keeps
 * the original "no records" look that list and form templates already show.
 */
function State(props: FeedbackStateProps) {
  switch (props.kind) {
    case "loading": {
      const { kind: _kind, ...loading } = props;
      return <Loading {...loading} />;
    }
    case "error": {
      const { kind: _kind, ...error } = props;
      return <ErrorState {...error} />;
    }
    case "empty": {
      const { kind: _kind, title, ...empty } = props;
      return title ? (
        <EmptyState {...empty} title={title} />
      ) : (
        <Empty className={empty.className} />
      );
    }
  }
}

export default State;
