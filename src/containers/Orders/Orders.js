import Order from 'components/Order/Order';
import Spinner from 'components/UI/Spinner/Spinner';
import withErrorHandler from 'hoc/withErrorHandler/withErrorHandler';
import React, { useEffect } from 'react';
import { connect } from 'react-redux';
import axios from 'services/axios-orders';
import * as actions from 'store/actions/index.action';

const Orders = props => {
  const { _authToken, _userId, onFetchOrders } = props;

  useEffect(() => {
    onFetchOrders(_authToken, _userId);
  }, [_authToken, _userId, onFetchOrders]);

  let orders = <Spinner />;
  if (!props._loading) {
    orders = props._orders.map(order => <Order ingredients={order.ingredients} price={order.price} key={order.id} />);
  }
  return <div>{orders}</div>;
};

const mapStateToProps = state => ({
  _orders: state.order.orders,
  _loading: state.order.loading,
  _authToken: state.auth.token,
  _userId: state.auth.userId
});

const mapDispatchToProps = dispatch => ({
  onFetchOrders: (token, userId) => dispatch(actions.fetchOrders(token, userId))
});

export default connect(mapStateToProps, mapDispatchToProps)(withErrorHandler(Orders, axios));
