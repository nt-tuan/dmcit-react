import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import { Badge, Card, CardBody, CardHeader, Col, Row, Table, Modal, ModalBody, Button } from 'reactstrap';
import CreateUser from './CreateUser';

import usersData from './UsersData';

function UserRow(props) {
  const user = props.user
  const userLink = `/users/${user.id}`

  const getBadge = (status) => {
    return status === 'Active' ? 'success' :
      status === 'Inactive' ? 'secondary' :
        status === 'Pending' ? 'warning' :
          status === 'Banned' ? 'danger' :
            'primary'
  }

  return (
    <tr key={user.id.toString()}>
      <th scope="row"><Link to={userLink}>{user.id}</Link></th>
      <td><Link to={userLink}>{user.name}</Link></td>
      <td>{user.registered}</td>
      <td>{user.role}</td>
      <td><Link to={userLink}><Badge color={getBadge(user.status)}>{user.status}</Badge></Link></td>
    </tr>
  )
}

class Users extends Component {
  constructor(props) {
    super(props);
    this.state = {
      modal: false
    };

    this.onClose = this.onClose.bind(this);
    this.onShow = this.onShow.bind(this);
  }

  onShow() {
    this.setState({
      modal: true
    });
  }

  onClose() {
    this.setState({
      modal: false
    });
  }

  render() {

    const userList = usersData.filter((user) => user.id < 10);

    return (
      <div className="animated fadeIn">
        <Button type="button" color="primary" onClick={this.onShow}>CREATE_USER</Button>
        <Row>
          <Col xl={6}>
            <Card>
              <CardHeader>
                <i className="fa fa-align-justify"></i> Users <small className="text-muted">example</small>
              </CardHeader>
              <CardBody>
                <Table responsive hover>
                  <thead>
                    <tr>
                      <th scope="col">id</th>
                      <th scope="col">name</th>
                      <th scope="col">registered</th>
                      <th scope="col">role</th>
                      <th scope="col">status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {userList.map((user, index) =>
                      <UserRow key={index} user={user} />
                    )}
                  </tbody>
                </Table>
              </CardBody>
            </Card>
          </Col>
        </Row>
        <Modal isOpen={this.state.modal}>
          <ModalBody>
            <CreateUser onClose={this.onClose}>
            </CreateUser>
          </ModalBody>
        </Modal>
      </div>
    )
  }
}

export default Users;
