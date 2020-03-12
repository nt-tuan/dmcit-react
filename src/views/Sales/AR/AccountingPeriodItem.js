import React, { useState, useEffect, useReducer } from 'react';
import { coreServices } from '../../../_services';
import { accountingActions } from './action';
import { Loader } from 'semantic-ui-react';
import { Header2 } from '../../Base';
import { Button, Form, List, Input, Row, Col, Tag } from 'antd';
import { EditOutlined, DeleteOutlined, SaveOutlined, CloseOutlined } from '@ant-design/icons';
import { APSettingContext } from './APSetting';
import { LayoutContext } from '../../../containers/DefaultLayout/LayoutContext';
import DatePicker from 'react-datepicker';
import "react-datepicker/dist/react-datepicker.css";
import { history } from '../../../_helpers';
import moment from 'moment';
import Moment from 'react-moment';


function AccountingPeriodHeader(name) {
  return 'ACCOUNTING PERIOD #' + name;
}

function AccountingPeriodDetail(props) {
  const [data, setData] = useState({ loading: true });
  const dispatch = React.useContext(APSettingContext);
  const layout = React.useContext(LayoutContext);
  useEffect(() => {
    setData(props.ap);
  }, [props]);  

  function getTag() {
    if (!data.opened)
      return <Tag color='success'>Available</Tag>;
    if (data.opened && !data.closed)
      return <Tag color='processing'>Working</Tag>;
    return <Tag color='default'>Closed</Tag>;
  }

  if (data == null || data.loading) {
    return <Loader active />
  }

  const handleDelete = () => {
    accountingActions.deleteAccountingPeriod(data.id)(dispatch, layout.alertDispatch);
  }

  return <List.Item.Meta
    title={<Header2 title={AccountingPeriodHeader(data.name)} tags={getTag()} extras={<>
      {!data.opened &&
        <Button type='primary' icon={<EditOutlined />} onClick={() =>
          accountingActions.switchToUpdateMode(data.id)(dispatch)
        }  />
      }
      {!data.opened &&
        <Button type='primary' icon={<DeleteOutlined />} onClick={handleDelete} danger />
      }
    </>}
    />}
    description={<i>START TIME:{data.startTime ? <Moment date={data.startTime} /> : "None"} &emsp;
    END TIME: {data.endTime ? <Moment date={data.endTime} /> : "None"}</i>
    }
  />
}


function AccountingPeriodUpdate(props) {
  const dispatch = React.useContext(APSettingContext);
  const [data, setData] = useState({});
  useEffect(() => {
    coreServices.getAccountingPeriod(props.id)
      .then(u => {
        const value = accountingActions.parseAccountingPeriod(u);
        setData(value);
      });
  }, [props.id]);

  const handleChange = ({ name, value }) => {
    setData({ ...data, [name]: value });
  }

  return <List.Item.Meta
    title={<Header2 title={AccountingPeriodHeader(data.name)} extras={<>
      <Button type='primary' icon={<SaveOutlined />} onClick={() => accountingActions.updateAccountingPeriod(data)(dispatch)} />
      <Button type='primary' icon={<CloseOutlined />} danger onClick={() => accountingActions.switchToViewMode(data.id)(dispatch)} />
    </>} />
    }
    description={<Form layout='vertical'>
      <Row><Col flex={1}>
        <Form.Item label='name' style={{ width: '100%' }}>
          <Input type='text' name="name" value={data.name} onChange={handleChange} />
        </Form.Item>
      </Col>
        <Col flex={1}>
          <Form.Item label='Start time'>
            <div className="customDatePickerWidth">
              <DatePicker
                selected={data.startTime}
                selectsStart
                startDate={data.startTime}
                endDate={data.endTime}
                disabled
                dateFormat="dd/MM/yyyy"
              />
            </div>
          </Form.Item>
        </Col>
        <Col flex={1}>
          <Form.Item label='End time'>
            <div className="customDatePickerWidth">
              <DatePicker
                selected={data.endTime}
                selectsEnd
                endDate={data.endTime}
                minDate={data.startTime}
                dateFormat="dd/MM/yyyy"
                onChange={date =>
                  setData({ ...data, endTime: date ? moment(date).startOf('day').toDate() : null })
                }
                isClearable={data.isTheLast}
                disabled={data.isTheLast == false}
              />
            </div>
          </Form.Item>
        </Col>
      </Row>



    </Form>}
  />
}

function AccountingPeriodAdd(props) {
  const [data, setData] = useState({});
  const dispatch = React.useContext(APSettingContext);

  const loadData = () => {
    coreServices.getLastAccountingPeriod()
      .then(json => {
        if (json) {
          const _data = accountingActions.parseAccountingPeriod(json);
          setData({ startTime: _data.endTime });
        } else {
          setData({ startTime: null });
        }
      })
      .catch(error => { });
  }

  useEffect(() => {
    loadData();
  }, []);

  function handleChange({ name, value }) {
    setData({ ...data, [name]: value });
  }

  function addAP() {
    coreServices.addAccountingPeriod(data)
      .then(json => {
        accountingActions.getAccountingPeriods()(dispatch);
        loadData();
      })
      .catch(error => { });
  }

  return <List.Item.Meta
    title={<Header2 title='ADD ACCOUNTING PERIOD' extras={<>
      <Button type='primary' icon={<SaveOutlined />} onClick={addAP} />
      <Button type='primary' icon={<CloseOutlined />} danger onClick={() => props.onClose && props.onClose()} />
    </>} />}
    description={
      <Form layout='vertical'>
        <Row>
          <Col flex={1}><Form.Item label='Period name'>
            <Input type='text' name="name" value={data.name ? data.name : ''} onChange={handleChange} />
          </Form.Item></Col>
          <Col flex={1}><Form.Item label='Start time'>
            <div className="customDatePickerWidth">
              <DatePicker
                selected={data.startTime}
                selectsStart
                startDate={data.startTime}
                endDate={data.endTime}
                disabled
                dateFormat="dd/MM/yyyy" />
            </div>
          </Form.Item></Col>
          <Col flex={1}><Form.Item label='End time'>
            <div className="customDatePickerWidth">
              <DatePicker
                selected={data.endTime}
                selectsEnd
                endDate={data.endTime}
                minDate={data.startTime}
                onChange={date => {
                  setData({ ...data, endTime: date });
                }}
                dateFormat="dd/MM/yyyy"
                isClearable
              />
            </div>
          </Form.Item></Col>
        </Row>
      </Form>
    } />
}

function AccountingPeriodView(props) {
  if (props.ap == null)
    return null;
  if (props.ap.update)
    return <AccountingPeriodUpdate id={props.ap.update.id} />;

  return <AccountingPeriodDetail ap={props.ap} />;
}



export { AccountingPeriodView, AccountingPeriodAdd };
