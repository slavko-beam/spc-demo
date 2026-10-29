import { makeAutoObservable } from 'mobx';
import type { Density, Theme } from '../../ui/ui_store/ui_store.ts';
import type { UiPresenter } from '../../ui/ui_presenter/ui_presenter.ts';
import type { SettingsStore } from '../settings_store/settings_store.ts';

export class SettingsPresenter {
  constructor(
    private readonly settingsStore: SettingsStore,
    private readonly uiPresenter: UiPresenter,
  ) {
    makeAutoObservable(this, {}, { autoBind: true });
  }

  toggleOpen() {
    this.settingsStore.isOpen = !this.settingsStore.isOpen;
  }

  close() {
    this.settingsStore.isOpen = false;
  }

  setTheme(theme: Theme) {
    this.uiPresenter.setTheme(theme);
  }

  setDensity(density: Density) {
    this.uiPresenter.setDensity(density);
  }
}
