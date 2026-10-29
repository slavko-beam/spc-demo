import type Database from 'better-sqlite3';
import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import { createApp } from './create_app.ts';
import { createDatabase } from './db/create_database.ts';
import { ListsRepository } from './lists/lists_repository.ts';
import { TodosRepository } from './todos/todos_repository.ts';

const post = (body: unknown) => ({
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify(body),
});

describe('createApp', () => {
  let db: Database.Database;
  let app: ReturnType<typeof createApp>;

  beforeEach(() => {
    db = createDatabase(':memory:');
    app = createApp({
      listsRepository: new ListsRepository(db),
      todosRepository: new TodosRepository(db),
    });
  });

  afterEach(() => {
    db.close();
  });

  it('lists the seeded lists with open counts', async () => {
    const res = await app.request('/lists');

    expect(res.status).toBe(200);
    expect(await res.json()).toEqual([
      { id: 1, name: 'Groceries', openCount: 4 },
      { id: 2, name: 'Work', openCount: 3 },
      { id: 3, name: 'Home', openCount: 2 },
    ]);
  });

  it('creates a todo in a list', async () => {
    const res = await app.request('/lists/3/todos', post({ title: 'Mow the lawn' }));

    expect(res.status).toBe(201);
    expect(await res.json()).toMatchObject({ listId: 3, title: 'Mow the lawn', completed: false });
  });

  it('rejects a blank todo title', async () => {
    const res = await app.request('/lists/3/todos', post({ title: '   ' }));

    expect(res.status).toBe(400);
  });

  it('returns 404 for todos of an unknown list', async () => {
    const res = await app.request('/lists/999/todos');

    expect(res.status).toBe(404);
  });

  it('completes todos in bulk and updates the open count', async () => {
    const res = await app.request('/todos/completed', post({ ids: [1, 2], completed: true }));

    expect(await res.json()).toEqual({ affected: 2 });
    const lists = (await (await app.request('/lists')).json()) as { openCount: number }[];
    expect(lists[0]?.openCount).toBe(2);
  });

  it('deletes todos in bulk', async () => {
    const res = await app.request('/todos/delete', post({ ids: [8, 9] }));

    expect(await res.json()).toEqual({ affected: 2 });
    expect(await (await app.request('/lists/3/todos')).json()).toEqual([]);
  });
});
