import { makeAutoObservable } from 'mobx';

// Mirrors the URL and nothing else: features derive their own meaning from `params`.
export class RouterStore {
  pathname = '/';
  params: Record<string, string | undefined> = {};

  constructor() {
    makeAutoObservable(this);
  }

  reset() {
    this.pathname = '/';
    this.params = {};
  }
}
