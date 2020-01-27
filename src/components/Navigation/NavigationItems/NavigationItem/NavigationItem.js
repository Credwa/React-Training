import React from 'react';
import styles from './NavigationItem.module.css';
import { NavLink } from 'react-router-dom';
import classes from './NavigationItem.module.css';

const navigationItem = props => (
  <li className={styles.NavigationItem}>
    <NavLink to={props.link} exact activeClassName={classes.active}>
      {props.children}
    </NavLink>
  </li>
);

export default navigationItem;
