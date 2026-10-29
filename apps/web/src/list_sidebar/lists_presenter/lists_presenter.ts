import type { List } from '@spc/api-client';
import { makeAutoObservable, runInAction } from 'mobx';
import { LoadStatus } from '../../lib/load_status.ts';
import { listRoute } from '../../router/app_route.ts';
import type { Navigate } from '../../router/create.ts';
import type { ListsService } from '../../services/lists_service.ts';
import type { ListsStore } from '../lists_store/lists_store.ts';

export class ListsPresenter {
  constructor(
    private readonly listsStore: ListsStore,
    private readonly listsService: ListsService,
    private readonly navigate: Navigate,
  ) {
    makeAutoObservable(this, {}, { autoBind: true });
  }

  async load() {
    this.listsStore.status = LoadStatus.LOADING;
    let lists: List[];
    try {
      lists = await this.listsService.getAll();
    } catch {
      runInAction(() => {
        this.listsStore.status = LoadStatus.ERROR;
      });
      return;
    }

    runInAction(() => {
      this.listsStore.lists = lists;
      this.listsStore.status = LoadStatus.LOADED;
    });

    const [firstList] = lists;
    if (this.listsStore.selectedListId !== undefined || !firstList) return;
    this.navigate(listRoute(firstList.id), { replace: true });
  }

  select(listId: number) {
    this.navigate(listRoute(listId));
  }

  adjustOpenCount(listId: number, delta: number) {
    const list = this.listsStore.lists.find(({ id }) => id === listId);
    if (!list) return;
    list.openCount = Math.max(0, list.openCount + delta);
  }
}
