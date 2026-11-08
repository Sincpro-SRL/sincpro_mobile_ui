// Emits dist/**/*.js from source with React Compiler, so apps get memoized
// components without compiling node_modules (Expo only compiles app code).
// Types come from `tsc --emitDeclarationOnly`; aliases are rewritten by tsc-alias.
import { mkdirSync, readdirSync, writeFileSync } from "node:fs";
import path from "node:path";

import { transformFileAsync } from "@babel/core";

const root = path.resolve(import.meta.dirname, "..");
const sourceDir = path.join(root, process.argv[2] ?? "sincpro_mobile_ui");
const outDir = path.join(root, "dist");

const stats = { files: 0, compiled: 0, skipped: [] };

const compilerLogger = {
  logEvent(filename, event) {
    if (event.kind === "CompileSuccess") stats.compiled += 1;
    if (event.kind === "CompileError" || event.kind === "CompileSkip") {
      const reason = event.detail?.reason ?? event.reason ?? event.kind;
      stats.skipped.push(`${path.relative(root, filename)}: ${reason}`);
    }
  },
};

function sources(directory) {
  return readdirSync(directory, { withFileTypes: true }).flatMap((entry) => {
    const file = path.join(directory, entry.name);
    if (entry.isDirectory()) return sources(file);
    if (!/\.tsx?$/.test(entry.name) || entry.name.endsWith(".d.ts")) return [];
    if (/\.test\.tsx?$/.test(entry.name)) return [];
    return [file];
  });
}

for (const file of sources(sourceDir)) {
  const result = await transformFileAsync(file, {
    babelrc: false,
    configFile: false,
    sourceMaps: false,
    presets: [["@babel/preset-typescript", { isTSX: true, allExtensions: true }]],
    plugins: [
      ["babel-plugin-react-compiler", { target: "19", logger: compilerLogger }],
      [
        "@babel/plugin-transform-react-jsx",
        { runtime: "automatic", importSource: "nativewind" },
      ],
    ],
  });
  const target = path.join(outDir, path.relative(sourceDir, file)).replace(/\.tsx?$/, ".js");
  mkdirSync(path.dirname(target), { recursive: true });
  writeFileSync(target, `${result.code}\n`);
  stats.files += 1;
}

console.log(
  `✓ JS: ${stats.files} files, React Compiler memoized ${stats.compiled} functions, skipped ${stats.skipped.length}`,
);
for (const line of stats.skipped) console.log(`  · skipped ${line}`);
// A skipped component ships without automatic memoization. Fail instead of
// degrading in silence; the reason above says which pattern to rewrite
// (try/finally → utils/async, ref.current in render → useState initializer, ...).
if (stats.skipped.length > 0) {
  console.error("✗ React Compiler must compile every component (see docs/GOTCHAS.md)");
  process.exit(1);
}
