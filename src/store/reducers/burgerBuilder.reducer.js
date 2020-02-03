import * as actionTypes from 'store/actions/actionTypes';
import { updateObject } from 'services/utils';

const INGREDIENT_PRICES = {
  salad: 0.5,
  cheese: 0.4,
  meat: 1.3,
  bacon: 0.7
};

const initialState = {
  ingredients: null,
  totalPrice: 4,
  error: false,
  building: false
};

const addIngredient = (state, action) => {
  const updatedState = {
    ingredients: updateObject(state.ingredients, {
      [action.ingredientName]: state.ingredients[action.ingredientName] + 1
    }),
    totalPrice: state.totalPrice + INGREDIENT_PRICES[action.ingredientName],
    building: true
  };
  return updateObject(state, updatedState);
};

const removeIngredient = (state, action) => {
  const updatedState = {
    ingredients: updateObject(state.ingredients, {
      [action.ingredientName]: state.ingredients[action.ingredientName] - 1
    }),
    totalPrice: state.totalPrice + INGREDIENT_PRICES[action.ingredientName],
    building: true
  };
  return updateObject(state, updatedState);
};

const setIngredients = (state, action) =>
  updateObject(state, { ingredients: action.ingredients, totalPrice: 4, error: false, building: false });

const fetchIngredientsFailed = (state, action) => updateObject(state, { error: true });

const reducer = (state = initialState, action) => {
  switch (action.type) {
    case actionTypes.ADD_INGREDIENT:
      return addIngredient(state, action);

    case actionTypes.REMOVE_INGREDIENT:
      return removeIngredient(state, action);

    case actionTypes.SET_INGREDIENTS:
      return setIngredients(state, action);

    case actionTypes.FETCH_INGREDIENTS_FAILED:
      return fetchIngredientsFailed(state);

    default:
      return state;
  }
};

export default reducer;
