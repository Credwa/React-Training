import React, { Component } from 'react';
import { connect } from 'react-redux';
import Order from 'components/Order/Order';
import axios from 'services/axios-orders';
import withErrorHandler from 'hoc/withErrorHandler/withErrorHandler';
import * as actions from 'store/actions/index.action';
import Spinner from 'components/UI/Spinner/Spinner';

class Orders extends Component {
  componentDidMount() {
    this.props.onFetchOrders(this.props._authToken, this.props._userId);
  }

  render() {
    let orders = <Spinner />;
    if (!this.props._loading) {
      orders = this.props._orders.map(order => (
        <Order ingredients={order.ingredients} price={order.price} key={order.id} />
      ));
    }
    return <div>{orders}</div>;
  }
}

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
