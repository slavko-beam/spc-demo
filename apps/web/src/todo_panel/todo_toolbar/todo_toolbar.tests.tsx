import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { beforeEach, describe, expect, it, vi, type Mock } from 'vitest';
import { TodoFilter } from '../todos_store/todos_store.ts';
import { TodoToolbarView } from './todo_toolbar.tsx';

describe('TodoToolbarView', () => {
  let onFilterChange: Mock<(filter: TodoFilter) => void>;
  let onSearchChange: Mock<(search: string) => void>;

  beforeEach(() => {
    onFilterChange = vi.fn();
    onSearchChange = vi.fn();
    render(
      <TodoToolbarView
        filter={TodoFilter.ACTIVE}
        search=""
        activeCount={2}
        completedCount={1}
        onFilterChange={onFilterChange}
        onSearchChange={onSearchChange}
      />,
    );
  });

  it('shows counts and marks the active filter', () => {
    expect(screen.getByRole('button', { name: 'All (3)' })).toHaveAttribute(
      'aria-pressed',
      'false',
    );
    expect(screen.getByRole('button', { name: 'Active (2)' })).toHaveAttribute(
      'aria-pressed',
      'true',
    );
  });

  it('reports filter and search changes', async () => {
    await userEvent.click(screen.getByRole('button', { name: 'Done (1)' }));
    await userEvent.type(screen.getByLabelText('Search todos'), 'm');

    expect(onFilterChange).toHaveBeenCalledWith(TodoFilter.COMPLETED);
    expect(onSearchChange).toHaveBeenCalledWith('m');
  });
});
