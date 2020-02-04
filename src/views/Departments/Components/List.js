import React, { useEffect, useState } from 'react';
import MaterialTable from 'material-table';
import {DepartmentDetail} from './'
import EmployeeDetails from '../../Employees/Components/Details';
import MyModal from '../../Modals/MyModal';
import { HRApiService } from '../../../_services';
import { useAlert } from 'react-alert';
export function DepartmentList(props) {
  const alert = useAlert();
  const [data, setData] = useState([]);
  const columnDef = [
    { title: 'Mã', field: 'code' },
    { title: 'Tên bộ phận/ phòng ban', field: 'name' },
    {
      'title': 'Trực thuộc', render: rowData => {
        if (rowData.parentId) {
          return <label>{rowData.parentName} </label>
        }
        return null;
      }
    },
    {
      title: 'Quản lí', render: rowData => {
        return <MyModal label={rowData.managerName} header={"EMPLOYEE_DETAILS"} component={<EmployeeDetails id={rowData.managerId} />} />
      }
    }
  ];
  function queryData(query) {
    return new Promise((resolve, reject) => {
      let postdata = {
        pageSize: 1000,
        page: 0,
        search: query.search,
        orderBy: query.orderBy ? query.orderBy.field : null,
        orderDirection: query.orderDirection === "asc" ? 0 : 1
      };
      HRApiService.departmentList(JSON.stringify(postdata),
        json => {
          if (json && json.result) {
            resolve({
              data: json.result.depts,
              page: 0,
              totalCount: json.result.total
            });
          }
          else {
            throw new Error('NO DATA FOUND');
          }
        },
        error => {
          alert.error(error);
        }
      );
    })
  }

  useEffect(() => {
    const postdata = {
      pageSize: 1000,
      page: 0
    };
    HRApiService.departmentList(postdata)
      .then(
        json => {
          if (json && json.data) {
            setData(json.data);
          }
          else {
            throw new Error('NO DATA FOUND');
          }
        }).catch(
          error => {
            alert.error(error);
            setData([]);
          });
  }, []);

  return (
    <div>
      <MaterialTable
        title="DEPARTMENT LIST"
        tableRef={props.tableRef}
        columns={columnDef}
        data={data}
        parentChildData={(row, rows) => rows.find(a => a.id === row.parentId)}
        options={props.options}
        onSelectionChange={props.onSelectionChange}
      />
    </div>
  );
}

