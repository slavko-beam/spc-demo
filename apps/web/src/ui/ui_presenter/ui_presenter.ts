import { makeAutoObservable } from 'mobx';
import type { ViewportService } from '../../services/viewport_service.ts';
import type { Density, Theme, UiStore } from '../ui_store/ui_store.ts';

export class UiPresenter {
  constructor(
    private readonly uiStore: UiStore,
    private readonly viewportService: ViewportService,
  ) {
    makeAutoObservable(this, {}, { autoBind: true });
  }

  watchViewport() {
    this.setIsMobile(this.viewportService.isMobile());
    this.viewportService.onChange(this.setIsMobile);
  }

  setIsMobile(isMobile: boolean) {
    this.uiStore.isMobile = isMobile;
  }

  setTheme(theme: Theme) {
    this.uiStore.theme = theme;
  }

  setDensity(density: Density) {
    this.uiStore.density = density;
  }
}
