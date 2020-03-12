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
import navigation from '../../_navs/defaultNav';


function DefaultLayout(props){
  return <AbstractLayout navigation={navigation} />;
}

export default DefaultLayout;
