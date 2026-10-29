import { observer } from 'mobx-react-lite';
import { Density, Theme } from '../ui/ui_store/ui_store.ts';
import styles from './settings_popover.module.css';

type Props = {
  isOpen: boolean;
  theme: Theme;
  density: Density;
  onToggleOpen: () => void;
  onClose: () => void;
  onThemeChange: (theme: Theme) => void;
  onDensityChange: (density: Density) => void;
};

export const SettingsPopoverView = observer(
  ({ isOpen, theme, density, onToggleOpen, onClose, onThemeChange, onDensityChange }: Props) => (
    <div className={styles.root}>
      <button type="button" aria-expanded={isOpen} aria-haspopup="dialog" onClick={onToggleOpen}>
        Settings
      </button>
      {isOpen && (
        <div
          className={styles.panel}
          role="dialog"
          aria-label="Settings"
          onKeyDown={(event) => event.key === 'Escape' && onClose()}
        >
          <label className={styles.field}>
            Theme
            <select
              value={theme}
              onChange={(event) => onThemeChange(Number(event.target.value) as Theme)}
            >
              <option value={Theme.LIGHT}>Light</option>
              <option value={Theme.DARK}>Dark</option>
            </select>
          </label>
          <label className={styles.field}>
            Density
            <select
              value={density}
              onChange={(event) => onDensityChange(Number(event.target.value) as Density)}
            >
              <option value={Density.COMFORTABLE}>Comfortable</option>
              <option value={Density.COMPACT}>Compact</option>
            </select>
          </label>
          <button type="button" onClick={onClose}>
            Done
          </button>
        </div>
      )}
    </div>
  ),
);
