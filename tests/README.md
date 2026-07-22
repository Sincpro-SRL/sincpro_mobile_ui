# `tests/` — runtime tests for `@sincpro/mobile-ui`

> Tests **never** live inside `sincpro_mobile_ui/`. They live in this `tests/` folder,
> **mirrored by source context**. Each runtime module gets its own folder; one or more
> `*.test.ts` files inside.

## Layout

```
tests/
├── branding/                   # mirrors sincpro_mobile_ui/branding.ts
│   └── branding.test.ts
└── theme/                      # mirrors sincpro_mobile_ui/theme/
    ├── active.test.ts          # setActiveTheme, subscribe, version
    ├── define.test.ts          # defineTheme, extendTheme, mergeTheme
    └── validate.test.ts        # validateTheme
```

When you add a new source module worth testing, create a folder with the same name here:

| Source | Tests |
|---|---|
| `sincpro_mobile_ui/branding.ts` | `tests/branding/branding.test.ts` |
| `sincpro_mobile_ui/theme/active.ts` | `tests/theme/active.test.ts` |
| `sincpro_mobile_ui/theme/define.ts` | `tests/theme/define.test.ts` |
| `sincpro_mobile_ui/theme/validate.ts` | `tests/theme/validate.test.ts` |
| `sincpro_mobile_ui/Display/*` (RN components) | RN test setup — needs `jest-expo` or `vitest` + RN preset; **not** covered by `make test` yet. |

## Running

```bash
make test
```

Wired to `tsx --test 'tests/**/*.test.ts'`. Pure-runtime tests only — no DOM, no React
Native runtime. RN components are exercised visually via the Storybook
(`make storybook`).

## Style

- `node:test` + `node:assert/strict`. No jest, no vitest — keep the dep tree tiny.
- One test file per concept, multiple `describe()` blocks per file.
- `beforeEach` to reset mutable singletons (`setActiveTheme({ name: 'reset' })`,
  `__resetBranding()`).
- Imports via `@sincpro/mobile-ui/...` (the alias from `tsconfig.json`), not relative
  paths.

## Excluded from build / typecheck

- `tsconfig.build.json` excludes `**/*.test.*` (so tests don't ship in `dist/`).
- `tsconfig.json` excludes `**/__tests__/**` (legacy, in case anything sneaks into
  source).
- `make typecheck` skips the test folder; tests run via `tsx --test` which has its own
  type-aware resolution.
