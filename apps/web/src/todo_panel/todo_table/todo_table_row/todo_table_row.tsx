import { observer } from 'mobx-react-lite';
import styles from './todo_table_row.module.css';

type Props = {
  id: number;
  title: string;
  completed: boolean;
  isSelected: boolean;
  onToggleSelected: (id: number) => void;
  onToggleCompleted: (id: number) => void;
};

export const TodoTableRowView = observer(
  ({ id, title, completed, isSelected, onToggleSelected, onToggleCompleted }: Props) => (
    <tr>
      <td>
        <input
          type="checkbox"
          aria-label={`Select "${title}"`}
          checked={isSelected}
          onChange={() => onToggleSelected(id)}
        />
      </td>
      <td className={styles.title} data-completed={completed}>
        {title}
      </td>
      <td>
        <input
          type="checkbox"
          aria-label={`Complete "${title}"`}
          checked={completed}
          onChange={() => onToggleCompleted(id)}
        />
      </td>
    </tr>
  ),
);
