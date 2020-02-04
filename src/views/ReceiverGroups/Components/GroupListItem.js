import React from 'react';
import { Label, List, Button } from 'semantic-ui-react'
export default function GroupListItem(props) {
  return (
    <List.Item>
      <List.Content floated='right'>
        <Button icon='close' onClick={u => {
          props.onDelete && props.onDelete(props.value);
        }} color='red' />
      </List.Content>
      <List.Content>
        <List.Header>
          {props.value.name} &emsp;
      <Label color='orange' tag>GROUP</Label>
        </List.Header>
      </List.Content>
    </List.Item>
  );
}
