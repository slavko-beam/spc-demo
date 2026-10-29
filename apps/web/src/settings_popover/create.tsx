import { observer } from 'mobx-react-lite';
import type { UiPresenter } from '../ui/ui_presenter/ui_presenter.ts';
import type { UiStore } from '../ui/ui_store/ui_store.ts';
import { SettingsPopoverView } from './settings_popover.tsx';
import { SettingsPresenter } from './settings_presenter/settings_presenter.ts';
import { SettingsStore } from './settings_store/settings_store.ts';

type Deps = {
  uiStore: UiStore;
  uiPresenter: UiPresenter;
};

export const createSettingsPopover = ({ uiStore, uiPresenter }: Deps) => {
  const settingsStore = new SettingsStore();
  const settingsPresenter = new SettingsPresenter(settingsStore, uiPresenter);

  return observer(() => (
    <SettingsPopoverView
      isOpen={settingsStore.isOpen}
      theme={uiStore.theme}
      density={uiStore.density}
      onToggleOpen={settingsPresenter.toggleOpen}
      onClose={settingsPresenter.close}
      onThemeChange={settingsPresenter.setTheme}
      onDensityChange={settingsPresenter.setDensity}
    />
  ));
};
