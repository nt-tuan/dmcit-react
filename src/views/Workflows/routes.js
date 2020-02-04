import React from 'react';

const Workflows = React.lazy(() => import('../Settings/Workflow/Workflows'));
const WorkflowSetting = React.lazy(() => import('./WorkflowSettings'));
const WorkflowProcess = React.lazy(() => import('./WorkflowItemView'));
const WorkflowExecutor = React.lazy(() => import('./WorkflowSummaryList'));
const WorkflowHistoryView = React.lazy(() => import('./HistoryWorkflowEntriesView'));

const Routes = [
    { path: '/workflows/setting', exact:true, name: 'Workflow setting', component: WorkflowSetting, requireRoles: ['admin']},
  { path: '/workflows/history', exact: true, name: 'Workflow history', component: WorkflowHistoryView, requireRoles: ['admin'] },
  { path: '/workflows/list', exact: true, name: 'Workflows', component: WorkflowExecutor, requireRoles: ['admin']},
  { path: '/workflows/manage', name: 'Workflow management', component: Workflows, requireRoles: ['admin'] },
  { path: '/workflows/:id', name: 'Workflow items', component: WorkflowProcess, requireRoles: ['admin']},
];
export default Routes;