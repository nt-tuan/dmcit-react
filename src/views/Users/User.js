import React, { Component } from 'react';
import { Button, Card, CardBody, CardHeader, Col, Row, Table } from 'reactstrap';
import usersData from './UsersData'

class User extends Component {
  constructor(props) {
    super(props);
    this.state = {
      error: null,
      isLoaded: false,
      data: null
    }
  }

  reloadData() {
    this.setState({ isLoaded: false });
    this.loadData();
  }

  loadData() {
    console.log(this.props.match.params.id);
    let url = `/api/account/details/${this.props.match.params.id}`;
    fetch(url, {
      method: 'GET', headers: {
        Accept: 'application/json',
      }
    })
      .then(response => {
        if (response.ok)
          return response.text();
        throw new Error(response.statusText);
      })
      .then(
        result => {
          this.setState({
            isLoaded: true,
            data: JSON.parse(result)
          });
        }).catch(error => {
          console.log(error);
          this.setState({
            isLoaded: true,
            error
          });
        });
  }

  componentDidMount() {
    this.loadData();
  }

  render() {
    const { error, isLoaded, data } = this.state;
    if (!isLoaded) {
      return <div>Loading...</div>;
    }
    else if (error) {
      return (<div>
        Error: {error.message} <Button onClick={() => this.reloadData()}>
          Refresh
        </Button>
      </div>);
    } else {
      return (
        <div className="animated fadeIn">
          <Row>
            <Col lg={6}>
              <Card>
                <CardHeader>
                  <strong><i className="icon-info pr-1"></i>User id: {this.props.match.params.id}</strong>
                </CardHeader>
                <CardBody>
                  <Table responsive striped hover>
                    <tbody>
                      {
                        data.map(([key, value]) => {
                          return (
                            <tr key={key}>
                              <td>{`${key}:`}</td>
                              <td><strong>{value}</strong></td>
                            </tr>
                          )
                        })
                      }
                    </tbody>
                  </Table>
                </CardBody>
              </Card>
            </Col>
          </Row>
        </div>
      )
    }
  }
}

export default User;
