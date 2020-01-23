import React from 'react';
import styles from './Toolbar.module.css';
import Logo from 'components/Logo/Logo';
import NavigationItems from 'components/Navigation/NavigationItems/NavigationItems';
import DrawerToggle from 'components/Navigation/SideDrawer/DrawerToggle/DrawerToggle';

const toolbar = props => (
  <header className={styles.Toolbar}>
    <DrawerToggle clicked={props.drawerToggleClicked} />
    <div className={[styles.Logo, styles.DesktopOnly].join(' ')}>
      <Logo />
    </div>
    <nav className={styles.DesktopOnly}>
      <NavigationItems />
    </nav>
  </header>
);

export default toolbar;
