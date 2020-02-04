import React, { Component } from 'react';
import { Link, withRouter } from 'react-router-dom';
import { Badge, DropdownItem, DropdownMenu, DropdownToggle, Nav, NavItem, NavLink } from 'reactstrap';
import PropTypes from 'prop-types';

import { AppAsideToggler, AppHeaderDropdown, AppNavbarBrand, AppSidebarToggler } from '@coreui/react';

import { userActions } from '../../_actions';
import { connect } from 'react-redux';

import { history } from '../../_helpers';

import logo from '../../assets/img/brand/logo.svg'
import sygnet from '../../assets/img/brand/logo.svg'

const propTypes = {
  children: PropTypes.node,
};

const defaultProps = {};

const user = localStorage.getItem('user');

class _defaultHeader extends Component {
  render() {
    // eslint-disable-next-line
    const { children, ...attributes } = this.props;
    return (
      <React.Fragment>
        <AppSidebarToggler className="d-lg-none" display="md" mobile />
        <AppNavbarBrand
          full={{ src: logo, width: 188, height: 50, alt: 'DOMESCO Logo' }}
          minimized={{ src: sygnet, width: 50, height: 60, alt: 'DOMESCO Logo' }}
        />
        <AppSidebarToggler className="d-md-down-none" display="lg" />

        <Nav className="d-md-down-none" navbar>
          <NavItem className="px-3">
            <Link to="/" className="nav-link" >Dashboard</Link>
          </NavItem>
          <NavItem className="px-3">
            <Link to="/accounts" className="nav-link">Users</Link>
          </NavItem>
          <NavItem className="px-3">
            <Link to="/settings" className="nav-link">Settings</Link>
          </NavItem>
        </Nav>
        <Nav className="ml-auto" navbar>
          <NavItem className="d-md-down-none">
            <NavLink href="#"><i className="icon-bell"></i></NavLink>
          </NavItem>
          <AppHeaderDropdown direction="down">
            <DropdownToggle nav style={{ marginRight: '20px'}}>
              {this.props.user && this.props.user.username}
            </DropdownToggle>
            <DropdownMenu right style={{ right: '0'}}>
              <DropdownItem header tag="div" className="text-center"><strong>Account</strong></DropdownItem>
              <DropdownItem><i className="fa fa-user"></i> Profile</DropdownItem>
              <DropdownItem><i className="fa fa-wrench"></i> Settings</DropdownItem>
              <DropdownItem onClick={e => {
                this.props.history.push('/login');
              }}><i className="fa fa-lock"></i> Logout</DropdownItem>
            </DropdownMenu>
          </AppHeaderDropdown>
        </Nav>
        {/*<AppAsideToggler className="d-lg-none" mobile />*/}
      </React.Fragment>
    );
  }
}

_defaultHeader.propTypes = propTypes;
_defaultHeader.defaultProps = defaultProps;


function mapState(state) {
  const { authentication } = state;
  const { user } = authentication;
  return { user };
}

const actionCreators = {
  logout: userActions.logout,
  login: userActions.login
};

const DefaultHeader = connect(mapState, actionCreators)(withRouter(_defaultHeader));

export default DefaultHeader;
