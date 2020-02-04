import React, { useState, useEffect, useRef } from 'react';
import { Progress, Segment, Statistic } from 'semantic-ui-react';
import { useAlert } from 'react-alert';
import Moment from 'react-moment';

const signalR = require("@aspnet/signalr");



export default function LoadLiabilityProgress(props) {
  const [data, setData] = useState();
  const [description, setDescription] = useState("No executing process");
  const [hubConnection, setHubConnection] =
    useState();
  const [lastWord, setLastWord] = useState();
  const connectionRef = useRef();
  const dataRef = useRef();
  const alert = useAlert();
  function onStateChange(state) {
    const { percent, add, update, error, messages } = state;
    setDescription(state.description);
    dataRef.current = {
      ...dataRef.current, percent, add, update, error, messages
    }
    setData(dataRef.current);
  }

  function onProgress(percent, add, update, error) {
    dataRef.current = {
      percent, add, update, error
    };
    setData({
      percent, add, update, error
    });
  }


  function onNotFound() {
    setDescription("No executing process");
    dataRef.current = null;
    setData(null);
  }

  function onDone(state) {
    setDescription(<div>Completed <Moment fromNow>{new Date()}</Moment></div>);

    alert.info(`Đã hoàn thành tiến trình ${props.id}`);

    stopConnection();
  }

  function onError(message) {
    alert.error(message);
  }

  function startConnection() {
    const hub = connectionRef.current;
    if (hub == null) {
      return;
    }

    hub.start().then(() => {
      hub.invoke("AssociateJob", props.jobId).then(result => {
        if (result) {
          dataRef.current = result;
          setData(dataRef.current);
        } else
          Promise.reject("Cannot retrieve data from server");
      }).catch(error => {
        alert.error(error.toString());
        stopConnection();
      });
    })
      .catch(error => {
        alert.error(`Connection failed: ${error}`);
        props.onFinish && props.onFinish();
        stopConnection(error);
      });
  }

  function stopConnection(word) {
    if (connectionRef.current == null)
      return;
    setLastWord(word);
    connectionRef.current.stop();
    connectionRef.current = null;
    setHubConnection(null);
  }

  useEffect(() => {
    const hub = new signalR.HubConnectionBuilder()
      .configureLogging(signalR.LogLevel.Debug)
      .withUrl("/processHub", { transport: signalR.HttpTransportType.WebSockets | signalR.HttpTransportType.LongPolling }).build();
    connectionRef.current = hub;
    setHubConnection(hub);
  }, [props.jobId]);

  useEffect(() => {
    if (hubConnection == null)
      return;
    startConnection();
    hubConnection.on("NotFound", () => onNotFound);
    hubConnection.on("Progress", onProgress);
    hubConnection.on("OnError", onError);
    hubConnection.on("Finish", (state) => onDone);
    hubConnection.on("ChangeState", onStateChange);
    hubConnection.onclose(() => {
      setTimeout(() => {
        startConnection();
      }, 5000);
    });
  }, [hubConnection]);

  useEffect(() => {
    return () => {
      stopConnection();
    };
  }, [])
  const process = data && data.percent != null && (<div>
    <Progress percent={data.percent} autoSuccess progress />
  </div>);

  return (
    <Segment>
      {props.header && <h4>{props.header}</h4>}
      {description && <div>{description}</div>}
      {process}
    </Segment>
  );
}
