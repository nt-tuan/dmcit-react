import React, { Component } from 'react';
import { Form, Label, Button, Message } from 'semantic-ui-react';
import MaterialTable from 'material-table';
import ReviewEmployee from './Review';
import MyModal from '../../Modals/MyModal';
import { HRApiService } from '../../../_services';
export default class EmployeeImport extends Component {
  constructor(props) {
    super(props);
    this.state = {
      step: 0,
      selectedFile: null,
      reviewImportData: [],
      resultImportData: [],
      modalMessage: null
    };
    this.onFileChange = this.onFileChange.bind(this);
    this.onSubmitReview = this.onSubmitReview.bind(this);
    this.onSubmitImport = this.onSubmitImport.bind(this);
    this.onBackToSelectFile = this.onBackToSelectFile.bind(this);
  }

  onFileChange(event) {
    this.setState({ selectedFile: event.target.files[0] });
  }

  onSubmitReview(event) {
    this.setState({ loading: true });
    const data = new FormData();
    data.append('file', this.state.selectedFile);
    HRApiService.employeeReview(data)
      .then(json => {
        this.setState({
          reviewImportData: json.data,
          step: 1
        });

      }).catch(error => {

      });
  }

  onSubmitImport(event) {
    let data = [];
    this.state.reviewImportData.forEach((value, index) => {
      let item = {
        code: value.code,
        id: value.id,
        dept: value.dept,
        person: value.person
      };
      data.push(item);
    });
    HRApiService.employeeImport({ employees: data })
      .then(json => {
        this.setState({
          step: 2,
          resultImportData: json.data
        });
      })
      .catch(error => {

      });
  }

  onBackToSelectFile(event) {
    this.setState({
      step: 0,
      reviewImportData: [],
      resultImportData: [],
      modalMessage: null
    });
  }

  render() {
    let body;
    if (this.state.step == 0) {
      body = <div>
        <Form.Field>
          <Label>IMPORT_FILE</Label>
          <Form.Input type="file" name="file" onChange={this.onFileChange} />
        </Form.Field>
        <hr />
        <Button onClick={this.onSubmitReview}>REVIEW</Button>
      </div>;
    } else if (this.state.step == 1) {
      body = <div>
        <ReviewEmployee data={this.state.reviewImportData} />
        <hr />
        <Button onClick={this.onBackToSelectFile}>BACK</Button>
        <Button color="green" onClick={this.onSubmitImport}>IMPORT</Button>
        <hr />
      </div>
    } else if (this.state.step == 2) {
      body = <div>
        <ReviewEmployee data={this.state.resultImportData} />
        <hr />
        <Button onClick={this.onBackToSelectFile}>
          DONE
        </Button>
        <hr />
      </div>
    }
    return <div>
      <MyModal open={this.state.modalMessage != null && this.state.modalMessage != undefined} component={this.state.modalMessage} onClose={() => this.setState({ modalMessage: null })} headers="ERROR" />
      {body}
    </div>
  }
}
