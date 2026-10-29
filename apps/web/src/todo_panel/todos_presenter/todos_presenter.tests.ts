import type { Todo } from '@spc/api-client';
import { runInAction } from 'mobx';
import { beforeEach, describe, expect, it } from 'vitest';
import { mock, type MockProxy } from 'vitest-mock-extended';
import { LoadStatus } from '../../lib/load_status.ts';
import type { ListsPresenter } from '../../list_sidebar/lists_presenter/lists_presenter.ts';
import type { TodosService } from '../../services/todos_service.ts';
import { todoFixture } from '../../test/fixtures.ts';
import { TodoFilter, TodosStore } from '../todos_store/todos_store.ts';
import { TodosPresenter } from './todos_presenter.ts';

describe('TodosPresenter', () => {
  let todosStore: TodosStore;
  let todosService: MockProxy<TodosService>;
  let listsPresenter: MockProxy<ListsPresenter>;
  let presenter: TodosPresenter;
  let todos: Todo[];

  beforeEach(() => {
    todosStore = new TodosStore();
    todosService = mock<TodosService>();
    listsPresenter = mock<ListsPresenter>();
    presenter = new TodosPresenter(todosStore, todosService, listsPresenter);
    todos = [
      todoFixture({ id: 1, listId: 7, title: 'Oat milk' }),
      todoFixture({ id: 2, listId: 7, title: 'Sourdough', completed: true }),
      todoFixture({ id: 3, listId: 7, title: 'Lemons' }),
    ];
  });

  const loadTodos = async () => {
    todosService.getByList.calledWith(7).mockResolvedValue(todos);
    await presenter.loadForList(7);
  };

  describe('loadForList', () => {
    it('should store the todos of the list when the request succeeds', async () => {
      await loadTodos();

      expect(todosStore.listId).toBe(7);
      expect(todosStore.todos).toEqual(todos);
      expect(todosStore.status).toBe(LoadStatus.LOADED);
    });

    it('should be loading while the request is in flight', () => {
      todosService.getByList.mockReturnValue(new Promise(() => {}));

      void presenter.loadForList(7);

      expect(todosStore.status).toBe(LoadStatus.LOADING);
    });

    it('should set the error status when the request fails', async () => {
      todosService.getByList.mockRejectedValue(new Error('boom'));

      await presenter.loadForList(7);

      expect(todosStore.status).toBe(LoadStatus.ERROR);
    });

    it('should ignore the response when the list changed while it was in flight', async () => {
      let resolveFirst: (todos: Todo[]) => void = () => {};
      todosService.getByList
        .calledWith(7)
        .mockReturnValue(new Promise((resolve) => (resolveFirst = resolve)));
      todosService.getByList.calledWith(8).mockResolvedValue([]);

      const first = presenter.loadForList(7);
      await presenter.loadForList(8);
      resolveFirst(todos);
      await first;

      expect(todosStore.listId).toBe(8);
      expect(todosStore.todos).toEqual([]);
    });

    it('should reset the store without loading when there is no list', async () => {
      runInAction(() => {
        todosStore.search = 'milk';
      });

      await presenter.loadForList(undefined);

      expect(todosStore.search).toBe('');
      expect(todosService.getByList).not.toHaveBeenCalled();
    });
  });

  describe('setFilter', () => {
    it('should set the filter', () => {
      presenter.setFilter(TodoFilter.COMPLETED);

      expect(todosStore.filter).toBe(TodoFilter.COMPLETED);
    });
  });

  describe('setSearch', () => {
    it('should set the search', () => {
      presenter.setSearch('milk');

      expect(todosStore.search).toBe('milk');
    });
  });

  describe('toggleSelected', () => {
    it('should select a todo when it is not selected', () => {
      presenter.toggleSelected(1);

      expect(todosStore.selectedIds).toEqual([1]);
    });

    it('should deselect a todo when it is selected', () => {
      presenter.toggleSelected(1);
      presenter.toggleSelected(3);
      presenter.toggleSelected(1);

      expect(todosStore.selectedIds).toEqual([3]);
    });
  });

  describe('toggleSelectAllVisible', () => {
    beforeEach(loadTodos);

    it('should select every visible todo when not all are selected', () => {
      presenter.setFilter(TodoFilter.ACTIVE);

      presenter.toggleSelectAllVisible();

      expect(todosStore.selectedIds).toEqual([1, 3]);
    });

    it('should deselect only the visible todos when all are selected', () => {
      presenter.toggleSelected(2);
      presenter.setSearch('lemon');
      presenter.toggleSelected(3);

      presenter.toggleSelectAllVisible();

      expect(todosStore.selectedIds).toEqual([2]);
    });
  });

  describe('clearSelection', () => {
    it('should deselect everything', () => {
      presenter.toggleSelected(1);

      presenter.clearSelection();

      expect(todosStore.selectedIds).toEqual([]);
    });
  });

  describe('dismissError', () => {
    it('should clear the error message', () => {
      runInAction(() => {
        todosStore.errorMessage = 'Could not update "Oat milk"';
      });

      presenter.dismissError();

      expect(todosStore.errorMessage).toBeUndefined();
    });
  });

  describe('toggleCompleted', () => {
    beforeEach(loadTodos);

    it('should complete the todo before the request finishes', () => {
      todosService.setCompleted.mockReturnValue(new Promise(() => {}));

      void presenter.toggleCompleted(1);

      expect(todosStore.todos[0]?.completed).toBe(true);
      expect(todosService.setCompleted).toHaveBeenCalledWith([1], true);
      expect(listsPresenter.adjustOpenCount).toHaveBeenCalledWith(7, -1);
    });

    it('should roll back and report when the request fails', async () => {
      todosService.setCompleted.mockRejectedValue(new Error('boom'));

      await presenter.toggleCompleted(1);

      expect(todosStore.todos[0]?.completed).toBe(false);
      expect(todosStore.errorMessage).toBe('Could not update "Oat milk"');
      expect(listsPresenter.adjustOpenCount).toHaveBeenLastCalledWith(7, 1);
    });

    it('should do nothing when the todo does not exist', async () => {
      await presenter.toggleCompleted(99);

      expect(todosService.setCompleted).not.toHaveBeenCalled();
    });
  });

  describe('completeSelected', () => {
    beforeEach(loadTodos);

    it('should complete only the open selected todos', async () => {
      todosService.setCompleted.mockResolvedValue(1);
      presenter.toggleSelected(1);
      presenter.toggleSelected(2);

      await presenter.completeSelected();

      expect(todosService.setCompleted).toHaveBeenCalledWith([1], true);
      expect(todosStore.activeCount).toBe(1);
      expect(todosStore.selectedIds).toEqual([]);
    });

    it('should only clear the selection when every selected todo is already completed', async () => {
      presenter.toggleSelected(2);

      await presenter.completeSelected();

      expect(todosService.setCompleted).not.toHaveBeenCalled();
      expect(todosStore.selectedIds).toEqual([]);
    });

    it('should keep the todos open and report when the request fails', async () => {
      todosService.setCompleted.mockRejectedValue(new Error('boom'));
      presenter.toggleSelected(1);

      await presenter.completeSelected();

      expect(todosStore.todos[0]?.completed).toBe(false);
      expect(todosStore.errorMessage).toBe('Could not complete the selected todos');
    });
  });

  describe('deleteSelected', () => {
    beforeEach(loadTodos);

    it('should remove the selected todos and adjust the open count', async () => {
      todosService.delete.mockResolvedValue(2);
      presenter.toggleSelected(1);
      presenter.toggleSelected(2);

      await presenter.deleteSelected();

      expect(todosService.delete).toHaveBeenCalledWith([1, 2]);
      expect(todosStore.todos.map(({ id }) => id)).toEqual([3]);
      expect(listsPresenter.adjustOpenCount).toHaveBeenCalledWith(7, -1);
    });

    it('should keep the todos and report when the request fails', async () => {
      todosService.delete.mockRejectedValue(new Error('boom'));
      presenter.toggleSelected(1);

      await presenter.deleteSelected();

      expect(todosStore.todos).toHaveLength(3);
      expect(todosStore.errorMessage).toBe('Could not delete the selected todos');
    });

    it('should do nothing when nothing is selected', async () => {
      await presenter.deleteSelected();

      expect(todosService.delete).not.toHaveBeenCalled();
    });
  });

  describe('addTodo', () => {
    beforeEach(loadTodos);

    it('should append the todo when it belongs to the current list', () => {
      presenter.addTodo(todoFixture({ id: 4, listId: 7 }));

      expect(todosStore.todos.map(({ id }) => id)).toEqual([1, 2, 3, 4]);
      expect(listsPresenter.adjustOpenCount).toHaveBeenCalledWith(7, 1);
    });

    it('should only adjust the open count when the todo belongs to another list', () => {
      presenter.addTodo(todoFixture({ id: 4, listId: 8 }));

      expect(todosStore.todos).toHaveLength(3);
      expect(listsPresenter.adjustOpenCount).toHaveBeenCalledWith(8, 1);
    });
  });
});
