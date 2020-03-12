import React, { useState, Suspense, useCallback, useEffect } from 'react';
import { Redirect, Route, Switch } from 'react-router-dom';
import { Container } from 'reactstrap';
import { Icon, Button, Message, Dimmer, Loader, Segment } from 'semantic-ui-react';
import { Layout, message } from 'antd';
//import { positions, Provider } from "react-alert";
import { PrivateRoute } from '../PrivateRoute'
import { userActions, alertActions } from '../../_actions';
//import { useSelector, useDispatch } from 'react-redux';
import { authentication as authenticationReducer } from '../../_reducers/authentication.reducer';
import { alert as alertReducer } from '../../_reducers/alert.reducer';
import { LayoutContext } from './LayoutContext';
import {
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
const { Header, Content, Sider } = Layout;
const DefaultSidebar = React.lazy(() => import('./DefaultSidebar'));
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
function AbstractLayout({ navigation }) {
    const [auth, authDispatch] = React.useReducer(authenticationReducer, { authorizing: true, authenticating: true });
    const [alert, alertDispatch] = React.useReducer(alertReducer, {});
    const loading = () => <div className="animated fadeIn pt-1 text-center">Loading...</div>
    const signOut = (e) => {
        e.preventDefault()
        this.props.history.push('/login')
    }

    const showError = _ => message.error(_, 10);
    const showSuccess = _ => message.success(_, 10);
    const showLoading = () => alertActions.loading()(alertDispatch);
    const showClear = () => alertActions.clear()(alertDispatch);

    useEffect(() => {
        userActions.getMyRoles()(authDispatch);
        userActions.isAuthenticated()(authDispatch);
    }, []);

    return (
        <LayoutContext.Provider value={{ auth, authDispatch, alert, alertDispatch, showError, showSuccess, showLoading, showClear }}>
            <div className="app">
                <Layout theme='light'>
                    <Suspense fallback={loading()}>
                        <DefaultHeader />
                    </Suspense>
                    <Layout them='light'>
                        <Suspense fallback={loading()}>
                            <DefaultSidebar navigation={navigation} />
                        </Suspense>
                        <Layout theme='light' style={{padding: '0 24px', background: '#fff'}}>
                        <AppBreadcrumb appRoutes={routes} />
                            <Content className="site-layout-content">
                                {alert && alert.loading && <Dimmer page active={alert && alert.loading}>
                                    <Loader />
                                </Dimmer>}
                                {/*alert && alert.messages && <Message
                                    error={alert.type == 'error'}
                                    warning={alert.type == 'warning'}
                                    info={alert.type == 'info'}
                                    list={alert.messages}
                                    onDismiss={() => alertDispatch(alertActions.clear())}
                                />*/}
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
                            </Content>
                        </Layout>
                    </Layout>
                </Layout>
                { /*<AppHeader fixed>
                    <Suspense fallback={loading()}>
                        <DefaultHeader />
                    </Suspense>
                </AppHeader>
                <div className="app-body">
                    <AppSidebar fixed display="lg">
                        <AppSidebarHeader />
                        <AppSidebarForm />
                        <Suspense>
                            <AppSidebarNav navConfig={props.navigation} {...props.extra} />
                        </Suspense>
                        <AppSidebarFooter />
                        <AppSidebarMinimizer />
                    </AppSidebar>
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
                </AppFooter> */}
            </div>
        </LayoutContext.Provider>
    );
}

export default AbstractLayout;
