import type { Todo } from '@spc/api-client';
import { makeAutoObservable } from 'mobx';
import { LoadStatus } from '../../lib/load_status.ts';

export enum TodoFilter {
  ALL,
  ACTIVE,
  COMPLETED,
}

export class TodosStore {
  listId: number | undefined = undefined;
  todos: Todo[] = [];
  status = LoadStatus.IDLE;
  errorMessage: string | undefined = undefined;
  filter = TodoFilter.ALL;
  search = '';
  selectedIds: number[] = [];

  constructor() {
    makeAutoObservable(this);
  }

  get visibleTodos(): Todo[] {
    const query = this.search.trim().toLowerCase();
    return this.todos.filter(
      (todo) =>
        (this.filter === TodoFilter.ALL ||
          (this.filter === TodoFilter.ACTIVE ? !todo.completed : todo.completed)) &&
        todo.title.toLowerCase().includes(query),
    );
  }

  get activeCount(): number {
    return this.todos.filter((todo) => !todo.completed).length;
  }

  get completedCount(): number {
    return this.todos.length - this.activeCount;
  }

  get selectedIdSet(): ReadonlySet<number> {
    return new Set(this.selectedIds);
  }

  get selectedTodos(): Todo[] {
    return this.todos.filter((todo) => this.selectedIdSet.has(todo.id));
  }

  get selectedCount(): number {
    return this.selectedTodos.length;
  }

  get isAllVisibleSelected(): boolean {
    return (
      this.visibleTodos.length > 0 &&
      this.visibleTodos.every((todo) => this.selectedIdSet.has(todo.id))
    );
  }

  reset() {
    this.listId = undefined;
    this.todos = [];
    this.status = LoadStatus.IDLE;
    this.errorMessage = undefined;
    this.filter = TodoFilter.ALL;
    this.search = '';
    this.selectedIds = [];
  }
}
