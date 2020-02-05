import SideDrawer from 'components/Navigation/SideDrawer/SideDrawer';
import Toolbar from 'components/Navigation/Toolbar/Toolbar';
import Aux from 'hoc/Aux/Aux';
import React, { useState } from 'react';
import { connect } from 'react-redux';
import styles from './Layout.module.css';

const Layout = props => {
  const [sideDrawerVisible, setSideDrawerVisible] = useState(false);

  const sideDrawerClosedHandler = () => {
    setSideDrawerVisible(false);
  };

  const sideDrawerToggleHandler = () => {
    setSideDrawerVisible(!sideDrawerVisible);
  };

  return (
    <Aux>
      <Toolbar isAuth={props.isAuthenticated} drawerToggleClicked={sideDrawerToggleHandler} />
      <SideDrawer isAuth={props.isAuthenticated} open={sideDrawerVisible} closed={sideDrawerClosedHandler} />
      <main className={styles.Content}>{props.children}</main>
    </Aux>
  );
};

const mapStateToProps = state => ({
  isAuthenticated: state.auth.token !== null
});

export default connect(mapStateToProps)(Layout);
