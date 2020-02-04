import React from 'react';
import { Form, Label, Segment, Divider, ButtonGroup, Button } from 'semantic-ui-react';
import { default as Message } from '../../Base/Messages/Message';

export class ChangePassword extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      oldPassword: '',
      newPassword: '',
      confirmPassword: ''
    };
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  handleChange(e, { name, value }) {
    this.setState({
      formData: { [name]: value }
    });
  }

  handleSubmit(e) {
    e.preventDefault();
    const url = `/hr/account/changepassword${this.props.match.params.id?"/"+this.props.match.params.id:""}`;
    fetch(`/hr/account/changepassword`, {
      method: 'POST',
      body: JSON.stringify({
        oldPassword: this.state.oldPassword,
        newPassword: this.state.newPassword
      })
    })
      .then(response => {
        if (response.ok) {
          return response.json();
        }
        throw new Error(response.statusText);
      })
      .then(response => {
        if (response && response.result && this.props.onSuccess) {
          this.props.onSuccess();
        } else {
          throw new Error(response.message);
        }
      })
      .catch(error => this.setState({ message: error.message }));
  }

  render() {
    return (
      <Segment>
        <ButtonGroup>
          <Button onClick={this.handleSubmit}>CHANGE_PASSWORD</Button>
        </ButtonGroup>
        <Divider />
        {this.state.message && <Message error>{this.state.message}</Message>}
        <Form>
          <Form.Field>
            <Label>OLD_PASSWORD</Label>
            <Form.Input type="password" name='oldPassword' onChange={this.handleChange} value={this.state.oldPassword}></Form.Input>
          </Form.Field>
          <Form.Field>
            <Label>NEW_PASSWORD</Label>
            <Form.Input type="password" name='newPassword' onChange={this.handleChange} value={this.state.newPassword}></Form.Input>
          </Form.Field>
          <Form.Field>
            <Label>CONFIRM_NEW_PASSWORD</Label>
            <Form.Input type="password" name='confirmPassword' onChange={this.handleChange} value={this.state.confirmPassword}></Form.Input>
          </Form.Field>
        </Form>
      </Segment>
    );
  }
}
