import assert from "node:assert/strict";
import { describe, it } from "node:test";

import {
  criteriaAt,
  describeCriteria,
  moveCollectionEntry,
  replaceCriteria,
  validateCondition,
  validateCriteria,
  type CriteriaField,
  type CriteriaGroup,
} from "@sincpro/mobile-ui/utils/criteria";

const fields: CriteriaField[] = [
  {
    id: "amount",
    label: "Importe",
    type: "number",
    operators: [{ id: "between", label: "entre", arity: "range" }],
  },
  {
    id: "date",
    label: "Fecha",
    type: "date",
    operators: [{ id: "equal", label: "es", arity: "one" }],
  },
  {
    id: "title",
    label: "Título",
    type: "text",
    operators: [{ id: "empty", label: "está vacío", arity: "none" }],
  },
  {
    id: "status",
    label: "Estado",
    type: "choice",
    options: [{ label: "Pendiente", value: false }],
    operators: [{ id: "equal", label: "es", arity: "one" }],
  },
];
const root: CriteriaGroup = {
  kind: "group",
  join: "all",
  children: [
    {
      kind: "group",
      join: "none",
      children: [{ kind: "condition", field: "title", operator: "empty", values: [] }],
    },
  ],
};

describe("collection criteria", () => {
  it("replaces and removes nested nodes immutably without flattening joins", () => {
    const updated = replaceCriteria(root, [0, 0], {
      kind: "condition",
      field: "amount",
      operator: "between",
      values: [0, 10],
    });
    assert.equal(criteriaAt(updated, [0]).kind, "group");
    assert.equal(
      criteriaAt(root, [0, 0]).kind === "condition" && criteriaAt(root, [0, 0]).field,
      "title",
    );
    assert.equal(validateCriteria(updated, fields), undefined);
    assert.match(describeCriteria(updated, fields), /Ninguna: \(Importe entre 0 — 10\)/);
    const removed = replaceCriteria(updated, [0, 0], null);
    assert.match(validateCriteria(removed, fields)!, /grupo vacío/);
  });
  it("rejects invalid paths and non-group root replacements explicitly", () => {
    assert.throws(() => criteriaAt(root, [10]), /Invalid/);
    assert.throws(() => replaceCriteria(root, [0, 0, 0], null), /Invalid/);
    assert.throws(() => replaceCriteria(root, [], null), /root/);
  });
  it("validates number range arity, zero, finite values and order", () => {
    const condition = { kind: "condition", field: "amount", operator: "between" } as const;
    assert.equal(validateCondition({ ...condition, values: [0, 10] }, fields), undefined);
    assert.match(
      validateCondition({ ...condition, values: [Infinity, 10] }, fields)!,
      /número/,
    );
    assert.match(validateCondition({ ...condition, values: [11, 10] }, fields)!, /inicio/);
    assert.match(validateCondition({ ...condition, values: [1] }, fields)!, /valores/);
  });
  it("rejects invalid calendar dates without throwing or rolling into another month", () => {
    for (const date of ["2026-99-99", "2026-02-29", "2026-04-31", "2026-1-2"]) {
      assert.match(
        validateCondition(
          { kind: "condition", field: "date", operator: "equal", values: [date] },
          fields,
        )!,
        /fecha/,
      );
    }
    assert.equal(
      validateCondition(
        { kind: "condition", field: "date", operator: "equal", values: ["2028-02-29"] },
        fields,
      ),
      undefined,
    );
  });
  it("honors configured operators, no-value comparisons and false choice values", () => {
    assert.equal(validateCriteria(root, fields), undefined);
    assert.equal(
      validateCondition(
        { kind: "condition", field: "status", operator: "equal", values: [false] },
        fields,
      ),
      undefined,
    );
    assert.match(
      validateCondition(
        { kind: "condition", field: "status", operator: "contains", values: ["pending"] },
        fields,
      )!,
      /operador/,
    );
    assert.match(
      validateCondition(
        { kind: "condition", field: "gone", operator: "empty", values: [] },
        fields,
      )!,
      /campo/,
    );
  });
  it("reorders priorities immutably and rejects boundary moves", () => {
    const order = ["date", "amount", "title"];
    assert.deepEqual(moveCollectionEntry(order, 2, -1), ["date", "title", "amount"]);
    assert.deepEqual(order, ["date", "amount", "title"]);
    assert.throws(() => moveCollectionEntry(order, 0, -1), /Invalid/);
  });
});
