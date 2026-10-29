import { act, render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { beforeEach, describe, expect, it } from 'vitest';
import { mock, type MockProxy } from 'vitest-mock-extended';
import { ListsStore } from '../list_sidebar/lists_store/lists_store.ts';
import { RouterStore } from '../router/router_store/router_store.ts';
import type { ViewportService } from '../services/viewport_service.ts';
import { UiPresenter } from '../ui/ui_presenter/ui_presenter.ts';
import { UiStore } from '../ui/ui_store/ui_store.ts';
import { createNavbar } from './create.tsx';

describe('createNavbar', () => {
  let uiStore: UiStore;
  let uiPresenter: UiPresenter;
  let viewportService: MockProxy<ViewportService>;
  let Navbar: React.FC;

  beforeEach(() => {
    uiStore = new UiStore();
    viewportService = mock<ViewportService>();
    uiPresenter = new UiPresenter(uiStore, viewportService);
    Navbar = createNavbar({ uiStore, uiPresenter, listsStore: new ListsStore(new RouterStore()) });
  });

  it('renders the variant for the viewport', () => {
    render(<Navbar />);
    expect(screen.getByTestId('desktop-navbar')).toBeInTheDocument();

    act(() => uiPresenter.setIsMobile(true));
    expect(screen.getByTestId('mobile-navbar')).toBeInTheDocument();
  });

  it('the shared settings popover keeps its state across variants', async () => {
    render(<Navbar />);
    await userEvent.click(screen.getByRole('button', { name: 'Settings' }));

    act(() => uiPresenter.setIsMobile(true));

    expect(screen.getByRole('dialog', { name: 'Settings' })).toBeInTheDocument();
  });
});
