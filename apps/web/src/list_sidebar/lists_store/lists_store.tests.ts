import { runInAction } from 'mobx';
import { beforeEach, describe, expect, it } from 'vitest';
import { RouterStore } from '../../router/router_store/router_store.ts';
import { listFixture } from '../../test/fixtures.ts';
import { ListsStore } from './lists_store.ts';

describe('ListsStore', () => {
  let routerStore: RouterStore;
  let store: ListsStore;

  beforeEach(() => {
    routerStore = new RouterStore();
    store = new ListsStore(routerStore);
    runInAction(() => {
      store.lists = [
        listFixture({ id: 1, name: 'Groceries' }),
        listFixture({ id: 2, name: 'Work' }),
      ];
    });
  });

  describe('selectedListId', () => {
    it.each([
      [{ listId: '2' }, 2],
      [{ listId: '99' }, 99],
    ])('should parse the id when the url params are %j', (params, listId) => {
      runInAction(() => {
        routerStore.params = params;
      });

      expect(store.selectedListId).toBe(listId);
    });

    it.each([[{ listId: 'abc' }], [{ listId: '-1' }], [{ listId: '1.5' }], [{}]])(
      'should return undefined when the url params are %j',
      (params) => {
        runInAction(() => {
          routerStore.params = params;
        });

        expect(store.selectedListId).toBeUndefined();
      },
    );
  });

  describe('selectedList', () => {
    it('should return the list matching the url', () => {
      runInAction(() => {
        routerStore.params = { listId: '2' };
      });

      expect(store.selectedList?.name).toBe('Work');
    });

    it('should return undefined when no loaded list matches the url', () => {
      runInAction(() => {
        routerStore.params = { listId: '99' };
      });

      expect(store.selectedList).toBeUndefined();
    });
  });

  describe('reset', () => {
    it('should clear the lists', () => {
      runInAction(() => {
        store.reset();
      });

      expect(store.lists).toEqual([]);
    });
  });
});
