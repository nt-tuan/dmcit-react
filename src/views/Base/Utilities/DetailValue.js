import React from 'react';
import { List, Label } from 'semantic-ui-react';
export function DetailValue(props) {

  const v = props.value ? props.value: <i>NOT DEFINED</i>;

  return <List.Item key={props.key}>
    <strong>{props.title}: </strong> {v}
    </List.Item>
}
