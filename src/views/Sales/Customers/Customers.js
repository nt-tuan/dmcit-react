import React, { useState, useEffect, useRef } from 'react';
import CustomerList from './List';
import CustomerDetail from './CustomerDetail';
import Message from '../../Base/Messages/Message';
import MyModal from '../../Modals/MyModal';
import { ButtonGroup, Segment, Button } from 'semantic-ui-react';


export default function Customers(props) {
  const tableRef = useRef();
  const selectionRef = useRef();
  const [modalOpen, setModalOpen] = useState(false);
  const [modal, setModal] = useState({ com: null, expanable: null, header: null });
  const [showFilter, setShowFilter] = useState(false);

  function handleSelectionChange(rows) {
    selectionRef.current = rows;
  }

  function openDetail() {
    console.log(selectionRef.current);
    if (selectionRef.current && selectionRef.current.length > 0) {
      let com = <CustomerDetail id={selectionRef.current[0].id} />
      let expanable = `/sales/customers/${selectionRef.current[0].id}`;
      setModal({
        com,
        expanable,
        header: 'CUSTOMER DETAIL'
      });
      setModalOpen(true);
    }
  }

  return (<Segment>
    <MyModal open={modalOpen} component={modal.com} onClose={() => setModalOpen(false)} expandable={modal.expandLink} header={modal.header} />
    <ButtonGroup compact>
      <Button onClick={openDetail} primary>
        DETAIL
      </Button>
      <Button onClick={openDetail} primary>
        UPDATE
      </Button>
      <Button onClick={openDetail} primary>
        IMPORT
      </Button>
      <Button onClick={openDetail} primary>
        EXPORT
      </Button>
      <Button onClick={openDetail} color='red'>
        DELETE
      </Button>
    </ButtonGroup>
    <ButtonGroup floated='right'>
      <Button primary compact icon='filter'
        onClick={() => {
          setShowFilter(!showFilter);
        }}>
      </Button>
    </ButtonGroup>
    <hr />
    <CustomerList tableRef={tableRef} onSelectionChange={handleSelectionChange} options={{
      debounceInterval: 1000,
      selection: true,
      filter: showFilter
    }} />
  </Segment>
  );
}
