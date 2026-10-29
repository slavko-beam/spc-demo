import { runInAction } from 'mobx';
import type { DataRouter, RouteObject, RouterState } from 'react-router';
import { ROUTE_PATTERNS, type AppRoute } from './app_route.ts';
import { RouterStore } from './router_store/router_store.ts';

export type Navigate = (route: AppRoute, options?: { replace?: boolean }) => void;

type Deps = {
  createDataRouter: (routes: RouteObject[]) => DataRouter;
};

export const createRouter = ({ createDataRouter }: Deps) => {
  const router = createDataRouter(ROUTE_PATTERNS);
  const routerStore = new RouterStore();

  // The one place router state flows into MobX; nothing else touches the router.
  const sync = ({ location, matches }: RouterState) =>
    runInAction(() => {
      routerStore.pathname = location.pathname;
      routerStore.params = matches.at(-1)?.params ?? {};
    });

  sync(router.state);
  router.subscribe(sync);

  const navigate: Navigate = (route, options) => void router.navigate(route, options);

  return { routerStore, navigate };
};
