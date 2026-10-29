import { observer } from 'mobx-react-lite';
import styles from './list_sidebar_item.module.css';

type Props = {
  id: number;
  name: string;
  openCount: number;
  isSelected: boolean;
  onSelect: (listId: number) => void;
};

export const ListSidebarItemView = observer(
  ({ id, name, openCount, isSelected, onSelect }: Props) => (
    <li>
      <button
        type="button"
        className={styles.item}
        aria-current={isSelected && 'page'}
        onClick={() => onSelect(id)}
      >
        <span>{name}</span>
        <span className={styles.count}>{openCount}</span>
      </button>
    </li>
  ),
);
