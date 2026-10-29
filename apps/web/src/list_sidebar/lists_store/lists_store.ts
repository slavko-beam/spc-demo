import type { List } from '@spc/api-client';
import { makeAutoObservable } from 'mobx';
import { LoadStatus } from '../../lib/load_status.ts';
import type { RouterStore } from '../../router/router_store/router_store.ts';

export class ListsStore {
  lists: List[] = [];
  status = LoadStatus.IDLE;

  constructor(private readonly routerStore: RouterStore) {
    makeAutoObservable<this, 'routerStore'>(this, { routerStore: false });
  }

  // From the URL, so it is known before the lists have loaded.
  get selectedListId(): number | undefined {
    const listId = Number(this.routerStore.params.listId);
    if (!Number.isInteger(listId) || listId <= 0) return undefined;
    return listId;
  }

  get selectedList(): List | undefined {
    return this.lists.find((list) => list.id === this.selectedListId);
  }

  reset() {
    this.lists = [];
    this.status = LoadStatus.IDLE;
  }
}
