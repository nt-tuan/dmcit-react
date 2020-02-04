import React, { useState, Suspense, useCallback, useEffect } from 'react';
import { Redirect, Route, Switch } from 'react-router-dom';
import { Container } from 'reactstrap';
import { Icon, Button, Message, Dimmer, Loader, Segment } from 'semantic-ui-react';
//import { positions, Provider } from "react-alert";
import { PrivateRoute } from '../PrivateRoute'
import { userActions, alertActions } from '../../_actions';
//import { useSelector, useDispatch } from 'react-redux';
import { authentication as authenticationReducer } from '../../_reducers/authentication.reducer';
import { alert as alertReducer } from '../../_reducers/alert.reducer';
import { LayoutContext } from './LayoutContext';
import {
    AppAside,
    AppBreadcrumb,
    AppFooter,
    AppHeader,
    AppSidebar,
    AppSidebarFooter,
    AppSidebarForm,
    AppSidebarHeader,
    AppSidebarMinimizer,
    AppSidebarNav,
} from '@coreui/react';
// routes config
import routes from '../../routes';
const DefaultAside = React.lazy(() => import('./DefaultAside'));
const DefaultFooter = React.lazy(() => import('./DefaultFooter'));
const DefaultHeader = React.lazy(() => import('./DefaultHeader'));

//const AlertTemplate = ({ message, options, style, close }) => {
//  return (
//    <div style={{
//      ...alertStyle,
//      ...style,
//      backgroundColor: options.type === 'info'?'blue':options.type === 'success'?'green':'red'
//    }}>
//      {options.type === 'info' && <Icon name='info' />}
//      {options.type === 'success' && <Icon name='check' />}
//      {options.type === 'error' && <Icon name='exclamation' />}
//      <span style={{ flex: 2 }}>{message}</span>
//      <button onClick={close} style={buttonStyle}>
//        <Icon name='x' />
//      </button>
//    </div>
//  )
//}
function AbstractLayout(props) {
    const [auth, authDispatch] = React.useReducer(authenticationReducer, { authorizing: true, authenticating: true });
    const [alert, alertDispatch] = React.useReducer(alertReducer, {});
    const loading = () => <div className="animated fadeIn pt-1 text-center">Loading...</div>
    const signOut = (e) => {
        e.preventDefault()
        this.props.history.push('/login')
    }

    const showError = _ => alertDispatch(alertActions.error(_));
    const showSuccess = _ => alertDispatch(alertActions.success(_));
    const showLoading = () => alertDispatch(alertActions.loading());
    const showClear = () => alertDispatch(alertActions.clear());

    useEffect(() => {
        userActions.getMyRoles()(authDispatch);
        userActions.isAuthenticated()(authDispatch);
    }, []);

    return (
        <LayoutContext.Provider value={{ auth, authDispatch, alert, alertDispatch, showError, showSuccess, showLoading, showClear }}>
            <div className="app">
                <AppHeader fixed>
                    <Suspense fallback={loading()}>
                        <DefaultHeader />
                    </Suspense>
                </AppHeader>
                <div className="app-body">
                    {props.appSidebar}
                    <main className="main">
                        <AppBreadcrumb appRoutes={routes} />
                        <Container fluid>
                            {alert && alert.loading && <Dimmer page active={alert && alert.loading}>
                                <Loader />
                            </Dimmer>}
                            {alert && alert.messages && <Message
                                error={alert.type == 'error'}
                                warning={alert.type == 'warning'}
                                info={alert.type == 'info'}
                                list={alert.messages}
                                onDismiss={() => alertDispatch(alertActions.clear())}
                            />}
                            <Suspense fallback={loading()}>
                                <Switch>
                                    {routes.map((route, idx) => {
                                        if (route.requireRoles) {
                                            return <PrivateRoute
                                                key={idx}
                                                path={route.path}
                                                exact={route.exact}
                                                name={route.name}
                                                component={route.component}
                                                requireRoles={route.requireRoles}
                                            />
                                        }
                                        return route.component ? (
                                            <Route
                                                key={idx}
                                                path={route.path}
                                                exact={route.exact}
                                                name={route.name}
                                                render={(props) => {
                                                    let newprops;
                                                    if (route.params) {
                                                        newprops = { ...props, ...route.params };
                                                    } else {
                                                        newprops = { ...props };
                                                    }
                                                    return <route.component {...newprops} />;
                                                }} />
                                        ) : (null);
                                    })}
                                    <Redirect from="/" to="/dashboard" />
                                </Switch>
                            </Suspense>
                        </Container>

                    </main>

                </div>
                <AppFooter>
                    <Suspense fallback={loading()}>
                        <DefaultFooter />
                    </Suspense>
                </AppFooter>
            </div>
        </LayoutContext.Provider>
    );
}

export default AbstractLayout;
