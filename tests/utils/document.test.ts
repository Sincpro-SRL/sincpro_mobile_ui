import { strict as assert } from "node:assert";
import { test } from "node:test";
import {
  documentBase64,
  documentImageUri,
  documentMimeType,
  isImageMimeType,
  mimeTypeLabel,
  stripDataUri,
} from "@sincpro/mobile-ui/utils/document";

const PDF = "JVBERi0xLjQKJcOkw7zDtsOf";
const PNG = "iVBORw0KGgoAAAANSUhEUgAA";
const JPEG = "/9j/4AAQSkZJRgABAQ";
const HTML = Buffer.from("<!DOCTYPE html><html></html>").toString("base64");
const LOWER_HTML = Buffer.from("<!doctype html><html></html>").toString("base64");
const BARE_HTML = Buffer.from("<html><body></body></html>").toString("base64");

test("base64 content is identified by its signature, without a declared type", () => {
  assert.equal(documentMimeType({ base64: PDF }), "application/pdf");
  assert.equal(documentMimeType({ base64: PNG }), "image/png");
  assert.equal(documentMimeType({ base64: JPEG }), "image/jpeg");
  assert.equal(documentMimeType({ base64: `\n  ${PDF}` }), "application/pdf");
  assert.equal(documentMimeType({ base64: HTML }), "text/html");
  assert.equal(documentMimeType({ base64: LOWER_HTML }), "text/html");
  assert.equal(documentMimeType({ base64: BARE_HTML }), "text/html");
  assert.equal(documentMimeType({ base64: "AAAA" }), undefined);
});

test("a declared type or data URI wins over the signature", () => {
  assert.equal(documentMimeType({ base64: PNG, mimeType: "application/x-escpos" }), "application/x-escpos");
  assert.equal(documentMimeType({ base64: `data:application/pdf;base64,${PNG}` }), "application/pdf");
  assert.equal(documentMimeType({ uri: "data:image/png;base64,abc" }), "image/png");
});

test("files are typed by extension, ignoring query and fragment", () => {
  assert.equal(documentMimeType({ uri: "file:///cache/print_jobs/42.PDF" }), "application/pdf");
  assert.equal(documentMimeType({ uri: "https://erp.example/report.pdf?download=1" }), "application/pdf");
  assert.equal(documentMimeType({ uri: "file:///cache/receipt.html#top" }), "text/html");
  assert.equal(documentMimeType({ uri: "file:///cache/print_jobs/42.png" }), undefined);
  assert.equal(documentMimeType({ uri: "file:///cache/print_jobs/42" }), undefined);
});

test("unknown or image types load natively; others get a readable label", () => {
  assert.equal(isImageMimeType(undefined), true);
  assert.equal(isImageMimeType("image/webp"), true);
  assert.equal(isImageMimeType("application/pdf"), false);
  assert.equal(mimeTypeLabel(undefined), "Imagen");
  assert.equal(mimeTypeLabel("application/pdf"), "PDF");
  assert.equal(mimeTypeLabel("text/html"), "HTML");
  assert.equal(mimeTypeLabel("application/x-escpos"), "X-ESCPOS");
});

test("images reach the native view as data URIs; files pass through untouched", () => {
  assert.equal(documentImageUri({ base64: PNG }), `data:image/png;base64,${PNG}`);
  assert.equal(documentImageUri({ base64: JPEG }), `data:image/jpeg;base64,${JPEG}`);
  assert.equal(
    documentImageUri({ base64: "data:image/webp;base64,UklGR" }),
    "data:image/webp;base64,UklGR",
  );
  assert.equal(documentImageUri({ uri: "file:///a.png" }), "file:///a.png");
});

test("renderers receive bare base64 whether it came as content or as a data URI", () => {
  assert.equal(documentBase64({ base64: `data:application/pdf;base64,${PDF}\n` }), PDF);
  assert.equal(documentBase64({ uri: `data:application/pdf;base64,${PDF}` }), PDF);
  assert.equal(documentBase64({ uri: "file:///a.pdf" }), undefined);
  assert.equal(stripDataUri("data:;base64,abc"), "abc");
  assert.equal(stripDataUri(PDF), PDF);
});
