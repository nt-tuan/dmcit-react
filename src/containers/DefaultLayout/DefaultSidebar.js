import React, { Component } from 'react';
import { Link, withRouter } from 'react-router-dom';
import { Layout, Menu, Dropdown, Button, message, Tooltip, Row, Col } from 'antd';
import { UserOutlined } from '@ant-design/icons';
import PropTypes from 'prop-types';

import { userActions } from '../../_actions';
import { connect } from 'react-redux';

import { history } from '../../_helpers';
const { Sider } = Layout;

const getMenuItem = (item) => {
    if (item.title) {
        return <Menu.Item key={item.name} disabled>
            {item.icon}
            <span>{item.name}</span>
        </Menu.Item>
    }

    if (item.children) {
        return <Menu.SubMenu
            title={<span>
                {item.icon}
                <span>{item.name}</span>
            </span>}
            key={item.name}>
            {item.children.map(u => getMenuItem(u))}
        </Menu.SubMenu>
    }

    return <Menu.Item key={item.name}>
        {item.icon}
        <span>{item.name}</span>
    </Menu.Item>
}

const menuContains = (items, name) => {
    return items.reduce((pre, cur) => {
        if(pre != null)
            return pre;
        if(cur.name == name)
            return cur.url;
        if(cur.children)
            return menuContains(cur.children, name)
        return null;
    }, null);
}

const DefaultSidebar = ({ navigation }) => {
    const handleClick = ({keyPath}) => {
        if(keyPath.length == 0)
            return;

        const key = keyPath[0];
        console.log(key);
        const url = menuContains(navigation.items, key);
        if(url != null){
            history.push({pathname: url});
        }
    }
    return <Sider theme='light'>
        <Menu mode='inline' onClick={handleClick} selectable={false}>
            {navigation && navigation.items.map(u => getMenuItem(u))}
        </Menu>
    </Sider>
}

export default DefaultSidebar;