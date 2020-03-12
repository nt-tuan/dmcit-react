import React, { useState, useEffect, useContext } from 'react';
import { Collapse, Button, Form, Input, Row, Col, Checkbox, Tabs } from 'antd';
import { Header2 } from '../../Base';
import { workflowActions } from './actions';
import { WorkflowConfigContext } from './WorkflowConfigContext';
import { TaskSelection, DeleteButton, LockInput, LockTextArea } from './Components';
import { TaskSettingListEditor } from './WorkflowTaskSetting';
import { ArrowUpOutlined, ArrowDownOutlined, DeleteOutlined } from '@ant-design/icons';
const { Panel } = Collapse;
const WorkflowTaskSummary = (task) => {
    const [f, setF] = useState(task);
    const { readOnly } = task;
    useEffect(() => {
        setF(task);
    }, [task]);
    const ctx = useContext(WorkflowConfigContext);
    const handleChange = ({ name, value }) => setF({ ...f, [name]: value });
    const confirmChange = ({ name, value }) => {
        if (readOnly)
            return;
        workflowActions.ChangeWorkflowTaskProperty(ctx.state, task.taskKey, name, value)(ctx.dispatch);
    }
    const handleCheckboxChange = ({ target }) => {
        const { name, checked } = target;
        confirmChange({ name, value: checked });
    }
    return <Form size='small' layout='vertical'>
        <Row>
            <Col flex={1}>
                <Form.Item label='Task id'>
                    <LockInput readOnly={readOnly} type='number' name='id' value={f.id}
                        onChange={e => handleChange(e.target)} onBlur={e => confirmChange(e.target)} />
                </Form.Item>
            </Col>
            <Col flex={1}>
                <Form.Item label='Task name'>
                    <TaskSelection readOnly={readOnly} name='name' value={f.name} onChange={u => {
                        handleChange(u);
                        confirmChange(u);
                    }} />
                </Form.Item>
            </Col>
        </Row>

        <Form.Item label='Description'>
            <LockTextArea readOnly={readOnly} name='description' value={f.description}
                onChange={e => handleChange(e.target)}
                onBlur={e => confirmChange(e.target)}
            />
        </Form.Item>
        <Form.Item>
            <Checkbox readOnly={readOnly} name='enabled' checked={f.enabled}
                onChange={handleCheckboxChange}>
                Enabled
                </Checkbox>
            <Checkbox name='approval' checked={f.approval} readOnly={readOnly} onChange={handleCheckboxChange}>Approval</Checkbox>
        </Form.Item>
    </Form>
}

const WorkflowTaskEditor = ({ taskKey, id, name, description, enabled, approval, settings, readOnly }) => {
    return <Tabs defaultActiveKey="1">
        <Tabs.TabPane tab='General information'  key="1">
            <WorkflowTaskSummary {... ({ taskKey, id, name, description, enabled, approval, readOnly })} />
        </Tabs.TabPane>
        <Tabs.TabPane tab='Settings' key = "2">
            <TaskSettingListEditor
                taskKey={taskKey}
                readOnly={readOnly}
                taskId={id}
                settings={settings}
            />
        </Tabs.TabPane>

    </Tabs>
}

export const WorkflowTaskListEditor = ({ tasks, editingTask, readOnly }) => {
    const ctx = useContext(WorkflowConfigContext);

    const handleUp = (event, index) => {
        event.stopPropagation();
        workflowActions.SwapTaskIndex(ctx.state, index, index - 1)(ctx.dispatch);
    }
    const handleDown = (event, index) => {
        event.stopPropagation();
        workflowActions.SwapTaskIndex(ctx.state, index, index + 1)(ctx.dispatch);
    }

    const genTaskButtons = (index, length) => {
        if (readOnly) {
            return null;
        }
        return <div>
            {index > 0 && <Button size='small' icon={<ArrowUpOutlined />} onClick={(event) => handleUp(event, index)} />}
            {index < length && <Button size='small' icon={<ArrowDownOutlined />} onClick={(event) => handleDown(event, index)} />}
            <DeleteButton
                onClick={event => {
                    event && event.stopPropagation();
                    workflowActions.DeleteWorkflowTask(ctx.state, index)(ctx.dispatch);
                }}
            />
        </div>
    }

    const editTask = (index) => {
        workflowActions.EditWorkflowTask(ctx.state, index)(ctx.dispatch);
    }

    return <div>
        <Collapse
            bordered={false}
            expandIconPosition='left'>
            {tasks.map((u, i) => {
                return <Panel header={`#${u.id} ${u.name}`} key={i} extra={genTaskButtons(i, tasks.length)}>
                    <WorkflowTaskEditor
                        taskKey={i}
                        onFocus={() => editTask(i)}
                        id={u.id}
                        readOnly={readOnly}
                        editingTask={editingTask}
                        name={u.name}
                        description={u.description}
                        enabled={u.enabled}
                        approval={u.approval}
                        settings={u.settings} />
                </Panel>
            })}
        </Collapse>

    </div>
}