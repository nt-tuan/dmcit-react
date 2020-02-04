import React, { useEffect, useState } from 'react';
import { List, Button, Label } from 'semantic-ui-react';

export default function ReceiverListItem(props) {
  const [value, setValue] = useState();

  useEffect(() => {
    setValue(props.value);
  }, [props.value]);

  if (value == null)
    return null;

  const cate = value.customerId ? 'CUSTOMER' : (value.employeeId ? 'EMPLOYEE' : 'OTHER');
  const color = value.customerId ? 'green' : (value.employeeId ? 'blue' : 'yellow');

  return (
    <List.Item>
      <List.Content floated='right'>
        <Button icon='close' size="mini" compact onClick={u => { props.onDelete && props.onDelete(value); }} color='red'></Button>
      </List.Content>
      <List.Content>
        <List.Header>
          {value.displayname} &emsp;
          <Label tag color={color}>{cate}</Label>
        </List.Header>
      </List.Content>
    </List.Item>
  );
}
