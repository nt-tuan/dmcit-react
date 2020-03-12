import React, { useState, useEffect, useContext } from 'react';
import { Button, Input, Select } from 'antd';
import { LayoutContext } from '../../../containers/DefaultLayout/LayoutContext';
import { workflowServices } from '../services';
import Icon, { PlusOutlined, SaveOutlined, DeleteOutlined, CloseOutlined, UnlockOutlined, LockOutlined, EditOutlined } from '@ant-design/icons'

export const launchTypeOptions = [
    { key: 0, value: 0, text: 'Start up' },
    { key: 1, value: 1, text: 'Trigger' },
    { key: 2, value: 2, text: 'Periodic' },
    { key: 3, value: 3, text: 'Cron Expression' }
];

export const LaunchTypeSelection = ({ name, value, onChange, readOnly }) => {
    const [mValue, setValue] = useState();
    useEffect(() => {
        setValue(value);
    }, [value])
    return <Select disabled={readOnly} value={mValue} onChange={value => onChange({name, value})}>
        {launchTypeOptions.map(u => <Select.Option key={u.key} value={u.value}>{u.text}</Select.Option>)}
    </Select>
}

export const TaskSelection = ({ name, value, onChange, readOnly }) => {
    const layoutContext = useContext(LayoutContext);
    const [options, setOptions] = useState([]);
    useEffect(() => {
        workflowServices.getWorkflowTasks()
            .then(data => {
                setOptions(data.map(u => ({
                    key: u,
                    value: u,
                    text: u
                })));
            })
            .catch(layoutContext.showError);
    }, []);

    const handleChange = (value) => {
        onChange && onChange({ name, value });
    }

    return <Select disabled={readOnly} value={value} onChange={handleChange}>
        {options.map(u => <Select.Option key={u.key} value={u.value}>
            {u.text}
        </Select.Option>)}
    </Select>
}

export const EditButton = ({ onClick }) => <Button type='primary' size='small' onClick={onClick} icon={<EditOutlined />} />    
export const AddButton = props => {
    if (props.myIconLabel == null)
        return <Button {...props} type='primary' size='small' icon={<PlusOutlined />} />
    return <Button {...props} type='primary' size='small' onChange={props.onChange} icon={<PlusOutlined />}>
        {` ${props.myIconLabel}`}
    </Button>
}
export const SaveButton = ({ onClick }) => <Button type='primary' size='small' onClick={onClick} icon={<SaveOutlined />} />
export const CloseButton = ({ onClick }) => <Button type='primary' size='small' danger onClick={onClick} icon={<CloseOutlined />} />
export const DeleteButton = ({ onClick }) => <Button type='primary' size='small' danger onClick={onClick} icon={<DeleteOutlined />} />
export const LockInput = props => <Input {...props} suffix={props.readOnly ? <LockOutlined /> : <UnlockOutlined />} />
export const LockTextArea = props => <Input.TextArea {...props} autoSize suffix={props.readOnly ? <LockOutlined /> : <UnlockOutlined />} />