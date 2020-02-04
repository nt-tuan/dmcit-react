import React, {Suspense} from 'react';
import AbstractLayout from './AbstractLayout'; 
import {
  AppSidebar,
  AppSidebarFooter,
  AppSidebarForm,
  AppSidebarHeader,
  AppSidebarMinimizer,
  AppSidebarNav,
} from '@coreui/react';
import navigation from '../../_navs/workflowNav';

function DefaultLayout(props){
  const sidebar = <AppSidebar fixed display="lg">
            <AppSidebarHeader />
            <AppSidebarForm />
            <Suspense>
              <AppSidebarNav navConfig={navigation} {...props} />
            </Suspense>
            <AppSidebarFooter />
            <AppSidebarMinimizer />
          </AppSidebar>;
  return <AbstractLayout appSidebar={sidebar} />;
}

export default DefaultLayout;
