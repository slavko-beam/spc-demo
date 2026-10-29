import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { beforeEach, describe, expect, it, vi, type Mock } from 'vitest';
import { TodoBulkActionsView } from './todo_bulk_actions.tsx';

describe('TodoBulkActionsView', () => {
  let onCompleteSelected: Mock<() => void>;
  let onDeleteSelected: Mock<() => void>;
  let onClearSelection: Mock<() => void>;

  beforeEach(() => {
    onCompleteSelected = vi.fn();
    onDeleteSelected = vi.fn();
    onClearSelection = vi.fn();
  });

  const renderBar = (selectedCount: number) =>
    render(
      <TodoBulkActionsView
        selectedCount={selectedCount}
        onCompleteSelected={onCompleteSelected}
        onDeleteSelected={onDeleteSelected}
        onClearSelection={onClearSelection}
      />,
    );

  it('renders nothing without a selection', () => {
    renderBar(0);

    expect(screen.queryByRole('toolbar')).not.toBeInTheDocument();
  });

  it('reports each bulk action', async () => {
    renderBar(2);

    expect(screen.getByText('2 selected')).toBeInTheDocument();
    await userEvent.click(screen.getByRole('button', { name: 'Complete' }));
    await userEvent.click(screen.getByRole('button', { name: 'Delete' }));
    await userEvent.click(screen.getByRole('button', { name: 'Clear' }));

    expect(onCompleteSelected).toHaveBeenCalled();
    expect(onDeleteSelected).toHaveBeenCalled();
    expect(onClearSelection).toHaveBeenCalled();
  });
});
