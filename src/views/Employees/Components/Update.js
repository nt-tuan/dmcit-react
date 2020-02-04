import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import { Form, Message, Button } from 'semantic-ui-react';
import { DepartmentSelection } from '../../Departments/Components';
import { HRApiService } from '../../../_services/hr';
import { PersonUpdate } from '../../Base/Person'


class EmployeeUpdate extends Component {
  constructor(props) {
    super(props);
    this.state = {
      formData: {
        code: "",
        person: {
          firstname: "",
          lastname: "",
          displayname: "",
          birthday: "",
          identityNumber: ""
        },
        deptid: ""
      },
      validated: false,
      validationMessage: {
      },
      error: null
    };
    //this.handleChange = this.handleChange.bind(this);
    this.onSubmit = this.onSubmit.bind(this);
    this.messageRef = React.createRef();
  }

  loadData() {
    this.setState({
      isLoaded: false
    });
    HRApiService.employeeDetail(this.props.id)
      .then(json => {
        if (json.data == null) {
          if (json.message)
            return Promise.reject(json.message);
          return Promise.reject("NO DATA FOUND");
        } else {
          this.setState({
            isLoaded: true,
            formData: json.data
          });
        }
      })
      .catch(error => {
        this.setState({
          isLoaded: true,
          error
        });
      });
  }

  handleChange = (e, { name, value }) => {
    //const value = event.type === 'checkbox' ? target.checked : target.value;
    console.log(`${name}: ${value}`);

    /*let name = e.target.name;*/
    var nameParts = name.split('.');
    if (nameParts.length > 1) {
      this.setState({
        formData: {
          ...this.state.formData, [nameParts[0]]: {
            ...this.state.formData[nameParts[0]],
            [nameParts[1]]: value
          }
        }
      });
    } else {
      this.setState({
        formData: { ...this.state.formData, [name]: value }
      });
    }
  }

  onSubmit(event) {
    event.preventDefault();
    console.log(this.state.formData);
    HRApiService.employeeUpdate(this.state.formData)
      .then(json => {
        if (json && json.data && this.props.onSuccess) {
          this.props.onSuccess(this.state.formData);
        };
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

  componentDidUpdate() {
    this.messageRef.current.scrollIntoView({
      behavior: "smooth"
    });
  }

  render() {
    let validationObject = this.state.validationMessage;
    let errorKeys = Object.keys(validationObject);
    let errorMessages = [];
    errorKeys.forEach(u => errorMessages.push(validationObject[u]));

    return (<div ref={this.messageRef}>
      {this.state.success && <Message success icon="check" content="UPDATE EMPLOYEE INFORMATION SUCCESSFULLY" type="info" />}
      {(errorMessages && errorMessages.length > 0) && <Message header="VALIDATION_ERROR" list={errorMessages}></Message>}
      <Form onSubmit={this.onSubmit}>
        {this.state.error && <Message negative>{this.state.error.message}</Message>}
        <Form.Field>
          <label>CODE</label>
          <Form.Input value={this.state.formData.code} name="code" onChange={this.handleChange} id="input-code" error={this.state.validationMessage.code != null} />
        </Form.Field>
        <PersonUpdate name="person" data={this.state.formData.person} validation={this.state.validationMessage} onChange={this.handleChange} />
        <Form.Group widths="equal">
          <DepartmentSelection name="dept.id" value={this.state.formData.dept ? this.state.formData.dept.id : null} onChange={this.handleChange} />
        </Form.Group>

        <Button type="submit" primary>Update</Button>
      </Form>
    </div>)
  }
}

export default EmployeeUpdate;
