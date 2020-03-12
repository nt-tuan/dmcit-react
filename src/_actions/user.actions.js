import { userConstants } from '../_constants';
import { userService } from '../_services';
import { alertActions } from './';
import { history } from '../_helpers';

export const userActions = {
  login,
  logout,
  register,
  getAll,
  getMyRoles,
  delete: _delete,
  isAuthenticated
};

function login(username, password, onSuccess) {
  return dispatch => {
    dispatch(request({ username }));
    userService.login(username, password)
      .then(
        user => {
          localStorage.setItem('user', JSON.stringify(user));
          dispatch(success(user));
        })
      .then(userService.getMyRoles)
      .then(roles => dispatch({ type: userConstants.GET_MY_ROLES_SUCCESS, roles }))
      .then(() => {
        if (onSuccess)
          onSuccess();
        else
          history.push('/');
      })
      .catch(error => {
        dispatch(failure(error));
        dispatch(alertActions.error(error));
      });
  };

  function request(user) { return { type: userConstants.LOGIN_REQUEST, user } }
  function success(user) { return { type: userConstants.LOGIN_SUCCESS, user } }
  function failure(error) { return { type: userConstants.LOGIN_FAILURE, error } }
}

function getMyRoles() {
  return dispatch => {
    dispatch(request());
    userService.getMyRoles()
      .then(json => {
        dispatch(success(json));
      })
      .catch(err => {
        dispatch(failure(err));
      });
  };

  function request() {
    return { type: userConstants.GET_MY_ROLES_REQUEST };
  }

  function success(roles) {
    return { type: userConstants.GET_MY_ROLES_SUCCESS, roles };
  }

  function failure(message) {
    return { type: userConstants.GET_MY_ROLES_FAILURE, error: message };
  }
}

function isAuthenticated() {
  return dispatch => {
    dispatch({ type: userConstants.AUTHENTICATE_REQUEST });
    userService.authenticated()
      .then(json => {
        if (json) {
          dispatch({
            type: userConstants.AUTHENTICATED
          });
        } else {
          return Promise.reject();
        }
      })
      .catch(error => {
        localStorage.setItem('user', null);
        dispatch({ type: userConstants.AUTHENTICATE_FAILURE, error })
      });
  };
}

function logout() {
  userService.logout();
  return { type: userConstants.LOGOUT };
}

function register(user) {
  return dispatch => {
    if (user.password !== user.confirmPassword) {
      dispatch(failure({ messages: ['Password and confirm password are not match each other'] }));
      return;
    }

    dispatch(request(user));
    userService.register(user)
      .then(
        user => {
          dispatch(success());
          history.push('/login');
          dispatch(alertActions.success('Registration successful'));
        },
        error => {
          dispatch(failure(error));
          dispatch(alertActions.error(error));
        }
      );
  };

  function request(user) { return { type: userConstants.REGISTER_REQUEST, user } }
  function success(user) { return { type: userConstants.REGISTER_SUCCESS, user } }
  function failure(error) { return { type: userConstants.REGISTER_FAILURE, error } }
}

function getAll() {
  return dispatch => {
    dispatch(request());

    userService.getAll()
      .then(
        users => dispatch(success(users)),
        error => dispatch(failure(error.toString()))
      );
  };

  function request() { return { type: userConstants.GETALL_REQUEST } }
  function success(users) { return { type: userConstants.GETALL_SUCCESS, users } }
  function failure(error) { return { type: userConstants.GETALL_FAILURE, error } }
}

// prefixed function name with underscore because delete is a reserved word in javascript
function _delete(id) {
  return dispatch => {
    dispatch(request(id));

    userService.delete(id)
      .then(
        user => dispatch(success(id)),
        error => dispatch(failure(id, error.toString()))
      );
  };

  function request(id) { return { type: userConstants.DELETE_REQUEST, id } }
  function success(id) { return { type: userConstants.DELETE_SUCCESS, id } }
  function failure(id, error) { return { type: userConstants.DELETE_FAILURE, id, error } }
}

