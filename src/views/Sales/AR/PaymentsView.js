import React from 'react';
import { customerARService } from './service';
import { Button } from 'antd';
import { Table } from '../../Base/Tables/Table';
import {LayoutContext} from '../../../containers/DefaultLayout/LayoutContext';
const download = require('downloadjs');
const PaymentsView = (props) => {
    const layout = React.useContext(LayoutContext);
    const columns = [
        { title: 'Customer code', key: 'customerCode', dataIndex: 'customerCode', width: '15%', search: 'customerCode' },
        { title: 'Customer name', key: 'cutomerName', dataIndex: 'customerName', width: '30%', search: 'customerName' },
        { title: 'Distributor code', key: 'distributorCode', dataIndex: 'distributorCode', width: '10%', search: 'distributorCode' },
        { title: 'Payment', key: 'amount', dataIndex: 'amount', width: '15%' },
        { title: 'AR', key: 'arAmount', dataIndex: 'arAmount', width: '15%' },
        { title: 'Date', key: 'createdDate', dataIndex: 'createdDate', width: '15%', search: { type: 'date-range', key: 'cc' } }
    ]

    const handleExport = () => {
        //customerARService.exportCustomerPayment()
    }

    return <div>
        <Table
            columns={columns}
            rowKey={record => `${record.customerCode}_${record.distributorCode}_${record.createdDate}`}
            query={postData => customerARService
                .getCustomerPayments(postData)
                .then(json => ({ data: json.data, current: postData.page, total: json.totalCount }))}
            extraActions={(postData, selectedRows) => (<div style={{ marginBottom: 16 }}>
                <Button type="primary" onClick={() => {
                    layout.showLoading();
                    customerARService
                    .rawExportCustomerPayment(postData)
                    .then(blob => {
                        download(blob, 'data.xlsx');
                    })
                    .then(layout.showClear)
                    .catch(layout.showError);
                }}>
                    Export Excel
                </Button>
            </div>)
            }
        /></div>
}
export default PaymentsView;