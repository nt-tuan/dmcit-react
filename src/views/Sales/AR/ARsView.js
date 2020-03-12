import React, { useState, useEffect, useRef } from 'react';
import { customerARService } from './service';
import {Table} from '../../Base/Tables/Table';
import {Button} from 'antd';
import {LayoutContext} from '../../../containers/DefaultLayout/LayoutContext';
const download = require('downloadjs');
const ARsView = () => {
    const layout = React.useContext(LayoutContext);
    const columns = [
        {
            title: 'Customer Code',
            dataIndex: 'customerCode',
            key: 'customerCode',
            width: '15%',
            search: 'customerCode'
        },
        {
            title: 'Name',
            dataIndex: 'customerName',
            key: 'customerName',
            width: '25%',
            search: 'customerName'
        },
        {
            title: 'Distributor',
            dataIndex: 'distributorCode',
            key: 'distributorCode',
            width: '10%',
            search: 'distributorCode'
        },
        {
            title: 'Date',
            dataIndex: 'createdDate',
            key: 'createdDate',
            width: '20%'
        },
        {
            title: 'Amount',
            dataIndex: 'amount',
            key: 'amount',
            width: '20%'
        }
    ];

    return (
        <div>
            <Table 
            rowKey={r => `${r.customerCode}_${r.distributorCode}`}
            columns={columns} 
            query={postData => customerARService.getLastCustomerARs(postData).then(json => {
                if (json) {
                    const { data, totalCount } = json;
                    return {data, current: postData.page, total: totalCount};
                } else {
                    return Promise.reject('NO DATA FOUND');
                }
            })}
            extraActions={(postData, selectedRows) => (<div style={{ marginBottom: 16 }}>
                <Button type="primary" onClick={() => {
                    layout.showLoading();
                    customerARService
                    .rawExportCustomerAR(postData)
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
            />
        </div>
    );
}
export default ARsView;