export function normalizeProgress(value: number): number {
  if (!Number.isFinite(value)) throw new RangeError("Progress value must be a finite number");
  return Math.max(0, Math.min(1, value));
}
