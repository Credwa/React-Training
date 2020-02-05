import BuildControls from 'components/Burger/BuildControls/BuildControls';
import Burger from 'components/Burger/Burger';
import OrderSummary from 'components/Burger/OrderSummary/OrderSummary';
import Modal from 'components/UI/Modal/Modal';
import Spinner from 'components/UI/Spinner/Spinner';
import Aux from 'hoc/Aux/Aux';
import withErrorHandler from 'hoc/withErrorHandler/withErrorHandler';
import React, { useCallback, useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import axios from 'services/axios-orders';
import * as actions from 'store/actions/index.action';

const BurgerBuilder = props => {
  const [purchasing, setPurchasing] = useState(false);

  const dispatch = useDispatch();
  const _ingredients = useSelector(state => state.burgerBuilder.ingredients);
  const _totalPrice = useSelector(state => state.burgerBuilder.totalPrice);
  const _error = useSelector(state => state.burgerBuilder.error);
  const _isAuthenticated = useSelector(state => state.auth.token);

  const onIngredientAdded = ingName => dispatch(actions.addIngredient(ingName));
  const onIngredientRemoved = ingName => dispatch(actions.removeIngredient(ingName));
  const onInitIngredients = useCallback(() => dispatch(actions.initIngredients()), [dispatch]);
  const onInitPurchase = () => dispatch(actions.purchaseInit());
  const onSetAuthRedirectPath = path => dispatch(actions.setAuthRedirectPath(path));

  useEffect(() => {
    onInitIngredients();
  }, [onInitIngredients]);

  const updatePurchaseState = ingredients => {
    const sum = Object.values(ingredients).reduce((accumulator, currentValue) => accumulator + currentValue, 0);
    return sum > 0;
  };

  const purchaseHandler = () => {
    if (_isAuthenticated) {
      setPurchasing(true);
    } else {
      onSetAuthRedirectPath('/checkout');
      props.history.push('/auth');
    }
  };

  const purchaseCancelHandler = () => {
    setPurchasing(false);
  };

  const purchaseContinueHandler = () => {
    // const queryParams = [];
    // for (let i in _ingredients) {
    //   queryParams.push(encodeURIComponent(i) + '=' + encodeURIComponent(_ingredients[i]));
    // }
    // queryParams.push('price=' + _totalPrice);
    // const queryString = queryParams.join('&');
    // props.history.push({ pathname: '/checkout', search: '?' + queryString });
    onInitPurchase();
    props.history.push('/checkout');
  };

  const disabledInfo = {
    ..._ingredients
  };
  for (let key in disabledInfo) {
    disabledInfo[key] = disabledInfo[key] <= 0;
  }
  let orderSummary = null;

  let burger = _error ? <p>Ingredients can't be loaded</p> : <Spinner />;
  if (_ingredients) {
    burger = (
      <Aux>
        <Burger ingredients={_ingredients} />
        <BuildControls
          ingredientAdded={onIngredientAdded}
          ingredientRemoved={onIngredientRemoved}
          disabled={disabledInfo}
          purchaseable={updatePurchaseState(_ingredients)}
          price={_totalPrice}
          orderBurger={purchaseHandler}
          isAuth={_isAuthenticated}
        />
      </Aux>
    );

    orderSummary = (
      <OrderSummary
        ingredients={_ingredients}
        purchaseCanceled={purchaseCancelHandler}
        purchaseContinued={purchaseContinueHandler}
        totalPrice={_totalPrice}
      />
    );
  }

  return (
    <Aux>
      <Modal show={purchasing} modalClosed={purchaseCancelHandler}>
        {orderSummary}
      </Modal>
      {burger}
    </Aux>
  );
};

export default withErrorHandler(BurgerBuilder, axios);
