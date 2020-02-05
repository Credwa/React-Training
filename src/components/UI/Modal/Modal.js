import Backdrop from 'components/UI/Backdrop/Backdrop';
import Aux from 'hoc/Aux/Aux';
import React from 'react';
import styles from './Modal.module.css';

const Modal = props => {
  // shouldComponentUpdate(nextProps, nextState) {
  //   return nextProps.show !== props.show || nextProps.children !== props.children;
  // }

  return (
    <Aux>
      <Backdrop show={props.show} onBackdropClicked={props.modalClosed} />
      <div
        className={styles.Modal}
        style={{
          transform: props.show ? 'translateY(0)' : 'translateY(-100vh)',
          opacity: props.show ? 1 : 0
        }}
      >
        {props.children}
      </div>
    </Aux>
  );
};

export default React.memo(
  Modal,
  (prevProps, nextProps) => nextProps.show === prevProps.show && nextProps.children === prevProps.children
);
