import { defaultFetch, defaultBlobFetch, authHeader } from '../_helpers';

export const RecipientServiceApi = {
  receiverColumns,
  addEmployeeReceiver,
  addCustomerReceiver,
  getReceiver,
  getReceivers,
  exportReceivers,
  deleteReceivers,
  getRecieverProviders,
  getProviders,
  addAddress,
  deleteAddress,
  addGroup,
  editGroup,
  getGroup,
  getGroups,
  reviewReceivers,
  previewReceivers,
  importReceivers
}

const getReceiverAddressFromRow = (row, name) => {
  if (!row.providers)
    return null;
  let filter = row.providers.filter(u => u.provider && u.provider.code.toLowerCase() == name.toLowerCase());
  if (filter.length > 0) {
    return filter[0].receiverAddress;
  }
}

function receiverColumns() {
  return [
    {
      title: '#',
      field: 'id'
    },
    {
      title: 'RECEIVER',
      field: 'fullname'
    }, {
      title: 'CATEGORY',
      render: (rowData) => {
        if (rowData.employeeId) {
          return 'EMPLOYEE';
        } else if (rowData.customerId) {
          return 'CUSTOMER';
        } else {
          return 'OTHER';
        }
      }
    },
    {
      title: 'Viettel',
      render: (rowData) => {
        return getReceiverAddressFromRow(rowData, 'viettel');
      }
    },
    {
      title: 'Netco',
      render: (rowData) => {
        return getReceiverAddressFromRow(rowData, 'netco');
      }
    },
    {
      title: 'Zalo',
      render: (rowData) => {
        return getReceiverAddressFromRow(rowData, 'zalo');
      }
    }
  ];
}

const prefixApi = '/api/messageReceiver/'
const df = (post, query, body) => {
  return defaultFetch(prefixApi + post, query, body);
}

function addEmployeeReceiver(query) {
  return df('AddEmployeeReceiver', query);
}

function addCustomerReceiver(query) {
  return df('AddCustomerReceiver', query);
};

function getReceiver(id) {
  return df(`receivers/${id}`);
}

function getReceivers(query) {
  return df('receivers', query);
}

function exportReceivers(query) {
  return df('exportreceivers', query);
}

function deleteReceivers(ids) {
  return df('messaging/delete', ids);
}

function getRecieverProviders(id) {
  return df(`receiverproviders/${id}`);
}

function getProviders() {
  return df('providers');
}

function addAddress(query) {
  return df(`AddReceiverProvider`, query);
}

function deleteAddress(id, query) {
  return df(`DeleteReceiverProvider/${id}`, query);
}

function addGroup(query) {
  return df('AddGroup', query);
}

function editGroup(id, query) {
  return df(`EditGroup/${id}`, query);
}

function getGroup(id) {
  return df(`GetGroup/${id}`);
}

function getGroups(query) {
  return df(`Groups`, query);
}

function reviewReceivers(query) {
  return df(`reviewreceivers`, query);
}

function previewReceivers(data) {
  return fetch(prefixApi + `PreviewReceivers`, {
    method: 'POST',
    body: data,
    headers: {
      ...authHeader()
    }
  }).then(res => {
    if (res.ok)
      return res.blob();
    throw new Error(res.statusText);
  });
}

function importReceivers(data) {
  return fetch(prefixApi + `ImportReceivers`, {
    method: 'POST',
    body: data,
    headers: {
      ...authHeader()
    }
  }).then(res => {
    if (res.ok)
      return res.blob();
    throw new Error(res.statusText);
  });
}
