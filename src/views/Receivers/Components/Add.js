import React, { Component } from 'react';
import { Form, Input, Label } from 'semantic-ui-react';
import Selection from '../../Employees/Components/Selection';

function AddReceiver(props) {
  const [ref, setRef] = useState({ customerId: undefined, employeeId: undefined, personId: undefined });
  const []

  const onEmployeeChange = () => {
    
  }

  return (<div>
    <Label>EMPLOYEE</Label>
    <Selection onChange={onEmployeeChange} />
    <Button>ADD_A_RECEIVER</Button>
  </div>);
}
