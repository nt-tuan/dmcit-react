import React, { Component } from 'react';
import { Alert, Label, Button, Card, CardBody, CardHeader, CardFooter, Form, Input, FormGroup } from 'reactstrap';

class CreateUser extends Component {
  constructor(props) {
    super(props);
    this.state = {
      formData: {
        email: '',
        username: '',
        password: '',
        confirmPassword: ''
      },
      isLoading: false,
      error: null
    };
    this.onSubmit = this.onSubmit.bind(this);
    this.onChange = this.onChange.bind(this);
  }

  onChange(event) {
    const target = event.target;
    const value = event.type === 'checkbox' ? target.checked : target.value;
    const name = target.name;
    this.setState({
      formData: { ...this.state.formData, [name]: value }
    });
  }

  onSubmit(event) {
    this.setState({
      isLoading: true
    });
    fetch('/api/account/register', { credentials: "same-origin", method: 'POST', body: JSON.stringify(this.state.formData) })
      .then(response => {
        if (response.ok)
          return response.text();
        throw new Error(response.statusText);
      })
      .then(result => {
        this.setState({
          isLoading: false
        });
        this.props.onClose();
      })
      .catch(error => {
        console.log(error);
        this.setState({
          isLoading: false,
          error
        });
      });
  }

  render() {
    if (this.state.isLoading) {
      return <div>Loading...</div>;
    }

    return (
      <Form action="createUser" method="post" onSubmit={this.onSubmit}>
        {this.state.error && <Alert color="danger">{this.state.error.message}</Alert>}
        <Card>
          <CardHeader>
            CREATE_NEW_USER
        </CardHeader>
          <CardBody>
            <FormGroup>
              <Label htmlFor="nf-username">USERNAME</Label>
              <Input type="text" id="username" name="username" placeholder="ENTER_YOUR_USERNAME" value={this.state.formData.username} onChange={this.onChange}>
              </Input>
            </FormGroup>
            <FormGroup>
              <Label htmlFor="email">EMAIL</Label>
              <Input type="email" id="email" name="email" placeholder="ENTER_YOUR_EMAIL" value={this.state.formData.email} onChange={this.onChange}>
              </Input>
            </FormGroup>
            <FormGroup>
              <Label htmlFor="nf-password">PASSWORD</Label>
              <Input type="password" id="password" name="password" placeholder="ENTER_YOUR_PASSWORD" value={this.state.formData.password} onChange={this.onChange}>
              </Input>
            </FormGroup>
            <FormGroup>
              <Label htmlFor="nf-password">CONFIRM_PASSWORD</Label>
              <Input type="password" id="confirmPassword" name="confirmPassword" placeholder="ENTER_YOUR_CONFIRM_PASSWORD" value={this.state.formData.confirmPassword} onChange={this.onChange}>
              </Input>
            </FormGroup>

          </CardBody>
          <CardFooter>
            <Button type="submit" size="sm" color="primary">
              <i className="fa fa-dot-circle-o"></i> SUBMIT
            </Button>
            <Button size="sm" color="danger" onClick={this.props.onClose}><i className="fa fa-close"></i> CLOSE</Button>
          </CardFooter>
        </Card>
      </Form >
    )
  }
}

export default CreateUser;
