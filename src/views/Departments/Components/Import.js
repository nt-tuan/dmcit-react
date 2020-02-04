import React, { useState } from 'react';
import { Form, Label, Button, Dimmer, Loader, Segment } from 'semantic-ui-react';
import MaterialTable from 'material-table';
import ReviewDepartment from './Review';
import { HRApiService } from '../../../_services';
import { useAlert } from 'react-alert';
export default function DepartmentImport() {
  const [step, setStep] = useState(0);
  const [selectedFile, setSelectedFile] = useState();
  const [reviewImportData, setReviewImportData] = useState([]);
  const [resultImportData, setResultImportData] = useState([]);
  const [loading, setLoading] = useState(false);

  const alert = useAlert();

  function onFileChange(event) {
    setSelectedFile(event.target.files[0]);
  }

  function onSubmitReview(event) {
    setLoading(true);
    const data = new FormData();
    data.append('file', selectedFile);
    HRApiService.departmentReview(data)
      .then(json => {
        setReviewImportData(json.data);
        setStep(1);
        setLoading(false);
      })
      .catch(error => {
        setLoading(false);
        alert.error(error.Message);
      });
  }

  function onSubmitImport(event) {
    let data = [];
    setLoading(true);
    reviewImportData.forEach((value, index) => {
      let item = {
        code: value.code,
        id: value.id,
        managerId: value.managerId,
        parentId: value.parentId,
        name: value.name,
        shortname: value.name
      };
      data.push(item);
    });
    HRApiService.departmentImport({ depts: data })
      .then(json => {
        if (json && json.data) {
          setStep(2);
          setResultImportData(json.data);
        } else {
          Promise.Reject("NO DATA FOUND");
        }
        setLoading(false);
      }).catch(error => {
        alert.error(error);
        setLoading(false);
      });
  }

  function onBackToSelectFile(event) {
    setStep(0);
    setReviewImportData([]);
    setResultImportData([]);
  }


  let body;
  if (step == 0) {
    body = <div>
      <Form.Field>
        <label>IMPORT_FILE</label>
        <Form.Input type="file" name="file" onChange={onFileChange} />
      </Form.Field>
      <hr />
      <Button onClick={onSubmitReview}>REVIEW</Button>

    </div>;
  } else if (step == 1) {
    body = <div>
      <ReviewDepartment data={reviewImportData} />
      <hr />
      <Button onClick={onBackToSelectFile}>BACK</Button>
      <Button color="green" onClick={onSubmitImport}>IMPORT</Button>
      <hr />
    </div>
  } else if (step == 2) {
    body = <div>
      <ReviewDepartment data={resultImportData} />
      <hr />
      <Button onClick={onBackToSelectFile}>
        DONE
        </Button>
      <hr />
    </div>
  }
  return <div>
    <Segment>
      <Dimmer active={loading} page>
        <Loader>Loading</Loader>
      </Dimmer>
      {body}
    </Segment>

  </div>
}
