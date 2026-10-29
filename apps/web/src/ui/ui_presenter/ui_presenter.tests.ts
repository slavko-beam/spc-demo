import { beforeEach, describe, expect, it } from 'vitest';
import { mock, type MockProxy } from 'vitest-mock-extended';
import type { ViewportService } from '../../services/viewport_service.ts';
import { Density, Theme, UiStore } from '../ui_store/ui_store.ts';
import { UiPresenter } from './ui_presenter.ts';

describe('UiPresenter', () => {
  let uiStore: UiStore;
  let viewportService: MockProxy<ViewportService>;
  let presenter: UiPresenter;
  let emitViewportChange: (isMobile: boolean) => void;

  beforeEach(() => {
    uiStore = new UiStore();
    viewportService = mock<ViewportService>();
    viewportService.onChange.mockImplementation((listener) => {
      emitViewportChange = listener;
      return () => {};
    });
    presenter = new UiPresenter(uiStore, viewportService);
  });

  describe('watchViewport', () => {
    it('should apply the current viewport', () => {
      viewportService.isMobile.mockReturnValue(true);

      presenter.watchViewport();

      expect(uiStore.isMobile).toBe(true);
    });

    it('should follow viewport changes', () => {
      viewportService.isMobile.mockReturnValue(true);
      presenter.watchViewport();

      emitViewportChange(false);

      expect(uiStore.isMobile).toBe(false);
    });
  });

  describe('setTheme', () => {
    it('should set the theme', () => {
      presenter.setTheme(Theme.DARK);

      expect(uiStore.theme).toBe(Theme.DARK);
    });
  });

  describe('setDensity', () => {
    it('should set the density', () => {
      presenter.setDensity(Density.COMPACT);

      expect(uiStore.density).toBe(Density.COMPACT);
    });
  });
});
