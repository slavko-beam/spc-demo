import { makeAutoObservable } from 'mobx';

export enum Theme {
  LIGHT,
  DARK,
}

export enum Density {
  COMFORTABLE,
  COMPACT,
}

export class UiStore {
  isMobile = false;
  theme = Theme.LIGHT;
  density = Density.COMFORTABLE;

  constructor() {
    makeAutoObservable(this);
  }

  reset() {
    this.isMobile = false;
    this.theme = Theme.LIGHT;
    this.density = Density.COMFORTABLE;
  }
}
