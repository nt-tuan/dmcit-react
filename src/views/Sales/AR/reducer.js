import { accountingConstants } from './constants';

function accountingPeriod(state = { loading: true }, action) {
  switch (action.type) {
    case accountingConstants.GET_ACCOUNTING_PERIOD_LIST_REQUEST:
      return {
        loading: true
      };
    case accountingConstants.GET_ACCOUNTING_PERIOD_LIST_SUCCESS:
      {
        const { data } = action;
        const opening = data.filter(u => u.opened && !u.closed).length > 0;
        const closed = data.filter(u => u.closed).length > 0;
        const available = data.filter(u => !u.opened).length > 0;

        return {
          ...state,
          data,
          apState: {
            opening,
            closed,
            available
          }
        };
      }
    case accountingConstants.GET_ACCOUNTING_PERIOD_REQUEST: {
      const { id } = action;
      if (state.data) {
        const data = state.data.map(u => {
          if (u.id != id)
            return u;
          return { ...u, loading: true };
        });
        return { ...state, data };
      }
      return {
        ...state };
    }
    case
      accountingConstants.GET_ACCOUNTING_PERIOD_SUCCESS: {
        const { startTime, endTime, closed, opened, name, id } = action.data;
        if (state.data) {
          const data = state.data.map(u => {
            if (u.id != id)
              return u;
            return { startTime, endTime, closed, opened, name, id };
          });
          return { ...state, data };
        }
        return { ...state };
      }

    case accountingConstants.ADD_ACCOUNTING_PERIOD_INIT_REQUEST:
      return {
        ...state, addAp: { loading: true }
      };
    case accountingConstants.ADD_ACCOUNTING_PERIOD_INIT_SUCCESS: {
      const { data } = action;
      if (data) {
        return {
          ...state,
          addAp: { startTime: data.endTime }
        };
      }
      else {
        return {
          ...state, appData: {}
        };
      }
    }
    case accountingConstants.UPDATE_ACCOUNTING_PERIOD_INIT_REQUEST:
      {
        const { id } = action;
        const newData = state.data.map(u => {
          if (u.id != id)
            return u;
          return {
            ...u, update: { loading: true }
          };
        });
        return { ...state, data: newData };
      }
    case accountingConstants.SWITCH_TO_UPDATE_MODE: {
      const { id } = action;
      const newData = state.data.map(u => {
        if (u.id != id)
          return u;
        return {
          ...u, update: { id }
        };
      });
      return { ...state, data: newData };
    }
    case accountingConstants.SWITCH_TO_VIEW_MODE: {
      const { id } = action;
      const newData = state.data.map(u => {
        if (u.id != id)
          return u;
        return {
          ...u, update: null
        };
      });
      return { ...state, data: newData };
    }
    case accountingConstants.UPDATE_ACCOUNTING_PERIOD_INIT_SUCCESS:
      {
        const { startTime, endTime, closed, opened, name, id } = action.data;
        const newData = state.data.map(u => {
          if (u.id != id)
            return u;
          return {
            startTime, endTime, closed, opened, name, id
          };
        });
        return { ...state, data: newData };
      }

    case accountingConstants.UPDATE_ACCOUNTING_PERIOD_CHANGE: {
      const { name, value, id } = action;
      const newData = state.data.map(u => {
        if (u.id != id)
          return u;
        var { update } = u;
        return {
          ...u, update: { ...update, [name]: value }
        };
      });
    }

    case accountingConstants.SUBMIT_ACCOUNTING_PERIOD_REQUEST:
      return { ...state, submiting: true };
    case accountingConstants.SUBMIT_ACCOUNTING_PERIOD_SUCCESS:
      return { ...state, submiting: false };
  }
}

export const accountingReducer = { accountingPeriod };
