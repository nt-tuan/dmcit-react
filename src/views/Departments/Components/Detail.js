import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import { List } from 'semantic-ui-react';
import { EmployeeLink, EmployeeList } from '../../Employees/Components';
import { DepartmentLink } from './DepartmentLink';
import { DetailValue } from '../../Base/Utilities';
import MyModal from '../../Modals/MyModal';
import { HRApiService } from '../../../_services';
class DepartmentDetail extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isLoaded: false,
      error: null
    };
    this.loadData = this.loadData.bind(this);
  }

  componentDidMount() {
    this.loadData();
  }

  componentWillReceiveProps(nextProps) {
    this.loadData();
  }

  loadData() {
    this.setState({
      isLoaded: false
    });
    HRApiService.departmentDetail(this.props.id)
      .then(json => {
        this.setState({
          dept: json.data,
          isLoaded: true
        })
      })
      .catch(error => {
        console.log(error);
        this.setState({
          isLoaded: true,
          error: error
        });
      });
  }

  render() {
    if (this.state.error) {
      if (this.state.error.message)
        return <div>{this.state.error.message}</div>;
      else
        return <div>Unknown error</div>
    }
    else if (!this.state.isLoaded) {
      return (
        <div>Loading...</div>
      );
    } else {
      const renderParent = this.state.dept.parentId ? (<DepartmentLink id={this.state.dept.parentId}/>) : null;

      const renderManager = this.state.dept.managerId ? (<EmployeeLink id={this.state.dept.managerId} />) : null;

      return (
        <div>
          <List divided>
            <DetailValue title='DEPARTMENT CODE' value={this.state.dept.code} />
            <DetailValue title='DEPARTMENT FULLNAME' value={this.state.dept.name} />
            <DetailValue title='DEPARTMENT SHORT NAME' value={this.state.dept.shortname} />
            {renderParent && <DetailValue title='PARENT DEPARTMENT' value={renderParent} />}
            <DetailValue title='MANAGER' value={renderManager} />
            
          </List>
          <hr />
          <h4>EMPLOYEES LIST</h4>
          <EmployeeList filter={{ "departmentId": this.props.id }} />
        </div>

      );
    }
  }
}

export { DepartmentDetail };
