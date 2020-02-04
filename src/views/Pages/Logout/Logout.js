import React, { Component } from 'react';
import { Link, Redirect } from 'react-router-dom';

class Logout extends React.Component {
  constructor(props) {
    super(props);
    localStorage.removeItem("user");
  }
  render() {
    return <Redirect to="/login" />
  }
}

export default Logout;
