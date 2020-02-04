import React from 'react';
import Moment from 'react-moment';
import { fixedRequestOptions, defaultFetchChain, defaultFetch, handleResponse, handleError } from '../_helpers/api-header';

function getBusiness(id) {
  return defaultFetch(`/api/core/business/${id}`);
}
function getSetting() {
  return defaultFetch(`/api/core/setting`, null, {method: 'GET'});
}
function getAccountingPeriods() {
  return defaultFetch(`/api/core/accountingperiods`, null, { method: 'GET' });
}

function getLastAccountingPeriod() {
  return defaultFetch(`/api/core/lastAccountingPeriod`, null, {method: 'GET'});
}

function getOpeningAccountingPeriod() {
  return defaultFetch(`/api/core/openingAccoutingPeriod`, null, { method: 'GET' });
}

function getAccountingPeriod(id) {
  return defaultFetch(`/api/core/accountingperiod/${id}`, null, { method: 'GET' });
}

function addAccountingPeriod(data) {
  return defaultFetch(`/api/core/accountingperiod`, data, {method:'PUT'});
}

function updateAccountingPeriod(data) {
  return defaultFetch(`/api/core/accountingperiod`, data, { method: 'POST' });
}

function openAccountingPeriod(id) {
  return defaultFetch(`/api/core/openAccountingperiod`, null, { method: 'POST' });
}

function closeAccountingPeriod(id) {
  return defaultFetch(`/api/core/closeAccountingperiod`, null, { method: 'POST' });
}

function revertAccountingPeriod() {
  return defaultFetch(`/api/core/revertAccountingPeriod`, null, { method: 'POST' });
}

export const coreServices = {
  getBusiness,
  getSetting,
  getAccountingPeriods,
  getAccountingPeriod,
  addAccountingPeriod,
  updateAccountingPeriod,
  getLastAccountingPeriod,
  getOpeningAccountingPeriod,
  openAccountingPeriod,
  closeAccountingPeriod,
  revertAccountingPeriod
};
