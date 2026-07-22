# Contributing — `@sincpro/mobile-ui`

> Checklist for adding a component, theme, story, or asset. Run `make verify-format`
> before pushing.

---

## Adding a component

### 1. Decide the tier

| If your component… | Goes in |
|---|---|
| Holds state, knows about business | ❌ Not in the DS |
| Renders data (badge, card, chip) | `Display/` |
| Captures user input (input, switch) | `Form/` |
| Communicates app state (loading, error, toast) | `Feedback/` |
| Is a layout primitive (box, row, stack) | `primitives/` |
| Is a modal overlay | `Dialog/` |
| Navigates intra-screen (appbar, tabs) | `Navigation/` |
| Combines other components into a screen template | `views/` |
| Is a ready-to-use composition | `widgets/` |

When in doubt, see `docs/STRUCTURE.md`.

### 2. File + naming

- Folder: `PascalCase/` (e.g. `Display/`)
- File: `PascalCase.Componente.tsx` (e.g. `Display.Card.tsx`)
- Compound export pattern: `index.ts` of the namespace re-exports it

```ts
// Display/index.ts
import Card from "@sincpro/mobile-ui/Display/Display.Card";
export const Display = { Card, ... };
```

### 3. Component skeleton

```tsx
import { cn, tv, type VariantProps } from "@sincpro/mobile-ui/theme/tw";
import type { ReactNode } from "react";

const myThing = tv({
  base: "rounded-md bg-bg-card border border-border-light", // NativeWind classes
  variants: {
    size: { small: "p-2", medium: "p-4" },
    tone: { neutral: "", primary: "border-border-focus" },
  },
  defaultVariants: { size: "medium", tone: "neutral" },
});

export interface MyThingProps extends VariantProps<typeof myThing> {
  /** What this thing displays. */
  children: ReactNode;
  /** ClassName passthrough for the consumer. */
  className?: string;
  testID?: string;
}

function MyThing({ children, className, size, tone, testID }: MyThingProps) {
  return (
    <View className={cn(myThing({ size, tone }), className)} testID={testID}>
      {children}
    </View>
  );
}

export default MyThing;
```

### 4. Rules (framework principles)

- **NativeWind-first.** Style with `className` (Tailwind). Use `theme.x` (JS) only for
  what className can't express: native props (`placeholderColor`), `LinearGradient`,
  shadows, anything inside `<Modal>` (CSS-vars don't cross the portal).
- **Accept `className` passthrough + merge.** Don't drop consumer overrides.
- **No `@className` toggling in touchables.** NativeWind loops on re-render. Static
  classes + state via `style` inline (tokens).
- **Use `primitives/Pressable`** instead of RN `Pressable` for touchables.
- **a11y non-negotiable**: `accessibilityRole`, `accessibilityLabel`,
  `accessibilityState`, `hitSlop` ≥ 8 on touchables, `testID` everywhere.
- **`tv()`** for static variants. Avoid `className={cond ? "a" : "b"}`.
- **No hex hardcoded outside `theme/`**. All colors via tokens.
- **No comments / docstrings** unless the file already has that style.
- **Functional component**, named export + default export.

### 5. Story

Every component gets a story in `.rnstorybook/stories/`. Group by namespace folder:

```
Display.stories.tsx     // Display namespace
DataDisplay.stories.tsx // data-display subgroup
```

- Title pattern: `"Components/Data Display"`, `"Foundations/Theme"`, etc.
- Light + dark variant via `setActiveTheme(DEFAULT_THEME)` / `(DEFAULT_DARK_THEME)` in
  the story.

### 6. Export it

`namespace/index.ts` adds it to the compound export. Update `docs/CATALOG.md` if it
adds a new component category.

### 7. Verify

```bash
make verify-format
```

That's `eslint --fix` + `prettier --write` + `tsc --noEmit` + `tsc -p tsconfig.stories.json --noEmit`
+ `doctor.sh` + diff check. If your changes pass these, push.

---

## Adding a theme

For a new default theme (e.g. `BRAND_DARK_THEME`):

1. Add to `theme/yourTheme.ts` next to `theme/default.ts` and `theme/dark.ts`:

   ```ts
   import type { ThemeTokens } from "@sincpro/mobile-ui/theme/types";
   export const BRAND_DARK_THEME: ThemeTokens = { ... };
   ```

2. Re-export from `theme/index.ts`.

3. Add a story in `Theme.stories.tsx` showing its palette.

For a consumer-defined theme at app boot, see `docs/REBRAND.md`.

---

## Adding a brand asset

- **Logo**: add to `app/assets/` (your app, not the DS). Pass to `setBranding({ logo })`
  at boot. The DS ships zero logos.
- **Brand mesh symbol**: same — drop the PNG in your app's `assets/`. Pass via
  `setBranding({ mesh })`. The DS ships one bundled fallback (`brand-mesh.png`).
- If you think the DS should ship a new asset by default: open a discussion first; the
  default fallback should remain generic.

---

## Adding a story

Files live in `.rnstorybook/stories/`. Pick the file matching your component's namespace,
or create a new grouped story file if the namespace doesn't have one yet.

Skeleton:

```tsx
import { Display } from "@sincpro/mobile-ui/Display";
import type { Meta, StoryObj } from "@storybook/react-native";
import { View } from "react-native";

const meta: Meta = { title: "Components/My Group" };
export default meta;

type Story = StoryObj;

export const MyThing: Story = {
  render: () => (
    <View className="gap-2">
      <Display.Card>Default</Display.Card>
      <Display.Card elevation="md">Elevated</Display.Card>
    </View>
  ),
};
```

Verify with `make storybook-check` (it compiles via `tsconfig.stories.json`).

---

## Adding a doc

- Add to `docs/` with a clear name + purpose line at the top.
- Update the top of `README.md` (or `AGENTS.md`) with a link if it's an entry point doc.
- Cross-reference from `STRUCTURE.md` / `PHILOSOPHY.md` when relevant.

---

## Verifying before pushing

```bash
make verify-format   # lint + format + types + doctor
make storybook       # run the on-device Storybook
make test            # run theme runtime tests (18 tests)
```

All green → push. CI/CD runs the same `make verify-format` plus `make publish`.
