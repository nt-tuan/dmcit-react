import React, { useState, useEffect, useContext } from 'react';
import { Layout, Menu, Tabs, Input } from 'antd';
import {PlusOutlined} from '@ant-design/icons';
import { workflowActions } from './actions';
import { WorkflowConfigContext } from './WorkflowConfigContext';
import { workflowConfigReducer } from './reducer';
import { LayoutContext } from '../../../containers/DefaultLayout/LayoutContext';
import { LaunchTypeSelection, LockInput, LockTextArea, EditButton, SaveButton, DeleteButton, AddButton, CloseButton } from './Components';
import { Header2 } from '../../Base';
import { WorkflowTaskListEditor } from './WorkflowTask';
import {ExecutorSelection} from './ExecutorSelection';
import { Form, Checkbox, Button as AB } from 'antd';
const { Sider, Content } = Layout;
const { TabPane } = Tabs;
const WorkflowSummaryEditor = ({workflow}) => {
    const ctx = useContext(WorkflowConfigContext);
    const [f, setF] = useState(workflow);
    useEffect(() => {
        setF(workflow);
    }, [workflow]);
    const handleConfirmChange = (e, { value, name }) => {
        if (!workflow.editing)
            return;
        workflowActions.ChangeWorkflowProperty(name, value)(ctx.dispatch);
    }
    const handleChange = React.useCallback((e, { value, name }) => {
        setF({ ...f, [name]: value })
    }, [f]);
    const handleCheckboxChange = ({target}) => {
        const { name, checked } = target;
        workflowActions.ChangeWorkflowProperty(name, checked)(ctx.dispatch);
    }
    return <Form layout='vertical' size='small'>
        <Form.Item label='Name'>
            <LockInput readOnly={!workflow.editing} type='text' name='name' value={f.name} onChange={handleChange} onBlur={e => handleConfirmChange(e, e.target)} />
        </Form.Item>
        <Form.Item label='Description'>
            <LockTextArea name='description' readOnly={!workflow.editing} value={f.description} onBlur={e => handleConfirmChange(e, e.target)} onChange={(e) => handleChange(e, e.target)} />
        </Form.Item>
        <Form.Item label='Launch type'>
            <LaunchTypeSelection name='launchType' readOnly={!workflow.editing} value={workflow.launchType} 
            onChange={({value, name}) => handleConfirmChange({value,name},{value, name})} />
        </Form.Item>
        {workflow.launchType == 2 && <Form.Item label='Periodic'>
            <Input name='period' readOnly={!workflow.editing} value={workflow.periodic} onChange={handleChange} />
        </Form.Item>
        }
        {workflow.launchType == 3 && <Form.Item label='Cron Expression'>
            <Input name='cronExpression' readOnly={!workflow.editing} value={workflow.cronExpression} onChange={handleChange} />
        </Form.Item>}
        <Form.Item >
            <Checkbox readOnly={!workflow.editing} checked={workflow.enabled} name='enabled' 
            onChange={handleCheckboxChange}>Enabled</Checkbox>
        </Form.Item>
        <Form.Item>
            <Checkbox readOnly={!workflow.editing} checked={workflow.approval} name='approval' 
            onChange={handleCheckboxChange}>Approval</Checkbox>
        </Form.Item>
        <Form.Item>
            <Checkbox readOnly={!workflow.editing} checked={workflow.stopWhenError} name='stopWhenError' 
            onChange={handleCheckboxChange}>Stop when get errors</Checkbox>
        </Form.Item>
        <Form.Item>
            <Checkbox readOnly={!workflow.editing} checked={workflow.enableParallelJobs} name='enableParallelJobs' 
            onChange={handleCheckboxChange}>Enable parallel jobs</Checkbox>
        </Form.Item>
    </Form>
}

