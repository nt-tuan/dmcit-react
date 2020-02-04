import React, { Component } from 'react';

import { Form, Message, Button, Label } from 'semantic-ui-react';
import { DepartmentSelection } from './';
import { default as EmployeeSelection } from '../../Employees/Components/Selection';
import { HRApiService } from '../../../_services';
class DepartmentUpdate extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isLoaded: false,
      formData: {
        code: "",
        name: "",
        alias: "",
        parentId: null,
        managerId: null
      },
      validated: false,
      validationMessage: {
      },
      error: null,
      success: null

    };
    //this.handleChange = this.handleChange.bind(this);
    this.onSubmit = this.onSubmit.bind(this);
  }

  loadData() {
    this.setState({
      isLoaded: false
    });
    HRApiService.departmentDetail(this.props.id)
      .then(jresult => {
        if (jresult) {
          this.setState({
            isLoaded: true,
            formData: jresult.data
          });
        } else {
          this.setState({
            isLoaded: true,
            error: jresult.message ? jresult.message : "NOT_FOUND"
          });
        }
      }).catch(error => {
        console.log(error);
        this.setState({
          isLoaded: true,
          error: error
        });
      });
  }

  handleChange = (e, { name, value }) => {
    //const value = event.type === 'checkbox' ? target.checked : target.value;

    console.log(`${name}: ${value}`);

    /*let name = e.target.name;*/

    this.setState({
      formData: { ...this.state.formData, [name]: value }
    });
  }

  onSubmit(event) {
    event.preventDefault();
    console.log(this.state.formData);
    HRApiService.departmentUpdate(this.props.id, this.state.formData)
      .then(json => {
        if (json && json.data && this.props.onSuccess) {
          this.props.onSuccess(this.state.formData);
        }
        this.setState({ success: true });
      })
      .catch(error => {
        this.setState({
          validationMessage: { ...this.state.validationMessage, error: error.message }
        });
      });
  }

  componentDidMount() {
    this.loadData();
  }

  render() {
    if (!this.state.isLoaded)
      return <div>loading...</div>

    let validationObject = this.state.validationMessage;
    let errorKeys = Object.keys(validationObject);
    let errorMessages = [];
    errorKeys.forEach(u => errorMessages.push(validationObject[u]));

    return (<div>
      {this.state.success && <Message success content="UPDATE DEPARTMENT SUCCESSFULLY" />}
      {(errorMessages && errorMessages.length > 0) && <Message header="VALIDATION_ERROR" messages={errorMessages}></Message>}
      <Form onSubmit={this.onSubmit}>
        {this.state.error && <Message negative>{this.state.error.message}</Message>}
        <Form.Field>
          <label>CODE</label>
          <Form.Input name="code" value={this.state.formData.code} onChange={this.handleChange} error={this.state.validationMessage.code != null} />
        </Form.Field>
        <Form.Field>
          <label>DEPARTMENT NAME</label>
          <Form.Input name="name" value={this.state.formData.name} onChange={this.handleChange} error={this.state.validationMessage.name != null} />
        </Form.Field>
        <Form.Field>
          <label>DEPARTMENT SHORTNAME</label>
          <Form.Input name="shortname" value={this.state.formData.shortname || ''} onChange={this.handleChange} error={this.state.validationMessage.shortname != null} />
        </Form.Field>

        <Form.Group widths="equal">
          <DepartmentSelection name="parentId" value={this.state.formData.parentId} onChange={this.handleChange}></DepartmentSelection>
        </Form.Group>
        <Form.Group widths="equal">
          <EmployeeSelection label="MANAGER" name="managerId" value={this.state.formData.managerId} onChange={this.handleChange}></EmployeeSelection>
        </Form.Group>

        <Button type="submit" primary>Update</Button>
      </Form>
    </div>)
  }
}

export { DepartmentUpdate };
