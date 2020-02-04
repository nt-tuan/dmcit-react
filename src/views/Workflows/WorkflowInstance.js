import React, { useEffect, useState, useRef } from 'react';
import { workflowService } from '../../_services'
import { LayoutContext } from '../../containers/DefaultLayout/LayoutContext';
import { List, Button, Progress, Icon, Label, Segment } from 'semantic-ui-react';
import { history } from '../../_helpers/history';
import { Container, Row, Col } from 'reactstrap';
import AceEditor from 'react-ace';
import "ace-builds/src-noconflict/mode-json";
import "ace-builds/src-noconflict/theme-monokai";

const _task = (u) => {
    const [expanded, setExpanded] = useState(false);
    const [active, setActive] = useState(false);
    React.useEffect(() => {
        setActive(u.progress != null && u.progress.endTime == null);
        setExpanded(u.progress != null && u.progress.endTime == null);
    }, [u]);
    const iconName = (status) => {
        if (active)
            return <List.Icon name='play' color='blue' />
        if (u.progress == null)
            return <List.Icon name='wait' color='grey' />
        if (u.progress != null && u.progress.endTime != null)
            return <List.Icon name='check' color='green' />
        if (status == 'error')
            return <List.Icon name='close' color='red' />

    }
    const renderLog = (u, index) => {
        return <List.Item key={index}>
            <List.Content>
                <List.Description>{u}</List.Description>
            </List.Content>
        </List.Item>

    };
    return <List.Item key={u.id} selected={active}>
        {(u.logs.length > 0 || u.files.length > 0) && <List.Content floated='right'>
            <Button icon={active || expanded ? 'minus square outline' : 'plus square outline'} onClick={() => setExpanded(!expanded)} />
        </List.Content>
        }
        {iconName(u.status)}
        <List.Content>
            <List.Header as='a'>{u.name}</List.Header>
            <List.Description>{u.description}</List.Description>
            {u.progress && active && <div>
                <List.Header>{u.progress.title}</List.Header>
                <List.Description>{u.progress.description}</List.Description>
                {u.progress.percent && u.progress.percent > 0 && <Progress percent={u.progress.percent} />}
            </div>
            }
            {u.logs && u.files && (active || expanded) && <div>
                <hr />
                {u.logs && u.logs.length > 0 && <div style={{ maxHeight: '200px', width: '100%', overflowY: 'scroll' }}>
                    <p><b>Logs</b></p>
                    <List divided>
                        {u.logs.reverse().map(renderLog)}
                    </List>
                </div>}
                {u.files && u.files.length > 0 && <div>
                    <p><b>Files</b></p>
                    <List>
                        {u.files.map(u =>
                            <List.Item>
                                <List.Icon name='file' color='blue' verticalAlign='middle' />
                                <List.Content>
                                    <List.Header>
                                        <a href={u.path} download={true}>{u.fileName}</a>
                                    </List.Header>
                                </List.Content>
                            </List.Item>)}
                    </List></div>}
            </div>
            }
        </List.Content>
    </List.Item >
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
                        layout.showError(e);
                        disconnect();
                    });
            })
            .catch(e => {
                layout.showError(e);
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
        const hub = workflowService.buildHub(hubMethods);
        hubRef.current = hub;
        startConnection(instance);
    }, [id, instance]);

    return <div>
        <Segment inverted color={running == false ? 'grey' : 'blue'}>
            <h6>Run #{instance} {running == false ? <Label>Done</Label> : <Label color="blue">Running</Label>}</h6>
        </Segment>
        {summary != true &&
            <List divided>
                {tasks && tasks.map(u => <_task {...u} />)}
            </List>
        }
    </div>
}