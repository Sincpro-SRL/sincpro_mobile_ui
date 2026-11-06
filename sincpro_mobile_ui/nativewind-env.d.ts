/// <reference types="nativewind/types" />

// The publish build sets rootDir to this folder, so it cannot see the
// repo-root nativewind-env.d.ts. Without this reference, `className` is not
// part of the program `tsc -p tsconfig.build.json` typechecks.
