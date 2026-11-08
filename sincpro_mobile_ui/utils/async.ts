export type Attempt<T> = { ok: true; value: T } | { ok: false; error: unknown };

/**
 * Runs `task` and reports how it ended instead of throwing. Component handlers use it
 * so they need no `try/finally`: React Compiler skips any component whose body has one.
 */
export async function attempt<T>(task: () => T | Promise<T>): Promise<Attempt<T>> {
  try {
    return { ok: true, value: await task() };
  } catch (error) {
    return { ok: false, error };
  }
}

/** The error's own message when it has one, else the fallback shown to the user. */
export function errorMessage(cause: unknown, fallback: string): string {
  return cause instanceof Error && cause.message.trim() ? cause.message : fallback;
}
