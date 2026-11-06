import assert from "node:assert/strict";
import { test } from "node:test";

import {
  applyReorder,
  moveReorderItem,
  reorderKeys,
  sameOrder,
} from "../../sincpro_mobile_ui/utils/reorder";

test("reorder validates stable keys and rejects missing or duplicate identities", () => {
  const key = (item: { id: string }) => item.id;
  assert.deepEqual(reorderKeys([{ id: "a" }, { id: "b" }], key), ["a", "b"]);
  for (const items of [[{ id: "" }], [{ id: " " }], [{ id: "a" }, { id: "a" }]])
    assert.throws(() => reorderKeys(items, key), /unique, non-empty/);
});

test("moving an item inserts at the exact final index without mutating input", () => {
  const items = Object.freeze(["a", "b", "c", "d"]);
  assert.deepEqual(moveReorderItem(items, 0, 3), ["b", "c", "d", "a"]);
  assert.deepEqual(moveReorderItem(items, 3, 0), ["d", "a", "b", "c"]);
  assert.deepEqual(moveReorderItem(items, 1, 1), items);
  for (const [from, to] of [
    [-1, 0],
    [0, 4],
    [1.5, 0],
    [0, NaN],
  ])
    assert.throws(() => moveReorderItem(items, from, to), /invalid move/);
});

test("applying a key order preserves current objects and rejects stale or partial orders", () => {
  const first = { id: "a", label: "Updated" };
  const second = { id: "b", label: "Current" };
  const items = Object.freeze([first, second]);
  const next = applyReorder(items, (item) => item.id, ["b", "a"]);
  assert.equal(next[0], second);
  assert.equal(next[1], first);
  for (const order of [["a"], ["a", "a"], ["b", "missing"]])
    assert.throws(() => applyReorder(items, (item) => item.id, order), /does not match/);
  assert.equal(sameOrder(["a", "b"], ["a", "b"]), true);
  assert.equal(sameOrder(["a", "b"], ["b", "a"]), false);
  assert.equal(sameOrder(["a"], ["a", "b"]), false);
});
