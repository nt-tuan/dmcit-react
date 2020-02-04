import { alertConstants } from '../_constants';

export function alert(state = {}, action) {
  let messages = action.messages ? action.messages : [];
  if (action.message)
    messages = [action.message, ...messages];
  switch (action.type) {
    case alertConstants.SUCCESS:
      return {
        type: 'info',
        messages
      };
    case alertConstants.ERROR:
      return {
        type: 'error',
        messages
      };
    case alertConstants.CLEAR:
      return {};
    case alertConstants.LOADING:
      return { loading: true };
    default:
      return state;
  }
}
