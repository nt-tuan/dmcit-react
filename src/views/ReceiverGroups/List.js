import React, { useState, useRef } from 'react';
import MaterialTable from 'material-table';
import { RecipientServiceApi } from '../../_services';

export default function ListGroups(props) {
  const thisRef = useRef();
  const ref = props.tableRef ? props.tableRef : thisRef;
  return (
    <MaterialTable
      title='GROUP LIST'
      columns={
        [
          {
            title: 'Name',
            field: 'name'
          },
          {
            title: 'Count',
            field: 'count'
          }
        ]
      }
      data={query => new Promise((resolve, reject) => {
        let postdata = {
          pageSize: query.pageSize,
          page: query.page,
          search: query.search,
          orderBy: query.orderBy ? query.orderBy.field : null,
          orderDirection: query.orderDirection === "asc" ? 0 : 1,
          filter: query.filter
        }
        RecipientServiceApi.getGroups(postdata)
          .then(json => {
          if (json) {
            resolve({
              data: json.data,
              page: json.page,
              totalCount: json.totalCount
            }); 
          } else {
            throw new Error('NOT FOUND');
          }
        })
          .catch(error => {
            if (props.onError)
              props.onError(error);
            else {
              reject(error);
            }
          });

      })}
      tableRef={ref}
      options={{ ...props.options }}
      onSelectionChange={props.onSelectionChange}
    />
  );
}
