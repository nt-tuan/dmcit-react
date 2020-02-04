import React, { useState, useContext, useEffect } from 'react';
import { Message as BaseMessage } from 'semantic-ui-react';
const getList = (messages, message) => {
  let list = [];

  if (message && message.length !== 0)
    list.push(message);
  if (messages)
    list = list.concat(messages);
  console.log("Message: " + message);
  console.log("Messages: " + messages);
  console.log("list: " + list);
  return list;
};

const alertStyle = {
  backgroundColor: '#151515',
  color: 'white',
  padding: '10px',
  textTransform: 'uppercase',
  borderRadius: '3px',
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  boxShadow: '0px 2px 2px 2px rgba(0, 0, 0, 0.03)',
  fontFamily: 'Arial',
  width: '300px',
  boxSizing: 'border-box'
}

const buttonStyle = {
  marginLeft: '20px',
  border: 'none',
  backgroundColor: 'transparent',
  cursor: 'pointer',
  color: '#FFFFFF'
}

export default function Message(props) {
  const [list, setMessageList] = useState([]);

  useEffect(() => {
    setMessageList(getList(props.messages, props.message));
  }, [props.messages, props.message]);

  function handleDismiss() {
    if (props.onDismiss) {
      props.onDismiss();
    }
  }

  if (!list || list.length === 0)
    return null;

  return (
    <BaseMessage list={list} error={props.error} info={props.info} warning={props.warning} onDismiss={handleDismiss} />
  );
}
