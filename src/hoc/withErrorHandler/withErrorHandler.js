import Modal from 'components/UI/Modal/Modal';
import Aux from 'hoc/Aux/Aux';
import useHttpErrorHandler from 'hooks/http-error-handler';
import React from 'react';

const withErrorHandler = (WrappedComponent, axios) => {
  return props => {
    const [error, clearError] = useHttpErrorHandler(axios);

    return (
      <Aux>
        <Modal show={error} modalClosed={clearError}>
          {error ? error.message : null}
        </Modal>
        <WrappedComponent {...props} />
      </Aux>
    );
  };
};

export default withErrorHandler;
