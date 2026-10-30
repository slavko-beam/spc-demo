# AGENTS.md

This repo demonstrates **SPC (store · presenter · component)**. Follow these rules for all front-end code in `apps/web`. `README.md` explains the reasoning behind them.

## Layout

- `apps/api`: Hono + `@hono/zod-openapi` + better-sqlite3 with raw SQL. Repositories are classes injected into `createApp`.
- `apps/web`: React 19 + MobX + React Router (programmatic, no file routing).
- `packages/api-client`: generated from `apps/api/openapi.json`. Run `pnpm generate` after changing an API route or schema. Never hand-edit `schema.gen.ts`.

## File structure

- Every file and folder name is snake_case. Exported identifiers keep their normal casing (`TodosStore`, `TodoTableView`, `createTodoPanel`).
- A flow folder `foo/` contains `create.tsx`, `foo.tsx` (the view), `foo.module.css`, `foo.tests.tsx` and `foo.stories.tsx`, all side by side.
- Stores, presenters and sub-views each get their own subfolder: `foo_store/foo_store.ts` + `foo_store/foo_store.tests.ts`, `foo_presenter/...`, `bar/bar.tsx` + `bar/bar.tests.tsx` + `bar/bar.stories.tsx`.
- Test files end in `.tests.ts(x)` and sit beside the file they test. No `tests/` or `stories/` subfolders.

## Stores

- A store holds observable fields, computed getters and a `reset()` method. It has no other methods.
- A store never writes to itself, except in `reset()`. Only presenters assign to store fields.
- A store may take other stores in its constructor so it can derive computeds from them (see `ListsStore`). Mark those fields `false` in `makeAutoObservable`.
- Status-like state is always a numeric TS `enum` with `SCREAMING_SNAKE` members, e.g. `LoadStatus.LOADING`. Never use string unions or booleans like `isLoading` for status.
- Define an enum in the store file that owns the state (`Theme` lives in `ui_store.ts`, `TodoFilter` in `todos_store.ts`). Only enums shared across features go in `lib/` (`LoadStatus`, `SubmitStatus`). Never create a separate `*_enums.ts` file.

## Presenters

- A presenter takes stores, services and other presenters in its constructor and holds no state of its own.
- Call `makeAutoObservable(this, {}, { autoBind: true })` in the constructor. `autoBind` lets `presenter.method` be passed directly as a callback prop.
- After an `await`, wrap store writes in `runInAction`.
- Business logic lives only here: API calls, optimistic updates, rollbacks and stale-response guards.

## Early returns

Applies to presenters, services, repositories and helpers. Keep indentation flat:

- Check guard conditions first and return early. Prefer `if (!list) return;` over `if (list) { ... }`.
- `try` wraps only the `await`. The `catch` records the failure and returns, and the success path continues at the top level:

  ```ts
  let todos: Todo[];
  try {
    todos = await this.todosService.getByList(listId);
  } catch {
    runInAction(() => {
      this.todosStore.status = LoadStatus.ERROR;
    });
    return;
  }

  if (this.todosStore.listId !== listId) return; // stale response
  runInAction(() => {
    this.todosStore.todos = todos;
    this.todosStore.status = LoadStatus.LOADED;
  });
  ```

- Don't put conditionals inside `runInAction` callbacks. Check before entering them.

## Components

- Every component is wrapped in `observer`.
- **Views** (`<folder>.tsx`, exported as `XView`) are pure: they take individual values, callbacks and `React.JSX.Element` slots as props. Never pass a store, presenter or service to a view.
- Aim for 5–10 props per view. Beyond that, split it into smaller views passed in as slots.
- When a view maps over a collection, each item renders through its own item view in a subfolder, e.g. `list_sidebar/list_sidebar_item/`, `todo_table/todo_table_row/`, `todo_toolbar/todo_filter_button/`. The map body is just `<ItemView key={...} ... />`, with no inline markup.
- Pass item views individual fields (`id`, `name`, `isSelected`), never the whole record. Pass the parent's id-taking callback as-is (`onSelect={onSelect}`), and let the item call it with its own id (`onClick={() => onSelect(id)}`). This keeps props referentially stable, so `observer`'s memo skips items that haven't changed.
- No ternaries in render code, in JSX children or in attribute values. Instead:
  - When a branch picks between pieces of markup, move it into a local `observer` component in the same file (not exported) that returns early, e.g. `TodoTableBody` in `todo_table.tsx`, or `if (uiStore.isMobile) return mobileNavbar;`.
  - When an enum picks a value, use a typed lookup table (`const SUBMIT_LABELS: Record<SubmitStatus, string>`).
  - For boolean styling, set a `data-*` or `aria-*` attribute and style it in CSS (`data-completed={completed}`), not conditional class names.
  - `&&` for show/hide is fine: `{isOpen && <div … />}`.
- No React hooks in app code. Use a hook only when a third-party library offers no other way.
- No exported singletons (`export const store = new Store()`). Every instance is created in a `create*` body or in `main.tsx`.
- Pass string props without braces: `label="Add"`, not `label={'Add'}`.

## `create*` factories

- Each folder that owns a flow has a `create.tsx` that exports `createX(deps)`. Use them for flows like `createTodoPanel` or `createNavbar`, not for generic UI like buttons.
- Every dependency comes in through `deps`. The body creates whatever only its own subtree needs: stores, presenters and child `create*` calls.
- The body starts loading data immediately (e.g. `listsPresenter.load()`, `reaction(...)`) and is never disposed. A flow only re-initialises when its `create*` runs again.
- Build each slot element once in the body (`const settingsPopover = <SettingsPopover />`) and pass that same element to every consumer.
- Call `create*` only from `main.tsx` or another `create*` body, never during render.
- `create*` factories never get tests. They are wiring; the stores, presenters and views they wire up are tested on their own.

## Routing

- `router/create.ts` owns the React Router instance and returns `{ routerStore, navigate }`. Nothing else imports the router.
- The URL is the source of truth for navigation state. `RouterStore` only mirrors it (`pathname`, `params`) and has no feature computeds.
- A feature store that cares about a param takes `RouterStore` in its constructor and owns the computed that parses it (e.g. `ListsStore.selectedListId`). React to those computeds with `reaction`.

## Tests

- Store tests cover computeds. Presenter tests use real stores with mocked services and presenters. View tests render the view with plain props. `create*` factories have no tests.
- Use `it`, never `test`. Store and presenter tests nest one `describe` per method or computed inside the class's `describe`, and each case reads as `should … when …`:

  ```ts
  describe('TodosPresenter', () => {
    describe('loadForList', () => {
      it('should set the error status when the request fails', async () => { … });
    });
  });
  ```

- Every public presenter method and every store computed gets its own `describe`, including the trivial ones.
- Mock with `mock<T>()` from `vitest-mock-extended`, typed as `MockProxy<T>`. Use `.calledWith(...)` for stubs that depend on arguments.
- Declare test values with `let` at `describe` scope and assign them in `beforeEach`. Never assign at declaration.
- Every new view gets a `<name>.stories.tsx` beside it, covering its variations.
- Test our behaviour, not React's or MobX's: assert what renders and which callbacks fire. No render counting or spy components to check rerender behaviour.

## Formatting

- Format with `pnpm format` (oxfmt): semicolons, single quotes in TS, double quotes in JSX, 2 spaces, 100 columns.

## Commands

- `pnpm dev` runs the API (:3001) and the web app (:5173).
- `pnpm test` / `pnpm check` / `pnpm storybook` / `pnpm generate` / `pnpm format`.
