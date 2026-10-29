import { beforeEach, describe, expect, it } from 'vitest';
import { mock, type MockProxy } from 'vitest-mock-extended';
import type { UiPresenter } from '../../ui/ui_presenter/ui_presenter.ts';
import { Density, Theme } from '../../ui/ui_store/ui_store.ts';
import { SettingsStore } from '../settings_store/settings_store.ts';
import { SettingsPresenter } from './settings_presenter.ts';

describe('SettingsPresenter', () => {
  let settingsStore: SettingsStore;
  let uiPresenter: MockProxy<UiPresenter>;
  let presenter: SettingsPresenter;

  beforeEach(() => {
    settingsStore = new SettingsStore();
    uiPresenter = mock<UiPresenter>();
    presenter = new SettingsPresenter(settingsStore, uiPresenter);
  });

  describe('toggleOpen', () => {
    it('should open the popover when it is closed', () => {
      presenter.toggleOpen();

      expect(settingsStore.isOpen).toBe(true);
    });

    it('should close the popover when it is open', () => {
      presenter.toggleOpen();
      presenter.toggleOpen();

      expect(settingsStore.isOpen).toBe(false);
    });
  });

  describe('close', () => {
    it('should close the popover', () => {
      presenter.toggleOpen();

      presenter.close();

      expect(settingsStore.isOpen).toBe(false);
    });
  });

  describe('setTheme', () => {
    it('should delegate to the ui presenter', () => {
      presenter.setTheme(Theme.DARK);

      expect(uiPresenter.setTheme).toHaveBeenCalledWith(Theme.DARK);
    });
  });

  describe('setDensity', () => {
    it('should delegate to the ui presenter', () => {
      presenter.setDensity(Density.COMPACT);

      expect(uiPresenter.setDensity).toHaveBeenCalledWith(Density.COMPACT);
    });
  });
});
