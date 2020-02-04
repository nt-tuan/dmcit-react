import React, { useState, useEffect, useRef } from 'react';
import MaterialTable from 'material-table';
import { List, Segment } from 'semantic-ui-react';
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

  return <Segment style={{ height: '100%', overflowY: 'scroll'}}>
    {data && data.length > 0 ? <div>
      <h4>RECIPIENTS LIST</h4>
      <hr />
      <List divided>
        {data.map(u => {
          console.log(u);
          if (u.type == 'receiver')
            return <ReceiverListItem key={`recipient-${u.id}`} value={u} onDelete={onDelete} />
          if (u.type == 'group')
            return <GroupListItem key={`group-${u.id}`} value={u} />
        })}
      </List> </div> : <p>'NO RECIPIENTS'</p>
    }
  </Segment>;

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
