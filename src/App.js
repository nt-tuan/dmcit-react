import React, { Component } from 'react';
import { HashRouter, Route, Switch } from 'react-router-dom';
// import { renderRoutes } from 'react-router-config';
import Loadable from 'react-loadable';
import { connect } from 'react-redux';
import { history } from './_helpers';
//import { Route } from './containers/PrivateRoute';
import './App.scss';

const loading = () => <div className="animated fadeIn pt-3 text-center">Loading...</div>;

// Containers
const DefaultLayout = Loadable({
  loader: () => import('./containers'),
  loading
});

const WorkflowLayout = Loadable({
  loader: () => import('./containers/DefaultLayout/WorkflowLayout'),
  loading
});

// Pages
const Login = Loadable({
  loader: () => import('./views/Pages/Login'),
  loading
});

const Logout = Loadable({
  loader: () => import('./views/Pages/Logout'),
  loading
});

const Register = Loadable({
  loader: () => import('./views/Pages/Register'),
  loading
});

const Page404 = Loadable({
  loader: () => import('./views/Pages/Page404'),
  loading
});

const Page401 = Loadable({
  loader: () => import('./views/Pages/Page401'),
  loading
});

const Page500 = Loadable({
  loader: () => import('./views/Pages/Page500'),
  loading
});

class _app extends Component {
  constructor(props) {
    super(props);

    history.listen((location, action) => {
      // clear alert on location change
      //this.props.clearAlerts();
    });
  }

  render() {
    return (
      <HashRouter history={history}>
        <Switch>
          <Route exact path="/login" name="Login Page" component={Login} />
          <Route exact path="/logout" name="Logout Page" component={Logout} />
          <Route exact path="/register" name="Register Page" component={Register} />
          <Route exact path="/404" name="Page 404" component={Page404} />
          <Route exact path="/500" name="Page 500" component={Page500} />
          <Route path='/workflows' name='Workflows' component={WorkflowLayout} />
          <Route path="/" name="Home" component={DefaultLayout} />
        </Switch>
      </HashRouter>
    );
  }
}

function mapState(state) {
  return state;
}

const actionCreators = {
}

const App = connect(mapState, actionCreators)(_app);
export default App;
