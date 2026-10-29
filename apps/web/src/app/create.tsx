import type { ApiClient } from '@spc/api-client';
import { observer } from 'mobx-react-lite';
import type { DataRouter, RouteObject } from 'react-router';
import { createListSidebar } from '../list_sidebar/create.tsx';
import { ListsPresenter } from '../list_sidebar/lists_presenter/lists_presenter.ts';
import { ListsStore } from '../list_sidebar/lists_store/lists_store.ts';
import { createNavbar } from '../navbar/create.tsx';
import { createRouter } from '../router/create.ts';
import { ListsService } from '../services/lists_service.ts';
import { TodosService } from '../services/todos_service.ts';
import { ViewportService } from '../services/viewport_service.ts';
import { createTodoPanel } from '../todo_panel/create.tsx';
import { UiPresenter } from '../ui/ui_presenter/ui_presenter.ts';
import { UiStore } from '../ui/ui_store/ui_store.ts';
import { AppLayoutView } from './app.tsx';

type Deps = {
  apiClient: ApiClient;
  mobileQuery: MediaQueryList;
  createDataRouter: (routes: RouteObject[]) => DataRouter;
};

export const createApp = ({ apiClient, mobileQuery, createDataRouter }: Deps) => {
  const { routerStore, navigate } = createRouter({ createDataRouter });

  const listsService = new ListsService(apiClient);
  const todosService = new TodosService(apiClient);
  const viewportService = new ViewportService(mobileQuery);

  const uiStore = new UiStore();
  const uiPresenter = new UiPresenter(uiStore, viewportService);
  uiPresenter.watchViewport();

  const listsStore = new ListsStore(routerStore);
  const listsPresenter = new ListsPresenter(listsStore, listsService, navigate);

  const Navbar = createNavbar({ uiStore, uiPresenter, listsStore });
  const ListSidebar = createListSidebar({ listsStore, listsPresenter });
  const TodoPanel = createTodoPanel({ listsStore, listsPresenter, todosService });

  const navbar = <Navbar />;
  const sidebar = <ListSidebar />;
  const main = <TodoPanel />;

  // Changing the theme re-renders the layout only; the slots are the same elements every time.
  return observer(() => (
    <AppLayoutView
      theme={uiStore.theme}
      density={uiStore.density}
      navbar={navbar}
      sidebar={sidebar}
      main={main}
    />
  ));
};
