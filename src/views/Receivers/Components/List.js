import React, { useEffect, useState } from 'react';
import { RecipientServiceApi } from '../../../_services';
import MaterialTable from 'material-table';
import { Select, Segment, Form } from 'semantic-ui-react';
import { DepartmentSelection } from '../../Departments/Components/Selection';
import MultipleDistributorSelection from '../../Sales/Distributors/MultipleSelection';
export default ReceiverList;
function ReceiverList(props) {
  const [columns, setColumns] = useState(RecipientServiceApi.receiverColumns());

  return (
    <div>
      <Segment>
        <Form>
          <MultipleDistributorSelection />
          <DepartmentSelection />
        </Form>
      </Segment>
      <MaterialTable
        title="MESSAGE RECEIVER LIST"
        tableRef={props.tableRef}
        columns={columns}
        data={query => new Promise((resovle, reject) => {
          let postdata = {
            pageSize: query.pageSize,
            page: query.page,
            search: query.search,
            orderBy: query.orderBy ? query.orderBy.field : null,
            orderDirection: query.orderDirection === "asc" ? 0 : 1,
            filter: props.filter
          };
          RecipientServiceApi.getReceivers(postdata)
            .then(json => {
              resovle({
                data: json.data.data,
                page: json.data.page,
                totalCount: json.data.totalCount
              });
            })
            .catch(error => {
              reject(error);
            });
        })}
        options={{
          ...props.options,
          debounceInterval: 1000,
          headerStyle: {
            zIndex: 1
          }
        }}
        onSelectionChange={props.onSelectionChange}

      />
    </div>);
}
