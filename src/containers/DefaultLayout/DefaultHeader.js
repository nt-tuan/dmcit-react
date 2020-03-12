import React, { Component } from 'react';
import { Link, withRouter } from 'react-router-dom';
import { Layout, Menu, Dropdown, Button, message, Tooltip, Row, Col } from 'antd';
import { UserOutlined } from '@ant-design/icons';
import PropTypes from 'prop-types';
import {LayoutContext} from './LayoutContext';
import { userActions } from '../../_actions';
import { connect } from 'react-redux';

import { history } from '../../_helpers';
const { Header } = Layout;
const propTypes = {
  children: PropTypes.node,
};

const defaultProps = {};

const navs = [
  { name: 'Messaging', url: '/messaging' },
  { name: 'Sales', url: '/sales' },
  { name: 'Workflows', url: '/workflows' }
]

const userMenuItems = [
  { name: 'Profile', disable: true, url: '/' },
  { name: 'Setting', disable: true, url: '/' },
  { name: 'Logout', url: '/logout' }
]

const DefaultHeader = props => {
  // eslint-disable-next-line
  const layout = React.useContext(LayoutContext);
  const { children, ...attributes } = props;
  return (
    <Header>
      <Row>
        <Col flex='100px'>
          <div className="logo" />
        </Col>
        <Col flex='auto'>
          {navs.map(u => <Button key={u.url} type="link" onClick={() => history.push({ pathname: u.url })}>
            <strong>{u.name}</strong>
          </Button>)}
        </Col>
        <Col flex='200px'>
          <div style={{float: 'right'}}>
          {layout.auth && layout.auth.user ?
            <Dropdown.Button overlay={<Menu>
              {userMenuItems.map(u => <Menu.Item key={u.name}>{u.name}</Menu.Item>)}
            </Menu>} icon={<UserOutlined />}>
              {layout.auth.user.username}
            </Dropdown.Button> : <Button onClick={u => history.push({ pathname: '/login' })}>
              Login
              </Button>
          }
          </div>
        </Col>
      </Row>
    </Header>
  );
}


export default DefaultHeader;
