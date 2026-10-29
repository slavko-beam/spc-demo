import { observer } from 'mobx-react-lite';
import type { ListsStore } from '../list_sidebar/lists_store/lists_store.ts';
import { createSettingsPopover } from '../settings_popover/create.tsx';
import type { UiPresenter } from '../ui/ui_presenter/ui_presenter.ts';
import type { UiStore } from '../ui/ui_store/ui_store.ts';
import { createDesktopNavbar } from './desktop_navbar/create.tsx';
import { createMobileNavbar } from './mobile_navbar/create.tsx';

type Deps = {
  uiStore: UiStore;
  uiPresenter: UiPresenter;
  listsStore: ListsStore;
};

export const createNavbar = ({ uiStore, uiPresenter, listsStore }: Deps) => {
  const SettingsPopover = createSettingsPopover({ uiStore, uiPresenter });
  // One element shared by both variants: a variant re-rendering never re-renders the popover.
  const settingsPopover = <SettingsPopover />;

  const DesktopNavbar = createDesktopNavbar({ listsStore, settingsPopover });
  const MobileNavbar = createMobileNavbar({ listsStore, settingsPopover });
  const desktopNavbar = <DesktopNavbar />;
  const mobileNavbar = <MobileNavbar />;

  return observer(() => {
    if (uiStore.isMobile) return mobileNavbar;
    return desktopNavbar;
  });
};
