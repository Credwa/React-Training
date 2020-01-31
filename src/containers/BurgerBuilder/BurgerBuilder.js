import React, { Component } from 'react';
import { connect } from 'react-redux';

import Aux from 'hoc/Aux/Aux';
import Burger from 'components/Burger/Burger';
import BuildControls from 'components/Burger/BuildControls/BuildControls';
import Modal from 'components/UI/Modal/Modal';
import OrderSummary from 'components/Burger/OrderSummary/OrderSummary';
import axios from 'services/axios-orders';
import Spinner from 'components/UI/Spinner/Spinner';
import withErrorHandler from 'hoc/withErrorHandler/withErrorHandler';
import * as actionTypes from 'store/actions';

class BurgerBuilder extends Component {
  state = {
    purchaseable: false,
    purchasing: false,
    loading: false,
    error: null
  };

  componentDidMount() {
    // axios
    //   .get('/ingredients.json')
    //   .then(res => {
    //     this.setState({ ingredients: res.data });
    //   })
    //   .catch(e => {
    //     this.setState({ error: true });
    //   });
  }

  updatePurchaseState(ingredients) {
    const sum = Object.values(ingredients).reduce((accumulator, currentValue) => accumulator + currentValue, 0);
    return sum > 0;
  }

  purchaseHandler = () => {
    this.setState({ purchasing: true });
  };

  purchaseCancelHandler = () => {
    this.setState({ purchasing: false });
  };

  purchaseContinueHandler = () => {
    // const queryParams = [];
    // for (let i in this.props._ingredients) {
    //   queryParams.push(encodeURIComponent(i) + '=' + encodeURIComponent(this.props._ingredients[i]));
    // }
    // queryParams.push('price=' + this.props._totalPrice);
    // const queryString = queryParams.join('&');
    // this.props.history.push({ pathname: '/checkout', search: '?' + queryString });
    this.props.history.push('/checkout');
  };

  render() {
    const disabledInfo = {
      ...this.props._ingredients
    };
    for (let key in disabledInfo) {
      disabledInfo[key] = disabledInfo[key] <= 0;
    }
    let orderSummary = null;

    let burger = this.state.error ? <p>Ingredients can't be loaded</p> : <Spinner />;
    if (this.props._ingredients) {
      burger = (
        <Aux>
          <Burger ingredients={this.props._ingredients} />
          <BuildControls
            ingredientAdded={this.props.onIngredientAdded}
            ingredientRemoved={this.props.onIngredientRemoved}
            disabled={disabledInfo}
            purchaseable={this.updatePurchaseState(this.props._ingredients)}
            price={this.props._totalPrice}
            orderBurger={this.purchaseHandler}
          />
        </Aux>
      );

      orderSummary = (
        <OrderSummary
          ingredients={this.props._ingredients}
          purchaseCanceled={this.purchaseCancelHandler}
          purchaseContinued={this.purchaseContinueHandler}
          totalPrice={this.props._totalPrice}
        />
      );

      if (this.state.loading) {
        orderSummary = <Spinner />;
      }
    }

    return (
      <Aux>
        <Modal show={this.state.purchasing} modalClosed={this.purchaseCancelHandler}>
          {orderSummary}
        </Modal>
        {burger}
      </Aux>
    );
  }
}

const mapStateToProps = state => ({
  _ingredients: state.ingredients,
  _totalPrice: state.totalPrice
});

const mapDispatchToProps = dispatch => ({
  onIngredientAdded: ingName => {
    dispatch({ type: actionTypes.ADD_INGREDIENT, ingredientName: ingName });
  },
  onIngredientRemoved: ingName => {
    dispatch({ type: actionTypes.REMOVE_INGREDIENT, ingredientName: ingName });
  }
});

export default connect(mapStateToProps, mapDispatchToProps)(withErrorHandler(BurgerBuilder, axios));
