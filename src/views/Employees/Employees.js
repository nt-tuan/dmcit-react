import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import MaterialTable from 'material-table'
import { Button, ButtonGroup, Segment, Confirm } from 'semantic-ui-react';
import EmployeeUpdate from './Components/Update';
import EmployeeDetails from './Components/Details'
import { EmployeeList } from './Components'
import EmployeeAdd from './Components/Add';
import MyModal from '../Modals/MyModal';
import { HRApiService } from '../../_services/hr'
import { useAlert } from 'react-alert';
function EmployeesView(props) {

  const [confirm, setConfirm] = useState({});
  const [modal, setModal] = useState({});
  const [selectedRows, setSelectedRows] = useState();

  const tableRef = useRef();
  const alert = useAlert();

  function handleSelectionChange(rows) {
    setSelectedRows(rows);
  }

  function checkSelectedMultipleRows() {
    if (selectedRows && selectedRows.length > 1) {
      alert.error("YOU_SELECT_TOO_MANY_EMPLOYEE");
      return true;
    }
    return false;
  }

  function getFirstSelectedRowId() {
    if (selectedRows && selectedRows.length > 0)
      return selectedRows[0].id;
    return null;
  }

  function handleEmployeeNewOpen() {
  }

  function handleEmployeeDetailsOpen() {
    const selectedRowId = getFirstSelectedRowId();
    if (modal.modalOpen || checkSelectedMultipleRows() || !selectedRowId)
      return;

    const com = <EmployeeDetails id={selectedRowId} />;
    const expandLink = `/hr/employees/detail/${selectedRowId}`;
    const header = `EMPLOYEE_DETAILS`;

    setModal({
      modalOpen: true,
      com,
      expandLink,
      header
    });
  }

  function handleEmployeeUpdateOpen() {
    const selectedRowId = getFirstSelectedRowId();
    if ((modal && modal.openModal) || checkSelectedMultipleRows() || !selectedRowId)
      return;

    const com = <EmployeeUpdate id={selectedRowId} />;
    const expandLink = `/hr/employees/update/${selectedRowId}`;
    const header = `EMPLOYEE_UPDATE`;

    setModal({
      modalOpen: true,
      com, expandLink, header
    });
  }

  function handleEmployeeDeleteOpen() {
    if (selectedRows.length == 0)
      return;
    setConfirm(
      {
        ...confirm,
        open: true,
        content: 'CONFIRM_DELETE',
        callback: deleteEmployees.bind(this)
      }
    );
  }

  function deleteEmployees() {
    console.log(`DELETE ${selectedRows.map(u => u.id)}`);
    HRApiService.employeeDelete({ collection: selectedRows.map(u => u.id) });
    tableRef.current.onQueryChange();
  }

  function handleConfirm() {
    if (confirm.callback) {
      confirm.callback();
    }
    setConfirm({ ...confirm, open: false });
  }

  return (
    <Segment>

      <MyModal open={modal.modalOpen} component={modal.com} onClose={() => setModal({modalOpen: false})} expandable={modal.expandLink} header={modal.header} />


      <Confirm
        open={confirm.open}
        content={confirm.content}
        onCancel={() => { setConfirm({ ...confirm, open: false }) }}
        onConfirm={handleConfirm}
      />
      <ButtonGroup>
        <Button onClick={handleEmployeeNewOpen} color="green">New</Button>
        <Button onClick={handleEmployeeDetailsOpen} primary>Details</Button>
        <Button onClick={handleEmployeeUpdateOpen} primary>Edit</Button>
        <Button primary onClick={() => props.history.push('/hr/employees/import')}>Import</Button>
        <Button primary>Export All</Button>
        <Button onClick={handleEmployeeDeleteOpen} color="red">Delete</Button>

      </ButtonGroup>
      <hr />
      <EmployeeList tableRef={tableRef} onSelectionChange={handleSelectionChange} options={{
        debounceInterval: 1000,
        selection: true
      }} />
    </Segment>
  );
}

export default EmployeesView;
