import { makeAutoObservable } from 'mobx';
import { SubmitStatus } from '../../../lib/submit_status.ts';

export class AddTodoStore {
  title = '';
  status = SubmitStatus.IDLE;

  constructor() {
    makeAutoObservable(this);
  }

  get canSubmit(): boolean {
    return this.title.trim().length > 0 && this.status !== SubmitStatus.SUBMITTING;
  }

  reset() {
    this.title = '';
    this.status = SubmitStatus.IDLE;
  }
}
