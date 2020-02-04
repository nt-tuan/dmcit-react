import React, { useState, useRef } from 'react';
import MaterialTable from 'material-table';
import { Link } from 'react-router-dom'
import MyModal from '../../Modals/MyModal';
import EmployeeDetails from './Details';
import { HRApiService } from '../../../_services';
import { useAlert } from 'react-alert';
import { Selection, DepartmentSelection } from '../../Departments/Components';
export function EmployeeList(props) {
  const [filter, setFilter] = useState({});
  const alert = useAlert();
  const thisRef = useRef();
  const ref = props.tableRef ? props.tableRef : thisRef;

  function handleDepartmentChange(e, { value, name }) {
    setFilter({ ...filter, departmentId: value });
    ref.current.onQueryChange();
  }

  const columnDef = HRApiService.employeeColumns();

  columnDef.pop();
  return (
    <div>
      {props.options && props.options.filter &&
        <div>
        <DepartmentSelection onChange={handleDepartmentChange} clearable />
          <hr />
        </div>
      }
      <MaterialTable
        title="Danh sách nhân viên"
        tableRef={ref}
        columns={columnDef}
        data={query => new Promise((resolve, reject) => {
          let postdata = {
            pageSize: query.pageSize,
            page: query.page,
            search: query.search,
            orderBy: query.orderBy ? query.orderBy.field : null,
            orderDirection: query.orderDirection === "asc" ? 0 : 1,
            filter: { ...props.filter, ...filter }
          };
          HRApiService.employeeList(postdata)
            .then(
              result => {
                if (result && result.data) {
                  resolve(result);
                } else {
                  return Promise.reject("NO DATA FOUND");
                }
              })
            .catch(
              error => {
                alert.error(error);
                resolve({ data: [], page: 0, totalCount: 0 });
              });
        })}
        options={{
          ...props.options,
          headerStyle: {
            zIndex: 1
          }
        }}
        onSelectionChange={props.onSelectionChange}
      />
    </div>
  );
}
