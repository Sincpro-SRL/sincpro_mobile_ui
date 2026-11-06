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

| Source                                        | Tests                                                                |
| --------------------------------------------- | -------------------------------------------------------------------- |
| `sincpro_mobile_ui/branding.ts`               | `tests/branding/branding.test.ts`                                    |
| `sincpro_mobile_ui/theme/active.ts`           | `tests/theme/active.test.ts`                                         |
| `sincpro_mobile_ui/theme/define.ts`           | `tests/theme/define.test.ts`                                         |
| `sincpro_mobile_ui/theme/validate.ts`         | `tests/theme/validate.test.ts`                                       |
| `sincpro_mobile_ui/Display/*` (RN components) | `tests/Display/*.test.tsx`, Jest Expo + React Native Testing Library |
| `sincpro_mobile_ui/Actions/*`                 | `tests/Actions/*.test.tsx`                                           |
| Storybook UX pilot                            | `tests/UX/*.test.tsx`                                                |

## Running

```bash
make test
```

Runs `tsx --test 'tests/**/*.test.ts'` for pure runtime logic, then Jest with the Expo 58
preset for `tests/**/*.test.tsx`. React Native Testing Library 14 uses asynchronous
rendering and events: await `render`, `rerender` and interactions.

Native unit tests cover copy success/failure/retry, repeated presses, disabled/busy state,
accessible sizing, adaptive layout, feedback and header semantics, plus the
list/detail/edit/error/cancel pilot.
Selectable text uses a read-only native multiline control: tests cover its keyboard/edition
contract, live branded fonts and selection events. `Text selectable` alone does not provide
range selection on iOS.
Grouping tests cover separators, independently accessible child actions, disabled rows,
legacy/readable typography, configured fonts, class override precedence and settings tasks.
Native flows exercise both default and customized surfaces and long grouped settings.
Filter/search tests cover named inputs, clear/submit, 48-point targets, disabled/selected
chips, legacy search triggers and auto-layout at font scales 1.3/1.31.
Composition tests exercise actual local query/filter results, empty reset, independent
save/open in rows/cards and cancel/apply of advanced drafts.
Two collection flows verify first-tap filtering with the keyboard open, separate query
and filter clearing, saved results, native detail/copy and long dark labels.
The long-label flow also passes at `accessibility-large`, including scrolling within the
native detail sheet to reach its copy action.
They mock device services where needed; they do not replace VoiceOver/TalkBack or
multiplatform device validation.

Keyboard tests cover avoidance props/clearance, first-tap controls, named 48-point toolbar
actions and native input ref forwarding. The iOS flow additionally types through
name → email → phone → multiline using the actual toolbar, skips a read-only field,
returns to phone, dismisses and saves. Unit mocks do not claim to verify native focus.

Criteria tests cover immutable nested updates, all/any/none descriptions, arity, zero,
finite numbers, range ordering, calendar dates and configured operators/choice values.
Workspace tests cover unfinished-draft gating, cancel/apply, saved configuration loading,
sorting priority/direction, explicit save failure/retry and external-tree recovery.
Autocomplete tests cover focus, selection and loading/error/retry/empty states.
The taxonomy test permits only Foundations/Components/Patterns/Legacy, not an UX bucket.

`make storybook-e2e` runs the `.maestro/` flows against an isolated Expo Go server on
port 8082. See the README for setup. Simulator E2E covers actual clipboard interaction,
keyboard editing, cancel, retry and long-content/dark mode. Flows also cover mobile
action/cancel/undo, staged filters, actual native sheet presentation and long-press
selection of a text fragment.
The iOS fragment validation additionally checks `xcrun simctl pbpaste` contains only the
selected word, not the full paragraph.
The enlarged-text run must
record the simulator's size category and restore it afterward; it is not a new default.

## Style

- Pure logic: `node:test` + `node:assert/strict`. Native interaction: Jest Expo and
  React Native Testing Library; no DOM runner.
- Pure runtime tests use one file per concept, with `describe()` blocks where useful.
- `beforeEach` to reset mutable singletons (`setActiveTheme({ name: 'reset' })`,
  `__resetBranding()`).
- Imports via `@sincpro/mobile-ui/...` (the alias from `tsconfig.json`), not relative
  paths.

## Excluded from build / typecheck

- `tsconfig.build.json` excludes `**/*.test.*` (so tests don't ship in `dist/`).
- `tsconfig.json` excludes `**/__tests__/**` (legacy, in case anything sneaks into
  source).
- `make typecheck` validates native tests through `tsconfig.tests.json`. Pure-runtime
  tests run via `tsx --test`; they are not included in that TypeScript project.
