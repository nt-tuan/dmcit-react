import React from 'react'
const CreateRequest = React.lazy(() => import('./CreateRequest'));

const Routes = [
    { path: '/support/create', exact:true, name: 'Workflow setting', component: CreateRequest}
];
export default Routes;