import React, { Component } from 'react';
import { connect } from 'react-redux';

import withErrorHandler from 'hoc/withErrorHandler/withErrorHandler';
import Button from 'components/UI/Button/Button';
import styles from './ContactData.module.css';
import axios from 'services/axios-orders';
import Spinner from 'components/UI/Spinner/Spinner';
import Input from 'components/UI/Input/Input';
class ContactData extends Component {
  state = {
    orderForm: {
      name: {
        elementType: 'input',
        elementConfig: {
          type: 'text',
          placeholder: 'Name'
        },
        value: '',
        validation: {
          required: true
        },
        valid: false,
        dirty: false
      },
      street: {
        elementType: 'input',
        elementConfig: {
          type: 'text',
          placeholder: 'Street'
        },
        value: '',
        validation: {
          required: true
        },
        valid: false,
        dirty: false
      },
      zip: {
        elementType: 'input',
        elementConfig: {
          type: 'text',
          placeholder: 'Zipcode'
        },
        value: '',
        validation: {
          required: true
        },
        valid: false,
        dirty: false
      },
      country: {
        elementType: 'input',
        elementConfig: {
          type: 'text',
          placeholder: 'Country'
        },
        value: '',
        validation: {
          required: true
        },
        valid: false,
        dirty: false
      },
      email: {
        elementType: 'email',
        elementConfig: {
          type: 'text',
          placeholder: 'Email'
        },
        value: '',
        validation: {
          required: true
        },
        valid: false,
        dirty: false
      },
      deliveryMethod: {
        elementType: 'select',
        elementConfig: {
          options: [
            { value: 'fastest', displayValue: 'Fastest' },
            { value: 'cheapest', displayValue: 'Cheapest' }
          ]
        },
        value: 'fastest',
        validation: {},
        valid: true
      }
    },
    isFormValid: false,
    loading: false
  };

  checkValidity(value, rules) {
    return rules.required ? value.trim() !== '' : false;
  }

  orderHandler = event => {
    event.preventDefault();
    this.setState({ loading: true });
    const formData = {};
    for (let formElementIdentifier in this.state.orderForm) {
      formData[formElementIdentifier] = this.state.orderForm[formElementIdentifier].value;
    }

    const order = {
      ingredients: this.props._ingredients,
      price: this.props._totalPrice,
      orderData: formData
    };
    axios
      .post('/orders.json', order)
      .then(response => {
        this.setState({ loading: false });
        this.props.history.push('/');
      })
      .catch(e => {
        this.setState({ loading: false });
      });
  };

  inputChangedHandler = (event, inputIdentifier) => {
    const updatedOrderForm = {
      ...this.state.orderForm
    };
    const updatedFormElement = { ...updatedOrderForm[inputIdentifier] };

    updatedFormElement.value = event.target.value;
    updatedFormElement.touched = true;
    updatedFormElement.valid = this.checkValidity(updatedFormElement.value, updatedFormElement.validation);
    updatedOrderForm[inputIdentifier] = updatedFormElement;

    let isFormValid = true;
    for (let inputIdentifier in updatedOrderForm) {
      isFormValid = updatedOrderForm[inputIdentifier].valid && isFormValid;
    }
    this.setState({ orderForm: updatedOrderForm, isFormValid: isFormValid });
  };

  render() {
    const formElementsArray = [];
    for (let key in this.state.orderForm) {
      formElementsArray.push({
        id: key,
        config: this.state.orderForm[key]
      });
    }
    let form = (
      <form onSubmit={this.orderHandler}>
        {formElementsArray.map(formElement => (
          <Input
            elementType={formElement.config.elementType}
            elementConfig={formElement.config.elementConfig}
            value={formElement.config.value}
            key={formElement.id}
            touched={formElement.config.touched}
            invalid={!formElement.config.valid}
            shouldValidate={formElement.config.validation}
            changed={event => this.inputChangedHandler(event, formElement.id)}
          />
        ))}
        <Button btnType="Success" disabled={!this.state.isFormValid}>
          ORDER
        </Button>
      </form>
    );

    if (this.state.loading) {
      form = <Spinner />;
    }
    return (
      <div className={styles.ContactData}>
        <h4>Enter your contact data</h4>
        {form}
      </div>
    );
  }
}

const mapStateToProps = state => ({
  _ingredients: state.ingredients,
  _totalPrice: state.totalPrice
});

export default connect(mapStateToProps)(withErrorHandler(ContactData, axios));