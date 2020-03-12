import React, { useState } from 'react';
import CustomerList from './List';
import CustomerDetail from './CustomerDetail';
import { Menu } from 'antd';
import {UserAddOutlined, ImportOutlined, ExportOutlined, DeleteOutlined, EditOutlined} from '@ant-design/icons'
import MyModal from '../../Modals/MyModal';


export default function Customers(props) {
  const [selectedRows, setSelectedRows] = useState([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [modal, setModal] = useState({ com: null, expanable: null, header: null });
  const [showFilter, setShowFilter] = useState(false);

  function handleSelectionChange(keys, rows) {
    setSelectedRows(rows);
  }

  const handleAction = ({key}) => {
    console.log('ACCCCC', key);
    if(key === 'add')
      openDetail();
  }

  function openDetail() {
    if (selectedRows.length > 0) {
      let com = <CustomerDetail id={selectedRows[0].id} />
      let expanable = `/sales/customers/${selectedRows[0].id}`;
      setModal({
        com,
        expanable,
        header: 'CUSTOMER DETAIL'
      });
      setModalOpen(true);
    }
  }

  return (<div>
    <MyModal open={modalOpen} component={modal.com} onClose={() => setModalOpen(false)} expandable={modal.expandLink} header={modal.header} />
    <Menu selectable={false} onClick={handleAction} mode="horizontal">
      <Menu.Item key="add" disabled={selectedRows.length == 0}>
        <UserAddOutlined />
        New
        </Menu.Item>
      <Menu.Item key="update" disabled={selectedRows.length == 0}>
        <EditOutlined />
        Update
        </Menu.Item>
      <Menu.Item key='import'>
        <ImportOutlined />
        Import
        </Menu.Item>
      <Menu.Item key='export'>
        <ExportOutlined />
        Export
        </Menu.Item>
      <Menu.Item key='delete' disabled={selectedRows.length == 0}>
        <DeleteOutlined />
        Delete
        </Menu.Item>
    </Menu>
    <CustomerList onSelectionChange={handleSelectionChange} />
  </div>
  );
}
