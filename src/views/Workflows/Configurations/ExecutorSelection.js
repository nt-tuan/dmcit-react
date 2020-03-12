import React, { useEffect } from 'react';
import { Select, Tag } from 'antd';
import { workflowServices } from '../services';

export const ExecutorSelection = ({onChange, readOnly, value}) => {
    const [options, setOptions] = React.useState([]);
    useEffect(() => {
        workflowServices.getExecutors()
        .then(setOptions)
        .catch(() => setOptions([]));
    },[]);
    return <Select
        disabled={readOnly}
        mode="multiple"
        style={{ width: '100%' }}
        placeholder="Select executors"
        value={value}
        optionLabelProp="label"
        onChange={(values) => onChange && onChange(values)}
    >
        {options.map(u => <Select.Option key={u.id} label={u.username}>
            <Tag>{u.username}</Tag> {u.email}
        </Select.Option>)}
    </Select>
}