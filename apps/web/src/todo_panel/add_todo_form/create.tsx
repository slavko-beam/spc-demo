import { observer } from 'mobx-react-lite';
import type { TodosService } from '../../services/todos_service.ts';
import type { TodosPresenter } from '../todos_presenter/todos_presenter.ts';
import type { TodosStore } from '../todos_store/todos_store.ts';
import { AddTodoFormView } from './add_todo_form.tsx';
import { AddTodoPresenter } from './add_todo_presenter/add_todo_presenter.ts';
import { AddTodoStore } from './add_todo_store/add_todo_store.ts';

type Deps = {
  todosStore: TodosStore;
  todosService: TodosService;
  todosPresenter: TodosPresenter;
};

export const createAddTodoForm = ({ todosStore, todosService, todosPresenter }: Deps) => {
  const addTodoStore = new AddTodoStore();
  const addTodoPresenter = new AddTodoPresenter(
    addTodoStore,
    todosStore,
    todosService,
    todosPresenter,
  );

  return observer(() => (
    <AddTodoFormView
      title={addTodoStore.title}
      status={addTodoStore.status}
      canSubmit={addTodoStore.canSubmit}
      onTitleChange={addTodoPresenter.setTitle}
      onSubmit={addTodoPresenter.submit}
    />
  ));
};
