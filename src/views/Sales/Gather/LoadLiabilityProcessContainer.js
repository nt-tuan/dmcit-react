import React, { useState, useEffect, useRef } from 'react';
import { Grid, List, Segment } from 'semantic-ui-react';
import LoadLiabilityProcess from './LoadLiabilityProcess';
import { useAlert } from 'react-alert';
const signalR = require('@aspnet/signalr')
export default function LoadLiabilityProcessContainer(props) {
  const [myHub, setHub] = useState();
  const [myMessage, setMyMessage] = useState([]);
  const [myJobs, setMyJobs] = useState([]);

  const alert = useAlert();
  const jobs = useRef([]);
  const messagesList = useRef([]);

  function setJobs(_job) {
    jobs.current = _job;
    setMyJobs(jobs.current);
  }

  function startConnection(hub) {
    if (hub == null)
      return;
    hub.start().then(() => {
      hub.invoke("GetAllCollectingProcess").then(u => {
        setJobs(u.map(v => { return { job: v }; }));
      });
      console.log("connection started");
    })
      .catch(error => alert.error(`connection failed: ${error}`));
  }

  function onResult({ isSuccessed, response }) {
    messagesList.current = [{ isSuccessed: true, content: response }, ...messagesList.current];
    setMyMessage(messagesList.current);
  }

  useEffect(() => {
    const hub = new signalR.HubConnectionBuilder().configureLogging(signalR.LogLevel.Debug).withUrl("/processHub", { transport: signalR.HttpTransportType.WebSockets | signalR.HttpTransportType.LongPolling }).build();
    setHub(hub);
  }, []);

  useEffect(() => {
    if (myHub == null)
      return;
    startConnection(myHub);
    myHub.on("OnNewProcess", (job, title) => {
      if (jobs == null) {
        setJobs([{ job, title }]);
      } else {
        if (jobs.current.filter(u => u.job == job).length == 0) {
          setJobs([...jobs.current, { job, title }]);
        }
      }
    });

    myHub.on("OnRemoveProcess", (job) => {
      if (jobs.current)
        setJobs(jobs.current.filter(u => u.job != job));
    });

    myHub.on("Result", onResult);

    myHub.onclose(() => {
      setTimeout(() => {
        startConnection(myHub);
      }, 5000);
    });
  }, [myHub]);

  const processNodes = myJobs && myJobs.length > 0? myJobs.map(u => {
    return <LoadLiabilityProcess header={u.title} jobId={u.job} key={u.job} />
  }) : <p><i>Không có tiến trình tải dữ liệu phân tán nào đang chạy</i></p>;

  return (<div>
    {processNodes}
    {myMessage && myMessage.length > 0 &&
      <Segment>
        <List>
          {myMessage.map((u, i) => <List.Item key={i} content={<p>{u.content}</p>} icon={u.isSuccessed ? 'check' : 'close'} />)}
        </List>
      </Segment>
    }
  </div>
  );
}
