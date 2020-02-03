import * as actionTypes from 'store/actions/actionTypes';
import { updateObject } from 'services/utils';

const initialState = {
  orders: [],
  loading: false,
  purchased: false
};

const purchaseInit = (state, action) => updateObject(state, { purchased: false });

const purcharseBurgerStart = (state, action) => updateObject(state, { loading: true });

const purcharseBurgerSuccess = (state, action) => {
  const newOrder = updateObject(action.orderData, { id: action.orderId });
  return updateObject(state, { loading: false, purchased: true, orders: state.orders.concat(newOrder) });
};

const purcharseBurgerFailed = (state, action) => updateObject(state, { loading: false });

const fetchOrdersStart = (state, action) => updateObject(state, { loading: true });

const fetchOrdersSuccess = (state, action) => updateObject(state, { loading: false, orders: action.orders });

const fetchOrdersFail = (state, action) => updateObject(state, { loading: false });

const reducer = (state = initialState, action) => {
  switch (action.type) {
    case actionTypes.PURCHASE_INIT:
      return purchaseInit(state, action);

    case actionTypes.PURCHASE_BURGER_START:
      return purcharseBurgerStart(state, action);

    case actionTypes.PURCHASE_BURGER_SUCCESS:
      return purcharseBurgerSuccess(state, action);

    case actionTypes.PURCHASE_BURGER_FAILED:
      return purcharseBurgerFailed(state, action);

    case actionTypes.FETCH_ORDERS_START:
      return fetchOrdersStart(state, action);

    case actionTypes.FETCH_ORDERS_SUCCESS:
      return fetchOrdersSuccess(state, action);

    case actionTypes.FETCH_ORDERS_FAIL:
      return fetchOrdersFail(state, action);

    default:
      return state;
  }
};

export default reducer;
