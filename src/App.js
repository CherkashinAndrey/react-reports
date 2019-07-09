import React, { Component } from 'react';
import { Route, Switch, withRouter, Redirect, BrowserRouter as Router } from 'react-router-dom';
import { connect } from 'react-redux';
import asyncComponent from './hoc/asyncComponent/asyncComponent';

import Layout from './hoc/Layout/Layout';
import BurgerBuilder from './containers/BurgerBuilder/BurgerBuilder';
import Logout from './containers/Auth/Logout/Logout';
import * as actions from './store/actions/index';

const asyncCheckout = asyncComponent(() => {
  return import('./containers/Checkout/Checkout');
});

const asyncOrders = asyncComponent(() => {
  return import('./containers/Orders/Orders');
});

const asyncAuth = asyncComponent(() => {
  return import('./containers/Auth/Auth');
});

class App extends Component {
  componentDidMount () {
    this.props.onTryAutoSignup();
  }

  render () {
    let routes = (
      <Router >
        <Switch>
          <Route path="/auth" component={asyncAuth} />
          <Route path="/arhive" component={BurgerBuilder} />
          <Route path="/reports" exact component={BurgerBuilder} />
          <Redirect to="/reports" />
        </Switch>
      </Router>
    );

    if ( this.props.isAuthenticated ) {
      routes = (
        <Router >
          <Switch >
            <Route path="/checkout" component={asyncCheckout} />
            <Route path="/orders" component={asyncOrders} />
            <Route path="/logout" component={Logout} />
            <Route path="/auth" component={asyncAuth} />
            <Route path="/arhive" component={BurgerBuilder} />
            <Route path="/reports" exact component={BurgerBuilder} />
            <Redirect to="/reports" />
          </Switch>
        </Router>
      );
    }

    return (
      <div>
        <Layout>
          {routes}
        </Layout>
      </div>
    );
  }
}

const mapStateToProps = state => {
  return {
    isAuthenticated: state.auth.token !== null
  };
};

const mapDispatchToProps = dispatch => {
  return {
    onTryAutoSignup: () => dispatch( actions.authCheckState() )
  };
};

export default withRouter( connect( mapStateToProps, mapDispatchToProps )( App ) );
