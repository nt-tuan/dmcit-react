import React, { useState, useEffect, useRef } from 'react';
import { Form, FormGroup, Button, Dimmer, Loader, Confirm, Grid, Icon } from 'semantic-ui-react';
import DatePicker from 'react-datepicker';
import moment from 'moment';
import ReceiverLiabilityList from './ReceiverLiabilityList';
import Distributors from '../../Sales/Distributors/MultipleSelection';
import { customerARService } from '../../../_services';
import "react-datepicker/dist/react-datepicker.css";
import Providers from './ProviderSelection';
import {MyProgress} from '../../Base/Progress/Progress';
import { Diary131Summary } from '../../Sales/Gather/Diary131Summary';
import { LayoutContext } from '../../../containers/DefaultLayout/LayoutContext';
import { alertActions } from '../../../_actions/alert.actions';
const download = require('downloadjs');

export default function PaymentMessageTemplate(props) {
  const [fromDate, setFromDate] = useState();
  const [toDate, setToDate] = useState();
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [process, setProcess] = useState();
  const [lockSend, setLockSend] = useState(false);
  const layoutContext = React.useContext(LayoutContext);
  const distributorRef = useRef();
  const providers = useRef();
  

  function validateInput() {
    if (distributorRef.current == null && distributorRef.current.length == 0) {
      alert.error("Bạn phải chọn ít nhất một chi nhánh");
      return false;
    }
    if (providers.current == null) {
      alert.error("You have to select at least a provider");
      return false;
    }
    if (fromDate == null || toDate == null) {
      alert.error("Bạn phải chọn ngày bắt đầu và ngày kết thúc");
      return false;
    }
    return true;
  }
  function getPostData() {
    var postdata = {
      startDate: moment(fromDate).startOf('day').toDate(),
      endDate: moment(toDate).startOf('day').toDate(),
      distributors: distributorRef.current,
      providers: providers.current
    };
    return postdata;
  }
  function handleLoad() {
    if (!validateInput()) return;
    layoutContext.alertDispatch(alertActions.loading());
    const postdata = getPostData();
    customerARService.loadCustomerPayment(postdata)
      .then(blob => {
        download(blob, `review.xlsx`);
        layoutContext.alertDispatch(alertActions.clear());
      })
      .catch(error => {
        layoutContext.alertDispatch(alertActions.error(error));
      });
  }

  function handlePreview() {
    if (!validateInput()) return;
    layoutContext.alertDispatch(alertActions.loading());
    const postdata = getPostData();
    customerARService.exportCustomerPayment(postdata)
      .then(blob => {
        download(blob, `review.xlsx`);
        layoutContext.alertDispatch(alertActions.clear());
      })
      .catch(error => {
        layoutContext.alertDispatch(alertActions.error(error));
      });
  }

  function handleDistributorsChange(e, { value, name }) {
    distributorRef.current = value.map(u => u.id);
  }

  function handleSend() {
    if (!validateInput()) return false;
    setConfirmOpen(false);
    layoutContext.alertDispatch(alertActions.loading());
    //setLockSend(true);
    var postdata = getPostData();
    customerARService.sendCustomerPaymentMessage(postdata)
      .then(json => {
        setProcess(<MyProgress id={json} />);
        layoutContext.alertDispatch(alertActions.clear());
      })
      .catch(error => {
        layoutContext.alertDispatch(alertActions.error(error));
      });
  }

  useEffect(() => {
    const defaultToDate = moment().startOf('day');
    const defaultFromDate = moment().subtract(1, 'days');
    setToDate(defaultToDate.toDate());
    setFromDate(defaultFromDate.toDate());
  }, []);

  return (
    <div>
      <h4>Send customer payments messages</h4>
      <hr />
      <Grid>
        <Grid.Row>
          <Grid.Column width={10}>
            <Form>
              <Distributors multiple onSelectionChange={handleDistributorsChange} />

              <Providers multiple onChange={(e, { value, name }) => {
                providers.current = value;
              }} />
              <FormGroup>
                <Form.Field>
                  <label>FROM DATE</label>
                  <DatePicker
                    selected={fromDate}
                    onChange={date => setFromDate(date)}
                    isClearable
                  />
                </Form.Field>
                <Form.Field>
                  <label>To DATE</label>
                  <DatePicker
                    selected={toDate}
                    onChange={date => setToDate(date)}
                    isClearable
                  />
                </Form.Field>
              </FormGroup>
              <Button onClick={handleLoad} primary compact size="mini">Calculate</Button>
              <Button onClick={handlePreview} primary compact size="mini">Preview</Button>
              <Button disabled={lockSend} onClick={() => setConfirmOpen(true)} icon primary compact size="mini" labelPosition="left">
                <Icon name="envelope" />
                Send
                </Button>
            </Form>
            <hr />
            {process}
          </Grid.Column>
          <Grid.Column width={6}>
            <Diary131Summary />
          </Grid.Column>
        </Grid.Row>
      </Grid>
      <Confirm
        open={confirmOpen}
        onCancel={() => setConfirmOpen(false)}
        onConfirm={handleSend} />
    </div>
  );
}
