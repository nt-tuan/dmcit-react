import React from 'react';
import { Segment, Form, DropDown, Icon, ButtonGroup, Button, Divider } from 'semantic-ui-react';
import { HRApiService } from '../../../_services';
import { default as EmployeeSelection } from '../../Employees/Components/Selection';
import { default as Message } from '../../Base/Messages/Message';

export class AddAccount extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      formData: {
        email: '',
        username: '',
        phone: ''
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
    HRApiService.employeeDetail(value)
      .then(result => {
        if (result && result.data && result.data.person) {
          this.setState({
            formData: { ...this.state.formData, username: result.data.code, email: result.data.person.email, employeeId: result.data.id }
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
      .catch(error => this.setState({ message: error.message }));
  }

  render() {
    return (
      <Segment>



        <Message error message={this.state.message} messages={this.state.messages} error></Message>
        <Form size="tiny">
          <Form.Group widths='equal'>
            <Form.Field>
              <EmployeeSelection name="employeeId" value={this.state.formData.employeeId} onChange={this.handleEmployeeChange} />
            </Form.Field>
            <Form.Field>
              <label>USERNAME</label>
              <Form.Input name="username" value={this.state.formData.username} onChange={this.handleChange} />
            </Form.Field>
          </Form.Group>
          <Form.Group widths='equal'>
            <Form.Field>
              <label>EMAIL</label>
              <Form.Input name="email" value={this.state.formData.email} onChange={this.handleChange} />
            </Form.Field>
            <Form.Field>
              <label>PHONE NUMBER</label>
              <Form.Input name="phone" value={this.state.formData.phone} onChange={this.handleChange} />
            </Form.Field>
          </Form.Group>
          <Form.Group widths='equal'>
            <Form.Field>
              <label>PASSWORD</label>
              <Form.Input type="password" name="password" onChange={this.handleChange} />
            </Form.Field>
            <Form.Field>
              <label>PASSWORD CONFIRM</label>
              <Form.Input type="password" name="confirmPassword" onChange={this.handleChange} />
            </Form.Field>
          </Form.Group>
          <Button size='mini' compact icon labelPosition='left' onClick={this.handleSubmit} positive>
            <Icon name='plus' /> ADD EMPLOYEE ACCOUNT
        </Button>
        </Form>
      </Segment>)
  }
}
