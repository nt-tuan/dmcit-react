import { authHeader, config, handleResponse, handleError, fixedRequestOptions, defaultFetch } from '../_helpers';

export const userService = {
  login,
  logout,
  register,
  list,
  getById,
  update,
  delete: _delete,

  getRoles,
  getAllRoles,
  getMyRoles,
  authenticated
};

function login(username, password) {
  return defaultFetch('/api/account/login',
    { username, password });
}

function logout() {
  // remove user from local storage to log user out
  return fetch(config.apiUrl + "/api/account/logout", fixedRequestOptions())
    .then(handleResponse)
    .then(user => {
        localStorage.removeItem('user');      
      return user;
    });
}

function list(data) {
  return defaultFetch('/api/account/list', data);
}

function getById(_id) {
  return defaultFetch(`/api/account/details/${_id}`);
}

function register(user) {
  const requestOptions = {
    ...fixedRequestOptions(),
    body: JSON.stringify(user)
  };

  return fetch(config.apiUrl + '/api/account/register', requestOptions)
    .then(handleResponse, handleError);
}

function update(user) {
  return defaultFetch(`/api/account/update`, user);
}

// prefixed function name with underscore because delete is a reserved word in javascript
function _delete(id) {
  const requestOptions = {
    method: 'DELETE',
    headers: authHeader()
  };

  return fetch(config.apiUrl + '/account/' + id, requestOptions).then(handleResponse, handleError);
}

function getRoles(id) {
  return defaultFetch(`/api/account/roles/${id}`);
}

function getAllRoles() {
  return defaultFetch('/api/account/allroles');
}

function getMyRoles() {
  return defaultFetch('/api/account/myroles');
}

function authenticated() {
  return defaultFetch('/api/account/authenticated');
}
