import React, { Component } from 'react';
import MaterialTable from 'material-table';
import { Link } from 'react-router-dom';
import { DepartmentDetail, DepartmentList, DepartmentUpdate } from './Components';
import EmployeeDetails from '../Employees/Components/Details';
import { Button, ButtonGroup, Modal, Header, Icon, Confirm, Segment } from 'semantic-ui-react';
import MyModal from '../Modals/MyModal';
import { HRApiService } from '../../_services';

class Departments extends Component {
  constructor(props) {
    super(props);
    this.state = {
      modalOpen: false,
      modal: {
      },
      confirm: {
        open: false,
        content: false,
        callback: null
      },
      selectedRows: []
    };
    this.tableRef = React.createRef();
    this.handleSelectionChange = this.handleSelectionChange.bind(this);
    this.handleDetailsOpen = this.handleDetailsOpen.bind(this);
    this.handleUpdateOpen = this.handleUpdateOpen.bind(this);
    this.handleConfirm = this.handleConfirm.bind(this);
    this.handleDeleteOpen = this.handleDeleteOpen.bind(this);
    this.handleExport = this.handleExport.bind(this);
  }

  handleSelectionChange(rows) {
    var f = [];
    for (let i = 0; i < rows.length; i++) {
      if (f.filter(u => u.id == rows[i].id).length == 0) {
        f.push(rows[i]);
      }
    }
    this.setState({ selectedRows: f });
  }

  checkSelectedMultipleRows() {
    const selectedRows = this.state.selectedRows;
    if (selectedRows == null)
      return false;
    if (selectedRows.length < 1) {
      this.setState({ error: "NO_DEPARTMENT_SELECTED" });
      return true;
    }
    if (selectedRows.length > 1) {
      this.setState({ error: "MULTIPLE_DEPARTMENTS_SELECTED" });
      return true;
    }
    return false;
  }

  getSelectedRowId() {
    const selectedRowId = this.state.selectedRows && this.state.selectedRows.length > 0 ? this.state.selectedRows[0].id : null;
    return selectedRowId;
  }

  handleDetailsOpen() {
    const selectedRowId = this.getSelectedRowId();
    if (this.state.openModal || this.checkSelectedMultipleRows())
      return;
    if (!selectedRowId)
      return;
    let com = <DepartmentDetail id={selectedRowId} />;
    let expandable = `/hr/departments/detail/${selectedRowId}`;
    let header = `DEPARTMENT_DETAILS`;

    this.setState({
      modalOpen: true,
      modal: {
        com,
        expandable,
        header
      }
    });
  }

  handleUpdateOpen() {
    if (this.state.openUpdate || this.checkSelectedMultipleRows())
      return;
    const selectedRowId = this.getSelectedRowId();
    if (!selectedRowId)
      return;
    let com = <DepartmentUpdate id={selectedRowId} />;
    let expandable = `/hr/departments/update/${selectedRowId}`;
    let header = `DEPARTMENT_UPDATE`;

    this.setState({
      modalOpen: true,
      modal: {
        com,
        expandable,
        header
      }
    });
  }

  handleDeleteOpen() {
    if (this.state.selectedRows == null || this.state.selectedRows.length == 0)
      return;
    this.setState({
      confirm: {
        ...this.state.confirm,
        open: true,
        content: 'CONFIRM_DELETE',
        callback: this.deleteDepartments.bind(this)
      }
    });
  }

  deleteDepartments() {
    console.log(`DELETE ${this.state.selectedRows.map(u => u.id)}`);
    fetch('/api/hr/dept/delete', {
      method: 'POST',
      body: JSON.stringify({ collection: this.state.selectedRows.map(u => u.id) }),
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json'
      }
    })
      .then(response => response.json())
      .then(jres => {
        if (jres.message) {
          this.setState({
            modalOpen: true,
            modal: {
              com: <div>{jres.message}</div>,
              expanable: null,
              header: "ERROR"
            }
          });
        }
      });
    this.tableRef.current.onQueryChange();
  }

  handleConfirm() {
    if (this.state.confirm.callback) {
      this.state.confirm.callback();
    }
    this.setState({ confirm: { ...this.state.confirm, open: false } });
  }

  handleExport() {
    HRApiService.departmentExport()
      .then(blob => {
      })
      .catch(err => {
      });
  }

  render() {
    const tableOptions = {
      debounceInterval: 1500,
      selection: true,
      paging: false,
      size: 'small'
    };
    return (
      <Segment>
        <MyModal open={this.state.modalOpen} component={this.state.modal.com} onClose={() => this.setState({ modalOpen: false })} expandable={this.state.modal.expandable} header={this.state.modal.header} />

        <Confirm
          open={this.state.confirm.open}
          content={this.state.confirm.content}
          onCancel={() => { this.setState({ confirm: { ...this.state.confirm, open: false } }) }}
          onConfirm={this.handleConfirm}
        />
        <ButtonGroup basic>
          <Button onClick={this.handleAddOpen} icon='plus'/>
          <Button onClick={this.handleDetailsOpen} icon='magnify' />
          <Button onClick={this.handleUpdateOpen} icon='edit' />
          <Button primary onClick={this.handleExport} icon='download' />
          <Button primary onClick={() => this.props.history.push('/hr/departments/import')} icon='file excel' />
          <Button onClick={this.handleDeleteOpen} color="red" icon='trash' />
        </ButtonGroup>
        <hr />
        <DepartmentList tableRef={this.tableRef}
          options={tableOptions}
          onSelectionChange={this.handleSelectionChange} />
      </Segment>
    );
  }
}

export default Departments;
