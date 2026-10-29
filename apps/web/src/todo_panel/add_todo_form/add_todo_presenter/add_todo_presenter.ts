import type { Todo } from '@spc/api-client';
import { makeAutoObservable, runInAction } from 'mobx';
import { SubmitStatus } from '../../../lib/submit_status.ts';
import type { TodosService } from '../../../services/todos_service.ts';
import type { TodosPresenter } from '../../todos_presenter/todos_presenter.ts';
import type { TodosStore } from '../../todos_store/todos_store.ts';
import type { AddTodoStore } from '../add_todo_store/add_todo_store.ts';

export class AddTodoPresenter {
  constructor(
    private readonly addTodoStore: AddTodoStore,
    private readonly todosStore: TodosStore,
    private readonly todosService: TodosService,
    private readonly todosPresenter: TodosPresenter,
  ) {
    makeAutoObservable(this, {}, { autoBind: true });
  }

  setTitle(title: string) {
    this.addTodoStore.title = title;
    if (this.addTodoStore.status !== SubmitStatus.ERROR) return;
    this.addTodoStore.status = SubmitStatus.IDLE;
  }

  async submit() {
    const { listId } = this.todosStore;
    if (!this.addTodoStore.canSubmit || listId === undefined) return;

    this.addTodoStore.status = SubmitStatus.SUBMITTING;
    let todo: Todo;
    try {
      todo = await this.todosService.create(listId, this.addTodoStore.title.trim());
    } catch {
      runInAction(() => {
        this.addTodoStore.status = SubmitStatus.ERROR;
      });
      return;
    }

    runInAction(() => {
      this.todosPresenter.addTodo(todo);
      this.addTodoStore.reset();
    });
  }
}
