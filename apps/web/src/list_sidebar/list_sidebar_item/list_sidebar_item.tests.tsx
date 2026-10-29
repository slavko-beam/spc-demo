import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { beforeEach, describe, expect, it, vi, type Mock } from 'vitest';
import { ListSidebarItemView } from './list_sidebar_item.tsx';

describe('ListSidebarItemView', () => {
  let onSelect: Mock<(listId: number) => void>;

  beforeEach(() => {
    onSelect = vi.fn();
  });

  const renderItem = (isSelected: boolean) =>
    render(
      <ul>
        <ListSidebarItemView
          id={2}
          name="Work"
          openCount={3}
          isSelected={isSelected}
          onSelect={onSelect}
        />
      </ul>,
    );

  it('shows the name and open count, and reports selection with its id', async () => {
    renderItem(false);

    expect(screen.getByRole('button', { name: /^Work/ })).toHaveTextContent('3');
    await userEvent.click(screen.getByRole('button', { name: /^Work/ }));

    expect(onSelect).toHaveBeenCalledWith(2);
  });

  it.each([
    [true, 'page'],
    [false, 'false'],
  ])('selected %s sets aria-current to %s', (isSelected, ariaCurrent) => {
    renderItem(isSelected);

    expect(screen.getByRole('button').getAttribute('aria-current')).toBe(ariaCurrent);
  });
});
