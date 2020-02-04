import { saleConstants } from '../_constants';
export const saleActions = {
  onFailure,
  changeDistributorSelection,
  initListComponent
}

function initListComponent(alert, tableRef) {
  return {
    type: saleConstants.CUSTOMERS_TABLE_INIT,
    alert, tableRef
  }
}

function changeDistributorSelection(e, { value, name }) {
  return {
    type: saleConstants.CUSTOMER_FILTER_CHANGE,
    filter: {
      distributor: value
    }
  }
}

function onFailure(error) {
  return dispatch => {
    return {
      type: saleConstants.GET_ERROR,
      error
    }
  }
}
