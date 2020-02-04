import React, { Component } from 'react';

import { Form, Message, Button, Label } from 'semantic-ui-react';
import { DepartmentSelection } from '../../Departments/Components';
class EmployeeAdd extends Component {
  constructor(props) {
    super(props);
    this.state = {
      formData: {
        code: "",
        firstname: "",
        lastname: "",
        deptid: ""
      },
      validated: false,
      validationMessage: {
      },
      error: null
    };
    //this.handleChange = this.handleChange.bind(this);
    this.onSubmit = this.onSubmit.bind(this);
  }

  handleChange = (e, { name, value }) => {
    //const value = event.type === 'checkbox' ? target.checked : target.value;
    console.log(`${name}: ${value}`);

    /*let name = e.target.name;*/

    this.setState({
      formData: { ...this.state.formData, [name]: value }
    });
  }

  onSubmit(event) {
    event.preventDefault();
    console.log(this.state.formData);
    const { code, firstname, lastname, deptid } = this.state.formData;
    fetch(`/api/hr/emps/add`, {
      method: "POST",
      headers: {
        Accept: "application/json",
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(this.state.formData)
    }).then(res => {
      if (res.ok)
        return res.text();
      throw new Error(res.statusText);
    })
      .then(res => {
        let json = JSON.parse(res);
        if (json && json.result && this.props.onSuccess) {
          this.props.onSuccess(this.state.formData);
        };
      })
      .catch(error => {
        this.setState({
          validationMessage: { ...this.state.validationMessage, error: error.message }
        });
      });
  }

  render() {
    let validationObject = this.state.validationMessage;
    let errorKeys = Object.keys(validationObject);
    let errorMessages = [];
    errorKeys.forEach(u => errorMessages.push(validationObject[u]));

    return (<div>
      {(errorMessages && errorMessages.length > 0) && <Message header="VALIDATION_ERROR" list={errorMessages}></Message>}
      <Form onSubmit={this.onSubmit}>
        {this.state.error && <Message negative>{this.state.error.message}</Message>}
        <Form.Field>
          <Label>CODE</Label>
          <Form.Input value={this.state.formData.code} name="code" onChange={this.handleChange} id="input-code" error={this.state.validationMessage.code != null} />
        </Form.Field>
        <Form.Group widths="equal">
          <Form.Field>
            <Label>FIRSTNAME</Label>
            <Form.Input value={this.state.formData.firstname} onChange={this.handleChange} id="input-firstname" name="firstname" error={this.state.validationMessage.firstname != null} />
          </Form.Field>
          <Form.Field>
            <Label>LASTNAME</Label>
            <Form.Input value={this.state.formData.lastname} onChange={this.handleChange} id="input-lastname" name="lastname" error={this.state.validationMessage.lastname != null} />
          </Form.Field>
        </Form.Group>

        <Form.Group widths="equal">
          <DepartmentSelection name="deptid" value={this.state.formData.deptid} onChange={this.handleChange}></DepartmentSelection>
        </Form.Group>

        <Button type="submit" primary>Add</Button>
      </Form>
    </div>)
  }
}

export default EmployeeAdd;
