import React, { useState, useEffect, useRef } from 'react';
import MaterialTable from 'material-table';
import { RecipientServiceApi } from '../../../_services';
import Message from '../../Base/Messages/Message';

export default function ReceiverProviders(props) {
  const [message, setMessage] = useState();
  const tableSelection = useRef();
  const thisRef = useRef();
  const tableRef = props.tableRef ? props.tableRef : thisRef;
  function handleChange(rows) {
    tableSelection.current = rows;
  }

  function deleteAddress(event, rowData) {
    RecipientServiceApi.deleteAddress(rowData.id,
      { provider: rowData.provider })
      .then(json => {
        tableRef.current.onQueryChange();
      })
      .catch(error => {
        setMessage(error);
      });
  }

  return (<div>
    <Message message={message} error></Message>
    <MaterialTable
      tableRef={tableRef}
      columns={[
        {
          title: 'PROVIDER',
          render: rowData => {
            if (rowData.provider) {
              return rowData.provider.name;
            }
            return null;
          }
        },
        {
          title: 'ADDRESS',
          field: 'receiverAddress'
        }
      ]}
      title='RECEIVER ADDRESSES'
      options={
        {
          paging: false,
          search: false
        }
      }
      onSelectionChange={handleChange}
      data={query => new Promise((resolve, reject) => {
        RecipientServiceApi.getRecieverProviders(props.id)
          .then(json => {
            if (json && json.data)
              resolve({
                data: json.data,
                page: 0,
                totalCount: json.data.length
              });
            else {
              throw new Error("NOT FOUND");
            }
          })
          .catch(error => {
            setMessage(error);
          });
      })}
      actions={
        [{
          icon: 'delete',
          tooltip: 'Delete Address',
          onClick: deleteAddress
        }]
      }
    />
  </div>
  );
}
