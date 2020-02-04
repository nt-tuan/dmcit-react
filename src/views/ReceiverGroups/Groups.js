import React, { useState, useEffect, useRef } from 'react';
import { AddGroup, EditGroup, ListGroups } from './index';
import MyModal from '../Modals/MyModal';
import { Button, ButtonGroup } from 'semantic-ui-react';


export default function Groups(props) {
  const [modal, setModal] = useState({});
  const tableRef = useRef();
  const selectedRows = useRef();
  function handleChange(rows) {
    selectedRows.current = rows;
  }

  function onOpenAdd() {
    let m = {
      open: true,
      com: <AddGroup onSuccess={onModalClose} />,
      expandable: '/messaging/groups/add'
    }
    setModal(m);
  }

  function onOpenEdit() {
    if (selectedRows && selectedRows.current && selectedRows.current.length > 0) {
      const id = selectedRows.current[0].id;
      const m = {
        open: true,
        com: <EditGroup id={id} onSuccess={onModalClose} />,
        expandable: `/messaging/groups/edit/${id}`
      }
      setModal(m);
    }
  }

  function onModalClose() {
    setModal({ open: false });
    tableRef.current.onQueryChange();
  }

  return (
    <div>
      <MyModal open={modal.open} component={modal.com} header={modal.header} expandable={modal.expandable} onClose={onModalClose} />
      <ButtonGroup>
        <Button primary onClick={onOpenAdd}>ADD</Button>
        <Button primary onClick={onOpenEdit}>EDIT</Button>
        <Button color="red" disabled>DELETE</Button>
      </ButtonGroup>
      <hr />
      <ListGroups tableRef={tableRef} selection={true} options={{ selection: true }} onSelectionChange={handleChange} />
    </div>
  );
}
