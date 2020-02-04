import React, { useState, useEffect, useRef } from 'react';
import { Progress, Segment, Statistic, Message } from 'semantic-ui-react';
import { Link } from 'react-router-dom';
import { useAlert } from 'react-alert';

const signalR = require("@aspnet/signalr");

export default function SendingMessageProcess(props) {
  const [data, setData] = useState({});
  const [hubConnection, setHubConnection] = useState();
  const [lastWord, setLastWord] = useState();
  const connectionRef = useRef();
  const dataRef = useRef();

  const alert = useAlert();

  function getPercent(state) {
    return Math.floor(state.total && state.count ? state.count * 100 / state.total : 0);
  }

  function setError(error) {
    setLastWord(error);
    setData({});
  }

  function setState(state) {
    dataRef.current = { ...dataRef.current, percent: getPercent(state), ...state };
    setData(dataRef.current);
  }

  function onProgress(total, count, success, error) {
    dataRef.current = { ...dataRef.current, percent: getPercent({ total, count }), count, success, error, state: 'Sending messages...' };
    setData(dataRef.current);
  }

  function stopConnection(word) {
    if (connectionRef.current == null)
      return;
    var words = [word, <div>Vui lòng truy cập <Link to={`/messaging/batches/${props.id}`} > {props.jobId}</Link> để truy cập thêm thông tin.</div>];
    setLastWord(words);
    connectionRef.current.stop();
    connectionRef.current = null;
    setHubConnection(null);
  }

  function startConnection() {
    const hub = connectionRef.current;
    if (hub == null) {
      return;
    }

    hub.start().then(() => {
      hub.invoke("SendMessage", props.id).then(result => {
        if (result) {
          if (result.stateCode == "WORKING") {
            dataRef.current = result;
            setData(dataRef.current);
          } else if (result.stateCode == "WAITING") {
            dataRef.current = { title: result.title, state: "Waiting to execute..." };
            setData(dataRef.current);
          }
        } else
          return Promise.reject("Cannot retrieve data from server");
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

  useEffect(() => {
  }, [props.header]);

  useEffect(() => {
    const hub = new signalR.HubConnectionBuilder()
      .configureLogging(signalR.LogLevel.Debug)
      .withUrl("/processHub", { transport: signalR.HttpTransportType.WebSockets | signalR.HttpTransportType.LongPolling }).build();
    connectionRef.current = hub;
    setHubConnection(hub);
  }, [props.id]);

  useEffect(() => {
    if (hubConnection == null)
      return;
    startConnection();
    hubConnection.on("Error", setError);
    hubConnection.on("StartProcess", setState);
    hubConnection.on("Progress", onProgress);
    hubConnection.on("EndProcess", (state) => {
      dataRef.current = {
        state: "Finished sending message",
        error: state.error,     
        success: state.success
      };
      setData(dataRef.current);
      props.onFinish && props.onFinish(`Đã hoàn thành tiến trình gửi ${state.total} tin nhắn, có ${state.error} lỗi, ${state.success} thành công`);
      stopConnection();
    });
    hubConnection.on("ChangeState", setState);
    hubConnection.onclose(() => {
      setTimeout(() => {
        startConnection();
      }, 5000);
    });
  }, [hubConnection]);

  useEffect(() => {
    return () => {
      if (connectionRef.current) {
        stopConnection();
      }
    };
  }, [])
  const process = data && data.percent != null && (<div>
    <Progress percent={data.percent} autoSuccess progress />
    <Statistic.Group size='mini'>
      <Statistic color="green">
        <Statistic.Value>{data.success}</Statistic.Value>
        <Statistic.Label>Add</Statistic.Label>
      </Statistic>

      <Statistic color="red">
        <Statistic.Value>{data.error}</Statistic.Value>
        <Statistic.Label>Error</Statistic.Label>
      </Statistic>
    </Statistic.Group>
  </div>);
  return (
    data && <div>
      <h4>{data.title}</h4>
      <div>{data.state}</div>
      {process}
      {data.messages && <Message content={data.messages} />}
      {lastWord && <Message content={lastWord} />}
    </div>
  );
}
