import React, { Component } from 'react';
import { withRouter, Link, Redirect } from 'react-router-dom';
import { Button, Card, CardBody, CardGroup, Col, Container, Form, Input, InputGroup, InputGroupAddon, InputGroupText, Row, Alert } from 'reactstrap';
import { userActions } from '../../../_actions';
import { connect } from 'react-redux';

class _login extends React.Component {
  constructor(props) {
    super(props);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.props.logout();
    this.state = {
      username: '',
      password: ''
    };
  }

  handleSubmit(event) {
    event.preventDefault();
    const { username, password } = this.state;
    const from = this.props.history && this.props.history.location && this.props.history.location.state ? this.props.history.location.state.from : null;
    this.props.login(username, password, () => {
      console.log(from);
      this.props.history.push(from && from.pathname != 'login' ? from.pathname : 'dashboard');
    });
  }

  render() {
    return (
      <div className="app flex-row align-items-center">
        <Container>
          {this.props.error &&
            <Row className="justify-content-center">
              <Col md="8">
                <Alert color="danger">
                  <ul>
                  <li><strong>{this.props.error.message?this.props.error.message:this.props.error}</strong></li>
                  <li><strong>Source: </strong>{this.props.error.source}</li>
                  <li><strong>StackTrace: </strong>{this.props.error.stackTrace}</li>
                  </ul>
                </Alert>
              </Col>
            </Row>}
          <Row className="justify-content-center">
            <Col md="8">
              <CardGroup>
                <Card className="p-4">
                  <CardBody>
                    <Form onSubmit={this.handleSubmit}>
                      <h1>Login</h1>
                      <p className="text-muted">Sign In to your account</p>
                      <InputGroup className="mb-3">
                        <InputGroupAddon addonType="prepend">
                          <InputGroupText>
                            <i className="icon-user"></i>
                          </InputGroupText>
                        </InputGroupAddon>
                        <Input type="text" placeholder="Username" autoComplete="username" value={this.state.username} onChange={(ev) => this.setState({ username: ev.target.value })} />
                      </InputGroup>
                      <InputGroup className="mb-4">
                        <InputGroupAddon addonType="prepend">
                          <InputGroupText>
                            <i className="icon-lock"></i>
                          </InputGroupText>
                        </InputGroupAddon>
                        <Input type="password" placeholder="Password" autoComplete="current-password" value={this.state.password} onChange={(ev) => this.setState({ password: ev.target.value })} />
                      </InputGroup>
                      <Row>
                        <Col xs="6">
                          <Button color="primary" className="px-4">Login</Button>
                        </Col>
                        <Col xs="6" className="text-right">
                          <Button color="link" className="px-0" disabled>Forgot password?</Button>
                        </Col>
                      </Row>
                    </Form>
                  </CardBody>
                </Card>
                <Card className="text-white bg-primary py-5 d-md-down-none" style={{ width: '44%' }}>
                  <CardBody className="text-center">
                    <div>
                      <h2>Xin chào!</h2>
                      <p>Đây là hệ thống quản trị tích hợp của phòng CNTT</p>
                    </div>
                  </CardBody>
                </Card>
              </CardGroup>
            </Col>
          </Row>
        </Container>
      </div>
    );
  }
}

const mapState = (state) => {
  const error = state.authentication.error;
  return { error };
}

const actionCreators = {
  login: userActions.login,
  logout: userActions.logout,

};

const Login = connect(mapState, actionCreators)(_login);

export default Login;
