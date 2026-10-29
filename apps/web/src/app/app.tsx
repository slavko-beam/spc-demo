import { observer } from 'mobx-react-lite';
import { Density, Theme } from '../ui/ui_store/ui_store.ts';
import styles from './app.module.css';

type Props = {
  theme: Theme;
  density: Density;
  navbar: React.JSX.Element;
  sidebar: React.JSX.Element;
  main: React.JSX.Element;
};

const THEME_ATTRIBUTES: Record<Theme, string> = {
  [Theme.LIGHT]: 'light',
  [Theme.DARK]: 'dark',
};

const DENSITY_ATTRIBUTES: Record<Density, string> = {
  [Density.COMFORTABLE]: 'comfortable',
  [Density.COMPACT]: 'compact',
};

export const AppLayoutView = observer(({ theme, density, navbar, sidebar, main }: Props) => (
  <div
    className={styles.root}
    data-theme={THEME_ATTRIBUTES[theme]}
    data-density={DENSITY_ATTRIBUTES[density]}
  >
    {navbar}
    <div className={styles.body}>
      <aside>{sidebar}</aside>
      <main>{main}</main>
    </div>
  </div>
));
