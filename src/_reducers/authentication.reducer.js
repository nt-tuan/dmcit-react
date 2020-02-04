import { userConstants } from '../_constants';

export function authentication(state = {}, action) {
  switch (action.type) {
    case userConstants.LOGIN_REQUEST:
      return {
        authenticating: true,
        user: action.user
      };
    case userConstants.LOGIN_SUCCESS:
      return {
        ...state,
        authenticating: false,
        user: action.user
      };
    case userConstants.LOGIN_FAILURE:
      return { error: action.error, authenticating: false };
    case userConstants.AUTHENTICATED: {
      const user = JSON.parse(localStorage.getItem('user'));
      return { ...state, user, authenticating: false };
    }
    case userConstants.AUTHENTICATE_REQUEST:
      return { ...state, authenticating: true };
    case userConstants.AUTHENTICATE_FAILURE:
      return { authenticating: false, error: action.error };
    case userConstants.GET_MY_ROLES_REQUEST:
      return { ...state, authorizing: true };
    case userConstants.GET_MY_ROLES_SUCCESS:
      return { ...state, roles: action.roles, authorizing: false };
    case userConstants.GET_MY_ROLES_FAILURE:
      return { ...state, error: action.error, authorizing: false };
    case userConstants.LOGOUT:
      return {};
    default:
      return state;
  }
}
