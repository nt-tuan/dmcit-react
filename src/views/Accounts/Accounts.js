import React, { useState, useEffect } from 'react';
import MyModal from '../Modals/MyModal';
import { AccountList, AddAccount as Add, UpdateAccount as Update, ResetPassword, AccountDetail as Details} from './Components';
import { Segment, ButtonGroup, Button, Confirm } from 'semantic-ui-react';
import {userService} from '../../_services'
import { default as Message } from '../Base/Messages/Message';
import {LayoutContext} from '../../containers/DefaultLayout/LayoutContext';

let selectedRows = null;

export default function Accounts() {
  const [modalOpen, setModalOpen] = useState(false);
  const [modal, setModal] = useState({});
  const [isSelected, setIsSelected] = useState(false);
  const [confirm, setConfirm] = useState({
    open: false,
    content: false,
    callback: null
  });
  const layout = React.useContext(LayoutContext)
  let tableRef = React.createRef();
  const handleSelectionChange = (rows) => {
    selectedRows = rows;
    setIsSelected(selectedRows && selectedRows.length>0);
  };
  const checkSelection = () => {
    return !selectedRows || selectedRows.length === 0;
  }
  const handleConfirm = () => {
    if (confirm.callback) {
      confirm.callback();
    }
    setConfirm({ open: false });
  }
  const handleOpenDetails = () => {
    if (checkSelection()) {
      return;
    }
    setModalOpen(true);
    setModal({
      com: <Details id={selectedRows[0].id} />,
      expandLink: `/hr/accounts/details/${selectedRows[0].id}`,
      header: `ACCOUNT_DETAILS`
    });
  }
  const handleOpenAdd = () => {
    setModalOpen(true);
    setModal({
      com: <Add />,
      expandLink: `/hr/accounts/add`,
      header: `ACCOUNT_DETAILS`
    });
  }

  const handleOpenUpdate = () => {
    if (checkSelection()) {
      return;
    }
    setModalOpen(true);
    setModal({
      com: <Update id={selectedRows[0].id} />,
      expandLink: `/hr/accounts/details/${selectedRows[0].id}`,
      header: `ACCOUNT_DETAILS`
    });
  }

  const handleResetPassword = () => {
    if (checkSelection()) {
      return;
    }
    const id = selectedRows[0].id;
    const username = selectedRows[0].username;
    userService.resetPassword(id)
    .then(p => layout.showSuccess(`New password of user ${username} is: ${p}`))
    .catch(layout.showError);
  }

  const handleLock = () => {
    if (checkSelection()) {
      return;
    }
    const id = selectedRows[0].id;
    const username = selectedRows[0].username;
    userService.lock(id)
    .then(() => layout.showSuccess(`Lock user ${username} successfully.`))
    .catch(layout.showError);
  };
  const handleUnlock = () => {
    if (checkSelection()) {
      return;
    }
    const id = selectedRows[0].id;
    const username = selectedRows[0].username;
    userService.unlock(id)
    .then(() => layout.showSuccess(`Unlock user ${username} successfully.`))
    .catch(layout.showError);
  };

  return (
    <Segment>
      <ButtonGroup basic size='small'>
        <Button icon='plus' onClick={handleOpenAdd} />
        <Button onClick={handleOpenDetails} disabled={!isSelected} icon='magnify' />
        <Button onClick={handleOpenUpdate} disabled={!isSelected} icon='edit' />
        <Button disabled={!isSelected} onClick={handleResetPassword} icon='key' />
        <Button disabled={!isSelected} onClick={handleLock} icon='lock' />
        <Button disabled={!isSelected} onClick={handleUnlock} icon='unlock' />
      </ButtonGroup>
      <hr />
      <AccountList tableRef={tableRef} onSelectionChange={handleSelectionChange}
        options={{
          debounceInterval: 1000,
          selection: true,
          scroll: true,
        }} />
      <MyModal open={modalOpen} component={modal.com} onClose={() => setModalOpen(false)} expandable={modal.expandLink} header={modal.header} />
      <Confirm open={confirm.open} content={confirm.content} onCancel={() => setConfirm({ open: false })} onConfirm={handleConfirm} />
    </Segment>
  )
}
