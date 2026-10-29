import type { Todo } from '@spc/api-client';
import { makeAutoObservable, runInAction } from 'mobx';
import { LoadStatus } from '../../lib/load_status.ts';
import type { ListsPresenter } from '../../list_sidebar/lists_presenter/lists_presenter.ts';
import type { TodosService } from '../../services/todos_service.ts';
import type { TodoFilter, TodosStore } from '../todos_store/todos_store.ts';

export class TodosPresenter {
  constructor(
    private readonly todosStore: TodosStore,
    private readonly todosService: TodosService,
    private readonly listsPresenter: ListsPresenter,
  ) {
    makeAutoObservable(this, {}, { autoBind: true });
  }

  async loadForList(listId: number | undefined) {
    this.todosStore.reset();
    if (listId === undefined) return;

    this.todosStore.listId = listId;
    this.todosStore.status = LoadStatus.LOADING;
    let todos: Todo[];
    try {
      todos = await this.todosService.getByList(listId);
    } catch {
      if (this.todosStore.listId !== listId) return;
      runInAction(() => {
        this.todosStore.status = LoadStatus.ERROR;
      });
      return;
    }

    // The user may have switched lists while this request was in flight.
    if (this.todosStore.listId !== listId) return;
    runInAction(() => {
      this.todosStore.todos = todos;
      this.todosStore.status = LoadStatus.LOADED;
    });
  }

  setFilter(filter: TodoFilter) {
    this.todosStore.filter = filter;
  }

  setSearch(search: string) {
    this.todosStore.search = search;
  }

  toggleSelected(id: number) {
    const { selectedIds } = this.todosStore;
    this.todosStore.selectedIds = selectedIds.includes(id)
      ? selectedIds.filter((selectedId) => selectedId !== id)
      : [...selectedIds, id];
  }

  toggleSelectAllVisible() {
    const visibleIds = this.todosStore.visibleTodos.map(({ id }) => id);
    this.todosStore.selectedIds = this.todosStore.isAllVisibleSelected
      ? this.todosStore.selectedIds.filter((id) => !visibleIds.includes(id))
      : [...new Set([...this.todosStore.selectedIds, ...visibleIds])];
  }

  clearSelection() {
    this.todosStore.selectedIds = [];
  }

  dismissError() {
    this.todosStore.errorMessage = undefined;
  }

  // Optimistic: flip immediately, roll back if the API call fails.
  async toggleCompleted(id: number) {
    const todo = this.todosStore.todos.find((candidate) => candidate.id === id);
    if (!todo) return;

    const completed = !todo.completed;
    this.setCompleted(todo, completed);
    try {
      await this.todosService.setCompleted([id], completed);
    } catch {
      runInAction(() => {
        this.setCompleted(todo, !completed);
        this.todosStore.errorMessage = `Could not update "${todo.title}"`;
      });
    }
  }

  async completeSelected() {
    const todos = this.todosStore.selectedTodos.filter((todo) => !todo.completed);
    if (todos.length === 0) return this.clearSelection();

    try {
      await this.todosService.setCompleted(
        todos.map(({ id }) => id),
        true,
      );
    } catch {
      runInAction(() => {
        this.todosStore.errorMessage = 'Could not complete the selected todos';
      });
      return;
    }

    runInAction(() => {
      for (const todo of todos) this.setCompleted(todo, true);
      this.clearSelection();
    });
  }

  async deleteSelected() {
    const todos = this.todosStore.selectedTodos;
    if (todos.length === 0) return;

    const deletedIds = new Set(todos.map(({ id }) => id));
    try {
      await this.todosService.delete([...deletedIds]);
    } catch {
      runInAction(() => {
        this.todosStore.errorMessage = 'Could not delete the selected todos';
      });
      return;
    }

    runInAction(() => {
      this.todosStore.todos = this.todosStore.todos.filter(({ id }) => !deletedIds.has(id));
      this.adjustOpenCount(-todos.filter((todo) => !todo.completed).length);
      this.clearSelection();
    });
  }

  addTodo(todo: Todo) {
    this.listsPresenter.adjustOpenCount(todo.listId, todo.completed ? 0 : 1);
    if (todo.listId !== this.todosStore.listId) return;
    this.todosStore.todos.push(todo);
  }

  private setCompleted(todo: Todo, completed: boolean) {
    if (todo.completed === completed) return;
    todo.completed = completed;
    this.adjustOpenCount(completed ? -1 : 1);
  }

  private adjustOpenCount(delta: number) {
    const { listId } = this.todosStore;
    if (listId === undefined || delta === 0) return;
    this.listsPresenter.adjustOpenCount(listId, delta);
  }
}
