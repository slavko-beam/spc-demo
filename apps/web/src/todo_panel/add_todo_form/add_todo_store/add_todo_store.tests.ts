import { runInAction } from 'mobx';
import { beforeEach, describe, expect, it } from 'vitest';
import { SubmitStatus } from '../../../lib/submit_status.ts';
import { AddTodoStore } from './add_todo_store.ts';

describe('AddTodoStore', () => {
  let store: AddTodoStore;

  beforeEach(() => {
    store = new AddTodoStore();
  });

  describe('canSubmit', () => {
    it.each([
      ['Lemons', SubmitStatus.IDLE],
      ['Lemons', SubmitStatus.ERROR],
    ])('should return true when the title is %j and the status is %s', (title, status) => {
      runInAction(() => {
        store.title = title;
        store.status = status;
      });

      expect(store.canSubmit).toBe(true);
    });

    it.each([
      ['', SubmitStatus.IDLE],
      ['   ', SubmitStatus.IDLE],
      ['Lemons', SubmitStatus.SUBMITTING],
    ])('should return false when the title is %j and the status is %s', (title, status) => {
      runInAction(() => {
        store.title = title;
        store.status = status;
      });

      expect(store.canSubmit).toBe(false);
    });
  });

  describe('reset', () => {
    it('should clear the title and status', () => {
      runInAction(() => {
        store.title = 'Lemons';
        store.status = SubmitStatus.ERROR;
        store.reset();
      });

      expect(store.title).toBe('');
      expect(store.status).toBe(SubmitStatus.IDLE);
    });
  });
});
