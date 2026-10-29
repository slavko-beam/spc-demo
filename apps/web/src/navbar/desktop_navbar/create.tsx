import { observer } from 'mobx-react-lite';
import type { ListsStore } from '../../list_sidebar/lists_store/lists_store.ts';
import { DesktopNavbarView } from './desktop_navbar.tsx';

type Deps = {
  listsStore: ListsStore;
  settingsPopover: React.JSX.Element;
};

export const createDesktopNavbar = ({ listsStore, settingsPopover }: Deps) =>
  observer(() => (
    <DesktopNavbarView listName={listsStore.selectedList?.name} settingsPopover={settingsPopover} />
  ));
