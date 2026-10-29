import type { List, Todo } from '@spc/api-client';

export const todoFixture = (overrides: Partial<Todo> = {}): Todo => ({
  id: 1,
  listId: 1,
  title: 'Buy oat milk',
  completed: false,
  createdAt: '2026-10-29T12:00:00.000Z',
  ...overrides,
});

export const listFixture = (overrides: Partial<List> = {}): List => ({
  id: 1,
  name: 'Groceries',
  openCount: 0,
  ...overrides,
});
