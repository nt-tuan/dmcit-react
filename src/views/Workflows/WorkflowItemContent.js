import React, { useEffect, useState, useRef } from 'react';
import { workflowService } from '../../_services'
import { LayoutContext } from '../../containers/DefaultLayout/LayoutContext';
import { List, Accordion, Button, Progress, Icon, Label } from 'semantic-ui-react';
import WorkflowInstance from './WorkflowInstance';
import {history} from '../../_helpers/history';
import { Container, Row, Col } from 'reactstrap';
import AceEditor from 'react-ace';
import "ace-builds/src-noconflict/mode-json";
import "ace-builds/src-noconflict/theme-monokai";

export default function WorkflowItemContent({id, summary}){
  const [info, setInfo] = useState({});
  const [instances, setInstances] = useState([]);
  const layout = React.useContext(LayoutContext);
  const hubRef = useRef();

  const renderInfo = () => {
    return <div>{JSON.stringify(info, null, 4)}</div>;
  }

  const renderList = () => {
    if (instances == null || !instances.length) {
      return <p>No running instances</p>;
    }
    return <List divided selection>
      {instances.map(u => <List.Item key={u.instanceId}>
        <WorkflowInstance summary={summary} instance={u.instanceId} id={u.id} running={u.running} />
      </List.Item>)}
    </List>
  }

  const hubMethods = {
    WorkflowStart: (ins) => setInstances(old =>
      ([...old, ins])),
    WorkflowEnd: (ins) => setInstances(old =>
      old.map(u => {
        if (u.instanceId == ins.instanceId) {
          return { ...u, running: false }
        }
        return u;
      }))
  };
  const disconnect = () => {
    if (hubRef.current == null)
      return;
    hubRef.current.stop();
    hubRef.current = null;
  };
  const startConnection = () => {
    const hub = hubRef.current;
    if (hub == null)
      return;
    layout.showLoading();
    hub.start()
      .then(() => {
        hub.invoke("WatchWorkflow", id)
          .then(_ => {
            if (_) {
              setInstances(_.jobs);
              setInfo(_.workflow);
              layout.showClear();
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

  const establishConnectinon = () => {
    disconnect();
    const hub = workflowService.buildHub(hubMethods);
    hubRef.current = hub;
    startConnection();
  };

  useEffect(() => {
    if (id == null)
      return;
    layout.showLoading();
    establishConnectinon();
  }, [id]);

  useEffect(() => {
    return disconnect;
  }, []);

  
  return (<div>
    <Accordion panels={[{
      key: 'infomation',
      title: 'Information',
      content: {
        content: renderInfo()
      }
    }]} />
    <hr />
    {renderList()}
  </div>);
}
