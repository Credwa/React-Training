import Button from 'components/UI/Button/Button';
import Input from 'components/UI/Input/Input';
import Spinner from 'components/UI/Spinner/Spinner';
import React, { useEffect, useState } from 'react';
import { connect } from 'react-redux';
import { Redirect } from 'react-router-dom';
import * as actions from 'store/actions/index.action';
import styles from './Auth.module.css';

const mapStateToProps = state => ({
  _loading: state.auth.loading,
  _error: state.auth.error,
  _isAuthenticated: state.auth.token !== null,
  _buildingBurger: state.burgerBuilder.building,
  _authRedirectPath: state.auth.authRedirectPath
});

const mapDispatchToProps = dispatch => ({
  onAuth: (email, password, isSignUp) => dispatch(actions.auth(email, password, isSignUp)),
  onSetAuthRedirect: () => dispatch(actions.setAuthRedirectPath('/'))
});

const Auth = props => {
  const [authForm, setAuthForm] = useState({
    email: {
      elementType: 'input',
      elementConfig: {
        type: 'email',
        placeholder: 'Email'
      },
      value: '',
      validation: {
        required: true,
        isEmail: true
      },
      valid: false,
      dirty: false
    },
    password: {
      elementType: 'input',
      elementConfig: {
        type: 'password',
        placeholder: 'Password'
      },
      value: '',
      validation: {
        required: true,
        minLength: 6
      },
      valid: false,
      dirty: false
    }
  });

  const [isSignUp, setIsSignUp] = useState(true);
  const { onSetAuthRedirect, _buildingBurger, _authRedirectPath } = props;

  useEffect(() => {
    if (_buildingBurger && _authRedirectPath) {
      onSetAuthRedirect();
    }
  }, [onSetAuthRedirect, _buildingBurger, _authRedirectPath]);

  const checkValidity = (value, rules) => {
    return rules.required ? value.trim() !== '' : false;
  };

  const inputChangedHandler = (event, controlName) => {
    const updatedControls = {
      ...authForm,
      [controlName]: {
        ...authForm[controlName],
        value: event.target.value,
        valid: checkValidity(event.target.value, authForm[controlName].validation),
        touched: true
      }
    };
    setAuthForm(updatedControls);
  };

  const onSubmitHandler = event => {
    event.preventDefault();
    props.onAuth(authForm.email.value, authForm.password.value, isSignUp);
  };

  const switchAuthModeHandler = event => {
    event.preventDefault();
    setIsSignUp(!isSignUp);
  };

  const formElementsArray = [];
  for (let key in authForm) {
    formElementsArray.push({
      id: key,
      config: authForm[key]
    });
  }

  let form = formElementsArray.map(formElement => (
    <Input
      key={formElement.id}
      elementType={formElement.config.elementType}
      elementConfig={formElement.config.elementConfig}
      value={formElement.config.value}
      touched={formElement.config.touched}
      invalid={!formElement.config.valid}
      shouldValidate={formElement.config.validation}
      changed={event => inputChangedHandler(event, formElement.id)}
    />
  ));

  if (props._loading) {
    form = <Spinner />;
  }

  let errorMessage = null;
  if (props._error) {
    errorMessage = <p>{props._error.message}</p>;
  }

  let authRedirect = null;
  if (props._isAuthenticated) {
    authRedirect = <Redirect to={props._authRedirectPath} />;
  } else {
  }

  return (
    <div className={styles.Auth}>
      {authRedirect}
      {errorMessage}
      <form onSubmit={onSubmitHandler}>
        {form}
        <Button btnType="Success">{!isSignUp ? 'Sign in' : 'Sign up'}</Button>
        <Button btnType="Danger" clicked={switchAuthModeHandler}>
          Switch to {isSignUp ? 'Sign in' : 'Sign up'}
        </Button>
      </form>
    </div>
  );
};

export default connect(mapStateToProps, mapDispatchToProps)(Auth);
