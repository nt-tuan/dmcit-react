import React from 'react';
import { Segment, Form, DropDown, Label, ButtonGroup, Button, Divider } from 'semantic-ui-react';
import { default as EmployeeSelection } from '../../Employees/Components/Selection';
import { default as Message } from '../../Base/Messages/Message';

export class AddAccount extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      formData: {
        email: ''
      },
      validationMessage: {},
      messages: []
    };
    this.handleChange = this.handleChange.bind(this);
    this.handleEmployeeChange = this.handleEmployeeChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  handleChange(e, { name, value }) {
    console.log(`${name}: ${value}`);
    this.setState({
      formData: { ...this.state.formData, [name]: value }
    });
  }

  handleEmployeeChange(e, { name, value }) {
    fetch(`/api/hr/emp/${value}`, { method: "POST" })
      .then(response => {
        if (response.ok)
          return response.json();
        throw new Error(response.statusText);
      })
      .then(result => {
        if (result && result.result) {
          this.setState({
            formData: {...this.state.formData, email: result.result.email, employeeId: result.result.id}
          });
        }
      })
      .catch(error => this.setState({ message: error.message }));
  }

  handleSubmit(event) {
    event.preventDefault();
    this.setState({
      message: null,
      messages: null
    });
    if (!this.state.formData || this.state.formData.password !== this.state.formData.confirmPassword) {
      this.setState({
        message: "INVALID_CONFIRM_PASSWORD"
      });
      return;
    }
    console.log(this.state.formData);
    fetch(`/api/account/add`, {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(this.state.formData)
    })
      .then(res => {
        if (res.ok) {
          return res.json();
        }
        throw new Error(res.statusText);
      })
      .then(res => {
        
        if (res && res.result && this.props.onSuccess) {
          this.props.onSuccess(this.state.formData);
        } else if (res) {
          
          this.setState({
            messages: res.messages,
            message: res.message
          });
          
        }
        
      })
      .catch(error => this.setState({message: error.message}));
  }

  render() {
    
    return (
      <Segment>
        <ButtonGroup>
          <Button onClick={this.handleSubmit} primary>ADD</Button>
        </ButtonGroup>
        <Divider />
        <Message error message={this.state.message} messages={this.state.messages} error></Message>
        <Form>
          <Form.Field>
            <EmployeeSelection name="employeeId" value={this.state.formData.employeeId} onChange={this.handleEmployeeChange} />
          </Form.Field>
          <Form.Field>
            <Label>USERNAME</Label>
            <Form.Input name="username" onChange={this.handleChange} />
          </Form.Field>
          <Form.Field>
            <Label>EMAIL</Label>
            <Form.Input name="email" value={this.state.formData.email} onChange={this.handleChange} />
          </Form.Field>
          <Form.Field>
            <Label>PASSWORD</Label>
            <Form.Input type="password" name="password" onChange={this.handleChange} />
          </Form.Field>
          <Form.Field>
            <Label>PASSWORD CONFIRM</Label>
            <Form.Input type="password" name="confirmPassword" onChange={this.handleChange} />
          </Form.Field>
        </Form>
      </Segment>)
  }
}
