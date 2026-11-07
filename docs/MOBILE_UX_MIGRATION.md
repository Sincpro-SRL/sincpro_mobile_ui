# Mobile UX adoption and migration

This guide records the earlier v1 adoption. For the required image renderer and
accessible-target migration, follow [v2 migration](./MIGRATION-V2.md).

## Scope

This PR implements design-system foundations. It does not update `@sincpro/mobile`,
Odoo or host applications, nor does it publish a package version. Hosts must adopt the
published registry release, not local `file:` dependencies.

Most additions are opt-in: composable Toast content, AmountSummary, Navigation.Search and
the optional Sheet footer. Do not treat every existing component as a breaking change.
Dock's transition from inline expansion to a native modal is a behavioral breaking change
for consumers of the earlier Dock implementation in this PR. If that behavior has been
published and is depended on, release it according to the repository's major-version policy.

## Dock changes

- Expansion blocks the underlying screen, including scroll and row actions.
- The primary action is rendered once, within the modal while expanded.
- The expanded panel receives touches in native modal bounds, not outside a tiny footer.
- Closing restores the collapsed bar. Native Back, accessible escape, the collapse action,
  swipe down on the handle and backdrop dismissal request the same state transition.
- `dismissOnBackdrop={false}` disables backdrop dismissal, not Back or the visible close.
- The 48-point drag handle owns touches immediately. It is not an interactive-content slot;
  diagonal gestures do not toggle expansion. Panel scroll gestures do not drag the handle.
- `SafeAreaProvider` is required. The expanded modal applies bottom insets and avoids the
  keyboard; the collapsed bar inherits its host screen/footer's safe-area layout.
- Slots remount when switching between screen and modal. Keep form values, validation,
  pending submission and selection outside Dock. Do not put the only copy of draft state
  in a stateful primary-action component.
- Fixed placement belongs outside the list scroll view. Reserve bottom padding for the
  collapsed bar. Footer placement inherits the existing form footer, not another fixed bar.
- Do not nest another modal/sheet inside the expanded Dock. Close it before opening the
  next overlay.

```tsx
const [expanded, setExpanded] = useState(false);
const [note, setNote] = useState("");

<Actions.Dock
  expanded={expanded}
  onExpandedChange={setExpanded}
  primaryAction={<Actions.Button title="Guardar" onPress={submit} />}
  summary={<Display.Monetary amount={total} />}
>
  <Form.TextInput value={note} onChangeText={setNote} />
</Actions.Dock>;
```

Without `expanded`, Dock owns visibility; `defaultExpanded` selects its initial state.
With `expanded`, the host must commit requests from `onExpandedChange`.
Do not dismiss on submission failure: show the error and retain the draft.
Localize `title`, `moreLabel`, `collapseLabel` and `backdropLabel` in the host.

## Adoption order

1. Publish and validate the design-system release.
2. Update core's peer/dev dependencies and adapt its shared UI wrappers:
   keep queue/cron/domain state in core; use Toast slots for presentation only.
3. Update the optional Odoo integration against that release.
4. Update Distribution and Tickets dependencies/resolutions from the registry.
   Replace duplicated bottom actions, monetary summaries and filter surfaces selectively.
5. Exercise each migrated screen before removing its old implementation.

## Acceptance checks

- Dock: swipe/tap opening, panel action taps, fixed submission, backdrop/Back/escape,
  interrupted and diagonal gestures, long scrolling content, safe area and keyboard.
- Drafts: reopening retains host state; failed submissions do not lose values.
- Toast: traditional notices and queue/cron progress, update/dismiss, swipe in both directions.
- Search: one debounced request per query, stale-request handling owned by the host,
  filter Apply/Cancel and recent-search persistence.
- Lists: stable IDs during insert/reorder and no selection loss on refresh.
- Run `make verify-format`; native Dock flow is `.maestro/action-dock.yaml`.
- Profile release builds on representative iOS/Android devices before claiming performance
  improvements. Automated unit tests and successful typechecks do not establish frame time,
  scroll smoothness or real gesture arbitration.
