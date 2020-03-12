import React from 'react';
import {PlusOutlined, ReadOutlined, HistoryOutlined, GroupOutlined} from '@ant-design/icons';

export default {
    items: [
        {
            name: 'New message',
            url: '/messaging/compose',
            icon: <PlusOutlined />
        },
        {
            name: 'Address book',
            url: '/messaging/receivers',
            icon: <ReadOutlined />
        },
        {
            name: 'Address group',
            url: '/messaging/groups',
            icon: <GroupOutlined />
        },
        {
            name: 'History',
            url: '/messaging/batches',
            icon: <HistoryOutlined />
        }
    ],
};
