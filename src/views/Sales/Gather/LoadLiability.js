import React, { useState, useEffect } from 'react';
import MaterialTable from 'material-table';
import { Form, FormGroup, Button, Grid } from 'semantic-ui-react';
import DatePicker from 'react-datepicker';
import MultipleDisitributorSelection from '../Distributors/MultipleSelection'
import { useAlert } from 'react-alert';
import Container from './LoadLiabilityProcessContainer';
//import { HubConnection } from '@aspnet/signalr-client';
import { collectingService } from '../../../_services';
import { history } from '../../../_helpers';
import moment from 'moment';
import "react-datepicker/dist/react-datepicker.css";



export default function LoadLiability(props) {
  const [data, setData] = useState([]);
  const [startDate, setStartDate] = useState();
  const [endDate, setEndDate] = useState();
  const [distributor, setDisitributor] = useState([]);
  
  const alert = useAlert();

  useEffect(() => {
    const defaultToDate = moment().startOf('day');
    const defaultFromDate = moment().subtract(1, 'days');

    setEndDate(defaultToDate.toDate());
    setStartDate(defaultFromDate.toDate());
  }, []);

  function loadData() {
    setData([]);
    const postData = {
      startDate: moment(startDate).startOf('day').toDate(),
      endDate: moment(endDate).startOf('day').toDate(),
      distributors: distributor.map(u => u.code)
    };
    console.log(postData);

    collectingService.loadDiary131()
      .then(json => {
        history.push({ pathname: `/progress/${json}` });
      })
      .catch(error => alert.error(error));
  }

  function onFilter() {
    loadData();
  }

  return (<div>
    <Form>
      <MultipleDisitributorSelection onSelectionChange={(e, { value, name }) => setDisitributor(value)} multiple />
      <FormGroup>
        <Form.Field>
          <label>FROM DATE</label>
          <DatePicker
            selected={startDate}
            onChange={date => setStartDate(date)}
            isClearable
          />
        </Form.Field>
        <Form.Field>
          <label>TO DATE</label>
          <DatePicker
            selected={endDate}
            onChange={date => setEndDate(date)}
            isClearable
          />
        </Form.Field>
        <Form.Field>
          <label>&nbsp;</label>
          <Button onClick={onFilter} primary>LOAD</Button>
        </Form.Field>
      </FormGroup>
    </Form>
    <Container />
  </div>
  );
}
