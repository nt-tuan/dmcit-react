import React, { useEffect, useState } from 'react';
import { RecipientServiceApi } from '../../../_services';
import MaterialTable from 'material-table';
import { Button, Segment, Form, Icon } from 'semantic-ui-react';
import { DepartmentSelection } from '../../Departments/Components/Selection';
import MultipleDistributorSelection from '../../Sales/Distributors/MultipleSelection';
export default ReceiverList;
function ReceiverList(props) {
  const [filter, setFilter] = useState({});
  const columns = RecipientServiceApi.receiverColumns();

  const handleFilter = () => {
    props.tableRef.current.onQueryChange();
  }

  return (
    <div>
      <Segment>
        <Form size="tiny">
          <MultipleDistributorSelection multiple onSelectionChange={(e, {value}) => setFilter({...filter, distributor: value?value.map(u => u.id):null})} />
          <DepartmentSelection clearable onChange={(e, {value}) => setFilter({...filter, department: value})} />
          <Button size="mini" icon onClick={handleFilter} labelPosition='left' compact><Icon name='filter' />Filter</Button> 
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
            filter: {...props.filter, ...filter}
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