export const WorkflowEditor = ({workflow}) => {
    const ctx = useContext(WorkflowConfigContext);
    const layout = useContext(LayoutContext);
    const handleEdit = () => {
        workflowActions.EditWorkflow()(ctx.dispatch);
    }
    const handleClose = () => {
        workflowActions.CancelEditWorkflowItem()(ctx.dispatch);
    }
    const handleSave = () => {
        workflowActions.SaveWorkflow(workflow)(ctx.dispatch, layout.alertDispatch);
    }

    const handleAddTask = () => {
        workflowActions.AddWorkflowTask(ctx.state)(ctx.dispatch);
    }

    const handleDelete = () => {
        workflowActions.DeleteWorkflow(ctx.state, workflow.id)(ctx.dispatch, layout.alertDispatch);
    }

    const handleExecutorsChange = values => {
        workflowActions.ChangeWorkflowProperty("executors", values)(ctx.dispatch);
    }

    const extraTabContent = () => {
        return <div>
            {workflow.id && !workflow.editing && <EditButton onClick={handleEdit} />}
            {workflow.id && !workflow.editing && <DeleteButton onClick={handleDelete} color='red' />}
            {workflow.id == null && <AddButton onClick={handleSave} />}
            {workflow.id != null && workflow.editing && <SaveButton onClick={handleSave} />}
            {workflow.id && workflow.editing && <CloseButton onClick={handleClose} />}
        </div>
    }

    if (workflow.loading)
        return <p>Loading...</p>

    console.log(workflow);

    return <div>
        {workflow.id ? <h4>Workflow #{workflow.id}</h4> : <h4>New workflow</h4>}
        <Tabs defaultActiveKey="1" tabBarExtraContent={extraTabContent()}>
            <TabPane tab="Summary" key="1">
                <WorkflowSummaryEditor workflow={workflow} />
            </TabPane>
            <TabPane tab="Tasks" key="2">
                <Header2 title='Task list' extras={workflow.editing && <AddButton onClick={handleAddTask} />} />
                <WorkflowTaskListEditor editingTask={workflow.editingTask} tasks={workflow.tasks} readOnly={!workflow.editing} />
            </TabPane>
            <TabPane tab="Accessibility" key="3">
                <ExecutorSelection onChange={handleExecutorsChange} value={workflow.executors} readOnly={!workflow.editing} />
            </TabPane>
        </Tabs>
    </div>
}

const WorkflowList = ({ data, workflow }) => {
    const context = useContext(WorkflowConfigContext);
    const layout = useContext(LayoutContext);
    const handleSelect = (id) => {
        workflowActions.SelectWorkflowItem(id)(context.dispatch, layout.alertDispatch);
    }
    const addWorkflow = () => {
        workflowActions.AddWorkflowItem()(context.dispatch);
    }
    if (data == null || data.length == 0)
        return <p>You don not have any workflow yet</p>

    const selectedKeys = workflow && workflow.id? [workflow.id.toString()]  : workflow?["new"]:[];
    console.log("SELECTED", selectedKeys);
    return (
        <Menu mode="inline" selectedKeys={selectedKeys}>
            {
                data.map(u => <Menu.Item key={u.id} onClick={() => handleSelect(u.id)}>
                    #{u.id} {u.name}
                </Menu.Item>
                )
            }
            <Menu.Item key="new" onClick={addWorkflow}><PlusOutlined />New workflow</Menu.Item>
        </Menu>
    );
}

export const WorkflowConfigView = () => {
    const [state, dispatch] = React.useReducer(workflowConfigReducer, { loading: true });
    const layout = useContext(LayoutContext);
    useEffect(() => {
        workflowActions.GetWorkflowList()(dispatch, layout.alertDispatch);
    }, []);
    //console.log(state);
    if (state == null || state.loading)
        return <p>Loading...</p>
    return <WorkflowConfigContext.Provider value={{ dispatch, state }}>
        <Layout>
            <Content style={{background: '#fff' }}>
                <Layout style={{background: '#fff' }}>
                    <Sider style={{ background: '#fff' }}>
                        <WorkflowList data={state.data} workflow={state.workflow} />
                    </Sider>
                    <Content style={{ margin: '0px 16px 0', background: '#fff' }}>{state.workflow && <WorkflowEditor workflow={state.workflow} />}</Content>
                </Layout>
            </Content>
        </Layout>
    </WorkflowConfigContext.Provider>
}