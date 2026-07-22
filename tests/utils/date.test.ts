/**
 * Runtime tests for `utils/date`. The module imports `expo-localization` (which depends
 * on react-native and breaks in node:test). We intercept the resolver before the first
 * `await import("@sincpro/mobile-ui/utils/date")` call to redirect to a CJS stub.
 */
import { strict as assert } from "node:assert";
import Module from "node:module";
import { describe, it } from "node:test";

const origResolve = Module._resolveFilename;
Module._resolveFilename = function (
  request: string,
  ...args: Parameters<typeof origResolve>
): string {
  if (request === "expo-localization") {
    return require.resolve("./_expo-localization-stub.cjs");
  }
  return origResolve.call(this as unknown as NodeJS.Module, request, ...args);
};

async function loadDateUtils() {
  const m: unknown = await import("@sincpro/mobile-ui/utils/date");
  const record = m as Record<string, unknown> & { default?: Record<string, unknown> };
  const fn = (record.formatDate ?? record.default?.formatDate) as
    | ((input: string | Date, tz: string | null | undefined, opts?: { locale?: string | null; showTime?: boolean }) => string)
    | undefined;
  const fnDefault = (record.formatDateWithDefaultTimezone ?? record.default?.formatDateWithDefaultTimezone) as
    | ((input: string | Date, opts?: { locale?: string | null; showTime?: boolean }) => string)
    | undefined;
  const fnDate = (record.getCurrentDateInTimezone ?? record.default?.getCurrentDateInTimezone) as
    | ((tz?: string | null) => string)
    | undefined;
  const fnDateTime = (record.getCurrentDateTimeInTimezone ?? record.default?.getCurrentDateTimeInTimezone) as
    | ((tz?: string | null) => string)
    | undefined;
  return {
    formatDate: fn,
    formatDateWithDefaultTimezone: fnDefault,
    getCurrentDateInTimezone: fnDate,
    getCurrentDateTimeInTimezone: fnDateTime,
  };
}

describe("utils/date", () => {
  it("exposes the four public functions", async () => {
    const { formatDate, formatDateWithDefaultTimezone, getCurrentDateInTimezone, getCurrentDateTimeInTimezone } =
      await loadDateUtils();
    assert.equal(typeof formatDate, "function");
    assert.equal(typeof formatDateWithDefaultTimezone, "function");
    assert.equal(typeof getCurrentDateInTimezone, "function");
    assert.equal(typeof getCurrentDateTimeInTimezone, "function");
  });

  it("formats a date-only string without time component", async () => {
    const { formatDate } = await loadDateUtils();
    const out = formatDate!("2025-09-02", "America/Costa_Rica", { locale: "es-CR" });
    assert.equal(typeof out, "string");
    assert.ok(out.includes("2025"), `expected year in output, got: ${out}`);
    assert.ok(!/\d{1,2}[:.]\d{2}/.test(out), `date-only output should not include time, got: ${out}`);
  });

  it("formats a date+time string including time component", async () => {
    const { formatDate } = await loadDateUtils();
    const out = formatDate!("2025-09-02T18:30:00Z", "America/Costa_Rica", { locale: "es-CR" });
    assert.equal(typeof out, "string");
    assert.ok(out.includes("2025"));
    assert.ok(/\d{1,2}[:.]\d{2}/.test(out), `expected time in output, got: ${out}`);
  });

  it("showTime=false forces no time even when input has one", async () => {
    const { formatDate } = await loadDateUtils();
    const out = formatDate!("2025-09-02T18:30:00Z", "America/Costa_Rica", {
      locale: "es-CR",
      showTime: false,
    });
    assert.ok(!/\d{1,2}[:.]\d{2}/.test(out), `showTime=false should drop time, got: ${out}`);
  });

  it("showTime=true forces time even when input is date-only", async () => {
    const { formatDate } = await loadDateUtils();
    const out = formatDate!("2025-09-02", "America/Costa_Rica", { locale: "es-CR", showTime: true });
    assert.ok(/\d{1,2}[:.]\d{2}/.test(out), `showTime=true should add time, got: ${out}`);
  });

  it("returns the sentinel string for an invalid timezone", async () => {
    const { formatDate } = await loadDateUtils();
    const out = formatDate!("2025-09-02", "Not/A/Real_Zone_!!!");
    assert.equal(out, "Error de formateo");
  });

  it("falls back to the default timezone when given null/undefined", async () => {
    const { formatDate } = await loadDateUtils();
    const a = formatDate!("2025-09-02", null, { locale: "es-CR" });
    const b = formatDate!("2025-09-02", undefined, { locale: "es-CR" });
    assert.equal(a, b);
  });

  it("formatDateWithDefaultTimezone delegates to formatDate with the default", async () => {
    const { formatDate, formatDateWithDefaultTimezone } = await loadDateUtils();
    const a = formatDateWithDefaultTimezone!("2025-09-02", { locale: "es-CR" });
    const b = formatDate!("2025-09-02", "America/Costa_Rica", { locale: "es-CR" });
    assert.equal(a, b);
  });

  it("getCurrentDateInTimezone returns YYYY-MM-DD", async () => {
    const { getCurrentDateInTimezone } = await loadDateUtils();
    const out = getCurrentDateInTimezone!("UTC");
    assert.match(out, /^\d{4}-\d{2}-\d{2}$/);
  });

  it("getCurrentDateTimeInTimezone returns a valid ISO string", async () => {
    const { getCurrentDateTimeInTimezone } = await loadDateUtils();
    const out = getCurrentDateTimeInTimezone!("UTC");
    assert.ok(!Number.isNaN(Date.parse(out)), `expected parseable ISO, got: ${out}`);
  });
});