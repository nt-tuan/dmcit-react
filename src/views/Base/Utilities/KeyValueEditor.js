import React, { useState, useEffect } from 'react';
import { Form, Button, Col, Row, Input } from 'antd';
import {EditOutlined, CloseOutlined, CheckOutlined} from '@ant-design/icons';

export const KeyValueEditor = (props) => {
    const [name, setName] = useState();
    const [value, setValue] = useState();
    const handleChange = (e) => {
        const { name, value } = e.target;
        if (name == 'name')
            setName(value);
        if (name == 'value')
            setValue(value);
        props.onChange && props.onChange({ name, value });
    };
    const handleConfirmChange = (e) => {
        props.onChange && props.onChange({ name, value, key: props.key });
    }
    useEffect(() => {
        setName(props.name);
        setValue(props.value);
    }, [props.name, props.value]);
    return <Form layout='inline' size='small'>
        <Row>
            <Col flex='auto'>
                <Form.Item>
                    <Input readOnly={props.readOnly} readOnly={props.lock} value={name}
                        onChange={handleChange} onBlur={handleConfirmChange} placeholder='Variable name' />
                </Form.Item>
            </Col>
            <Col flex='auto'>
                <Form.Item label='Value'>
                    <Input readOnly={props.readOnly} readOnly={props.lock} value={value}
                        onChange={handleChange} onBlur={handleConfirmChange} placeholder='Value' />
                </Form.Item>
            </Col>
            <Col flex='auto'>
                {props.onEdit && !props.readOnly && <Button basic icon={<EditOutlined />} onClick={() => props.onEdit(name)} />}
                {props.onDelete && !props.readOnly && <Button basic icon={<CloseOutlined />} onClick={() => props.onDelete({ name, value, key: props.key })} />}
                {props.onAdd && !props.readOnly && <Button basic icon={<CheckOutlined />} onClick={() => props.onAdd({ name, value })} />}
            </Col>
        </Row>

    </Form>
}