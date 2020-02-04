import React, { useEffect, useState, useReducer } from 'react';
import { Button, Icon, ButtonGroup, Card, Loader } from 'semantic-ui-react';
import MyModal from '../Modals/MyModal';
import { coreServices, collectingService } from '../../_services';
import { accountingActions } from '../../_actions';
import { MyProgress } from '../Base/Progress/Progress';
import { AccountingPeriodView, AccountingPeriodAdd } from './AccountingPeriod';
import { accountingReducer } from '../../_reducers/accounting.reducer';

const APSettingContext = React.createContext(null);

function AccountingPeriodsSetting(props) {
  const [reducerData, dispatch] = useReducer(accountingReducer.accountingPeriod, { loading: true });
  const [viewAdd, setViewAdd] = useState(false);
  const [modal, setModal] = useState({})
  function loadData() {
    accountingActions.getAccountingPeriods()(dispatch);
  };

  function openAdd() {
    setViewAdd(!viewAdd);
  }

  function downloadDiary131() {
    collectingService.loadDiary131()
      .then(json => {
        setModal({
          open: true,
          header: 'Download diary131 process',
          component: <MyProgress id={json} />,
          expandable: `/progress/${json}`
        });
      })
      .catch(error => { console.log(error); });
  }

  function closeAP() {
    coreServices.closeAccountingPeriod()
      .then(json => {
        setModal({
          open: true,
          header: 'Download diary131 process',
          component: <MyProgress id={json} />,
          expandable: `/progress/${json}`
        });
      })
      .catch(error => { });
  }

  function rollbackAP() {
    coreServices.revertAccountingPeriod()
      .then(json => {
        accountingActions.getAccountingPeriods()(dispatch);
      })
      .catch(error => { });
  }

  function openAP() {
    coreServices.openAccountingPeriod()
      .then(json => {
        accountingActions.getAccountingPeriods()(dispatch);
      })
      .catch(error => {
      });
  }

  useEffect(() => {
    loadData();
  }, []);

  const { data, apState } = reducerData;

  if (!data || !apState)
    return <Loader active />;

  return <APSettingContext.Provider value={dispatch}>
    {modal && <MyModal open={modal && modal.open} header={modal.header} expandable={modal.expandable} component={modal.component} onClose={() => {
      setModal(null);
      accountingActions.getAccountingPeriods()(dispatch);
    }} />}
    <Card fluid>
      <Card.Content>
        <Card.Header>
          ACCOUNTING PERIOD &emsp;
        <Button size="mini" icon compact onClick={openAdd} color="green" labelPosition="left">
            <Icon name="plus" />
            Add
          </Button>
          <Button size="mini" icon compact onClick={openAP} primary labelPosition="left" disabled={apState.opening || !apState.available}>
            <Icon name="unlock" />
            Open
          </Button>

          <Button size="mini" icon compact onClick={closeAP} primary labelPosition="left" disabled={!apState.opening}>
            <Icon name="lock" />
            Close
          </Button>


          <Button size="mini" icon compact onClick={rollbackAP} color="red" labelPosition="left" disabled={apState.opening || !apState.closed}>
            <Icon name="undo" />
            Back
          </Button>

          <Button size="mini" icon compact onClick={downloadDiary131} labelPosition="left" primary disabled={!apState.opening}>
            <Icon name="download" />
            Diary131
            </Button>

        </Card.Header>
        <Card.Description>
          <Card.Group itemsPerRow={1}>
            {viewAdd && <AccountingPeriodAdd key={-1} onSuccess={loadData} />}
            {data && data.map((u, index) =>
              <AccountingPeriodView key={index}
                ap={u} />)}
          </Card.Group>
        </Card.Description>
      </Card.Content>
    </Card>
  </APSettingContext.Provider>
}

export { AccountingPeriodsSetting, APSettingContext };
