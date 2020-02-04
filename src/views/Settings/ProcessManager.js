import React from 'react';
import { Card } from 'semantic-ui-react';
import { MyProgress } from '../Base/Progress/Progress';

const signalR = require("@aspnet/signalr");

export function ProcessManager() {
  const [ps, setPs] = React.useState();

  const processRef = React.useRef();
  const hubRef = React.useRef();
  const hubMethods = {
    onProcessBegin,    
  };

  function onProcessBegin(id, title) {
    addProcess({ id, title });
  }

  function setProcesses(processes) {
    processRef.current = processes;
    setPs(processes);
  }

  function removeProcess(id) {
    if (processRef.current == null)
      return;
    processRef.current = processRef.current.filter(u => u.id != id);
    setPs(processRef.current);
  }

  function addProcess(p) {
    processRef.current = [...processRef.current, p];
    setPs(processRef.current);
  }

  function stopConnection() {
    if (hubRef == null)
      return;
    hubRef.current.stop();
    hubRef.current = null;
  }

  function startConnection() {
    const hub = hubRef.current;
    if (hub == null)
      return;
    hub.start()
      .then(() => {
        hub.invoke("GetAllCollectingProcess")
          .then(_ => {
            if (_) {
              setProcesses(_.map(u => ({id: u.jobId })));
            }
            else
              return Promise.reject("No data retreived");
          })
          .catch(e => {
            stopConnection();
          });
      })
      .catch(e => {
        stopConnection(e.message);
      });
  }

  React.useEffect(() => {
    const hub = new signalR.HubConnectionBuilder()
      .configureLogging(signalR.LogLevel.Debug)
      .withUrl("/processHub", {
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

    startConnection();
    hub.onclose(() => {
      setTimeout(() => {
        startConnection();
      }, 5000);
    });
  }, []);


  return <Card fluid>
    <Card.Content>
      <Card.Header>
        Process manager
      </Card.Header>
      <Card.Description>
        {ps ? ps.map(u => <MyProgress id={u.id} onProcessUnregister={removeProcess} hideMessage />):"None"}
      </Card.Description>
    </Card.Content>
  </Card>
}
