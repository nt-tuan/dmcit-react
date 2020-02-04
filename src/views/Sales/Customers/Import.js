import React, { useState } from 'react';
import { Form, Label, Button, Dimmer, Loader } from 'semantic-ui-react';
import { saleServices } from '../../../_services';
const download = require('downloadjs');


export default function CustomerImport(props) {
  const [selectedFile, setSelectedFile] = useState();
  const [loading, setLoading] = useState(false);
  function onFileChange(event) {
    setSelectedFile(event.target.files[0]);
  }

  function onSubmitReview(event) {
    setLoading(true);
    const data = new FormData();
    data.append('file', selectedFile);
    saleServices.previewCustomers(data)
      .then(blob => {
        download(blob, `review.xlsx`);
        setLoading(false);
      })
      .catch(error => {
        //alert.error(error.message);
        setLoading(false);
      });
  }

  function onSubmitResult(event) {
    setLoading(true);
    const data = new FormData();
    data.append('file', selectedFile);
    saleServices.importCustomers(data)
      .then(blob => {
        download(blob, `result.xlsx`);
        setLoading(false);
      })
      .catch(error => {
        //alert.error(error.message);
        setLoading(false);
      });
  }

  return (<div>
    <Dimmer active={loading} page>
      <Loader />
    </Dimmer>
    <Form.Field>
      <Label>IMPORT_FILE</Label>
      <Form.Input type="file" name="file" onChange={onFileChange} />
    </Form.Field>
    <hr />
    <Button disabled={selectedFile == null} onClick={onSubmitReview}>PREVIEW</Button>
    <Button disabled={selectedFile == null} onClick={onSubmitResult}>IMPORT</Button>
  </div>);

}
