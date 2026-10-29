import { observer } from 'mobx-react-lite';
import type { TodoFilter } from '../../todos_store/todos_store.ts';
import styles from './todo_filter_button.module.css';

type Props = {
  filter: TodoFilter;
  label: string;
  isActive: boolean;
  onSelect: (filter: TodoFilter) => void;
};

export const TodoFilterButtonView = observer(({ filter, label, isActive, onSelect }: Props) => (
  <button
    type="button"
    className={styles.button}
    aria-pressed={isActive}
    onClick={() => onSelect(filter)}
  >
    {label}
  </button>
));
