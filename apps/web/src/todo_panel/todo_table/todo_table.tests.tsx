import type { Todo } from '@spc/api-client';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { beforeEach, describe, expect, it, vi, type Mock } from 'vitest';
import { LoadStatus } from '../../lib/load_status.ts';
import { todoFixture } from '../../test/fixtures.ts';
import { TodoTableView } from './todo_table.tsx';

describe('TodoTableView', () => {
  let todos: Todo[];
  let onToggleSelected: Mock<(id: number) => void>;
  let onToggleSelectAll: Mock<() => void>;
  let onToggleCompleted: Mock<(id: number) => void>;

  beforeEach(() => {
    todos = [
      todoFixture({ id: 1, title: 'Oat milk' }),
      todoFixture({ id: 2, title: 'Sourdough', completed: true }),
    ];
    onToggleSelected = vi.fn();
    onToggleSelectAll = vi.fn();
    onToggleCompleted = vi.fn();
  });

  const renderTable = (overrides: Partial<React.ComponentProps<typeof TodoTableView>> = {}) =>
    render(
      <TodoTableView
        todos={todos}
        status={LoadStatus.LOADED}
        selectedIds={new Set([2])}
        isAllSelected={false}
        onToggleSelected={onToggleSelected}
        onToggleSelectAll={onToggleSelectAll}
        onToggleCompleted={onToggleCompleted}
        {...overrides}
      />,
    );

  it('renders each todo with its selection and completion state', () => {
    renderTable();

    expect(screen.getByLabelText('Select "Oat milk"')).not.toBeChecked();
    expect(screen.getByLabelText('Select "Sourdough"')).toBeChecked();
    expect(screen.getByLabelText('Complete "Sourdough"')).toBeChecked();
  });

  it('reports toggles with the todo id', async () => {
    renderTable();

    await userEvent.click(screen.getByLabelText('Complete "Oat milk"'));
    await userEvent.click(screen.getByLabelText('Select "Oat milk"'));
    await userEvent.click(screen.getByLabelText('Select all'));

    expect(onToggleCompleted).toHaveBeenCalledWith(1);
    expect(onToggleSelected).toHaveBeenCalledWith(1);
    expect(onToggleSelectAll).toHaveBeenCalled();
  });

  it.each([
    [LoadStatus.IDLE, 'Pick a list to see its todos.'],
    [LoadStatus.LOADING, 'Loading todos…'],
    [LoadStatus.ERROR, 'Could not load todos.'],
  ])('status %s shows "%s"', (status, message) => {
    renderTable({ status });

    expect(screen.getByText(message)).toBeInTheDocument();
    expect(screen.queryByText('Oat milk')).not.toBeInTheDocument();
  });

  it('shows an empty message when nothing matches', () => {
    renderTable({ todos: [] });

    expect(screen.getByText('Nothing here.')).toBeInTheDocument();
    expect(screen.getByLabelText('Select all')).toBeDisabled();
  });
});
