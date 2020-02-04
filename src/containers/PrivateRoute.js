import React, { useEffect, useCallback } from 'react';
import { Route, Redirect } from 'react-router-dom';
import {LayoutContext} from './DefaultLayout/LayoutContext';

export const PrivateRoute = ({ component: Component, requireRoles, ...rest }) => {
  const state = React.useContext(LayoutContext);
  

  function checkAuthorize() {
    const {roles } = state.auth;
    if (requireRoles && requireRoles.length > 0) {
      if (roles && roles.length > 0) {
        const f = requireRoles.filter(u => roles.filter(v => v.name == u).length > 0);
        return f.length > 0;
      } else {
        return false;
      }
    }
    return true;
  }

  const loading = () => <div className="animated fadeIn pt-1 text-center">Loading...</div>

  const authorize = checkAuthorize();

  return (<Route {...rest} render={props => {
    if (state.auth.authorizing || state.auth.authenticating) {
      return loading();
    }
    if (!state.auth.user) {
      return <Redirect to={{ pathname: '/login', state: { from: props.location } }} />
    } else if (authorize) {
      return <Component {...props} />
    } else {
      return <Redirect to={{ pathname: '/401', state: { from: props.location } }} />
    }
  }} />
  )
}
