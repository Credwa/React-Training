import CheckoutSummary from 'components/Order/CheckoutSummary/CheckoutSummary';
import ContactData from 'containers/Checkout/ContactData/ContactData';
import React from 'react';
import { connect } from 'react-redux';
import { Redirect, Route } from 'react-router-dom';

const Checkout = props => {
  const checkoutCancelledHandler = () => {
    props.history.goBack();
  };

  const checkoutContinuedHandler = () => {
    props.history.replace('/checkout/contact-data');
  };

  let summary = <Redirect to="/" />;

  if (props._ingredients) {
    const purchasedRedirect = props._purchased ? <Redirect to="/" /> : null;
    summary = (
      <div>
        {purchasedRedirect}
        <CheckoutSummary
          ingredients={props._ingredients}
          checkoutCancelled={checkoutCancelledHandler}
          checkoutContinued={checkoutContinuedHandler}
        />
        <Route path={props.match.path + '/contact-data'} component={ContactData} />
      </div>
    );
  }

  return summary;
};

const mapStateToProps = state => ({
  _ingredients: state.burgerBuilder.ingredients,
  _totalPrice: state.burgerBuilder.totalPrice,
  _purchased: state.order.purchased
});

export default connect(mapStateToProps)(Checkout);
