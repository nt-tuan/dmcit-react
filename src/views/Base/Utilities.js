import React from 'react';
import { List } from 'semantic-ui-react';
function DetailValue(props) {

  const v = props.value ? props.value : <i>NOT DEFINED</i>;

  return <List.Item>
    <strong>{props.title}: </strong> {v}
  </List.Item>
}

export { DetailValue };
