import React, { useState, useEffect, useRef } from 'react';
import MaterialTable from 'material-table';
import { List } from 'antd';
import ReceiverListItem from '../../Messaging/Components/ReceiverListItem';
import GroupListItem from '../../ReceiverGroups/Components/GroupListItem';
export default function ReceiverList(props) {
  const [data, setData] = useState();

  useEffect(() => {
    setData(props.data);
  }, [props.data]);

  function onDelete(row) {
    var ndata = data.filter(u => u.type != row.type || u.id != row.id);
    props.onDataChange(ndata);
  }

  return data && data.length > 0 ? <div>
    <List
      header="RECIPIENTS LIST"
      dataSource={data}
      size="small"
      renderItem={u => {
        if (u.type == 'receiver')
          return <ReceiverListItem key={`recipient-${u.id}`} value={u} onDelete={onDelete} />
        if (u.type == 'group')
          return <GroupListItem key={`group-${u.id}`} value={u} />
      }} />
  </div> : <p>'NO RECIPIENTS'</p>;



  return <MaterialTable
    name="RECEIVER MESSAGE LIST"
    title='RECEIVERS'
    actions={[{
      icon: 'close',
      tooltip: 'Remove',
      onClick: onDelete
    }]}
    columns={[
      {
        title: 'NAME',
        render: rowData => {
          if (rowData.type == 'receiver') {
            return <ReceiverListItem value={rowData} />
          } else if (rowData.type == 'group') {
            return <GroupListItem value={rowData} />
          }
        }
      }
    ]}
    data={data}
    options={
      {
        paging: false,
        search: false,
        headerStyle: {
          zIndex: 0
        },
        showTitle: false,
        header: false,
        toolbar: false

      }
    }
    localization={{
      body: {
        emptyDataSourceMessage: 'NO RECEIVERS'
      }
    }}
  />
}
