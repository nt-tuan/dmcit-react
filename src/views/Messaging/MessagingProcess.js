import React, { useState, useEffect } from 'react';
import { Progress, Statistic } from 'semantic-ui-react';
import { useAlert } from 'react-alert';
import SendingMessageProcess from './Components/SendingMessageProcess';
const signalR = require("@aspnet/signalr");


export default function MessagingProgress(props) {
  const [data, setData] = useState({});
  const [state, setState] = useState();
  const alert = useAlert();
  const [hubConnection, setHubConnection] = useState();
  const id = props.id ? props.id : props.match.params.id;

  return <SendingMessageProcess jobId={id} />
}
