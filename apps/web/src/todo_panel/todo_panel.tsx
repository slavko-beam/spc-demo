import { observer } from 'mobx-react-lite';
import styles from './todo_panel.module.css';

type Props = {
  title: string | undefined;
  errorMessage: string | undefined;
  onDismissError: () => void;
  addTodoForm: React.JSX.Element;
  toolbar: React.JSX.Element;
  bulkActions: React.JSX.Element;
  table: React.JSX.Element;
};

export const TodoPanelView = observer(
  ({ title, errorMessage, onDismissError, addTodoForm, toolbar, bulkActions, table }: Props) => (
    <section className={styles.panel} aria-label="Todos">
      <h1 className={styles.title}>{title ?? 'Todos'}</h1>
      {errorMessage && (
        <div className={styles.error} role="alert">
          {errorMessage}
          <button type="button" onClick={onDismissError}>
            Dismiss
          </button>
        </div>
      )}
      {addTodoForm}
      {toolbar}
      {bulkActions}
      {table}
    </section>
  ),
);
