import React from 'react';
import EmployeeDetail from './Components/Details';
import { Segment } from 'semantic-ui-react';

export default function EmployeeDetailView(props) {
  return (
    <Segment>
      <h4>EMPLOYEE DETAIL</h4>
      <hr />
      <EmployeeDetail id={props.match.params.id} />
    </Segment>
  );
}
