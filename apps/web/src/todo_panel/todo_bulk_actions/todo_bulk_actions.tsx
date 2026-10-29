import { observer } from 'mobx-react-lite';
import styles from './todo_bulk_actions.module.css';

type Props = {
  selectedCount: number;
  onCompleteSelected: () => void;
  onDeleteSelected: () => void;
  onClearSelection: () => void;
};

export const TodoBulkActionsView = observer(
  ({ selectedCount, onCompleteSelected, onDeleteSelected, onClearSelection }: Props) =>
    selectedCount > 0 && (
      <div className={styles.bar} role="toolbar" aria-label="Bulk actions">
        <span className={styles.count}>{selectedCount} selected</span>
        <button type="button" onClick={onCompleteSelected}>
          Complete
        </button>
        <button type="button" className={styles.danger} onClick={onDeleteSelected}>
          Delete
        </button>
        <button type="button" onClick={onClearSelection}>
          Clear
        </button>
      </div>
    ),
);
