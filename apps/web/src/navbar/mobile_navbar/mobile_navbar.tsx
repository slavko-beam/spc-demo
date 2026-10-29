import { observer } from 'mobx-react-lite';
import styles from '../navbar.module.css';

type Props = {
  listName: string | undefined;
  settingsPopover: React.JSX.Element;
};

export const MobileNavbarView = observer(({ listName, settingsPopover }: Props) => (
  <header className={`${styles.navbar} ${styles.mobile}`} data-testid="mobile-navbar">
    <span className={styles.brand}>SPC</span>
    <span className={styles.current}>{listName ?? 'Todos'}</span>
    {settingsPopover}
  </header>
));
