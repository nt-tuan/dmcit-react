import React, { useState, useEffect} from 'react';
import { customerARService } from '../../../_services';
import MaterialTable from 'material-table'
import { useAlert } from 'react-alert';
import Moment from 'react-moment';
const numeral = require('numeral');

numeral.register('locale', 'vi', {
  delimiters: {
    thousands: ' ',
    decimal: ','
  },
  abbreviations: {
    thousand: 'k',
    million: 'm',
    billion: 'b',
    trillion: 't'
  },
  currency: {
    symbol: 'đ'
  }
});

numeral.locale('vi');


export default function ReceiverLiabilityList(props) {
  const alert = useAlert();  

  return (
    <MaterialTable
      title='Công nợ khách hàng'
      columns={
        [
          {
            title: 'Customer Code',
            field: 'customerCode'
          },
          {
            title: 'Customer Name',
            field: 'customerName'
          },
          {
            title: 'DistributorCode',
            field: 'distributorCode'
          },
          {
            title: 'Liability',
            key: 'Amount',
            render: rowData => {
              return numeral(rowData.amount).format('0,0')
            },
            defaultSort: 'desc',
            cellStyle: {textAlign:'right'}
          }, {
            title: 'DateModified',
            key: 'createdDate',
            render: rowData => {
              return <Moment fromNow>{rowData.createdDate}</Moment>
            }
          }
        ]
      }
      data={query => new Promise((resolve, reject) => {
        const postdata = {
          pageSize: query.pageSize,
          page: query.page,
          search: query.search,
          orderBy: query.orderBy ? query.orderBy.key: 'Amount',
          orderDirection: query.orderDirection === "asc" ? 0 : 1,
          filter: props.filter
        };
        customerARService.getReceiverLiability(postdata)
          .then(json => {
            if (json && json.data) {
              resolve({
                data: json.data,
                page: json.page,
                totalCount: json.totalCount,
                filter: props.filter
              });
            } else {
              throw new Error('NO DATA FOUND');
            }
          }).catch(error => {
            alert.error(error.message);
            resolve({
              data: [],
              page: 0,
              totalCount: 0
            });
          });
      })}
    />
    );
}
