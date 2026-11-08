import assert from "node:assert/strict";
import { test } from "node:test";

import { dateTimeFormat } from "@sincpro/mobile-ui/utils/intl";
import { formatTwoDecimals, parseToMonetaryNumber } from "@sincpro/mobile-ui/utils/monetary";

test("date formatters are shared per locale and options", () => {
  const options = { year: "numeric", month: "long", day: "numeric", timeZone: "UTC" } as const;
  const first = dateTimeFormat("es-BO", options);
  assert.equal(dateTimeFormat("es-BO", { ...options }), first);
  assert.notEqual(dateTimeFormat("es-BO", { ...options, timeZone: "America/La_Paz" }), first);
  assert.notEqual(dateTimeFormat("en-US", options), first);
  const date = new Date(Date.UTC(2026, 4, 8, 12));
  assert.equal(first.format(date), new Intl.DateTimeFormat("es-BO", options).format(date));
  assert.throws(() => dateTimeFormat("es-BO", { timeZone: "Mars/Olympus" }), RangeError);
});

test("money keeps its format with one shared formatter and reads numbers as numbers", () => {
  assert.equal(formatTwoDecimals(1234.5), "1.234,50");
  assert.equal(formatTwoDecimals("1234.567"), "1.234,57");
  assert.equal(formatTwoDecimals(1.005), "1,01");
  assert.equal(formatTwoDecimals(null), "0,00");
  assert.equal(formatTwoDecimals(-3), "-3,00");
  // A finite number is no longer turned into a string: exponent forms stay exact.
  assert.equal(parseToMonetaryNumber(1e21), 1e21);
  assert.equal(parseToMonetaryNumber(1e-7), 1e-7);
  assert.equal(parseToMonetaryNumber(Number.NaN), 0);
  assert.equal(parseToMonetaryNumber(Number.POSITIVE_INFINITY), 0);
});
