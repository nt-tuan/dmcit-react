import React from 'react';
import Moment from 'react-moment';
import { Message } from 'semantic-ui-react';
import { fileFetch, defaultFetch} from '../_helpers/api-header';
export const HRApiService = {
  employeeColumns: getEmployeeColumns,
  employeeList: employeesListApi,
  employeeReview,
  employeeImport,
  employeeDetail,
  employeeDelete,
  employeeUpdate,
  departmentReview,
  departmentImport,
  departmentList,
  departmentDetail,
  departmentUpdate,
  departmentExport
}

function getEmployeeColumns() {
  const employeeColumns =
    [{
      title: 'Mã',
      field: 'code'
    },
    {
      title: 'Tên nhân viên',
      render: rowData => rowData.person ? rowData.person.fullname : null
    },
    {
      title: 'Tên thường gọi',
      render: rowData => rowData.person ? rowData.person.displayname : null
    },
    {
      'title': 'Trực thuộc', render: rowData => {
        if (rowData.dept) {
          return <strong>{rowData.dept.name}({rowData.dept.code})</strong>;
        }
        return null;
      }
    }, {
      title: 'Ngày sinh', render: rowData => {
        if (rowData.person && rowData.person.birthday) {
          return <Moment date={rowData.person.birthday} format="DD/MM/YYYY" />
        }
      }
    },
    {
      title: 'Email', render: rowData => rowData.person ? rowData.person.email : null
    },
    {
      title: "Lỗi", render: rowData => {
        if (rowData.messages) {
          const rs = [];
          rowData.messages.forEach((value, index) => {
            let color = null;
            if (value.type == "danger")
              color = "red";
            else if (value.type == "warning")
              color = "yellow";
            if (value.key != null && value.key.length > 0) {
              rs.push(<Message key={index} color={color}><strong>{value.key}</strong>: {value.content}</Message>);
            } else {
              rs.push(<Message key={index} color={color}>{value.content}</Message>);
            }
          });
          return <div>{rs}</div>
        } else {
          return null;
        }
      }
    }
    ];
  return employeeColumns;
}


function employeesListApi(postdata) {
  return defaultFetch(`/api/hr/emp`, postdata);
  //defaultFetchChain(
  //  fetch(`/api/hr/emp`, {
  //    ...fixedRequestOptions,
  //    body: JSON.stringify(postdata),
  //  }), success, error);
}

function employeeReview(data) {
  return fileFetch(`/api/hr/ReviewEmployeeExcel`, data);
}
function employeeImport(data) {
  return defaultFetch(`/api/hr/ImportEmployees`, data);
}

function employeeDetail(id) {
  return defaultFetch(`/api/hr/emp/${id}`);
}

function employeeUpdate(postData) {
  return defaultFetch(`/api/hr/emp/update`, postData);
}

function employeeDelete(data) {
  return defaultFetch('/api/hr/emp/delete', data);
}

function departmentList(query) {
  return defaultFetch('/api/hr/depts', query);
}

function departmentDetail(id) {
  return defaultFetch(`/api/hr/dept/detail/${id}`);
}

function departmentUpdate(id, postData) {
  return defaultFetch(`/api/hr/dept/update/${id}`, postData);
}

function departmentExport(postData) {
  return defaultFetch(`/api/hr/dept/export`, postData);
}

function departmentReview(data) {
  return fileFetch(`/api/hr/ReviewDepartmentExcel`, data);
}
function departmentImport(data) {
  return defaultFetch(`/api/hr/ImportDepartments`, data);
}
