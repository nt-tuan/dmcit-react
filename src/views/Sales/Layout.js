import React from 'react';
import AbstractLayout from '../../containers/DefaultLayout/AbstractLayout'; 

import navigation from './navs';

function SalesLayout(props){
  return <AbstractLayout navigation={navigation} />;
}
export default SalesLayout;
