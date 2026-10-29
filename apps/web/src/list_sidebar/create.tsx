import { observer } from 'mobx-react-lite';
import { ListSidebarView } from './list_sidebar.tsx';
import type { ListsPresenter } from './lists_presenter/lists_presenter.ts';
import type { ListsStore } from './lists_store/lists_store.ts';

type Deps = {
  listsStore: ListsStore;
  listsPresenter: ListsPresenter;
};

export const createListSidebar = ({ listsStore, listsPresenter }: Deps) => {
  void listsPresenter.load();

  return observer(() => (
    <ListSidebarView
      lists={listsStore.lists}
      status={listsStore.status}
      selectedListId={listsStore.selectedListId}
      onSelect={listsPresenter.select}
    />
  ));
};
