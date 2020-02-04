import React from 'react';
import { Segment, Form, DropDown, Label, ButtonGroup, Button, Divider } from 'semantic-ui-react';
import { default as EmployeeSelection } from '../../Employees/Components/Selection';
import { default as Message } from '../../Base/Messages/Message';
import { userService } from '../../../_services';
import { EditUserRoles } from './UserRoles';

export class UpdateAccount extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      formData: {
        employeeId: null,
        username: "",
        email: ""
      },
      validationMessage: {},
      messages: []
    };
    //this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  componentDidMount() {
    this.loadData();
  }

  loadData() {
    userService.getById(this.props.id)
      .then(response => {
        if (response && response.data) {
          console.log(response.data);
          this.setState({
            formData: response.data
          });
        }
      })
      .catch(error => this.setState({ message: error}));
  }

  handleChange = (e, { name, value }) => {
    console.log(`${name}: ${value}`);
    this.setState({
      formData: { ...this.state.formData, [name]: value }
    });
  }

  handleSubmit(event) {
    event.preventDefault();
    const { employeeId, customerId, roles, id } = this.state.formData;
    userService.update({ employeeId, customerId, roles: roles.map(u => u.name), id })
      .then(res => {
        if (res && res.data && this.props.onSuccess) {
          this.props.onSuccess(this.state.formData);
        }
      })
      .catch(error => this.setState({ message: error }));
  }

  render() {
    return (
      <Segment>
        <ButtonGroup>
          <Button onClick={this.handleSubmit} primary>UPDATE</Button>
        </ButtonGroup>
        <Divider />
        {this.state.message && <Message error message={this.state.message} messages={this.state.messages} />}
        <Form>
          <Form.Field>
            <Label>USERNAME</Label>
            <Form.Input name="username" value={this.state.formData.username} readOnly />
          </Form.Field>
          <Form.Field>
            <Label>EMAIL</Label>
            <Form.Input name="email" value={this.state.formData.email} readOnly />
          </Form.Field>
          <h4>ROLES</h4>
          <EditUserRoles userId={this.state.formData.id} onChange={this.handleChange} name='roles'  />
        </Form>
      </Segment>
      
    )
  }
}
