import React, { useEffect, useState, useRef } from 'react';
import { workflowServices } from './services'
import { LayoutContext } from '../../containers/DefaultLayout/LayoutContext';
import { Header } from '../Base';
import { Modal, Button, List, Row, Col } from 'antd';
import { DesktopOutlined, InfoCircleOutlined } from '@ant-design/icons';
import WorkflowInstance from './WorkflowInstance';
import { history } from '../../_helpers/history';
import AceEditor from 'react-ace';
import "ace-builds/src-noconflict/mode-json";
import "ace-builds/src-noconflict/theme-monokai";

export default function WorkflowItemContent({ id, summary }) {
  const [info, setInfo] = useState({});
  const [instances, setInstances] = useState([]);
  const [visible, setVisible] = useState(false);
  const layout = React.useContext(LayoutContext);
  const hubRef = useRef();

  const renderInfo = () => {
    return <div>{JSON.stringify(info, null, 4)}</div>;
  }

  const renderList = () => {
    if (instances == null || !instances.length) {
      return <p>No running instances</p>;
    }
    return <List dataSource={instances}
      renderItem={(u) => <List.Item key={u.instanceId}>
        <WorkflowInstance summary={summary} instance={u.instanceId} id={u.id} running={u.running} />
      </List.Item>}>

    </List>
  }

  const hubMethods = {
    WorkflowStart: (ins) => setInstances(old =>
      ([...old, { ...ins, running: true }])),
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
              setInstances(_.jobs.map(u => ({ ...u, running: true })));
              setInfo(_.workflow);
              layout.showClear();
            }
            else
              return Promise.reject("No data retreived");
          })
          .catch(e => {
            console.log(e);
            layout.showError(e);
            disconnect();
          });
      })
      .catch(e => {
        console.log(e);
        layout.showError(e);
        disconnect();
      });
  };

  const establishConnectinon = () => {
    disconnect();
    const hub = workflowServices.buildHub(hubMethods);
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

  const openDetail = () => {
    history.push({ pathname: `/workflows/${id}` });
  }
  return (<div>
    <Modal
      visible={visible}
      onCancel={() => setVisible(false)}
    >
      {renderInfo()}
    </Modal>
    <Header divided title={`#${id} ${info.name}`} extras={<>
      <Button icon={<InfoCircleOutlined />} size="small" onClick={() => setVisible(true)}  />
      <Button icon={<DesktopOutlined />} size="small" onClick={openDetail} />
    </>} />
    {renderList()}
  </div>);
}
