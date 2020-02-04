import { fixedRequestOptions, defaultBlobFetch, handleResponse, handleError, defaultFetch } from '../_helpers/api-header';
import { authHeader } from '../_helpers';

export const saleServices = {
  getCustomers,
  getCustomerDetail,
  importCustomers,
  previewCustomers,
  getDistributors,
  customerTableColumns
}

function customerTableColumns() {
  return [
    { title: 'CODE', field: 'code', sorting: true, key: 'code' },
    {
      title: 'NAME', render: rowData => {
        if (rowData.business) {
          return rowData.business.fullname
        }else 
        if (rowData.person) {
          return rowData.person.fullname
        } 
        return null;
      },
      sorting: false
    },
    {
      title: 'DISTRIBUTOR',
      render: rowData => {
        if (rowData.distributor)
          return rowData.distributor.name;
        return null;
      },
      sorting: false
    },
    {
      title: 'CATEGORY',
      render: rowData => {
        if (rowData.person) {
          return "PERSONAL"
        } else if (rowData.business) {
          return "BUSINESS"
        }
        return "UNDEFINED";
      },
      sorting: false
    }
  ];
}

function getCustomers(query) {
  return defaultFetch('/api/sales/customers', query);
}

function importCustomers(data) {
  return fetch(`/api/sales/ImportCustomers`, {
    method: 'POST',
    headers: {
      ...authHeader()
    },
    body: data
  })
    .then(response => {
      if (response.ok)
        return response.blob();
      return response.text().then(text => Promise.reject(text));
    }, error => {
      return Promise.reject(error);
    });
}

function previewCustomers(data) {
  return fetch(`/api/sales/PreviewCustomers`, {
    method: 'POST',
    headers: {
      ...authHeader()
    },
    body: data
  })
    .then(response => {
      if (response.ok)
        return response.blob();
      return response.text().then(text => Promise.reject(text));
    }, error => {
      return Promise.reject(error);
    });
}

function getDistributors(){
  return defaultFetch('/api/sales/distributors');
}

function getCustomerDetail(id) {
  return defaultFetch(`/api/sales/customers/${id}`);
}

