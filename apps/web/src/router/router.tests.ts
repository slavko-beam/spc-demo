import { createMemoryRouter } from 'react-router';
import { beforeEach, describe, expect, it } from 'vitest';
import { createRouter } from './create.ts';

describe('createRouter', () => {
  let router: ReturnType<typeof createRouter>;

  beforeEach(() => {
    router = createRouter({
      createDataRouter: (routes) => createMemoryRouter(routes, { initialEntries: ['/lists/2'] }),
    });
  });

  it('syncs the initial location into the store', () => {
    expect(router.routerStore.pathname).toBe('/lists/2');
    expect(router.routerStore.params).toEqual({ listId: '2' });
  });

  it('navigating updates the store', async () => {
    router.navigate('/lists/5');

    await expect.poll(() => router.routerStore.params.listId).toBe('5');
    expect(router.routerStore.pathname).toBe('/lists/5');
  });
});
