import React, { useState, useEffect, useContext } from 'react';
import { KeyValueEditor } from '../../Base/Utilities';
import { workflowActions } from './actions';
import { WorkflowConfigContext } from './WorkflowConfigContext';
import { DeleteButton, AddButton, SaveButton, CloseButton, LockInput } from './Components';
import { Button, Collapse, Form, Input, Row, Col, Tabs } from 'antd';
import { Header2 } from '../../Base';
import { ArrowUpOutlined, ArrowDownOutlined } from '@ant-design/icons';
const { Panel } = Collapse;
const VariablesEditor = ({ variables, readOnly, taskKey, settingKey }) => {
    const ctx = useContext(WorkflowConfigContext);
    const handleAddVariable = () => {
        workflowActions.AddWorkflowTaskSettingVariable(ctx.state, taskKey, settingKey, { name: 'New variable', value: '' })(ctx.dispatch);
    }
    const handleChange = (i, { value, name }) => {
        workflowActions.ChangeWorkflowTaskSettingVariable(ctx.state, taskKey, settingKey, i, { name, value })(ctx.dispatch);
    }
    const handleDelete = (i) => {
        workflowActions.DeleteWorkflowTaskSettingVariable(ctx.state, taskKey, settingKey, i)(ctx.dispatch);
    }

    return <div>
        <Header2 title='Attributes' extras={!readOnly && <AddButton onClick={() => handleAddVariable()} />} />
        {variables && variables.map((u, i) => <KeyValueEditor
            key={i}
            readOnly={readOnly}
            name={u.name}
            value={u.value}
            onChange={({ value, name }) => handleChange(i, { value, name })}
            onDelete={() => handleDelete(i)} />
        )}
    </div>
}

const SettingEditor = ({ taskKey, settingKey, name, value, variables, readOnly }) => {
    const [d, setD] = useState({ name, value });
    const ctx = useContext(WorkflowConfigContext);
    useEffect(() => {
        setD({ name, value });
    }, [name, value]);

    const handleChange = e => {
        const { name, value } = e.target;
        setD({ ...d, [name]: value });
    }
    const handleConfirm = (e) => {
        const { name, value } = e.target;
        if (readOnly)
            return;
        workflowActions.ChangeWorkflowTaskSettingProperty(ctx.state, taskKey, settingKey, { name, value })(ctx.dispatch);
    }
    return <div>
        <Form layout='vertical' size='small'>
            <Row>
                <Col span={8}>
                    <Form.Item label='Setting name' rules={[{ required: true }]}>
                        <LockInput name='name' readOnly={readOnly} value={d.name} onChange={handleChange} onBlur={handleConfirm} />
                    </Form.Item>
                </Col>
                <Col span={16}>
                    <Form.Item label='Setting value' rules={[{ required: true }]}>
                        <LockInput name='value' readOnly={readOnly} value={d.value} onChange={handleChange} onBlur={handleConfirm} />
                    </Form.Item>
                </Col>
            </Row>
        </Form>
        <VariablesEditor
            readOnly={readOnly}
            settingName={name}
            variables={variables}
            taskKey={taskKey}
            settingKey={settingKey}
        />
    </div>
}

export const TaskSettingListEditor = ({ taskKey, settings, readOnly }) => {
    const ctx = React.useContext(WorkflowConfigContext);
    const handleAdd = () => {
        workflowActions.AddWorkflowTaskSetting(ctx.state, taskKey)(ctx.dispatch);
    }
    const handleDelete = (i) => {
        workflowActions.DeleteWorkflowTaskSetting(ctx.state, taskKey, i)(ctx.dispatch);
    }
    const handleUp = (i) => { }
    const handleDown = (i) => {
    }
    const genExtra = (i, length) => {
        if (readOnly)
            return null;
        return <div>
            {i > 0 && <Button icon={<ArrowUpOutlined />} size='small' onClick={() => handleUp(i)} />}
            {i < length && <Button icon={<ArrowDownOutlined />} size='small' onClick={() => handleDown(i)} />}
            <DeleteButton onClick={() => handleDelete(i)} />
        </div>
    }
    return <div>
        <Header2 title='Settings' extras={!readOnly && <AddButton onClick={handleAdd} style={{ float: 'right' }} />} />        
        <Collapse
            defaultActiveKey={['0']}
            expandIconPosition='left'>
            {settings.map((d, i) => {
                return <Panel header={d.name} key={i} extra={genExtra(i, settings.length)} >
                    <SettingEditor
                        taskKey={taskKey}
                        settingKey={i}
                        readOnly={readOnly}
                        name={d.name}
                        value={d.value}
                        variables={d.variables} />
                </Panel>
            })}
        </Collapse>
    </div>
};