import { saleConstants, userConstants } from '../_constants';
import { saleServices } from '../_services';
import { saleActions } from '../_actions';

const initialState = {
  filter: {}
}

export function customers(state = initialState, action) {
  switch (action.type) {
    case saleConstants.CUSTOMER_FILTER_CHANGE:
      return {
        filter: { ...state.filter, ...action.filter }
      }
    default:
      return state;
  }

}
