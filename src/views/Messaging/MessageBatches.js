import React from 'react';
import { useAlert } from 'react-alert';
import MessageBatchList from './Components/MessageBatchList';

export default function MessageBatches(props) {
  return (<MessageBatchList {...props} />);
}
