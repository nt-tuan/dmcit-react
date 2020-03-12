import React from 'react';
import AbstractLayout from '../../containers/DefaultLayout/AbstractLayout'; 
import navigation from './navs';

function Layout(props){
  return <AbstractLayout navigation={navigation} />;
}

export default Layout;
