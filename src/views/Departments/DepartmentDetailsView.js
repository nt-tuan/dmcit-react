import React from 'react';
import { DepartmentDetail } from './Components';
import { Segment } from 'semantic-ui-react';

export default class DepartmentDetailsView extends React.Component{
  render() {
    return (<Segment><DepartmentDetail id={this.props.match.params.id} /></Segment>);
  }
}
