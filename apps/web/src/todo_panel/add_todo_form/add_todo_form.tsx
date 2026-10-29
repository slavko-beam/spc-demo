import { observer } from 'mobx-react-lite';
import { SubmitStatus } from '../../lib/submit_status.ts';
import styles from './add_todo_form.module.css';

type Props = {
  title: string;
  status: SubmitStatus;
  canSubmit: boolean;
  onTitleChange: (title: string) => void;
  onSubmit: () => void;
};

const SUBMIT_LABELS: Record<SubmitStatus, string> = {
  [SubmitStatus.IDLE]: 'Add',
  [SubmitStatus.SUBMITTING]: 'Adding…',
  [SubmitStatus.ERROR]: 'Add',
};

export const AddTodoFormView = observer(
  ({ title, status, canSubmit, onTitleChange, onSubmit }: Props) => (
    <form
      className={styles.form}
      onSubmit={(event) => {
        event.preventDefault();
        onSubmit();
      }}
    >
      <input
        type="text"
        className={styles.input}
        placeholder="What needs doing?"
        aria-label="New todo"
        value={title}
        onChange={(event) => onTitleChange(event.target.value)}
      />
      {status === SubmitStatus.ERROR && <span className={styles.error}>Could not add todo</span>}
      <button type="submit" disabled={!canSubmit}>
        {SUBMIT_LABELS[status]}
      </button>
    </form>
  ),
);
