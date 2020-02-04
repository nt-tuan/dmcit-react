import { defaultFetch, defaultBlobFetch } from '../_helpers';

const prefixApi = "/api/template/"
const getTemplates = () => {
  return defaultFetch(prefixApi + '', null, { method: 'GET' });
}

const getTemplate = (id) => {
  return defaultFetch(prefixApi + id, null, { method: 'GET' });
}

const updateTemplate = (id, data) => {
  return defaultFetch(prefixApi + id, data, { method: 'PUT' });
}

const testReviewTemplate = (id, model) => {
  return defaultFetch(`${prefixApi}testreview?id=${id}&model=${model}`, null, { method: 'GET' });
}

const testDownloadTemplate = (id, model) => {
  return defaultBlobFetch(`${prefixApi}testdownload?id=${id}&&model=${model}`, null, { method: 'GET' });
}

export const templateService = {
  getTemplate,
  getTemplates,
  updateTemplate,
  testReviewTemplate,
  testDownloadTemplate
};
