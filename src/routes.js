import React from 'react';
import DefaultLayout from './containers/DefaultLayout';
import EmployeeDetails from './views/Employees/EmployeeDetailView';
import WorkflowRoutes from './views/Workflows/routes';
import SupportRequestRoutes from './_modules/SupportRequest/routes';
const Dashboard = React.lazy(() => import('./views/Dashboard'));

const Page404 = React.lazy(() => import('./views/Pages/Page404'));
const Page401 = React.lazy(() => import('./views/Pages/Page401'));

//SETTINGS
const GeneralSetting = React.lazy(
  () => import('./views/Settings/GeneralSetting')
    .then(module => ({ default: module.GeneralSetting }))
);
const AccountingPeriodsSetting = React.lazy(
  () => import('./views/Settings/AccountingPeriodSetting')
    .then(module => ({ default: module.AccountingPeriodsSetting }))
);
const ServerSetting = React.lazy(() => import('./views/Settings/ServersSetting').then(module => ({ default: module.ServersSetting })));
const MessagingSetting = React.lazy(() => import('./views/Settings/MessagingSetting')
  .then(module => ({ default: module.MessagingSetting }))
);

const ProcessManager = React.lazy(() => import('./views/Settings/ProcessManager')
  .then(module => ({ default: module.ProcessManager }))
);
const TemplateSetting = React.lazy(() => import('./views/Settings/Templates/Templates'));

const Employees = React.lazy(() => import('./views/Employees/Employees'));
const EmployeeImport = React.lazy(() => import('./views/Employees/Components/Import.js'));

const DepartmentDetail = React.lazy(() => import('./views/Departments/DepartmentDetailsView'));
const DepartmentUpdate = React.lazy(() => import('./views/Departments/DepartmentUpdateView'));
const DepartmentsList = React.lazy(() => import('./views/Departments/Departments'));
const DepartmentImport = React.lazy(() => import('./views/Departments/Components/Import'));
const AccountDetails = React.lazy(() => import('./views/Accounts/Components/Detail'));
const AddAccount = React.lazy(() => import('./views/Accounts/Components/Add'));
const Accounts = React.lazy(() => import('./views/Accounts/Accounts'));

const CustomerDetail = React.lazy(() => import('./views/Sales/Customers/CustomerDetail'));
const CustomerImport = React.lazy(() => import('./views/Sales/Customers/Import'));
const CustomerList = React.lazy(() => import('./views/Sales/Customers/Customers'));

const Receivers = React.lazy(() => import('./views/Receivers/Receivers'));
const ReceiverImport = React.lazy(() => import('./views/Receivers/Components/Import'));

const Groups = React.lazy(() => import('./views/ReceiverGroups/Groups'));
const AddGroup = React.lazy(() => import('./views/ReceiverGroups/Add'));
const EditGroup = React.lazy(() => import('./views/ReceiverGroups/Edit'));

//COMPOSEMESSAGE
const ComposeCustomMessage = React.lazy(() => import('./views/Messaging/CustomCompose'));
const ARMessageTemplate = React.lazy(() => import('./views/Messaging/Components/ARMessageTemplate'));
const PaymentMessageTemplate = React.lazy(() => import('./views/Messaging/Components/PaymentMessageTemplate'));
const ComposeTemplateMessage = React.lazy(() => import('./views/Messaging/TemplateCompose'));

const MessagingProcess = React.lazy(() => import('./views/Messaging/MessagingProcess'));

//MESSAGE BATCH VIEWS
const MessageBatches = React.lazy(() => import('./views/Messaging/MessageBatches'));
const MessageBatch = React.lazy(() => import('./views/Messaging/MessageBatchDetail'));

//Tesing Components
//const TestingCom = React.lazy(() => import('./views/Messaging/Components/ARTemplate'))

const MyProgressView = React.lazy(() => import('./views/Base/Progress/ProgressView'));


