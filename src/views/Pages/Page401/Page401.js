import React, { Component } from 'react';
import { Button, Col, Container, Input, InputGroup, InputGroupAddon, InputGroupText, Row } from 'reactstrap';

class Page401 extends Component {
  render() {
    return (
      <div className="app flex-row align-items-center">
        <Container>
          <Row className="justify-content-center">
            <Col md="6">
              <div className="clearfix">
                <h1 className="float-left display-3 mr-4">404</h1>
                <h4 className="pt-3">Khu vực hạn chế</h4>
                <p className="text-muted float-left">Bạn không đủ quyền truy cập vào khu vực này!</p>
              </div>
            </Col>
          </Row>
        </Container>
      </div>
    );
  }
}

export default Page401;
