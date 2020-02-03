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
import * as actions from 'store/actions/index.action';

class BurgerBuilder extends Component {
  state = {
    purchaseable: false,
    purchasing: false
  };

  componentDidMount() {
    this.props.onInitIngredients();
  }

  updatePurchaseState(ingredients) {
    const sum = Object.values(ingredients).reduce((accumulator, currentValue) => accumulator + currentValue, 0);
    return sum > 0;
  }

  purchaseHandler = () => {
    if (this.props._isAuthenticated) {
      this.setState({ purchasing: true });
    } else {
      this.props.onSetAuthRedirectPath('/checkout');
      this.props.history.push('/auth');
    }
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
    this.props.onInitPurchase();
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

    let burger = this.props._error ? <p>Ingredients can't be loaded</p> : <Spinner />;
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
            isAuth={this.props._isAuthenticated}
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
  _ingredients: state.burgerBuilder.ingredients,
  _totalPrice: state.burgerBuilder.totalPrice,
  _error: state.burgerBuilder.error,
  _isAuthenticated: state.auth.token
});

const mapDispatchToProps = dispatch => ({
  onIngredientAdded: ingName => dispatch(actions.addIngredient(ingName)),
  onIngredientRemoved: ingName => dispatch(actions.removeIngredient(ingName)),
  onInitIngredients: () => dispatch(actions.initIngredients()),
  onInitPurchase: () => dispatch(actions.purchaseInit()),
  onSetAuthRedirectPath: path => dispatch(actions.setAuthRedirectPath(path))
});

export default connect(mapStateToProps, mapDispatchToProps)(withErrorHandler(BurgerBuilder, axios));
