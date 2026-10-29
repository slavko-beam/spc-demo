import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { beforeEach, describe, expect, it, vi, type Mock } from 'vitest';
import { TodoTableRowView } from './todo_table_row.tsx';

describe('TodoTableRowView', () => {
  let onToggleSelected: Mock<(id: number) => void>;
  let onToggleCompleted: Mock<(id: number) => void>;

  beforeEach(() => {
    onToggleSelected = vi.fn();
    onToggleCompleted = vi.fn();
  });

  const renderRow = (overrides: Partial<React.ComponentProps<typeof TodoTableRowView>> = {}) =>
    render(
      <table>
        <tbody>
          <TodoTableRowView
            id={4}
            title="Lemons"
            completed={false}
            isSelected={false}
            onToggleSelected={onToggleSelected}
            onToggleCompleted={onToggleCompleted}
            {...overrides}
          />
        </tbody>
      </table>,
    );

  it.each([
    [false, false],
    [true, false],
    [false, true],
    [true, true],
  ])('selected %s, completed %s', (isSelected, completed) => {
    renderRow({ isSelected, completed });

    expect(screen.getByLabelText('Select "Lemons"')).toHaveProperty('checked', isSelected);
    expect(screen.getByLabelText('Complete "Lemons"')).toHaveProperty('checked', completed);
  });

  it('reports toggles with its id', async () => {
    renderRow();

    await userEvent.click(screen.getByLabelText('Select "Lemons"'));
    await userEvent.click(screen.getByLabelText('Complete "Lemons"'));

    expect(onToggleSelected).toHaveBeenCalledWith(4);
    expect(onToggleCompleted).toHaveBeenCalledWith(4);
  });
});
