import React, { useEffect, useState, useRef } from 'react';
import { workflowServices } from './services'
import { LayoutContext } from '../../containers/DefaultLayout/LayoutContext';
import { Progress } from 'semantic-ui-react';
import { Timeline, Button as B, Collapse, List as L, Tag } from 'antd';
import Icon, {QuestionCircleOutlined, FieldTimeOutlined, LoadingOutlined, CheckCircleOutlined, CloseCircleOutlined} from '@ant-design/icons';
const _task = ({ workflowId, instanceId, id, logs, progress, files, name, description, enabled, isWaitingForApproval, approval, running }) => {
    const [expanded, setExpanded] = useState(false);
    const [u, setU] = useState({ workflowId, instanceId, id, logs, progress, files, name, description, enabled, isWaitingForApproval, approval, running });

    React.useEffect(() => {
        setU(v => ({ ...v, logs, files, progress, isWaitingForApproval, running }));
        if (progress && progress.type == 1)
            setExpanded(true);
    }, [logs, files, progress, isWaitingForApproval, running]);

    const getColor = () => {
        if (u.progress == null || u.progress.type == 0)
            return 'gray';
        if (u.progress.type == 1)
            return 'blue';
        if (u.progress.type == 2)
            return 'green';
        if (u.progress.type == -1)
            return 'red';
        if (u.progress.type == 3)
            return '#FFFF00';
    }

    const renderState = () => {
        const {progress} = u;
        if (u.isWaitingForApproval)
            return <QuestionCircleOutlined style={{color: getColor()}} />
        if (progress == null || progress.type == 0) {
            return <FieldTimeOutlined style={{color: getColor()}}  />
        }
        if (progress.type == 3)
            return <QuestionCircleOutlined style={{color: getColor()}} />
        if (progress.type == -1)
            return <CloseCircleOutlined style={{color: getColor()}} />;
        if (progress.type == 1)
            return <LoadingOutlined style={{color: getColor()}} />;
        if (progress.type == 2)
            return <CheckCircleOutlined style={{color: getColor()}} />
        return <FieldTimeOutlined style={{color: getColor()}} />
    }

    const renderProgress = () => {
        if (u.progress && u.progress.type == 1)
            return <div>
                <p><strong>Progress: </strong>{u.progress.title}</p>
                <p><i>{u.progress.description}</i></p>
                {u.progress.percent && u.progress.percent > 0 && <Progress percent={u.progress.percent} />}
            </div>
        return null;
    }
    const renderLog = (u, index) => {
        return <L.Item>
            {u}
        </L.Item>
    };

    const approve = () => {
        const { workflowId, instanceId } = u;
        workflowServices.approveWorkflow({ workflowId, instanceId });
    }

    const disapprove = () => {
        const { workflowId, instanceId } = u;
        workflowServices.disapproveWorkflow({ workflowId, instanceId });
    }
    return <Timeline.Item dot={renderState()} color={getColor()}>
        <div>
            <strong>{u.name}</strong>
            {((u.logs && u.logs.length > 0) || (u.files && u.files.length > 0)) &&
                <B icon={expanded ? 'arrows-alt' : 'shrink'} style={{ float: 'right' }} onClick={() => setExpanded(!expanded)}></B>
            }
            {u.running && u.progress && u.progress.type == 3 && <B icon='check' onClick={approve} style={{ float: 'right' }} />}
            {u.running && u.progress && u.progress.type == 3 && <B icon='close' onClick={disapprove} style={{ float: 'right' }} />}
        </div>
        <p>{u.description}</p>
        {renderProgress()}
        {u.logs && u.files && expanded && <Collapse bordered={false} defaultActiveKey={[]}>
            {u.logs && u.logs.length > 0 && <Collapse.Panel header="Logs" key="1">
                <L size='small'
                    dataSource={u.logs}
                    renderItem={renderLog} />
            </Collapse.Panel>}
            {u.files && u.files.length > 0 && <Collapse.Panel header="Files" key="2">
                <L size='small'
                    dataSource={u.files}
                    renderItem={(u => <L.Item>
                        <Icon.FileOutlined type='file' /> <a href={u.path} download={true}>{u.fileName}</a>
                    </L.Item>)}
                />
            </Collapse.Panel>}
        </Collapse>
        }
    </Timeline.Item >
}

export default function WorkflowInstance({ id, instance, running, summary }) {
    const [data, setData] = useState([]);
    const [tasks, setTasks] = useState([]);
    const hubRef = useRef();
    const layout = React.useContext(LayoutContext);

    const setValues = (_) => {
        setData(_);
        setTasks(_.tasks);
    }
    const onWorkflowStart = setValues;
    const updateTasks = (oldData, task) => oldData.map(u => {
        if (u.id == task.id)
            return task;
        return u;
    });
    const onWorkflowEnd = wf => {
        disconnect();
    };
    const onWorkflowTaskStart = task => {
        setTasks(oldData => updateTasks(oldData, task));
        //setCurrentTask({...task, status: 'done' });
    };
    const onWorkflowTaskChange = task => {
        setTasks(oldData => updateTasks(oldData, task));
    };
    const onWorkflowTaskEnd = task => {
        setTasks(oldData => updateTasks(oldData, task));
    };

    const hubMethods = {
        WorkflowStart: onWorkflowStart,
        WorkflowEnd: onWorkflowEnd,
        WorkflowTaskStart: onWorkflowTaskStart,
        WorkflowTaskEnd: onWorkflowTaskEnd,
        WorkflowTaskChange: onWorkflowTaskChange
    };

    const disconnect = () => {
        if (hubRef.current == null)
            return;
        hubRef.current.stop();
        hubRef.current = null;
    };
    const startConnection = (instance) => {
        const hub = hubRef.current;
        if (hub == null)
            return;
        hub.start()
            .then(() => {
                hub.invoke("WatchWorkflowInstance", id, instance)
                    .then(_ => {
                        if (_) {
                            setValues(_);
                        }
                        else
                            return Promise.reject("No data retreived");
                    })
                    .catch(e => {
                        layout.showError(e.message);
                        disconnect();
                    });
            })
            .catch(e => {
                console.log(e);
                layout.showError(e.message);
                disconnect();
            });
    };

    useEffect(() => {
        if (running == false) {
            disconnect();
        }
    }, [running]);

    useEffect(() => {
        disconnect();
        const hub = workflowServices.buildHub(hubMethods);
        hubRef.current = hub;
        startConnection(instance);
    }, [id, instance]);

    return <div style={{ width: '100%' }}>
        <h4>Run #{instance} {running == false ? <Tag color='gray'>Done</Tag> : <Tag color="blue">Running</Tag>}</h4>
        {summary != true &&
            <Timeline>
                {tasks && tasks.map((u, i) => <_task key={u.id} {...{ ...u, workflowId: id, instanceId: instance, running }} />
                )}
            </Timeline>
        }
    </div>
}