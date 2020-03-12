import React, { useEffect, useState } from 'react';
import MaterialTable from 'material-table';
import MyModal from '../../Modals/MyModal';
import { saleServices } from '../../../_services';
import { saleActions } from '../../../_actions';
import DistributorSelection from '../Distributors/Selection'
import { Table } from '../../Base/Tables/Table';
import { Accordion, Label, Icon, Form } from 'semantic-ui-react'
import { connect } from 'react-redux';
import { useAlert } from 'react-alert';
import Message from '../../Base/Messages/Message';

function CustomerList({ onSelectionChange }) {
  const [distributors, setDistributors] = useState([]);
  useEffect(() => {
    saleServices.getDistributors().then(json => {
      setDistributors(json.data);
    }).catch();
  }, []);

  const columns = [
    {
      title: 'CODE',
      dataIndex: 'code'
    },
    {
      title: 'NAME',
      dataIndex: 'name'
    },
    {
      title: 'DISTRIBUTOR',
      dataIndex: 'distributor',
      render: (text, row) => row.distributor.name,
      filters: distributors.map(({ id, name }) => ({ value: id, text: name }))
    },
    {
      title: 'CATEGORY',
      dataIndex: 'category'
    }
  ];

  const rowSelection = () => {
    if (onSelectionChange)
      return {
        onChange: (selectedRowKeys, selectedRows) => {
          onSelectionChange && onSelectionChange(selectedRowKeys, selectedRows);
        }
      }
    return null;
  };

  return (<div>
    <Table
      rowKey={r => `${r.distributor}_${r.code}`}
      columns={columns}
      query={postData => saleServices.getCustomers(postData).then(json => {
        if (json.data) {
          const { data, page, totalCount } = json.data;
          return {
            data: data.map(u => {
              if (u.person) {
                return { ...u, name: u.person.displayname, category: 'Person' }
              }
              if (u.business)
                return { ...u, name: u.business.displayname, category: 'Business' }
              return { ...u }
            }), current: page, total: totalCount
          };
        } else {
          return Promise.reject({ message: 'NO DATA FOUND' });
        }
      })}
      rowSelection={rowSelection()}
    />
  </div>
  );
}
export default CustomerList;
