import React, {useState } from 'react';
import FormReceiverGroup from './Form';
import { Redirect } from 'react-router-dom';
import { Button, Icon } from 'semantic-ui-react';
import { RecipientServiceApi } from '../../_services';

export default function AddReceiverGroup(props) {
  const [data, setData] = useState({ name: '', members: [] });
  const [validation, setValidation] = useState();
  const [redirect, setRedirect] = useState(false);
  function addGroup() {
    let query = data;
    RecipientServiceApi.addGroup(query)
      .then(json => {
        if (json && json.result) {
          if (props.onSuccess) {
            props.onSuccess(query);
          }
          else {
            setRedirect(true);
          }
        } else if (json && json.validation) {
          setValidation(json.validation);
        }
      }).catch(error => {
        setValidation({ error });
      });
  }

  function renderRedirect() {
    if (redirect) {
      return <Redirect to='/messaging/groups' />
    }
  }

  return (
    <div>
      {renderRedirect()}
      <h4>ADD RECEIVER</h4>
      <hr />
      <FormReceiverGroup validation={validation} onChange={data => setData(data)} data={data}/>
    <hr />
      <Button onClick={addGroup} primary>ADD GROUP</Button>
      <hr />
      </div>
    );
}
