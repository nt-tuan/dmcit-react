import React, { useState, useEffect } from 'react';

import { Input, Button, Form, Icon, Message } from 'semantic-ui-react';
import ReceiverSelection from '../Receivers/Components/ReceiverSelection';
import { RecipientServiceApi } from '../../_services';
import MaterialTable from 'material-table';
export default function FormReceiverGroup(props) {
  const [members, setMembers] = useState(props.data.members);
  const [groupName, setGroupName] = useState(props.data.name);
  const [validation, setValidation] = useState();

  function handleChange(rawValue) {
    const selectedMember = rawValue;
    if (selectedMember == null || selectedMember == undefined)
      return;
    var existFilter = members.filter(u => u.id == selectedMember.id);
    if (existFilter.length == 0)
      setMembers([...members, selectedMember]);
    //setSelectionValue(null);
  }

  function getPostData() {
    return { name: groupName, members };
  }

  function onDeleteRow(event, rowData) {
    let newMembers = members.filter(u => u.id != rowData.id);
    setMembers(newMembers);
  }

  useEffect(() => {
    if (props.onChange) {
      props.onChange(getPostData());
    }
  }, [members, groupName]);

  useEffect(() => {
    setGroupName(props.data.name);
    setMembers(props.data.members);
  }, [props.data]);

  useEffect(() => {
    setValidation(props.validation);
  }, [props.validation]);

  const columnDef = RecipientServiceApi.receiverColumns();

  let list = members && members.length > 0 ?
    (<MaterialTable
      actions={[
        {
          icon: 'delete',
          tooltip: 'Delete Receiver',
          onClick: onDeleteRow
        }
      ]}
      title='MEMBERS'
      columns={columnDef} data={members} options={{
        paging: false
      }}
      options={{
        headerStyle: {
          zIndex: 0
        }
      }}
    />) : (<Message warning visible content='NO MEMBERS' />);



  return (<Form error={validation != null && validation != undefined}>
    <Message error content={validation ? validation.error : null} />
    <label>GROUP NAME</label>
    <Form.Input fluid onChange={(e, { value }) => setGroupName(value)} value={groupName} error={validation != null && validation.name != null} />
    <Message error list={validation && validation.name ? validation.name.errors.map(u => u.errorMessage) : []} />
    <hr />
    <label>RECEIVER</label>

    <ReceiverSelection
      name="receiver"
      onRawChange={handleChange}
      multiple={false}
    />


    <hr />
    <label>MEMBERS</label>
    {list}
  </Form>);
}
