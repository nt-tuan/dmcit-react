import React, { useState } from 'react';
import { Button, Form, Grid, Icon } from 'semantic-ui-react';
import MultipleDistributorSelection from '../../Sales/Distributors/MultipleSelection';
import ProviderSelection from './ProviderSelection';
import ReceiverLiabilityList from './ReceiverLiabilityList';
import { customerARService } from '../../../_services';
import SendingMessageProcess from './SendingMessageProcess';
import { Diary131Summary } from '../../Sales/Gather/Diary131Summary';
import {LayoutContext} from '../../../containers/DefaultLayout/LayoutContext';
import {alertConstants} from '../../../_constants';
const download = require('downloadjs');
export default function ARMessageTemplate(props) {
  const [servers, setServers] = useState();
  const [providers, setProviders] = useState();
  const [preview, setPreview] = useState();
  const [lockSend, setLockSend] = useState(false);
  const context = React.useContext(LayoutContext);
  function handleChange(e, { value, name }) {
    setServers(value);
  }

  function handleProvidersChange(e, { value, name }) {
    setProviders(value);
  }

  function loadData() {
    var distributors = [];
    if (servers) {
      distributors = servers.map(u => u.id);
    }
    const _preview = <ReceiverLiabilityList filter={{ distributors }} />
    setPreview(_preview);
  }

  function setLoading(){
    context.alertDispatch({type: alertConstants.LOADING});
  }

  function setLoaded(){
    context.alertDispatch({type: alertConstants.CLEAR});
  }

  function exportExcel() {
    var query = {
      providers,
      distributors: servers.map(u => u.id)
    };
    setLoading();
    customerARService.exportCustomerLiabilities(query).then(blob => {
      download(blob, 'congno.xlsx');
      setLoaded();
    }).catch(error =>{
      setLoaded();
    }
    );
  }

  function sendMessage() {
    setLoading();
    var query = {
      providers,
      distributors: servers.map(u => u.id)
    };
    customerARService.sendCustomerLiabilityMessage(query)
      .then(json => {
        setLockSend(true);
        if (json.data) {
          process = <SendingMessageProcess id={json.data} />
        } else {
          return Promise.reject({ messages: ["NO DATA FOUND"] });
        }
        setLoaded();
      })
      .then(error => {
        setLoaded();
      });
  }

  return (<div>
    <Grid>
      <Grid.Row>
        <Grid.Column width={10}>
          <h4>Gửi công nợ cho khách hàng</h4>
          <hr />
          <Form>
            <MultipleDistributorSelection onSelectionChange={handleChange} multiple />
            <ProviderSelection onChange={handleProvidersChange} multiple />
          </Form>
          <hr />
          <Button icon primary compact size='mini' labelPosition='left' onClick={loadData}>
            <Icon name='list' />
            View list
            </Button>
          <Button icon primary compact size='mini' labelPosition='left' onClick={exportExcel}>
            <Icon name='file excel' />
            Export excel</Button>
          <Button icon primary compact size='mini' labelPosition='left' disabled={lockSend} onClick={sendMessage}>
            <Icon name='envelope' />
            Send message
          </Button>
        </Grid.Column>
        <Grid.Column width={6}>
          <Diary131Summary />
        </Grid.Column>
      </Grid.Row>
    </Grid>
    <hr />
    {preview}

  </div>);
}
