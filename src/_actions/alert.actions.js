import { alertConstants } from '../_constants';

export const alertActions = {
  success,
  error,
  clear,
  loading
};

function success(message) {
  return dispatch => dispatch({ type: alertConstants.SUCCESS, message });
}

function error(message) {
  return dispatch => dispatch({ type: alertConstants.ERROR, message });
}

function clear() {
  return dispatch => dispatch({ type: alertConstants.CLEAR });
}

function loading() {
  return dispatch => dispatch({ type: alertConstants.LOADING });
}
