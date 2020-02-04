import { accountingConstants } from '../_constants';
import { coreServices } from '../_services';
import { alertActions } from './';
import { history } from '../_helpers';

function parseAccountingPeriod(json) {
  const { name, opened, closed, id } = json;
  let startTime = null, endTime = null;
  if (json.startTime)
    startTime = new Date(json.startTime);
  if (json.endTime)
    endTime = new Date(json.endTime);
  return { startTime, endTime, name, opened, closed, id };
}

function handleSubmitSuccess() {

}

function handleSubmitError() {

}

function addAccountingPeriod(data, { onSuccess, onError}) {
  return dispatch => {
    dispatch({ type: accountingConstants.SUBMIT_ACCOUNTING_PERIOD_REQUEST });
    coreServices.addAccountingPeriod(data)
      .then(json => {
        dispatch({ type: accountingConstants.SUBMIT_ACCOUNTING_PERIOD_SUCCESS });
        initAddLastAccoutingPeriod()(dispatch);
        onSuccess && onSuccess();
      })
      .catch(error => {
        dispatch({ type: accountingConstants.SUBMIT_ACCOUNTING_PERIOD_FAILURE });
        onError && onError(error);
      });
  }
}

function setAccountingPeriod(data) {
  return dispatch => {
    dispatch({ type: accountingConstants.GET_ACCOUNTING_PERIOD_SUCCESS, data });
  }
};

function getAccountingPeriod(id) {
  return dispatch => { 
    dispatch({ type: accountingConstants.GET_ACCOUNTING_PERIOD_REQUEST, id });
    coreServices.getAccountingPeriod(id)
      .then(json => {
        const data = parseAccountingPeriod(json);
        setAccountingPeriod(data)(dispatch);
        //dispatch({ type: accountingConstants.GET_ACCOUNTING_PERIOD_SUCCESS, data });
      })
      .catch(error => {
        dispatch({ type: accountingConstants.ACCOUNTING_FAILURE, error });
      });
  }
}

function getAccountingPeriods() {
  return dispatch => {
    dispatch({ type: accountingConstants.GET_ACCOUNTING_PERIOD_LIST_REQUEST });
    coreServices.getAccountingPeriods()
      .then(json => {
        dispatch({ type: accountingConstants.GET_ACCOUNTING_PERIOD_LIST_SUCCESS, data: json });
      })
      .catch(error => {
        dispatch({ type: accountingConstants.ACCOUNTING_FAILURE, error });
      });
  };
}

function switchToUpdateMode(id) {
  return dispatch => {
    dispatch({ type: accountingConstants.SWITCH_TO_UPDATE_MODE, id });
  };
}
function switchToViewMode(id) {
  return dispatch => {
    dispatch({ type: accountingConstants.SWITCH_TO_VIEW_MODE, id });
  };
}

function initUpdateLastAccountingPeriod(id) {
  return dispatch => {
    dispatch({ type: accountingConstants.UPDATE_ACCOUNTING_PERIOD_INIT_REQUEST, id });

    Promise.all([coreServices.getLastAccountingPeriod(), coreServices.getAccountingPeriod(id)])
      .then(values => {
        const data = parseAccountingPeriod(values[1]);
        dispatch({
          type: accountingConstants.UPDATE_ACCOUNTING_PERIOD_INIT_SUCCESS,
          data,
          isTheLast: values[1].id == values[0].id
        });
      })
      .catch(error => {
        dispatch({ type: accountingConstants.ACCOUNTING_FAILURE }, error);
      });;
  };
}

function initAddLastAccoutingPeriod() {
  return dispatch => {
    dispatch({ type: accountingConstants.ADD_ACCOUNTING_PERIOD_INIT_REQUEST });

    coreServices.getLastAccountingPeriod()
      .then(json => {
        const data = json ? parseAccountingPeriod(json) : {startTime: new Date(1900,1,1)};
        dispatch({ type: accountingConstants.ADD_ACCOUNTING_PERIOD_INIT_SUCCESS, data });
      })
      .catch(error => {
        dispatch({ type: accountingConstants.ACCOUNTING_FAILURE }, error);
      });
  };
}

function updateAccountingPeriod(data) {
  return dispatch => {
    dispatch({ type: accountingConstants.SUBMIT_ACCOUNTING_PERIOD_REQUEST });

    coreServices.updateAccountingPeriod(data)
      .then(json => {
        getAccountingPeriods()(dispatch);
      })
      .catch(error => {
        dispatch({ type: accountingConstants.ACCOUNTING_FAILURE });
      });
  }
}

function openAccountingPeriod(id, { onSuccess, onError}) {
  return dispatch => {
    dispatch({ type: accountingConstants.SUBMIT_ACCOUNTING_PERIOD_REQUEST });
    coreServices.openAccountingPeriod(id)
      .then(json => {
        dispatch({ type: accountingConstants.SUBMIT_ACCOUNTING_PERIOD_SUCCESS });
        getAccountingPeriod(id)(dispatch);
        onSuccess && onSuccess();
      })
      .catch(error => {
        dispatch({ type: accountingConstants.ACCOUNTING_FAILURE }, error);
        onError && onError();
      });
  }
}

function closeAccountingPeriod(id, { onSuccess, onError}) {
  return dispatch => {
    dispatch({ type: accountingConstants.SUBMIT_ACCOUNTING_PERIOD_REQUEST });
    coreServices.closeAccountingPeriod(id)
      .then(json => {
        dispatch({ type: accountingConstants.SUBMIT_ACCOUNTING_PERIOD_SUCCESS });
        getAccountingPeriod(id)(dispatch);
        onSuccess && onSuccess(json);
      })
      .catch(error => {
        dispatch({ type: accountingConstants.ACCOUNTING_FAILURE }, error);
        onError && onError();
      });
  }
}

function revertAccountingPeriod(id, { onSuccess, onError }) {
  return dispatch => {
    dispatch({ type: accountingConstants.SUBMIT_ACCOUNTING_PERIOD_REQUEST });
    coreServices.revertAccountingPeriod()
      .then(json => {
        dispatch({ type: accountingConstants.SUBMIT_ACCOUNTING_PERIOD_SUCCESS });
        getAccountingPeriod(id)(dispatch);
        onSuccess && onSuccess();
      })
      .catch(error => {
        dispatch({ type: accountingConstants.ACCOUNTING_FAILURE }, error);
        onError && onError();
      });
  }
}

function updateAccountingPeriodHandleChange(name, value, id) {
  return dispatch => {
    dispatch({ type: accountingConstants.UPDATE_ACCOUNTING_PERIOD_CHANGE, data: { name, value, id } });
  };
}

export const accountingActions = {
  getAccountingPeriod,
  getAccountingPeriods,
  addAccountingPeriod,
  initAddLastAccoutingPeriod,
  initUpdateLastAccountingPeriod,
  updateAccountingPeriodHandleChange,
  updateAccountingPeriod,
  openAccountingPeriod,
  closeAccountingPeriod,
  revertAccountingPeriod,
  setAccountingPeriod,
  switchToUpdateMode,
  switchToViewMode,
  parseAccountingPeriod
};
