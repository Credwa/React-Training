import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Redirect } from 'react-router-dom';

import Input from 'components/UI/Input/Input';
import Button from 'components/UI/Button/Button';
import styles from './Auth.module.css';
import Spinner from 'components/UI/Spinner/Spinner';
import * as actions from 'store/actions/index.action';

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

class Auth extends Component {
  state = {
    controls: {
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
    },
    isSignUp: true
  };

  componentDidMount() {
    if (this.props._buildingBurger && this.props._authRedirectPath) {
      this.props.onSetAuthRedirect();
    }
  }

  checkValidity(value, rules) {
    return rules.required ? value.trim() !== '' : false;
  }

  inputChangedHandler = (event, controlName) => {
    const updatedControls = {
      ...this.state.controls,
      [controlName]: {
        ...this.state.controls[controlName],
        value: event.target.value,
        valid: this.checkValidity(event.target.value, this.state.controls[controlName].validation),
        touched: true
      }
    };
    this.setState({ controls: updatedControls });
  };

  onSubmitHandler = event => {
    event.preventDefault();
    this.props.onAuth(this.state.controls.email.value, this.state.controls.password.value, this.state.isSignUp);
  };

  switchAuthModeHandler = event => {
    event.preventDefault();
    this.setState(prevState => {
      return { isSignUp: !prevState.isSignUp };
    });
  };

  render() {
    const formElementsArray = [];
    for (let key in this.state.controls) {
      formElementsArray.push({
        id: key,
        config: this.state.controls[key]
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
        changed={event => this.inputChangedHandler(event, formElement.id)}
      />
    ));

    if (this.props._loading) {
      form = <Spinner />;
    }

    let errorMessage = null;
    if (this.props._error) {
      errorMessage = <p>{this.props._error.message}</p>;
    }

    let authRedirect = null;
    if (this.props._isAuthenticated) {
      authRedirect = <Redirect to={this.props._authRedirectPath} />;
    } else {
    }

    return (
      <div className={styles.Auth}>
        {authRedirect}
        {errorMessage}
        <form onSubmit={this.onSubmitHandler}>
          {form}
          <Button btnType="Success">{!this.state.isSignUp ? 'Sign in' : 'Sign up'}</Button>
          <Button btnType="Danger" clicked={this.switchAuthModeHandler}>
            Switch to {this.state.isSignUp ? 'Sign in' : 'Sign up'}
          </Button>
        </form>
      </div>
    );
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(Auth);
