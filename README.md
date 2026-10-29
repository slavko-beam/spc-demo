# SPC demo: store · presenter · component

A small todo app (lists, todos, a responsive navbar) built to show the SPC pattern for React + MobX. The back-end and front-end are separate services joined by a generated OpenAPI client.

```sh
pnpm install
pnpm dev          # API on :3001 (SQLite, 300ms fake latency), web on :5173
pnpm test         # API route tests + store/presenter/view tests
pnpm storybook    # every view variation
pnpm generate     # regenerate openapi.json and the typed client after API changes
```

## File structure

Every file and folder is snake_case. A flow folder holds its `create.tsx`, its view (named after the folder), the view's CSS module, and its tests and stories right beside it. Stores, presenters and sub-views each get their own subfolder with the same layout:

```
todo_panel/
├─ create.tsx                  createTodoPanel
├─ todo_panel.tsx              TodoPanelView
├─ todo_panel.module.css
├─ todo_panel.tests.tsx
├─ todo_panel.stories.tsx
├─ todos_store/
│  ├─ todos_store.ts
│  └─ todos_store.tests.ts
├─ todos_presenter/
│  ├─ todos_presenter.ts
│  └─ todos_presenter.tests.ts
├─ todo_table/                 sub-view, connected inside createTodoPanel
│  ├─ todo_table.tsx
│  ├─ todo_table.module.css
│  ├─ todo_table.tests.tsx
│  ├─ todo_table.stories.tsx
│  └─ todo_table_row/          item view: the table's map renders only <TodoTableRowView />
└─ add_todo_form/              nested flow with its own create.tsx, store and presenter
```

## The three layers

| Layer         | Holds                                                            | Never                                                        |
| ------------- | ---------------------------------------------------------------- | ------------------------------------------------------------ |
| **Store**     | Observable state, computeds, `reset()`                           | Writes to itself, calls services, contains logic             |
| **Presenter** | Injected stores, services, presenters                            | Holds state                                                  |
| **Component** | Pure `observer` views taking values, callbacks and element slots | Creates stores or presenters, imports singletons, uses hooks |

That split makes testing straightforward:

- **Stores**: set some fields, assert the computeds ([`todos_store.tests.ts`](apps/web/src/todo_panel/todos_store/todos_store.tests.ts)).
- **Presenters**: real stores, `mock<Service>()` for the generated-client wrappers. Call a method, assert the store ([`todos_presenter.tests.ts`](apps/web/src/todo_panel/todos_presenter/todos_presenter.tests.ts) covers optimistic toggles, rollback and stale responses).
- **Views**: everything is a prop, so every variation is one `render` call or one story ([`todo_table.stories.tsx`](apps/web/src/todo_panel/todo_table/todo_table.stories.tsx)).

## `create*` factories

A `create*` function is the wiring for one flow. It receives every dependency, creates whatever only its own subtree needs, and returns an `observer` that passes plain values to a pure view:

```tsx
export const createSettingsPopover = ({ uiStore, uiPresenter }: Deps) => {
  const settingsStore = new SettingsStore(); // only this subtree needs it
  const settingsPresenter = new SettingsPresenter(settingsStore, uiPresenter);

  return observer(() => (
    <SettingsPopoverView
      isOpen={settingsStore.isOpen}
      theme={uiStore.theme}
      onToggleOpen={settingsPresenter.toggleOpen}
      // …
    />
  ));
};
```

The whole app is a tree of these, rooted in [`app/create.tsx`](apps/web/src/app/create.tsx):

```
main.tsx
└─ createApp ── services, RouterStore, UiStore, ListsStore, their presenters
   ├─ createNavbar
   │  ├─ createSettingsPopover ── SettingsStore, SettingsPresenter
   │  ├─ createDesktopNavbar(settingsPopover)  ┐ same element
   │  └─ createMobileNavbar(settingsPopover)   ┘
   ├─ createListSidebar ── starts listsPresenter.load()
   └─ createTodoPanel ── TodosStore, TodosPresenter, reaction(listsStore.selectedListId)
      └─ createAddTodoForm ── AddTodoStore, AddTodoPresenter
```

The body of each `create*` runs once, so it can start loading data immediately (`listsPresenter.load()`, a `reaction` on the URL) without `useEffect`. There's nothing to dispose: a flow only re-initialises when its `create*` runs again.

## Slots are elements, not components

[`createNavbar`](apps/web/src/navbar/create.tsx) builds the popover element **once** and gives that same element to both variants:

```tsx
const settingsPopover = <SettingsPopover />;
const DesktopNavbar = createDesktopNavbar({ listsStore, settingsPopover });
const MobileNavbar = createMobileNavbar({ listsStore, settingsPopover });
```

When a navbar re-renders, React sees the identical `settingsPopover` element and skips it. The popover only re-renders for its own observables. The same applies to the layout: changing the theme re-renders `AppLayoutView`, but not the navbar, sidebar or panel slots. The popover's open state also survives a desktop → mobile switch, because it lives in a store, not in the component ([`navbar.tests.tsx`](apps/web/src/navbar/navbar.tests.tsx)).

## Keeping views small

Aim for 5–10 props per view. The todo panel would need about 15, so it is split into four views (`todo_toolbar`, `todo_bulk_actions`, `todo_table`, `add_todo_form`), each with its own connected `observer` inside `createTodoPanel`. As a bonus, typing in the search box doesn't re-render the bulk action bar.

## Routing without hooks

[`router/create.ts`](apps/web/src/router/create.ts) owns a React Router data router (route patterns only) and returns `{ routerStore, navigate }`. The router's `subscribe` callback mirrors the location into `RouterStore` as raw `pathname` and `params`, nothing more. Each feature derives what a param means for itself: `ListsStore.selectedListId` parses `params.listId`. Presenters call `navigate(listRoute(id))`, and the todo panel reacts to `listsStore.selectedListId`, so back and forward work for free. No `useParams`, `useNavigate` or `<RouterProvider>`.

## Back-end

[`apps/api`](apps/api/src) follows the same idea: `createApp({ listsRepository, todosRepository })` takes its dependencies, and tests run it against an in-memory SQLite database. Routes are declared with `@hono/zod-openapi`. `pnpm generate` writes `openapi.json`, and `openapi-typescript` turns it into the typed client in `packages/api-client`.
