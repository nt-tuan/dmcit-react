import React from 'react';
import {HomeOutlined, ShareAltOutlined, LoadingOutlined, HistoryOutlined, CodeOutlined, SettingOutlined } from '@ant-design/icons';

export default {
    items: [
      {
        name: 'Dashboard',
        url: '/dashboard',
        icon: <HomeOutlined style={{verticalAlign: '0.125em'}} />,
        badge: {
          variant: 'info',
          text: 'NEW',
        }
      },
      {
        name: 'Working',
        url: '/workflows',
        icon: <LoadingOutlined  style={{verticalAlign: '0.125em'}} />
      },
      {
        name: 'History',
        url: '/workflows/history',
        icon: <HistoryOutlined  style={{verticalAlign: '0.125em'}} />
      },
      {
        name: 'Manage',
        url: '/workflows/config',
        icon: <CodeOutlined  style={{verticalAlign: '0.125em'}} />
      },
      {
        name: 'Settings',
        url: '/workflows/setting',
        icon: <SettingOutlined  style={{verticalAlign: '0.125em'}} />
      }
    ],
  };
  