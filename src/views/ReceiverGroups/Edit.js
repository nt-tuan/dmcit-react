import React, { useState, useEffect } from 'react';
import FormReceiverGroup from './Form';
import { Redirect } from 'react-router-dom';
import { Button } from 'semantic-ui-react';
import { RecipientServiceApi } from '../../_services';

export default function EditReceiverGroup(props) {
  const [data, setData] = useState({ name: '', members: [] });
  const [validation, setValidation] = useState();
  const [redirect, setRedirect] = useState(false);
  const id = props.id ? props.id : props.match.param.id;
  useEffect(() => {
    RecipientServiceApi.getGroup(id)
      .then(json => {
        if (json && json.data) {
          setData(json.data);
        }
      })
      .catch(error => {
        //Redirect to not found
      });
  }, [props]);

  function editGroup() {
    let query = data;
    RecipientServiceApi.editGroup(id, query)
      .catch(json => {
        if (json && json.data) {
          if (props.onSuccess) {
            props.onSuccess(query);
          }
          else {
            setRedirect(true);
          }
        } else if (json && json.validation) {
          setValidation(json.validation);
        }
      })
      .catch(error => {
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
      <h4>EDIT GROUP</h4>
      <hr />
      <FormReceiverGroup validation={validation} onChange={data => setData(data)} data={data} />
      <hr />
      <Button onClick={editGroup} primary>EDIT GROUP</Button>
      <hr />
    </div>
  );
}
