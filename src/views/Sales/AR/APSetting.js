import React, { useEffect, useState, useReducer } from 'react';
import { Loader } from 'semantic-ui-react';
import { List, Button as B} from 'antd';
import {PlusOutlined, BackwardOutlined, UnlockOutlined, LockOutlined, DownloadOutlined} from '@ant-design/icons';
import {Header} from '../../Base';
import MyModal from '../../Modals/MyModal';
import { coreServices } from '../../../_services';
import { collectingService } from './collectingService';
import { accountingActions } from './action';
import { MyProgress } from '../../Base/Progress/Progress';
import { AccountingPeriodView, AccountingPeriodAdd } from './AccountingPeriodItem';
import { accountingReducer } from './reducer';

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

    const onCloseNewApp = () => {
        setViewAdd(false);
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
        <Header title='ACCOUNTING PERIODS' extras={<>
            <B icon={<PlusOutlined />} onClick={openAdd}>Add</B>
            <B icon={<UnlockOutlined />} onClick={openAP} disabled={apState.opening || !apState.available}>Open</B>
            <B icon={<LockOutlined />} onClick={closeAP} disabled={!apState.opening}>Close</B>
            <B icon={<BackwardOutlined />} onClick={rollbackAP} disabled={apState.opening || !apState.closed}>Back</B>
            <B icon={<DownloadOutlined />} onClick={downloadDiary131} disabled={!apState.opening}>Download 131</B>
        </>} />

        {viewAdd && <AccountingPeriodAdd key={-1} onSuccess={loadData} onClose={onCloseNewApp} />}
        <List dataSource={data}
            renderItem={u => <List.Item>
                <AccountingPeriodView key={u.id}  ap={u} />
            </List.Item>} />
    </APSettingContext.Provider>
}

export { AccountingPeriodsSetting, APSettingContext };
