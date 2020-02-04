import React, { useState, useRef } from 'react';
import { EmployeeList } from '../../Employees/Components';
import { Label, FormGroup, Button } from 'semantic-ui-react';
import Message from '../../Base/Messages/Message';
import { RecipientServiceApi } from '../../../_services';
export default function AddEmployeeReceiver(props) {
  const [message, setMessage] = useState(null);
  const [messages, setMessages] = useState([]);
  const [messageType, setMessageType] = useState({
    error: false,
    info: false,
    warning: false
  });
  const tableRef = useRef();
  const rowSelected = useRef();
  const addReceiver = () => {
    if (rowSelected.current && rowSelected.current.length >= 1) {
      let collection = rowSelected.current.map(u => u.id);
      RecipientServiceApi.addEmployeeReceiver({ collection })
        .then(json => {
          if (json.message) {
            setMessage(json.message);
          }
          if (json.messages && json.messages.length > 0) {
            setMessages(json.messages);
          }
          setMessageType({ info: true, warning: false, error: false });
          props.onSuccess && props.onSuccess();
        })
        .catch(error => {
          setMessage(error);
        });
    } else {
      setMessage("NO ROWS SELECTED");
    }
  }

  function handleChange(rows) {
    rowSelected.current = rows;
  }

  return (<FormGroup>
    <Message message={message} messages={messages} info={messageType.info} error={messageType.error} warning={messageType.warning} />
    <Button onClick={addReceiver} compact primary>ADD</Button>
    <hr />
    <EmployeeList
      tableRef={tableRef}
      options={{
        debounceInterval: 1000,
        selection: true
      }}
      onSelectionChange={handleChange} />
    <hr />
    <Button onClick={addReceiver} compact primary>ADD</Button>
  </FormGroup>);
}
