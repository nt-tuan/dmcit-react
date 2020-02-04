import { fixedRequestOptions, defaultFetchChain, defaultFetch } from '../_helpers/api-header';

export const collectingService = {
  loadDiary131,
  getServerDetail,
  getServers,
  updateServer
};

const prefixApi = "/api/datacollector/"
function df(url, data, body) {
  return defaultFetch(prefixApi + url, data, body);
}

function loadDiary131() {
  return df('DownloadDiary131');
}

function getServerDetail(id) {
  return df(`server/${id}`, null, {method: 'GET'});
}

function getServers() {
  return df(`servers`, null, { method: 'GET' });
}

function updateServer(data) {
  return df(`server`, data);
}

