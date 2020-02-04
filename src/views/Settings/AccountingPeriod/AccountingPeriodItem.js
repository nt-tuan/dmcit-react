import React, { useState, useEffect, useReducer } from 'react';
import { coreServices } from '../../../_services';
import { accountingActions } from '../../../_actions';
import { Button, ButtonGroup, Card, Form, Loader } from 'semantic-ui-react';
import { APSettingContext } from '../../Settings/AccountingPeriodSetting';
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
  useEffect(() => {
    setData(props.ap);
  }, [props]);

  function getColor() {
    if (!data.opened)
      return 'green';
    if (data.opened && !data.closed)
      return 'blue';
    return 'red';
  }

  if (data == null || data.loading) {
    return <Loader active />
  }

  return <Card color={getColor()}>
    <Card.Content>
      <Card.Header>
        <ButtonGroup compact floated="right" disabled={data.submiting}>
          {!data.opened &&
            <Button icon="edit" primary onClick={() =>
              accountingActions.switchToUpdateMode(data.id)(dispatch)
            } />
          }
          {!data.opened &&
            <Button icon="trash" negative onClick={
              props.onDelete && props.onDelete()
            } />
          }
        </ButtonGroup>
        {AccountingPeriodHeader(data.name)}
      </Card.Header>
      <Card.Meta>
        <i>START TIME:{data.startTime ? <Moment date={data.startTime} /> : "None"} &emsp;
          END TIME: {data.endTime ? <Moment date={data.endTime} /> : "None"}</i>
      </Card.Meta>
    </Card.Content>
  </Card >
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

  const handleChange = (e, { name, value }) => {
    setData({ ...data, [name]: value });
  }

  return <Card>
    <Card.Content>
      <Card.Header>
        <ButtonGroup compact primary floated="right">
          <Button icon="disk" onClick={() => accountingActions.updateAccountingPeriod(data)(dispatch)} />
          <Button icon="close" negative onClick={() => accountingActions.switchToViewMode(data.id)} />
        </ButtonGroup>
        {AccountingPeriodHeader(data.name)}
      </Card.Header>
      <Card.Description>
        <Form>
          <Form.Group>
            <Form.Field width={8}>
              <label>NAME</label>
              <Form.Input name="name" value={data.name} onChange={handleChange} />
            </Form.Field>
            <Form.Field width={4}>
              <label>START TIME</label>
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
            </Form.Field>
            <Form.Field width={4}>
              <label>END TIME</label>
              <div className="customDatePickerWidth">
                <DatePicker
                  selected={data.endTime}
                  selectsEnd
                  endDate={data.endTime}
                  minDate={data.startTime}
                  dateFormat="dd/MM/yyyy"
                  onChange={date => 
                    setData({ ...data, endTime: date ? moment(date).startOf('day').toDate() : null})
                  }
                  isClearable={data.isTheLast}
                  disabled={data.isTheLast == false}
                />
              </div>
            </Form.Field>
          </Form.Group>
        </Form>
      </Card.Description>
    </Card.Content>
  </Card>
}

function AccountingPeriodAdd(props) {
  const [data, setData] = useState({});
  const dispatch = React.useContext(APSettingContext);

  const loadData = () => {
    coreServices.getLastAccountingPeriod()
      .then(json => {
        if (json) {
          const _data = accountingActions.parseAccountingPeriod(json);
          setData({startTime: _data.endTime});
        } else {
          setData({ startTime: null });
        }
      })
      .catch(error => { });
  }

  useEffect(() => {
    loadData();
  }, []);

  function handleChange(e, { name, value }) {
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
  
  return <Card fluid>
    <Card.Content>
      <Card.Header>
        ADD ACCOUNTING PERIOD
        <ButtonGroup compact floated="right">
          <Button icon="save" primary onClick={addAP} />
          <Button icon="close" negative onClick={props.onClose && props.onClose()} />
        </ButtonGroup>
      </Card.Header>
      <Card.Description>
        <Form>
          <Form.Group>
            <Form.Field width={8}>
              <label>NAME</label>
              <Form.Input
                name="name"
                value={data.name ? data.name : ''}
                onChange={handleChange} />
            </Form.Field>
            <Form.Field width={4}>
              <label>START TIME</label>
              <div className="customDatePickerWidth">
                <DatePicker
                  selected={data.startTime}
                  selectsStart
                  startDate={data.startTime}
                  endDate={data.endTime}
                  disabled
                  dateFormat="dd/MM/yyyy" />
              </div>
            </Form.Field>
            <Form.Field width={4}>
              <label>END TIME</label>
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
            </Form.Field>
          </Form.Group>
        </Form>
      </Card.Description>
    </Card.Content>
  </Card>
}

function AccountingPeriodView(props) {
  if (props.ap == null)
    return null;
  if (props.ap.update)
    return <AccountingPeriodUpdate id={props.ap.update.id} />;

  return <AccountingPeriodDetail ap={props.ap} />;
}



export { AccountingPeriodView, AccountingPeriodAdd };
