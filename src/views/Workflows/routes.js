import React from 'react';

const WorkflowConfigView = React.lazy(() => import('./Configurations')
  .then(module => ({ default: module.WorkflowConfigView })));
const WorkflowSetting = React.lazy(() => import('./WorkflowSettings'));
const WorkflowProcess = React.lazy(() => import('./WorkflowItemView'));
const WorkflowExecutor = React.lazy(() => import('./WorkflowSummaryList'));
const WorkflowHistoryView = React.lazy(() => import('./HistoryWorkflowEntriesView'));

const Routes = [
  { path: '/workflows/setting', exact: true, name: 'Workflow setting', component: WorkflowSetting, requireRoles: ['admin'] },
  { path: '/workflows/history', exact: true, name: 'Workflow history', component: WorkflowHistoryView, requireRoles: ['admin'] },
  { path: '/workflows', exact: true, name: 'Workflows', component: WorkflowExecutor, requireRoles: ['admin'] },
  { path: '/workflows/config', name: 'Workflow management', component: WorkflowConfigView, requireRoles: ['admin'] },
  { path: '/workflows/:id', name: 'Workflow items', component: WorkflowProcess, requireRoles: ['admin'] },
];
export default Routes;