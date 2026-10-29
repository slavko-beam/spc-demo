import { reaction } from 'mobx';
import { observer } from 'mobx-react-lite';
import type { ListsPresenter } from '../list_sidebar/lists_presenter/lists_presenter.ts';
import type { ListsStore } from '../list_sidebar/lists_store/lists_store.ts';
import type { TodosService } from '../services/todos_service.ts';
import { createAddTodoForm } from './add_todo_form/create.tsx';
import { TodoBulkActionsView } from './todo_bulk_actions/todo_bulk_actions.tsx';
import { TodoPanelView } from './todo_panel.tsx';
import { TodoTableView } from './todo_table/todo_table.tsx';
import { TodosPresenter } from './todos_presenter/todos_presenter.ts';
import { TodosStore } from './todos_store/todos_store.ts';
import { TodoToolbarView } from './todo_toolbar/todo_toolbar.tsx';

type Deps = {
  listsStore: ListsStore;
  listsPresenter: ListsPresenter;
  todosService: TodosService;
};

export const createTodoPanel = ({ listsStore, listsPresenter, todosService }: Deps) => {
  const todosStore = new TodosStore();
  const todosPresenter = new TodosPresenter(todosStore, todosService, listsPresenter);

  // The URL is the source of truth for which list is shown, including back/forward navigation.
  reaction(() => listsStore.selectedListId, todosPresenter.loadForList, { fireImmediately: true });

  const AddTodoForm = createAddTodoForm({ todosStore, todosService, todosPresenter });

  // Each section observes only what it renders: typing in search never re-renders the bulk bar.
  const TodoToolbar = observer(() => (
    <TodoToolbarView
      filter={todosStore.filter}
      search={todosStore.search}
      activeCount={todosStore.activeCount}
      completedCount={todosStore.completedCount}
      onFilterChange={todosPresenter.setFilter}
      onSearchChange={todosPresenter.setSearch}
    />
  ));

  const TodoBulkActions = observer(() => (
    <TodoBulkActionsView
      selectedCount={todosStore.selectedCount}
      onCompleteSelected={todosPresenter.completeSelected}
      onDeleteSelected={todosPresenter.deleteSelected}
      onClearSelection={todosPresenter.clearSelection}
    />
  ));

  const TodoTable = observer(() => (
    <TodoTableView
      todos={todosStore.visibleTodos}
      status={todosStore.status}
      selectedIds={todosStore.selectedIdSet}
      isAllSelected={todosStore.isAllVisibleSelected}
      onToggleSelected={todosPresenter.toggleSelected}
      onToggleSelectAll={todosPresenter.toggleSelectAllVisible}
      onToggleCompleted={todosPresenter.toggleCompleted}
    />
  ));

  const addTodoForm = <AddTodoForm />;
  const toolbar = <TodoToolbar />;
  const bulkActions = <TodoBulkActions />;
  const table = <TodoTable />;

  return observer(() => (
    <TodoPanelView
      title={listsStore.selectedList?.name}
      errorMessage={todosStore.errorMessage}
      onDismissError={todosPresenter.dismissError}
      addTodoForm={addTodoForm}
      toolbar={toolbar}
      bulkActions={bulkActions}
      table={table}
    />
  ));
};
