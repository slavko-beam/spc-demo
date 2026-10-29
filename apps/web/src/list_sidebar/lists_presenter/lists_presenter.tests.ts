import { runInAction } from 'mobx';
import { beforeEach, describe, expect, it, vi, type Mock } from 'vitest';
import { mock, type MockProxy } from 'vitest-mock-extended';
import { LoadStatus } from '../../lib/load_status.ts';
import type { Navigate } from '../../router/create.ts';
import { RouterStore } from '../../router/router_store/router_store.ts';
import type { ListsService } from '../../services/lists_service.ts';
import { listFixture } from '../../test/fixtures.ts';
import { ListsStore } from '../lists_store/lists_store.ts';
import { ListsPresenter } from './lists_presenter.ts';

describe('ListsPresenter', () => {
  let routerStore: RouterStore;
  let listsStore: ListsStore;
  let listsService: MockProxy<ListsService>;
  let navigate: Mock<Navigate>;
  let presenter: ListsPresenter;

  beforeEach(() => {
    routerStore = new RouterStore();
    listsStore = new ListsStore(routerStore);
    listsService = mock<ListsService>();
    navigate = vi.fn<Navigate>();
    presenter = new ListsPresenter(listsStore, listsService, navigate);
  });

  describe('load', () => {
    it('should store the lists when the request succeeds', async () => {
      const lists = [listFixture({ id: 1 }), listFixture({ id: 2 })];
      listsService.getAll.mockResolvedValue(lists);

      await presenter.load();

      expect(listsStore.lists).toEqual(lists);
      expect(listsStore.status).toBe(LoadStatus.LOADED);
    });

    it('should redirect to the first list when the url has none', async () => {
      listsService.getAll.mockResolvedValue([listFixture({ id: 4 }), listFixture({ id: 5 })]);

      await presenter.load();

      expect(navigate).toHaveBeenCalledWith('/lists/4', { replace: true });
    });

    it('should not navigate when the url already has a list', async () => {
      runInAction(() => {
        routerStore.params = { listId: '5' };
      });
      listsService.getAll.mockResolvedValue([listFixture({ id: 4 }), listFixture({ id: 5 })]);

      await presenter.load();

      expect(navigate).not.toHaveBeenCalled();
    });

    it('should not navigate when there are no lists', async () => {
      listsService.getAll.mockResolvedValue([]);

      await presenter.load();

      expect(navigate).not.toHaveBeenCalled();
    });

    it('should set the error status when the request fails', async () => {
      listsService.getAll.mockRejectedValue(new Error('boom'));

      await presenter.load();

      expect(listsStore.status).toBe(LoadStatus.ERROR);
    });
  });

  describe('select', () => {
    it('should navigate to the list', () => {
      presenter.select(3);

      expect(navigate).toHaveBeenCalledWith('/lists/3');
    });
  });

  describe('adjustOpenCount', () => {
    beforeEach(async () => {
      listsService.getAll.mockResolvedValue([listFixture({ id: 1, openCount: 1 })]);
      await presenter.load();
    });

    it('should add the delta to the open count', () => {
      presenter.adjustOpenCount(1, 2);

      expect(listsStore.lists[0]?.openCount).toBe(3);
    });

    it('should not go below zero', () => {
      presenter.adjustOpenCount(1, -5);

      expect(listsStore.lists[0]?.openCount).toBe(0);
    });

    it('should do nothing when the list does not exist', () => {
      presenter.adjustOpenCount(99, 1);

      expect(listsStore.lists[0]?.openCount).toBe(1);
    });
  });
});
