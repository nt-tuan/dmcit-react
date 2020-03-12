import React from 'react';

const Receivers = React.lazy(() => import('../Receivers/Receivers'));
const ReceiverImport = React.lazy(() => import('../Receivers/Components/Import'));

const Groups = React.lazy(() => import('../ReceiverGroups/Groups'));
const AddGroup = React.lazy(() => import('../ReceiverGroups/Add'));
const EditGroup = React.lazy(() => import('../ReceiverGroups/Edit'));

//COMPOSEMESSAGE
const ComposeCustomMessage = React.lazy(() => import('./CustomCompose'));
const ARMessageTemplate = React.lazy(() => import('./Components/ARMessageTemplate'));
const PaymentMessageTemplate = React.lazy(() => import('./Components/PaymentMessageTemplate'));
const ComposeTemplateMessage = React.lazy(() => import('./TemplateCompose'));

const MessagingProcess = React.lazy(() => import('./MessagingProcess'));

//MESSAGE BATCH VIEWS
const MessageBatches = React.lazy(() => import('./MessageBatches'));
const MessageBatch = React.lazy(() => import('./MessageBatchDetail'));

//Tesing Components
//const TestingCom = React.lazy(() => import('./views/Messaging/Components/ARTemplate'))


// https://github.com/ReactTraining/react-router/tree/master/packages/react-router-config
const routes = [
  { path: '/messaging/receivers/import', exact: true, name: 'Import receivers', component: ReceiverImport, requireRoles: ['messaging.admin'] },
  { path: '/messaging/receivers', exact: true, name: 'Receivers', component: Receivers, requireRoles: ['messaging.admin'] },
  { path: '/messaging/groups/add', exact: true, name: 'Add Group', component: AddGroup, requireRoles: ['messaging.admin'] },
  { path: '/messaging/groups/edit/:id', exact: true, name: 'Edit Group', component: EditGroup, requireRoles: ['messaging.admin'] },
  { path: '/messaging/groups', exact: true, name: 'List Group', component: Groups, requireRoles: ['messaging.admin'] },
  { path: '/messaging', exact: true, name: 'Compose message', component: ComposeCustomMessage, requireRoles: ['messaging.admin'] },
  { path: '/messaging/compose/template', exact: true, name: 'Compose template message', component: ComposeTemplateMessage, requireRoles: ['messaging.admin'] },
  { path: '/messaging/compose/ar', exact: true, name: 'Compose ar message', component: ARMessageTemplate, requireRoles: ['messaging.admin'] },
  { path: '/messaging/compose/payment', exact: true, name: 'Compose payment messages', component: PaymentMessageTemplate, requireRoles: ['messaging.admin'] },
  { path: '/messaging/messagingprocess/:id', exact: true, name: 'Messaging Process', component: MessagingProcess, requireRoles: ['messaging.admin'] },
  { path: '/messaging/batches', exact: true, name: 'Message Batch', component: MessageBatches, requireRoles: ['sales.admin'] },
  { path: '/messaging/batches/:id', exact: true, name: 'Message Batch Detail', component: MessageBatch, requireRoles: ['messaging.admin'] },
];

export default routes;
