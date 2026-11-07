import { strict as assert } from "node:assert";
import { test } from "node:test";
import { imageSourceKey } from "@sincpro/mobile-ui/utils/image";

test("image identities cover asset IDs, URLs, arrays and source metadata", () => {
  assert.equal(imageSourceKey(0), "0");
  assert.equal(imageSourceKey("https://example.com/a.png"), '"https://example.com/a.png"');
  assert.equal(imageSourceKey({ uri: "a" }), imageSourceKey({ uri: "a" }));
  assert.notEqual(
    imageSourceKey({ uri: "a", cacheKey: "v1" }),
    imageSourceKey({ uri: "a", cacheKey: "v2" }),
  );
  assert.equal(
    imageSourceKey([
      { uri: "a", width: 80 },
      { uri: "b", width: 160 },
    ]),
    '[{"uri":"a","width":80},{"uri":"b","width":160}]',
  );
});

test("native shared image references have stable identities without serialization", () => {
  class ImageRef {
    nativeRefType = "image";
    width = 80;
    toJSON() {
      throw new Error("Shared references must not be serialized");
    }
  }
  const first = new ImageRef();
  const second = new ImageRef();
  assert.equal(imageSourceKey(first), imageSourceKey(first));
  assert.notEqual(imageSourceKey(first), imageSourceKey(second));
});
