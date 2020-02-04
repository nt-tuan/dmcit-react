import { defaultFetch, defaultBlobFetch, authHeader } from '../_helpers';
const prefixApi = '/api/messaging/'
const df = (post, query, body) => {
  return defaultFetch(prefixApi + post, query, body);
}
function getMessageBatches(query) {
  return df(`MessageBatches`, query);
}

function getMessageBatch(id) {
  return df(`GetMessageBatch/${id}`);
}

function getMessage(id) {
  return df(`GetSendMessage/${id}`);
}

function getMessages(query) {
  return df(`GetSentMessages`, query);
}

function sendCustomMessage(query) {
  return df(`SendCustomMessage`, query);
}

function getSetting() {
  return df(`setting`, null, { method: 'GET' });
}

function getViettelSMSSetting() {
  return df('viettelsmssetting', null, {method:'GET'});
}
function updateViettelSMSSetting(data) {
  return df('viettelsmssetting', data, { method: 'POST' });
}
function getDefaultViettelSMSSetting() {
  return df('defaultviettelsmssetting', null, { method: 'GET' });
}

function getSMTPSetting(){
  return df('SmtpSetting', null, {method: 'GET'});
}

function updateSMTPSetting(data){
  return df('SmtpSetting', data, {method: 'POST'});
}

function getDefaultSMTPSetting(){
  return df('DefaultSmtpSetting', null, {method: 'GET'});
}

function reviewReceivers(query) {
  return df(`reviewreceivers`, query);
}

export const MessagingServiceApi = {
  getMessageBatches,
  getMessageBatch,
  sendCustomMessage,
  getMessage,
  getMessages,
  getSetting,
  getViettelSMSSetting,
  getDefaultViettelSMSSetting,
  updateViettelSMSSetting,
  getSMTPSetting,
  updateSMTPSetting,
  getDefaultSMTPSetting,
  reviewReceivers
}
