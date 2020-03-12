import React, { useState } from 'react';
import { Button, Card, CardBody, Col, Container, Form, Input, InputGroup, InputGroupAddon, InputGroupText, Row } from 'reactstrap';
import { Message, Dimmer, Loader } from 'semantic-ui-react';
import { connect } from 'react-redux';
import { userActions } from '../../../_actions';

function _register(props) {
  const [user, setUser] = useState({});
  function handleRegister(e) {
    e.preventDefault();
    props.register(user);
  }
  function handleChange(e) {
    setUser({ ...user, [e.target.name]: e.target.value });
  }
  const { error, registering } = props;
  return (
    <div className="app flex-row align-items-center">
      <Dimmer page active={registering}>
        <Loader content="registering" />
      </Dimmer>
      <Container>
        <Row className="justify-content-center">
          <Col md="9" lg="7" xl="6">
            <Card className="mx-4">
              <CardBody className="p-4">
                <Form>
                  {error && <Message content={[...error.messages, error.source, error.stackTrace]} error />}

                  <h1>Register</h1>
                  <p className="text-muted">Create your account</p>
                  <InputGroup className="mb-3">
                    <InputGroupAddon addonType="prepend">
                      <InputGroupText>
                        <i className="icon-user"></i>
                      </InputGroupText>
                    </InputGroupAddon>
                    <Input type="text" placeholder="Username" autoComplete="username" name="username" onChange={handleChange} />
                  </InputGroup>
                  <InputGroup className="mb-3">
                    <InputGroupAddon addonType="prepend">
                      <InputGroupText>@</InputGroupText>
                    </InputGroupAddon>
                    <Input type="text" placeholder="Email" autoComplete="email" name="email" onChange={handleChange} />
                  </InputGroup>
                  <InputGroup className="mb-3">
                    <InputGroupAddon addonType="prepend">
                      <InputGroupText>
                        <i className="icon-lock"></i>
                      </InputGroupText>
                    </InputGroupAddon>
                    <Input type="password" placeholder="Password" autoComplete="new-password" name="password" onChange={handleChange} />
                  </InputGroup>
                  <InputGroup className="mb-4">
                    <InputGroupAddon addonType="prepend">
                      <InputGroupText>
                        <i className="icon-lock"></i>
                      </InputGroupText>
                    </InputGroupAddon>
                    <Input type="password" placeholder="Repeat password" autoComplete="new-password" name="confirmPassword" onChange={handleChange} />
                  </InputGroup>
                  <Button color="success" block onClick={handleRegister}>Create Account</Button>
                </Form>
              </CardBody>
            </Card>
          </Col>
        </Row>
      </Container>
    </div>);
}

const mapState = (state) => {
  const { error, registering } = state.registration;
  return { error, registering };
}

const actionCreators = {
  register: userActions.register
};

const Register = connect(mapState, actionCreators)(_register);

export default Register
