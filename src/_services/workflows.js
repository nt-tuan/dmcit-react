import React from 'react';
import Moment from 'react-moment';
import { fixedRequestOptions, defaultFetchChain, defaultFetch, handleResponse, handleError } from '../_helpers/api-header';
const signalR = require('@aspnet/signalr');

const prefix = "/api/workflows";
const df = (api, body, option) => defaultFetch(prefix + api, body, option);
const getWorkflows = () => {
  return df('', null, {method: 'GET'});
}

const getWorkflow = (id) => {
  return df('/'+id, null, { method: 'GET' });
}

const getWorkflowStatus = (id) => {
  return df('/status/' + id, null, { method: 'GET' });
}

const addWorkflow = (data) => {
  return df('', data, { method: 'POST' });
}

const editWorkflow = (id, data) => {
  return df('/'+id, data, { method: 'PUT' });
}

const deleteWorkflow = (id) => {
  return df('', null, { method: 'DELETE' });
}

const startWorkflow = (data) => {
  return df('/start', data, { method: 'POST' });
}

const getSetting = () => {
  return df('/setting', null, {method: 'GET'});
}

const buildHub = (hubMethods) => {
  const hub = new signalR.HubConnectionBuilder()
  .configureLogging(signalR.LogLevel.Debug)
  .withUrl("/workflowHub", {
    transport: signalR.HttpTransportType.WebSockets | signalR.HttpTransportType.LongPolling,
    accessTokenFactory: () => {
      const user = JSON.parse(localStorage.getItem('user'));
      if (user)
        return user.token;
      return null;
    }
  })
  .build();
  for (var key in hubMethods) {
    hub.on(key, hubMethods[key]);
  }
  return hub;
}

const getHistoryWorkflowEntrys = (data) => {
  return df('/history', {...data, orderBy: "DateCreated", orderDir: 1}, {method: 'POST'});
}

const getHistoryWorkflowEntry = (id) => {
  return df(`/history/${id}`, null, {method: 'GET'});
}

export const workflowService = {
  getWorkflows,
  getWorkflow,
  getWorkflowStatus,
  addWorkflow,
  editWorkflow,
  deleteWorkflow,
  startWorkflow,
  buildHub,
  getSetting,
  getHistoryWorkflowEntrys,
  getHistoryWorkflowEntry
};
