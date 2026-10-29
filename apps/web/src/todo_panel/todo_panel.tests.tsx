import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { beforeEach, describe, expect, it, vi, type Mock } from 'vitest';
import { TodoPanelView } from './todo_panel.tsx';

describe('TodoPanelView', () => {
  let onDismissError: Mock<() => void>;

  beforeEach(() => {
    onDismissError = vi.fn();
  });

  const renderPanel = (overrides: Partial<React.ComponentProps<typeof TodoPanelView>> = {}) =>
    render(
      <TodoPanelView
        title="Groceries"
        errorMessage={undefined}
        onDismissError={onDismissError}
        addTodoForm={<div>add form slot</div>}
        toolbar={<div>toolbar slot</div>}
        bulkActions={<div>bulk actions slot</div>}
        table={<div>table slot</div>}
        {...overrides}
      />,
    );

  it('renders the title and every slot', () => {
    renderPanel();

    expect(screen.getByRole('heading', { name: 'Groceries' })).toBeInTheDocument();
    for (const slot of ['add form', 'toolbar', 'bulk actions', 'table']) {
      expect(screen.getByText(`${slot} slot`)).toBeInTheDocument();
    }
  });

  it('falls back to a generic title', () => {
    renderPanel({ title: undefined });

    expect(screen.getByRole('heading', { name: 'Todos' })).toBeInTheDocument();
  });

  it('shows a dismissible error', async () => {
    renderPanel({ errorMessage: 'Could not update "Lemons"' });

    expect(screen.getByRole('alert')).toHaveTextContent('Could not update "Lemons"');
    await userEvent.click(screen.getByRole('button', { name: 'Dismiss' }));

    expect(onDismissError).toHaveBeenCalled();
  });
});
