import React, { useEffect, useRef } from 'react';
import MaterialTable from 'material-table';
import MyModal from '../../Modals/MyModal';
import { saleServices } from '../../../_services';
import { saleActions } from '../../../_actions';
import DistributorSelection from '../Distributors/Selection'
import { Accordion, Label, Icon, Form } from 'semantic-ui-react'
import { connect } from 'react-redux';
import { useAlert } from 'react-alert';
import Message from '../../Base/Messages/Message';

function _customerList(props) {
  const alert = useAlert();
  const tableRef = useRef();

  useEffect(() => {
    tableRef.current.onQueryChange();
  }, [props.filter])

  return (
    <div>
      {props.options && props.options.filter &&
        <div>
          <Form>
            <DistributorSelection handleChange={props.onDistributorChange} />
          </Form>
          <hr />
        </div>
      }
      <MaterialTable
        title="Danh sách khách hàng"
        columns={saleServices.customerTableColumns()}
        tableRef={tableRef}
        data={(query) => new Promise((resolve, reject) => {
          const postData = {
            pageSize: query.pageSize,
            page: query.page,
            orderBy: query.orderBy ? query.orderBy.key : null,
            orderDirection: query.orderDirection === "asc" ? 0 : 1,
            search: query.search,
            filter: props.filter
          };

          saleServices.getCustomers(postData).then(json => {
            if (json.data) {
              const { data, page, totalCount } = json.data;
              resolve({
                data, page, totalCount
              });
            } else {
              return Promise.reject({ message: 'NO DATA FOUND' });
            }
          }).catch(error => {
            alert.error(error);
          });
        })}
        //parentChildData={(row, rows) => rows.find(a => a.code === row.parentCode)}
        options={{
          ...props.options,
          debounceInterval: 2000,
          headerStyle: {
            zIndex: 1
          }
        }}
        onSelectionChange={props.onSelectionChange}
      />
    </div>
  );
}

const mapState = (state) => {
  const { query, filter } = state.customers;
  return {
    query, filter
  };
}

const actionCreators = {
  onDistributorChange: saleActions.changeDistributorSelection
}

const CustomerList = connect(mapState, actionCreators)(_customerList);

export default CustomerList;