// https://github.com/ReactTraining/react-router/tree/master/packages/react-router-config
const routes = [
  { path: '/dashboard', name: 'Dashboard', component: Dashboard },
  { path: '/system/ap', name: 'Accounting periods setting', component: AccountingPeriodsSetting, requireRoles: ['admin'] },
  { path: '/system/general', name: 'General setting', component: GeneralSetting, requireRoles: ['admin'] },
  { path: '/system/servers', name: 'Server setting', component: ServerSetting, requireRoles: ['admin'] },
  { path: '/system/messaging', name: 'Messaging setting', component: MessagingSetting, requireRoles: ['admin'] },
  { path: '/system/processes', name: 'Process manager', component: ProcessManager, requireRoles: ['admin'] },
  { path: '/system/templates', name: 'Template management', component: TemplateSetting, requireRoles: ['admin'] },
  ...WorkflowRoutes,
  ...SupportRequestRoutes,
  { path: '/accounts', name: 'Accounts', component: Accounts, requireRoles: ['admin', 'hr.admin'] },
  { path: '/hr/employees/detail/:id', name: 'Employee detail', component: EmployeeDetails, requireRoles: ['hr.admin'] },
  { path: '/hr/employees', exact: true, name: 'Employees List', component: Employees, requireRoles: ['hr.admin'] },
  { path: '/hr/employees/import', exact: true, name: 'Import Employee', component: EmployeeImport, requireRoles: ['hr.admin'] },
  { path: '/hr/departments/detail/:id', exact: true, name: "Department detail", component: DepartmentDetail, requireRoles: ['hr.admin'] },
  { path: '/hr/departments/update/:id', exact: true, name: "Department update", component: DepartmentUpdate, requireRoles: ['hr.admin'] },
  { path: '/hr/departments/import', exact: true, name: 'Department import', component: DepartmentImport, requireRoles: ['hr.admin'] },
  { path: '/hr/departments', exact: false, name: "Department list", component: DepartmentsList, requireRoles: ['hr.admin'] },
  { path: '/accounts/details/:id', exact: true, name: "Account info", component: AccountDetails, requireRoles: ['admin'] },
  { path: '/accounts/add', exact: true, name: "Add account", component: AddAccount, requireRoles: ['admin'] },
  { path: '/sales/customers', exact: true, name: 'Customer List', component: CustomerList, requireRoles: ['sales.admin'] },
  { path: '/sales/customers/import', exact: true, name: 'Customer import', component: CustomerImport, requireRoles: ['sales.admin'] },
  {
    path: '/sales/customers/:id', exact: true, name: 'Customer detail', component: CustomerDetail, requireRoles: ['sales.admin']
  },
  { path: '/messaging/receivers/import', exact: true, name: 'Import receivers', component: ReceiverImport, requireRoles: ['messaging.admin'] },
  { path: '/messaging/receivers', exact: true, name: 'Receivers', component: Receivers, requireRoles: ['messaging.admin'] },
  {
    path: '/messaging/groups/add', exact: true, name: 'Add Group', component: AddGroup, requireRoles: ['messaging.admin']
  },
  { path: '/messaging/groups/edit/:id', exact: true, name: 'Edit Group', component: EditGroup, requireRoles: ['messaging.admin'] },
  { path: '/messaging/groups', exact: true, name: 'List Group', component: Groups, requireRoles: ['messaging.admin'] },
  { path: '/messaging/compose/custom', exact: true, name: 'Compose message', component: ComposeCustomMessage, requireRoles: ['messaging.admin'] },
  { path: '/messaging/compose/template', exact: true, name: 'Compose template message', component: ComposeTemplateMessage, requireRoles: ['messaging.admin'] },
  { path: '/messaging/compose/ar', exact: true, name: 'Compose ar message', component: ARMessageTemplate, requireRoles: ['messaging.admin'] },
  { path: '/messaging/compose/payment', exact: true, name: 'Compose payment messages', component: PaymentMessageTemplate, requireRoles: ['messaging.admin'] },
  { path: '/messaging/messagingprocess/:id', exact: true, name: 'Messaging Process', component: MessagingProcess, requireRoles: ['messaging.admin'] },
  { path: '/messaging/batches', exact: true, name: 'Message Batch', component: MessageBatches, requireRoles: ['sales.admin'] },
  { path: '/messaging/batches/:id', exact: true, name: 'Message Batch Detail', component: MessageBatch, requireRoles: ['messaging.admin'] },
  { path: '/progress/:id', exact: true, name: 'Progress', component: MyProgressView, requireRoles: ['admin'] },
  { path: '/401', exact: true, name: 'Not Found', component: Page401 },
  { path: '/', exact: false, name: 'Home', component: Dashboard },
];

export default routes;
