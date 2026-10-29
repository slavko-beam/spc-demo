import type { List } from '@spc/api-client';
import { observer } from 'mobx-react-lite';
import { LoadStatus } from '../lib/load_status.ts';
import { ListSidebarItemView } from './list_sidebar_item/list_sidebar_item.tsx';
import styles from './list_sidebar.module.css';

type Props = {
  lists: List[];
  status: LoadStatus;
  selectedListId: number | undefined;
  onSelect: (listId: number) => void;
};

export const ListSidebarView = observer(({ lists, status, selectedListId, onSelect }: Props) => (
  <nav aria-label="Lists">
    <h2 className={styles.title}>Lists</h2>
    {status === LoadStatus.LOADING && <p className={styles.message}>Loading lists…</p>}
    {status === LoadStatus.ERROR && <p className={styles.message}>Could not load lists.</p>}
    <ul className={styles.list}>
      {lists.map((list) => (
        <ListSidebarItemView
          key={list.id}
          id={list.id}
          name={list.name}
          openCount={list.openCount}
          isSelected={list.id === selectedListId}
          onSelect={onSelect}
        />
      ))}
    </ul>
  </nav>
));
