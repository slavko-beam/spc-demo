import { makeAutoObservable } from 'mobx';

export class SettingsStore {
  isOpen = false;

  constructor() {
    makeAutoObservable(this);
  }

  reset() {
    this.isOpen = false;
  }
}
