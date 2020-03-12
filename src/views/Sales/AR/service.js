import { defaultFetch, defaultBlobFetch, authHeader, fixedRequestOptions } from '../../../_helpers';

const prefixApi = '/api/customerAR/'
const df = (post, query, body) => {
  return defaultFetch(prefixApi + post, query, body);
}

function getReceiverLiability(query) {
  return df(`GetCustomerLiability`, query);
}

function loadCustomerPayment(query) {
  return defaultBlobFetch(prefixApi+ 'CalculateCustomersPayment', query);
}

function exportCustomerPayment(query) {
  return defaultBlobFetch(prefixApi + `ExportCustomersPayment`, query);
}

function rawExportCustomerPayment(query){
  return defaultBlobFetch(prefixApi + 'payments/excel', query);
}

function sendCustomerPaymentMessage(query) {
  return df(`SendCustomersPayment`, query);
}

function sendCustomerLiabilityMessage(query) {
  return defaultFetch(`SendCustomersLiability`, query);
}

function getCustomerPaymentState() {
  return df(`GetCustomerPaymentState`);
}

function getDiary131State() {
  return df('GetDiary131State');
}

function exportCustomerLiabilities(data) {
  return defaultBlobFetch(prefixApi + 'ExportCustomerLiabilities', data);
}

function rawExportCustomerAR(query){
  return defaultBlobFetch(prefixApi + 'payments/excel', query);
}

const getLastCustomerARs = data => {
  return df('ars', data);
}

const getCustomerPayments = data => {
  return df('payments', data);
}

export const customerARService = {
  getReceiverLiability,
  loadCustomerPayment,
  exportCustomerPayment,
  rawExportCustomerPayment,
  sendCustomerPaymentMessage,
  sendCustomerLiabilityMessage,
  getCustomerPaymentState,
  getDiary131State,
  exportCustomerLiabilities,
  rawExportCustomerAR,
  getLastCustomerARs,
  getCustomerPayments
}
