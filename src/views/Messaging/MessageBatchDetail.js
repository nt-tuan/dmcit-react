import React, { useState, useEffect } from 'react';
import { MessagingServiceApi } from '../../_services/messaging';
import { useAlert } from 'react-alert';
import { Label } from 'semantic-ui-react';
import MaterialTable from 'material-table';
export default function MessageBatchDetail(props) {
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState();
  const id = props.match.params.id ? parseInt(props.match.params.id) : props.id;
  const alert = useAlert();

  useEffect(() => {
    setLoading(true);
    MessagingServiceApi.getMessageBatch(id)
      .then(json => {
        if (json && json.data) {
          setData(json.data);
          setLoading(false);
        } else {
          throw new Error('NO DATA FOUND');
        }
      }).
      catch(error => {
        alert.error(error.message);
        setLoading(false);
        props.history.push({ pathname: '/messaging/batches' });
      });
  }, []);

  return loading ? <p>Loading...</p> : (<div>
    <h6>SEND TIME</h6>
    <h4>{data.sentDate}</h4>
    <h6>FINISH TIME</h6>
    <h4>{data.finishDate}</h4>
    {data.createdBy && <div><h6>Người gửi</h6><h4>data.created.name</h4></div>}
    <MaterialTable
      title="MESSAGE LIST"
      columns={[
        {
          title: 'Id',
          field: 'id'
        },
        {
          title: 'Nhà cung cấp',
          field: 'provider'
        },
        {
          title: 'Địa chỉ',
          field: 'addressee'
        },
        {
          title: 'Nội dung',
          field: 'content'
        },
        {
          title: 'Response',
          field: 'responseMessage'
        },
        {
          title: 'Status',
          render: rowData => {
            if (rowData.status == -1) {
              return <Label color='red'>ERROR</Label>
            } else if (rowData.status == 3)
              return <Label color='green'>SUCCEED</Label>
            else if (rowData.status == 1)
              return <Label color='blue'>SENDING</Label>
            else if (rowData.status == 2)
              return <Label color='blue'>WAITING</Label>
            else return null;
          }
        },
        {
          title: 'Ngày kết thúc',
          field: 'sentTime',
          key: 'sentTime'
        }
      ]}
      data={query => new Promise((resolve, reject) => {
        let postData = {
          pageSize: query.pageSize,
          page: query.page,
          search: query.search,
          orderBy: query.orderBy ? query.orderBy.field : null,
          orderDirection: query.orderDirection === "asc" ? 0 : 1,
          filter: { ...props.filter, messageBatch: id }
        };
        MessagingServiceApi.getMessages(postData)
          .then(json => {
            if (json && json.data)
              resolve({
                data: json.data,
                pageSize: json.pageSize,
                page: json.page,
                totalCount: json.totalCount
              });
            else {
              throw new Error('NO DATA FOUND');
            }
          })
          .catch(error => {
            alert.error(error.message);
            resolve([]);
          });
      })}

      options={{
        search: false,
        sorting: false
      }}
    />
  </div>)
}
