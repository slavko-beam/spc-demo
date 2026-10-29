import type { Todo } from '@spc/api-client';
import { observer } from 'mobx-react-lite';
import { LoadStatus } from '../../lib/load_status.ts';
import styles from './todo_table.module.css';
import { TodoTableRowView } from './todo_table_row/todo_table_row.tsx';

type Props = {
  todos: Todo[];
  status: LoadStatus;
  selectedIds: ReadonlySet<number>;
  isAllSelected: boolean;
  onToggleSelected: (id: number) => void;
  onToggleSelectAll: () => void;
  onToggleCompleted: (id: number) => void;
};

type BodyProps = Omit<Props, 'isAllSelected' | 'onToggleSelectAll'>;

const MESSAGES: Partial<Record<LoadStatus, string>> = {
  [LoadStatus.IDLE]: 'Pick a list to see its todos.',
  [LoadStatus.LOADING]: 'Loading todos…',
  [LoadStatus.ERROR]: 'Could not load todos.',
};

const MessageRow = observer(({ message }: { message: string }) => (
  <tr>
    <td colSpan={3} className={styles.message}>
      {message}
    </td>
  </tr>
));

const TodoTableBody = observer(
  ({ todos, status, selectedIds, onToggleSelected, onToggleCompleted }: BodyProps) => {
    const statusMessage = MESSAGES[status];
    if (statusMessage) return <MessageRow message={statusMessage} />;
    if (todos.length === 0) return <MessageRow message="Nothing here." />;

    return todos.map((todo) => (
      <TodoTableRowView
        key={todo.id}
        id={todo.id}
        title={todo.title}
        completed={todo.completed}
        isSelected={selectedIds.has(todo.id)}
        onToggleSelected={onToggleSelected}
        onToggleCompleted={onToggleCompleted}
      />
    ));
  },
);

export const TodoTableView = observer(
  ({
    todos,
    status,
    selectedIds,
    isAllSelected,
    onToggleSelected,
    onToggleSelectAll,
    onToggleCompleted,
  }: Props) => (
    <table className={styles.table}>
      <thead>
        <tr>
          <th className={styles.check}>
            <input
              type="checkbox"
              aria-label="Select all"
              checked={isAllSelected}
              disabled={todos.length === 0}
              onChange={onToggleSelectAll}
            />
          </th>
          <th>Todo</th>
          <th className={styles.check}>Done</th>
        </tr>
      </thead>
      <tbody>
        <TodoTableBody
          todos={todos}
          status={status}
          selectedIds={selectedIds}
          onToggleSelected={onToggleSelected}
          onToggleCompleted={onToggleCompleted}
        />
      </tbody>
    </table>
  ),
);
