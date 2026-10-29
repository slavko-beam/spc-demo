import { observer } from 'mobx-react-lite';
import type { ListsStore } from '../../list_sidebar/lists_store/lists_store.ts';
import { MobileNavbarView } from './mobile_navbar.tsx';

type Deps = {
  listsStore: ListsStore;
  settingsPopover: React.JSX.Element;
};

export const createMobileNavbar = ({ listsStore, settingsPopover }: Deps) =>
  observer(() => (
    <MobileNavbarView listName={listsStore.selectedList?.name} settingsPopover={settingsPopover} />
  ));
