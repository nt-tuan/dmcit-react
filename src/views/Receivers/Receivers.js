import React, { Component, useState, useRef } from 'react';
import { Form, Input, Label, ButtonGroup, Button } from 'semantic-ui-react';
import ReceiverList from './Components/List';
import AddEmployee from './Components/AddEmployee';
import AddCustomer from './Components/AddCustomer';
import MyModal from '../Modals/MyModal';
import EditReceiver from './Components/EditReceiver';
import Message from '../Base/Messages/Message';
import { RecipientServiceApi } from '../../_services';
import { useAlert } from 'react-alert';
const download = require('downloadjs');
export default function Receivers(props) {
  const [error, setError] = useState();
  const [modal, setModal] = useState({ open: false, com: null, header: null });
  const alert = useAlert();
  const tableRef = useRef();
  const selectionRef = useRef();
  const handleSelectionChange = (rows) => {
    selectionRef.current = rows;
  }

  const checkSelectedMultipleRows = () => {
    if (selectionRef.current && selectionRef.current.length > 1) {
      setError('YOU_SELECT_TOO_MANY_RECEIVERS');
      return false;
    }
    return true;
  }

  const checkNoRowsSelect = () => {
    if (selectionRef.current && selectionRef.current.length > 0)
      return true;
    setError("NO ROWS SELECTED");
    return false;
  }

  const openAddEmployee = () => {
    setModal({
      open: true,
      com: <AddEmployee onSuccess={onUpdateSuccess} />,
      header: 'ADD_EMPLOYEE_RECEIVER'
    });
  }

  const openAddCustomer = () => {
    setModal({
      open: true,
      com: <AddCustomer onSuccess={onUpdateSuccess} />,
      header: "ADD CUSTOMER RECEIVER"
    });
  }

  const onUpdateSuccess = () => {
    setModal({ open: false });
    tableRef.current.onQueryChange();
  }

  const openEditReceiver = () => {
    if (checkNoRowsSelect()) {
      setModal({
        open: true,
        com: <EditReceiver employee={selectionRef.current[0].employeeId} customer={selectionRef.current[0].customerId} id={selectionRef.current[0].id} onSuccess={onUpdateSuccess} />,
        header: "UPDATE RECEIVER"
      });
    }
  }

  const handleExport = () => {
    RecipientServiceApi.exportReceivers({
      page: null,
      pageSize: null
    }).then(blob => {
      download(blob, new Date());
    }).catch(error => alert.error(error));
  };

  const handleDelete = () => {
    if (checkNoRowsSelect()) {
      RecipientServiceApi.deleteReceivers({ collection: selectionRef.current.map(u => u.id) });
    }
  };

  const handleImport = () => {
    props.history.push('/messaging/receivers/import');
  }

  return (<div>
    <Message error message={error} />

    <Button size="mini" compact onClick={openAddEmployee} primary>ADD_EMPLOYEE</Button>
    <Button size="mini" compact onClick={openAddCustomer} primary>ADD_CUSTOMER</Button>
    <Button size="mini" compact onClick={openEditReceiver} primary>UPDATE</Button>
    {' '}
    <Button size="mini" compact onClick={handleImport} primary>IMPORT_TO_EXCEL</Button>
    <Button size="mini" compact disabled onClick={handleExport} primary>EXPORT_TO_EXCEL</Button>
    {' '}
    <Button size="mini" compact color='red' onClick={handleDelete}>DELETE</Button>

    <hr />
    <MyModal open={modal.open} component={modal.com} header={modal.header} />
    <ReceiverList tableRef={tableRef} onSelectionChange={handleSelectionChange} options={{ deboundInterval: 1000, selection: true }} />
  </div>);
}
