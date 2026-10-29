import type { List } from '@spc/api-client';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { beforeEach, describe, expect, it, vi, type Mock } from 'vitest';
import { LoadStatus } from '../lib/load_status.ts';
import { listFixture } from '../test/fixtures.ts';
import { ListSidebarView } from './list_sidebar.tsx';

describe('ListSidebarView', () => {
  let lists: List[];
  let onSelect: Mock<(listId: number) => void>;

  beforeEach(() => {
    lists = [
      listFixture({ id: 1, name: 'Groceries', openCount: 4 }),
      listFixture({ id: 2, name: 'Work', openCount: 0 }),
    ];
    onSelect = vi.fn();
  });

  it('marks the selected list and reports selection', async () => {
    render(
      <ListSidebarView
        lists={lists}
        status={LoadStatus.LOADED}
        selectedListId={2}
        onSelect={onSelect}
      />,
    );

    expect(screen.getByRole('button', { name: /^Work/ })).toHaveAttribute('aria-current', 'page');

    await userEvent.click(screen.getByRole('button', { name: /^Groceries/ }));

    expect(onSelect).toHaveBeenCalledWith(1);
  });

  it('shows the loading state', () => {
    render(
      <ListSidebarView
        lists={[]}
        status={LoadStatus.LOADING}
        selectedListId={undefined}
        onSelect={onSelect}
      />,
    );

    expect(screen.getByText('Loading lists…')).toBeInTheDocument();
  });
});
