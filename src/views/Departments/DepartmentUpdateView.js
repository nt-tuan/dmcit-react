import React from 'react';
import { DepartmentUpdate } from './Components';
import { Segment } from 'semantic-ui-react';

export default class DepartmentUpdateView extends React.Component {
  render() {
    return (<Segment><DepartmentUpdate id={this.props.match.params.id}></DepartmentUpdate></Segment>);
  }
}
