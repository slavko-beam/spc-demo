import { runInAction } from 'mobx';
import { beforeEach, describe, expect, it } from 'vitest';
import { LoadStatus } from '../../lib/load_status.ts';
import { todoFixture } from '../../test/fixtures.ts';
import { TodoFilter, TodosStore } from './todos_store.ts';

describe('TodosStore', () => {
  let store: TodosStore;

  beforeEach(() => {
    store = new TodosStore();
    runInAction(() => {
      store.todos = [
        todoFixture({ id: 1, title: 'Buy oat milk' }),
        todoFixture({ id: 2, title: 'Buy sourdough', completed: true }),
        todoFixture({ id: 3, title: 'Call plumber' }),
      ];
    });
  });

  describe('visibleTodos', () => {
    it.each([
      [TodoFilter.ALL, [1, 2, 3]],
      [TodoFilter.ACTIVE, [1, 3]],
      [TodoFilter.COMPLETED, [2]],
    ])('should return todos %j when the filter is %s', (filter, ids) => {
      runInAction(() => {
        store.filter = filter;
      });

      expect(store.visibleTodos.map(({ id }) => id)).toEqual(ids);
    });

    it('should match titles case-insensitively when searching', () => {
      runInAction(() => {
        store.search = '  BUY ';
      });

      expect(store.visibleTodos.map(({ id }) => id)).toEqual([1, 2]);
    });

    it('should apply the search and the filter together', () => {
      runInAction(() => {
        store.search = 'buy';
        store.filter = TodoFilter.ACTIVE;
      });

      expect(store.visibleTodos.map(({ id }) => id)).toEqual([1]);
    });
  });

  describe('activeCount', () => {
    it('should count the todos that are not completed', () => {
      expect(store.activeCount).toBe(2);
    });
  });

  describe('completedCount', () => {
    it('should count the completed todos', () => {
      expect(store.completedCount).toBe(1);
    });
  });

  describe('selectedTodos', () => {
    it('should ignore selected ids that are not in the list', () => {
      runInAction(() => {
        store.selectedIds = [1, 99];
      });

      expect(store.selectedTodos.map(({ id }) => id)).toEqual([1]);
    });
  });

  describe('selectedCount', () => {
    it('should count only selected todos that exist', () => {
      runInAction(() => {
        store.selectedIds = [1, 3, 99];
      });

      expect(store.selectedCount).toBe(2);
    });
  });

  describe('isAllVisibleSelected', () => {
    it('should return false when only some visible todos are selected', () => {
      runInAction(() => {
        store.filter = TodoFilter.ACTIVE;
        store.selectedIds = [1];
      });

      expect(store.isAllVisibleSelected).toBe(false);
    });

    it('should return true when every visible todo is selected', () => {
      runInAction(() => {
        store.filter = TodoFilter.ACTIVE;
        store.selectedIds = [1, 3];
      });

      expect(store.isAllVisibleSelected).toBe(true);
    });

    it('should return false when nothing is visible', () => {
      runInAction(() => {
        store.search = 'nothing matches';
      });

      expect(store.isAllVisibleSelected).toBe(false);
    });
  });

  describe('reset', () => {
    it('should restore the initial state', () => {
      runInAction(() => {
        store.listId = 7;
        store.status = LoadStatus.LOADED;
        store.search = 'milk';
        store.selectedIds = [1];
        store.reset();
      });

      expect(store.listId).toBeUndefined();
      expect(store.todos).toEqual([]);
      expect(store.status).toBe(LoadStatus.IDLE);
      expect(store.search).toBe('');
      expect(store.selectedIds).toEqual([]);
    });
  });
});
