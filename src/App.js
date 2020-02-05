import Logout from 'containers/Auth/Logout/Logout';
import BurgerBuilder from 'containers/BurgerBuilder/BurgerBuilder';
import Layout from 'hoc/Layout/Layout';
import React, { Suspense, useEffect } from 'react';
import { connect } from 'react-redux';
import { Redirect, Route, Switch, withRouter } from 'react-router-dom';
import * as actions from 'store/actions/index.action';

const Checkout = React.lazy(() => import('containers/Checkout/Checkout'));
const Orders = React.lazy(() => import('containers/Orders/Orders.js'));
const Auth = React.lazy(() => import('containers/Auth/Auth'));

const App = props => {
  const { onTryAutoSignup } = props;

  useEffect(() => {
    onTryAutoSignup();
  }, [onTryAutoSignup]);

  let routes = (
    <Switch>
      <Route path="/auth" render={props => <Auth {...props} />} />
      <Route path="/" exact component={BurgerBuilder} />
      <Redirect to="/" />
    </Switch>
  );

  if (props._isAuthenticated) {
    routes = (
      <>
        <Switch>
          <Route path="/checkout" render={props => <Checkout {...props} />} />
          <Route path="/orders" render={props => <Orders {...props} />} />
          <Route path="/logout" component={Logout} />
          <Route path="/auth" render={props => <Auth {...props} />} />
          <Route path="/" exact component={BurgerBuilder} />
          <Redirect to="/" />
        </Switch>
      </>
    );
  }
  return (
    <div>
      <Layout>
        <Suspense fallback={<p>Loading...</p>}>{routes}</Suspense>
      </Layout>
    </div>
  );
};

const mapStateToProps = state => ({
  _isAuthenticated: state.auth.token !== null
});

const mapDispatchToProps = dispatch => ({
  onTryAutoSignup: () => dispatch(actions.authCheckState())
});

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(App));
