import React, { useState } from 'react';
import { Button, Icon, List, Progress, Accordion } from 'semantic-ui-react';
import { workflowService } from '../../../_services';
import { LayoutContext } from '../../../containers/DefaultLayout/LayoutContext';
import AceEditor from 'react-ace';
import "ace-builds/src-noconflict/mode-json";
import "ace-builds/src-noconflict/theme-monokai";

const signalR = require('@aspnet/signalr');

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

function _workflowProcess(id) {
  const [status, setStatus] = useState();
  const [data, setDataValue] = useState();
  const [parameters, setParameters] = useState('{}');
  const [currentTask, setCurrentTask] = useState();
  const dataRef = React.useRef();
  const hubRef = React.useRef();
  const context = React.useContext(LayoutContext);
  const setData = (data) => {
    dataRef.current = data;
    setDataValue(data);
    console.log(dataRef.current);
  }
  const onWorkflowStart = setData;
  const onWorkflowEnd = wf => {
    setData(wf);
    disconnect();
  };
  const onWorkflowTaskStart = task => {
    const tasks = [];
    dataRef.current.tasks.forEach((value, index) => {
      if (value.id == task.id)
        tasks.push({ ...task });
      else
        tasks.push(value);
    });
    setData({ ...dataRef.current, tasks });
    //setCurrentTask({...task, status: 'done' });
  };
  const onWorkflowTaskChange = task => {
    const tasks = [];
    dataRef.current.tasks.forEach((value, index) => {
      if (value.id == task.id)
        tasks.push({ ...task });
      else
        tasks.push(value);
    });
    setData({ ...dataRef.current, tasks });
    //setCurrentTask({...task, status: 'done' });
  };
  const onWorkflowTaskEnd = task => {
    const tasks = [];
    dataRef.current.tasks.forEach((value, index) => {
      if (value.id == task.id)
        tasks.push({ ...task, status: 'done' });
      else
        tasks.push(value);
    });
    setData({ ...dataRef.current, tasks });
    //setCurrentTask({...task, status: 'done' });
  };
  const hubMethods = {
    WorkflowStart: onWorkflowStart,
    WorkflowEnd: onWorkflowEnd,
    WorkflowTaskStart: onWorkflowTaskStart,
    WorkflowTaskChange: onWorkflowTaskChange,
    WorkflowTaskEnd: onWorkflowTaskEnd
  }
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
              setData(_);
            }
            else
              return Promise.reject("No data retreived");
          })
          .catch(e => {
            context.showError(e);
            disconnect();
          });
      })
      .catch(e => {
        context.showError(e);
        disconnect();
      });
  };



  const establishConnectinon = (instance) => {
    const hub = new signalR.HubConnectionBuilder()
      .configureLogging(signalR.LogLevel.Debug)
      .withUrl("/workflowHub", {
        transport: signalR.HttpTransportType.WebSockets | signalR.HttpTransportType.LongPolling,
        accessTokenFactory: () => {
          const user = JSON.parse(localStorage.getItem('user'));
          if (user)
            return user.token;
          return null;
        }
      })
      .build();
    hubRef.current = hub;

    for (var key in hubMethods) {
      hub.on(key, hubMethods[key]);
    }

    startConnection(instance);
  };

  const startWorkflow = () => {
    workflowService.startWorkflow({ id, "parameters": JSON.parse(parameters) })
      .then(_ => establishConnectinon(_))
      .catch(context.showError);
  }

  React.useEffect(() => {
    context.showLoading();
    workflowService.getWorkflow(id)
      .then(setData)
      .then(context.showClear)
      .catch(context.showError);

    workflowService.getWorkflowStatus(id)
      .then(setStatus)
      .catch(context.showError);
  }, [id]);


  return <div>
    {status && status.isRunning === false && <Button icon compact size="mini" labelPosition="left" primary onClick={startWorkflow}>
      <Icon name='play' /> Execute
    </Button>
    }
    {status && status.isRunning === true &&
      <Button icon compact size="mini" labelPosition="left" color='red'>
        <Icon name='pause' /> Stop
    </Button>
    }
    <hr />
    <Accordion panels={[{
      key: 'parameters',
      title: 'Parameters',
      content: {
        content: <AceEditor
          name="value"
          mode="json"
          theme="monokai"
          value={parameters}
          wrapEnabled={true}
          height="300px"
          width="100%"
          setOptions={{ useWorker: false }}
          onChange={setParameters} />
      }
    }]} />

    <hr />
    <List divided>
      {data && data.tasks.map(u => <_task {...u} />)}
    </List>
  </div>
}

export default function WorkflowProcess({ match }) {
  const { id } = match.params;
  return _workflowProcess(id);
}