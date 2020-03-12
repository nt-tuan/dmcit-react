import React from 'react';

const SalesHome = React.lazy(() => import('./Home'));
const CustomerARView = React.lazy(() => import('./AR/ARsView'));
const CustomerPaymentsView = React.lazy(() => import('./AR/PaymentsView'));
const CustomerDetail = React.lazy(() => import('./Customers/CustomerDetail'));
const CustomerImport = React.lazy(() => import('./Customers/Import'));
const CustomerList = React.lazy(() => import('./Customers/Customers'));
//Report
const SalesByDistributors = React.lazy(() => import('./Reports/SalesByDistributors'));
const Invoices = React.lazy(() => import('./Reports/Invoices'));
const AccountingPeriodsSetting = React.lazy(
  () => import('./AR/APSetting')
    .then(module => ({ default: module.AccountingPeriodsSetting }))
);

// https://github.com/ReactTraining/react-router/tree/master/packages/react-router-config
const routes = [  
  { path: '/sales', exact: true, name: 'Sales', component: SalesHome, requireRoles: ['admin']},
  { path: '/sales/setting', exact: true, name: 'Sales setting', component: AccountingPeriodsSetting, requireRoles: ['admin']},
  { path: '/sales/reports', exact: true, name: 'Sales reports', component: SalesByDistributors, requireRoles: ['admin']},
  { path: '/sales/reports/invoices', exact: true, name: 'Invoices', component: Invoices, requireRoles: ['admin']},
  { path: '/sales/reports/ars', exact: true, name: 'Customer AR', component: CustomerARView, requireRoles: ['admin']},
  { path: '/sales/reports/payments', exact: true, name: 'Customer payments', component: CustomerPaymentsView, requireRoles: ['admin']},
  { path: '/sales/customers', exact: true, name: 'Customer List', component: CustomerList, requireRoles: ['sales.admin'] },
  { path: '/sales/customers/import', exact: true, name: 'Customer import', component: CustomerImport, requireRoles: ['sales.admin'] },
  { path: '/sales/customers/:id', exact: true, name: 'Customer detail', component: CustomerDetail, requireRoles: ['sales.admin']}
];

export default routes;
