import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { beforeEach, describe, expect, it, vi, type Mock } from 'vitest';
import { TodoFilter } from '../../todos_store/todos_store.ts';
import { TodoFilterButtonView } from './todo_filter_button.tsx';

describe('TodoFilterButtonView', () => {
  let onSelect: Mock<(filter: TodoFilter) => void>;

  beforeEach(() => {
    onSelect = vi.fn();
  });

  it.each([true, false])('active %s is reflected in aria-pressed', (isActive) => {
    render(
      <TodoFilterButtonView
        filter={TodoFilter.ACTIVE}
        label="Active (2)"
        isActive={isActive}
        onSelect={onSelect}
      />,
    );

    expect(screen.getByRole('button', { name: 'Active (2)' })).toHaveAttribute(
      'aria-pressed',
      String(isActive),
    );
  });

  it('reports its filter when clicked', async () => {
    render(
      <TodoFilterButtonView
        filter={TodoFilter.COMPLETED}
        label="Done (1)"
        isActive={false}
        onSelect={onSelect}
      />,
    );

    await userEvent.click(screen.getByRole('button'));

    expect(onSelect).toHaveBeenCalledWith(TodoFilter.COMPLETED);
  });
});
