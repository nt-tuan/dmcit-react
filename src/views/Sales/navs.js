import React from 'react';
import {HomeOutlined, TableOutlined, FileDoneOutlined,
    TransactionOutlined, DollarOutlined, 
    WalletOutlined, UserOutlined,
    TeamOutlined, SettingOutlined } from '@ant-design/icons';

export default {
    items: [
        {
            name: 'Dashboard',
            url: '/sales',
            icon: <HomeOutlined />
        },
        {
            name: 'Reports',
            icon: <TableOutlined />,
            children: [
                {
                    name: 'Sales report',
                    url: '/sales/reports',
                    icon: <TransactionOutlined />
                },
                {
                    name: 'Invoices report',
                    url: '/sales/reports/invoices',
                    icon: <FileDoneOutlined />
                },
                {
                    name: 'ARs',
                    url: '/sales/reports/ars',
                    icon: <WalletOutlined />
                },
                {
                    name: 'Payments',
                    url: '/sales/reports/payments',
                    icon:  <DollarOutlined />
                }
            ]
        },
        {
            name: 'Customers',
            url: '/sales/customers',
            icon: <UserOutlined />
        },
        {
            name: 'Distributors',
            url: '/sales/distributors',
            icon: <TeamOutlined />
        },
        {
            name: 'Report configuration',
            url: '/sales/setting',
            icon: <SettingOutlined />
        }
    ],
};
