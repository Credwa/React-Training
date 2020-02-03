import React, { Component } from 'react';
import { connect } from 'react-redux';

import CheckoutSummary from 'components/Order/CheckoutSummary/CheckoutSummary';
import { Route, Redirect } from 'react-router-dom';
import ContactData from 'containers/Checkout/ContactData/ContactData';
class Checkout extends Component {
  componentWillMount() {
    // const query = new URLSearchParams(this.props.location.search);
    // const ingredients = {};
    // let price = 0;
    // for (let param of query.entries()) {
    //   if (param[0] === 'price') {
    //     price = param[1];
    //   } else {
    //     ingredients[param[0]] = Number(param[1]);
    //   }
    // }
    // this.setState({ ingredients, price: price });
  }

  checkoutCancelledHandler = () => {
    this.props.history.goBack();
  };

  checkoutContinuedHandler = () => {
    this.props.history.replace('/checkout/contact-data');
  };

  render() {
    let summary = <Redirect to="/" />;

    if (this.props._ingredients) {
      const purchasedRedirect = this.props._purchased ? <Redirect to="/" /> : null;
      summary = (
        <div>
          {purchasedRedirect}
          <CheckoutSummary
            ingredients={this.props._ingredients}
            checkoutCancelled={this.checkoutCancelledHandler}
            checkoutContinued={this.checkoutContinuedHandler}
          />
          <Route path={this.props.match.path + '/contact-data'} component={ContactData} />
        </div>
      );
    }

    return summary;
  }
}

const mapStateToProps = state => ({
  _ingredients: state.burgerBuilder.ingredients,
  _totalPrice: state.burgerBuilder.totalPrice,
  _purchased: state.order.purchased
});

export default connect(mapStateToProps)(Checkout);
