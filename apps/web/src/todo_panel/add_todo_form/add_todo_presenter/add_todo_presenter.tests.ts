import { runInAction } from 'mobx';
import { beforeEach, describe, expect, it } from 'vitest';
import { mock, type MockProxy } from 'vitest-mock-extended';
import { SubmitStatus } from '../../../lib/submit_status.ts';
import type { TodosService } from '../../../services/todos_service.ts';
import { todoFixture } from '../../../test/fixtures.ts';
import type { TodosPresenter } from '../../todos_presenter/todos_presenter.ts';
import { TodosStore } from '../../todos_store/todos_store.ts';
import { AddTodoStore } from '../add_todo_store/add_todo_store.ts';
import { AddTodoPresenter } from './add_todo_presenter.ts';

describe('AddTodoPresenter', () => {
  let addTodoStore: AddTodoStore;
  let todosStore: TodosStore;
  let todosService: MockProxy<TodosService>;
  let todosPresenter: MockProxy<TodosPresenter>;
  let presenter: AddTodoPresenter;

  beforeEach(() => {
    addTodoStore = new AddTodoStore();
    todosStore = new TodosStore();
    todosService = mock<TodosService>();
    todosPresenter = mock<TodosPresenter>();
    presenter = new AddTodoPresenter(addTodoStore, todosStore, todosService, todosPresenter);
    runInAction(() => {
      todosStore.listId = 7;
    });
  });

  describe('setTitle', () => {
    it('should set the title', () => {
      presenter.setTitle('Lemons');

      expect(addTodoStore.title).toBe('Lemons');
    });

    it('should clear the error status when the previous submit failed', () => {
      runInAction(() => {
        addTodoStore.status = SubmitStatus.ERROR;
      });

      presenter.setTitle('Limes');

      expect(addTodoStore.status).toBe(SubmitStatus.IDLE);
    });
  });

  describe('submit', () => {
    it('should create a trimmed todo, hand it to the todos presenter and reset', async () => {
      const todo = todoFixture({ title: 'Lemons', listId: 7 });
      todosService.create.calledWith(7, 'Lemons').mockResolvedValue(todo);
      presenter.setTitle('  Lemons ');

      await presenter.submit();

      expect(todosPresenter.addTodo).toHaveBeenCalledWith(todo);
      expect(addTodoStore.title).toBe('');
      expect(addTodoStore.status).toBe(SubmitStatus.IDLE);
    });

    it('should be submitting while the request is in flight', () => {
      todosService.create.mockReturnValue(new Promise(() => {}));
      presenter.setTitle('Lemons');

      void presenter.submit();

      expect(addTodoStore.status).toBe(SubmitStatus.SUBMITTING);
    });

    it('should not submit when the title is blank', async () => {
      presenter.setTitle('   ');

      await presenter.submit();

      expect(todosService.create).not.toHaveBeenCalled();
    });

    it('should not submit when no list is selected', async () => {
      runInAction(() => {
        todosStore.listId = undefined;
      });
      presenter.setTitle('Lemons');

      await presenter.submit();

      expect(todosService.create).not.toHaveBeenCalled();
    });

    it('should keep the title and set the error status when the request fails', async () => {
      todosService.create.mockRejectedValue(new Error('boom'));
      presenter.setTitle('Lemons');

      await presenter.submit();

      expect(addTodoStore.title).toBe('Lemons');
      expect(addTodoStore.status).toBe(SubmitStatus.ERROR);
    });
  });
});
