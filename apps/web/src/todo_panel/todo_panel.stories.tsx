import type { Meta, StoryObj } from '@storybook/react-vite';
import { fn } from 'storybook/test';
import { LoadStatus } from '../lib/load_status.ts';
import { todoFixture } from '../test/fixtures.ts';
import { AddTodoFormView } from './add_todo_form/add_todo_form.tsx';
import { SubmitStatus } from '../lib/submit_status.ts';
import { TodoBulkActionsView } from './todo_bulk_actions/todo_bulk_actions.tsx';
import { TodoFilter } from './todos_store/todos_store.ts';
import { TodoPanelView } from './todo_panel.tsx';
import { TodoTableView } from './todo_table/todo_table.tsx';
import { TodoToolbarView } from './todo_toolbar/todo_toolbar.tsx';

// Slots are filled with the real views given static props: the whole panel, zero stores.
const meta = {
  component: TodoPanelView,
  args: {
    title: 'Groceries',
    errorMessage: undefined,
    onDismissError: fn(),
    addTodoForm: (
      <AddTodoFormView
        title=""
        status={SubmitStatus.IDLE}
        canSubmit={false}
        onTitleChange={fn()}
        onSubmit={fn()}
      />
    ),
    toolbar: (
      <TodoToolbarView
        filter={TodoFilter.ALL}
        search=""
        activeCount={2}
        completedCount={1}
        onFilterChange={fn()}
        onSearchChange={fn()}
      />
    ),
    bulkActions: (
      <TodoBulkActionsView
        selectedCount={1}
        onCompleteSelected={fn()}
        onDeleteSelected={fn()}
        onClearSelection={fn()}
      />
    ),
    table: (
      <TodoTableView
        todos={[
          todoFixture({ id: 1, title: 'Oat milk' }),
          todoFixture({ id: 2, title: 'Sourdough', completed: true }),
          todoFixture({ id: 3, title: 'Lemons' }),
        ]}
        status={LoadStatus.LOADED}
        selectedIds={new Set([3])}
        isAllSelected={false}
        onToggleSelected={fn()}
        onToggleSelectAll={fn()}
        onToggleCompleted={fn()}
      />
    ),
  },
} satisfies Meta<typeof TodoPanelView>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
export const WithError: Story = { args: { errorMessage: 'Could not update "Lemons"' } };
