import React, { useEffect, useState, useRef, useCallback } from 'react';
import { Progress, List, Message, Icon, Loader, Card } from 'semantic-ui-react';
const signalR = require("@aspnet/signalr");

const MyProgress = (props) => {
  const [title, setTitle] = useState();
  const [subTitle, setSubtitle] = useState();
  const [description, setDescription] = useState();
  const [percent, setPercent] = useState();

  const [messages, setMessages] = useState();
  const [error, setError] = useState();
  const hubRef = useRef();
  const mRef = useRef([]);
  const addMessage = m => {
    const nm = [m, ...mRef.current];
    mRef.current = nm;
    setMessages(nm);
  };
  
  const nullProgress = {
    title: 'Waiting to execute...'
  };

  const setProgress = (p) => {
    setDescription(p.description);
    setPercent(p.percent);
    setSubtitle(p.title);
  }

  const onProgressBegin = (progress) => {
    setSubtitle(progress.title);
  };
  const onProgressEnd = (progress) => {
    setProgress(nullProgress);
  };
  const onProgressChangeState = (p) => {
    setDescription(p.description);
  };
  const OnProcessMessage = (data) => {
    addMessage(data);
  };
  const onProgressInscrease = (percent) => {
    setPercent(percent);
  }

  const OnProcessUnregister = () => {
    setSubtitle('PROCESS HAS BEEN FINISHED');
    setDescription(null);
    stopConnection();

    props.onProcessUnregister && props.onProcessUnregister(props.id);
  }
  const hubMethods = {
    onProgressBegin,
    onProgressChangeState,
    OnProcessMessage,
    onProgressInscrease,
    onProgressEnd,
    OnProcessUnregister
  };

  const stopConnection = (word) => {
    if (hubRef.current == null)
      return;
    hubRef.current.stop();
    hubRef.current = null;
    props.onDisconnect && props.onDisconnect(word);
  }

  function startConnection() {
    const hub = hubRef.current;
    if (hub == null)
      return;
    hub.start()
      .then(() => {
        hub.invoke("RegisterProgress", props.id)
          .then(_ => {
            if (_) {
              _.messages.forEach(u => {
                addMessage(u);
              });
              if (_.progress)
                setProgress(_.progress);
              setTitle(_.name);
            }
            else
              throw new Error("No data retreived");
          })
          .catch(e => {
            setError(e.message);
            stopConnection(e.message);
          });
      })
      .catch(e => {
        setError(e.message);
        stopConnection(e.message);
      });
  }

  useEffect(() => {
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
  }, [props.id]);

  if (error) {
    return <Message negative icon="close" header="Failed to communicate with server" content={error} />
  }

  const renderMessageIcon = (type) => {
    if (type == -1) {
      return <Icon name='remove circle' color='red' />
    }
    else if (type == 1) {
      return <Icon name='check circle' color='green' />
    }
    else if (type == 0) {
      return <Icon name='warning circle' color='yellow' />
    }
    return null;
  }

  function renderProgress() {
    if (subTitle) {
      return <div>
        <div>{subTitle}</div>
        <Progress percent={percent} color="blue">
          {description}
        </Progress>
        <hr />
      </div>
    }
    return null;
  }

  if (title) {
    return (<div>
      <h4>{title}</h4>
      <hr />
      {renderProgress()}
      {!props.hideMessage && <div>
        <div>Messages log</div>
        <List divided>
          {messages && messages.map((value, index) => <List.Item key={index}>
            {renderMessageIcon(value.type)}
            <List.Content>
              {value.timeOccur && <strong>{value.timeOccur}: </strong>}{value.message}</List.Content>
          </List.Item>)}
        </List>
      </div>
      }
    </div>);
  }

  return <div>Waiting progress to start</div>
}

export { MyProgress };



