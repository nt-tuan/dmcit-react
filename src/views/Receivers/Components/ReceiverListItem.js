import React from 'react';
import { Label, Icon } from 'semantic-ui-react';
export default function ReceiverListItem(props) {
  let cate = props.value.customerId ? 'CUSTOMER' : (props.value.employeeId ? 'EMPLOYEE' : 'OTHER');
  let color = props.value.customerId ? 'green' : (props.value.employeeId ? 'blue' : 'yellow');

  return (
    <div>
      <Icon name='user' />
      {props.value.name} &emsp;
      <Label color={color}>{cate}</Label>
    </div>
  );
}
