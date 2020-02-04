import React from 'react';
import { Card } from 'semantic-ui-react';
import { MyProgress } from './Progress';

const MyProgressView = (props) => {
  return <Card fluid>
    <Card.Content>
      <MyProgress id={props.match.params.id} />
    </Card.Content>
  </Card>
}

export default MyProgressView;
