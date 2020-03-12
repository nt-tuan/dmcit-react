import React, { useState, useEffect, useRef } from 'react';
import { Table as T, Input, Button, DatePicker } from 'antd';
import {SearchOutlined } from '@ant-design/icons';
import moment from 'moment';
import { LayoutContext } from '../../../containers/DefaultLayout/LayoutContext';
const  { RangePicker } = DatePicker;
const Table = ({ query, columns, rowKey, rowSelection, onTableChange, extraActions }) => {
    const [loading, setLoading] = useState(false);
    const [page, setPage] = useState({ current: 0, pageSize: 10 });
    const [data, setData] = useState([]);
    const [selectedRows, setSelectedRows] = useState();
    const [postData, setPostData] = useState({});
    const layout = React.useContext(LayoutContext);
    const ref = useRef();
    useEffect(() => {
        const postData = {
            pageSize: page.pageSize,
            page: page.current,
            filter: {}
        };
        load(postData);
    }, []);
    const updateData = (data, current, total) => {
        setData(data);
        setPage(page => {
            const pageCount = Math.floor(total / page.pageSize);
            return { current: current, total: pageCount, pageSize: page.pageSize };
        });
    }
    const load = (postData) => {
        setLoading(true);
        setPostData(postData);
        query(postData)
            .then(({ data, current, total }) => updateData(data, current, total))
            .then(() => setLoading(false))
            .catch(layout.showError);
    }
    const handleSearch = (selectedKeys, confirm, dataIndex) => {
        confirm();
    }
    const handleReset = (clearFilters) => {
        clearFilters();
    }
    const getColumnSearchProps = dataIndex => ({
        filterDropdown: ({ setSelectedKeys, selectedKeys, confirm, clearFilters }) => (
            <div style={{ padding: 8 }}>
                <Input
                    ref={node => {
                        ref.current = { ...ref.current, searchInput: node };
                    }}
                    placeholder={`Search ${dataIndex}`}
                    value={selectedKeys[0]}
                    onChange={e => setSelectedKeys(e.target.value ? [e.target.value] : [])}
                    onPressEnter={() => handleSearch(selectedKeys, confirm, dataIndex)}
                    style={{ width: 188, marginBottom: 8, display: 'block' }}
                />
                <Button
                    type="primary"
                    onClick={() => handleSearch(selectedKeys, confirm, dataIndex)}
                    icon="search"
                    size="small"
                    style={{ width: 90, marginRight: 8 }}
                >
                    Search
              </Button>
                <Button onClick={() => handleReset(clearFilters)} size="small" style={{ width: 90 }}>
                    Reset
              </Button>
            </div>
        ),
        filterIcon: filtered => (
            <SearchOutlined style={{ color: filtered ? '#1890ff' : undefined }} />
        ),
        onFilterDropdownVisibleChange: visible => {
            if (visible) {
                setTimeout(() => ref.current.searchInput.select());
            }
        }
    });

    const getColumnDateRangeProps = dataIndex => ({
        filterDropdown: ({ setSelectedKeys, selectedKeys, confirm, clearFilters }) => (
            <div style={{ padding: 8 }}>
                <RangePicker
                    ref={node => {
                        ref.current = { ...ref.current, searchInput: node };
                    }}
                    ranges={{
                        Today: [moment(), moment()],
                        'This Month': [moment().startOf('month'), moment().endOf('month')],
                        'This year': [moment().startOf('year'), moment().endOf('year')]
                    }}
                    style={{ marginBottom: 8, display: 'block' }}
                    onChange={(dates) => setSelectedKeys(dates && dates.length > 1 ? [{startDate: dates[0], endDate: dates[1]}]:null)}
                />
                <Button
                    type="primary"
                    onClick={() => handleSearch(selectedKeys, confirm, dataIndex)}
                    icon="search"
                    size="small"
                    style={{ width: 90, marginRight: 8 }}
                >
                    Search
              </Button>
                <Button onClick={() => handleReset(clearFilters)} size="small" style={{ width: 90 }}>
                    Reset
              </Button>
            </div>
        ),
        filterIcon: filtered => (
            <SearchOutlined style={{ color: filtered ? '#1890ff' : undefined }} />
        ),
        onFilterDropdownVisibleChange: visible => {
            if (visible) {
                setTimeout(() => ref.current.searchInput.focus());
            }
        }
    });
    const defColumns = columns.map(u => {
        var search = null;
        if (typeof u.search === 'string' || u.search instanceof String)
            search = getColumnSearchProps(u.search);
        else if (u.search && u.search.type == 'date-range')
            search = getColumnDateRangeProps(u.search.key);

        const { title, dataIndex, key, width, render, extra } = u;
        return {
            title, dataIndex, key, width, render, ...search, ...extra
        }
    })

    const handleTableChange = (pagination, filter, sorter) => {
        const postData = {
            pageSize: pagination.pageSize,
            page: pagination.current,
            orderBy: sorter.key,
            orderDirection: sorter.order,
            filter
        };
        onTableChange && onTableChange(postData);
        load(postData);
    }
    const handleSelectionChange = (rowKeys, row) => {
        setSelectedRows(row);
        rowSelection &&  rowSelection.onChange && rowSelection.onChange(rowKeys, row);
    }
    return (
        <div>
            {extraActions && extraActions(postData, selectedRows)}
            <T
                rowSelection={{
                    onChange: handleSelectionChange
                }}
                loading={loading}
                rowKey={rowKey}
                columns={defColumns}
                dataSource={data}
                pagination={page}
                size='small'
                onChange={handleTableChange} />
        </div>
    );
}
export { Table };