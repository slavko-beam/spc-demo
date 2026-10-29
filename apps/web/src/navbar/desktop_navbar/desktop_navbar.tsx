import { observer } from 'mobx-react-lite';
import styles from '../navbar.module.css';

type Props = {
  listName: string | undefined;
  settingsPopover: React.JSX.Element;
};

export const DesktopNavbarView = observer(({ listName, settingsPopover }: Props) => (
  <header className={styles.navbar} data-testid="desktop-navbar">
    <span className={styles.brand}>SPC Todos</span>
    <span className={styles.tagline}>store · presenter · component</span>
    <span className={styles.current}>{listName}</span>
    {settingsPopover}
  </header>
));
