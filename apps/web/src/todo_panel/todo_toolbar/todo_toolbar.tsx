import { observer } from 'mobx-react-lite';
import { TodoFilter } from '../todos_store/todos_store.ts';
import { TodoFilterButtonView } from './todo_filter_button/todo_filter_button.tsx';
import styles from './todo_toolbar.module.css';

type Props = {
  filter: TodoFilter;
  search: string;
  activeCount: number;
  completedCount: number;
  onFilterChange: (filter: TodoFilter) => void;
  onSearchChange: (search: string) => void;
};

export const TodoToolbarView = observer(
  ({ filter, search, activeCount, completedCount, onFilterChange, onSearchChange }: Props) => {
    const filters = [
      { value: TodoFilter.ALL, label: `All (${activeCount + completedCount})` },
      { value: TodoFilter.ACTIVE, label: `Active (${activeCount})` },
      { value: TodoFilter.COMPLETED, label: `Done (${completedCount})` },
    ];

    return (
      <div className={styles.toolbar}>
        <input
          type="search"
          className={styles.search}
          placeholder="Search todos"
          aria-label="Search todos"
          value={search}
          onChange={(event) => onSearchChange(event.target.value)}
        />
        <div className={styles.filters} role="group" aria-label="Filter todos">
          {filters.map(({ value, label }) => (
            <TodoFilterButtonView
              key={value}
              filter={value}
              label={label}
              isActive={filter === value}
              onSelect={onFilterChange}
            />
          ))}
        </div>
      </div>
    );
  },
);
