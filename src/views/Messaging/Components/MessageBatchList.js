import React, { useState, useRef } from 'react';
import { Form, FormGroup, Icon } from 'semantic-ui-react';
import MaterialTable from 'material-table';
import DatePicker from 'react-datepicker';
import { MessagingServiceApi } from '../../../_services/messaging';
import Message from '../../Base/Messages/Message';
import { useAlert } from 'react-alert';

import "react-datepicker/dist/react-datepicker.css";

export default function MessageBatchList(props) {
  const [startDate, setStartDate] = useState();
  const [endDate, setEndDate] = useState();
  const thisRef = useRef();
  const tableRef = props.tableRef ? props.tableRef : thisRef;
  const alert = useAlert();
  const defaultData = {
    data: [],
    page: 0,
    totalCount: 0
  }

  function viewRowDetail(event, rowData) {
    props.history.push({ pathname: `/messaging/batches/${rowData.id}` });
  }

  function onFilter() {
    tableRef.current.onQueryChange();
  }

  return (
    <div>
      <Form>
        <FormGroup>
          <Form.Field>
            <label>FROM DATE</label>
            <DatePicker
              selected={startDate}
              onChange={date => setStartDate(date)}
              isClearable
            />
          </Form.Field>
          <Form.Field>
            <label>END DATE</label>
            <DatePicker
              selected={endDate}
              onChange={date => setEndDate(date)}
              isClearable
            />
          </Form.Field>
          <Form.Field>
            <label>&nbsp;</label>
            <Form.Button onClick={onFilter} primary>GO</Form.Button>
          </Form.Field>
        </FormGroup>
      </Form>
      <hr />
      <MaterialTable
        tableRef={tableRef}
        actions={[
          {
            icon: () => <Icon size='tiny' name='magnify' />,
            tooltip: 'Detail',
            onClick: viewRowDetail
          }
        ]}
        columns={[
          {
            title: 'Id',
            field: 'id'
          },
          {
            title: 'SENT TIME',
            key: 'ActionTime',
            field: 'sentDate'
          },
          {
            title: 'FINISH TIME',
            field: 'finishDate'
          },
          {
            title: 'SENT BY',
            field: 'createdBy'
          }, {
            title: 'MESSAEG COUNT',
            field: 'count'
          }
        ]}
        data={query => new Promise((resolve, reject) => {
          let postData = {
            filter: {
              startDate,
              endDate
            },
            pageSize: query.pageSize,
            page: query.page,
            search: query.search,
            orderBy: query.orderBy ? query.orderBy.key: null,
            orderDirection: query.orderDirection === "asc" ? 1 : 0
          };
          MessagingServiceApi.getMessageBatches(postData)
            .then(json => {
              if (json && json.data) {
                resolve({
                  data: json.data,
                  pageSize: json.pageSize,
                  page: json.page,
                  totalCount: json.totalCount
                });
              } else {
                resolve(defaultData);
                alert.error('NOT FOUND');
              }
            })
            .catch(error => {
              resolve(defaultData);
              alert.error(error);
            });
        })}
        search={false}
        options={{
          showTitle: false,
          toolbar: false,

        }}
      />
    </div>
  )
}
