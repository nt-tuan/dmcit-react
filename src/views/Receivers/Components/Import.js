import React, { useState } from 'react';
import { Form, Label, Button, Dimmer, Loader } from 'semantic-ui-react';
import { RecipientServiceApi } from '../../../_services';
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
    RecipientServiceApi.previewReceivers(data)
      .then(blob => {
        download(blob, `review.xlsx`);
        setLoading(false);
      })
      .catch(error => {
        setLoading(false);
      });
  }

  function onSubmitResult(event) {
    setLoading(true);
    const data = new FormData();
    data.append('file', selectedFile);
    RecipientServiceApi.importReceivers(data)
      .then(blob => {
      download(blob, `result.xlsx`);
      setLoading(false);
      })
      .catch(error => {
      setLoading(false);
    });
  }

  return (<div>
    <Dimmer active={loading} page>
      <Loader />
    </Dimmer>
    <h4>IMPORT RECEIVERS LIST</h4>
    <hr />
    <Form.Field>
      <Label>IMPORT_FILE</Label>
      <Form.Input type="file" name="file" onChange={onFileChange} />
    </Form.Field>
    <hr />
    <Button disabled={selectedFile == null} onClick={onSubmitReview} primary>PREVIEW</Button>
    <Button disabled={selectedFile == null} onClick={onSubmitResult} primary>IMPORT</Button>
  </div>);

}
