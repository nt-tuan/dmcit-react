import React, { useState, useEffect } from 'react';
import MaterialTable from 'material-table';
import { Link } from 'react-router-dom';
import { Label } from 'semantic-ui-react';
import MyModal from '../../Modals/MyModal';
import EmployeeDetails from '../../Employees/Components/Details';
import { userService } from '../../../_services';


export function AccountList(props) {
  return (
    <MaterialTable
      title="ACCOUNT_LIST"
      tableRef={props.tableRef}
      columns={[
        { title: 'Username', field: 'username' },
        { title: 'Email', field: 'email' },
        {
          title: 'EMPLOYEE', render: rowData => {
            if (rowData.employeeId) {
              return <MyModal label={rowData.employeeName} header="EMPLOYEE_DETAILS" component={<EmployeeDetails id={rowData.employeeId} />} />
            } else
              return "";
          }
        },
        {
          title: 'LOCK',
          render: rowData =>
            rowData.isLock ? <Label color='red'>Lock</Label> : <Label color='green'>Available</Label>

        }
      ]}
      data={query => new Promise((resolve, reject) => {
        const postdata = {
          pageSize: query.pageSize,
          page: query.page,
          search: query.search,
          orderBy: query.orderBy ? query.orderBy.field : null,
          orderDirection: query.orderDirection === "asc" ? 0 : 1,
          filter: { ...props.filter }
        };
        userService.list(postdata)
          .then(res => {
            resolve({
              data: res.data,
              page: res.page,
              totalCount: res.totalCount
            });
          }).catch(error => {
            reject(error.message);
          });
      })}
      options={props.options}
      onSelectionChange={props.onSelectionChange}
    />
  );
}
