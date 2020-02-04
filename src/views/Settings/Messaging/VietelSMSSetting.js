import React, { useState, useEffect } from 'react';
import { Form, Checkbox, Icon, Button, Segment, Header } from 'semantic-ui-react';
import { MessagingServiceApi } from '../../../_services';
import { alertActions } from '../../../_actions';
import { LayoutContext } from '../../../containers/DefaultLayout/LayoutContext';
export function ViettelSMSSetting(props) {
  const [data, setData] = useState({});
  const handleChange = (e, { value, name }) => {
    setData({ ...data, [name]: value });
  }
  const layout = React.useContext(LayoutContext);
  useEffect(() => {
    MessagingServiceApi
      .getViettelSMSSetting()
      .then(_ => {
        setData(_);
      })
      .catch(error =>
        layout.alertDispatch(alertActions.error(error))
      );
  }, []);
  const save = () => {
    MessagingServiceApi.updateViettelSMSSetting(data)
      .then(_ => layout.alertDispatch(alertActions.success("Saved")))
      .catch(error => layout.alertDispatch(alertActions.error(error)));
  }
  const loadDefault = () => {
    MessagingServiceApi.getDefaultViettelSMSSetting()
      .then(_ => setData(_))
      .catch(error => layout.alertDispatch(alertActions.error(error)));
  }

  return (
    <Segment>
      <Header as="h4">Viettel SMS Brandname Setting</Header>
  <Form>
    <Form.Field>
      <Button icon compact size='mini' color='green' labelPosition='left' onClick={save}>
        <Icon name='disk' /> Save
      </Button>
      <Button icon compact size='mini' primary labelPosition='left' onClick={loadDefault}>
        <Icon name='undo' /> Default
      </Button>
    </Form.Field>
    <Form.Field>
      <label>Username</label>
      <Form.Input name='username' value={data.username} onChange={handleChange} />
    </Form.Field>
    <Form.Field>
      <label>Password</label>
      <Form.Input name='password' value={data.password} onChange={handleChange} />
    </Form.Field>
    <Form.Field>
      <label>CP Code</label>
      <Form.Input name='cpCode' value={data.cpCode} onChange={handleChange} />
    </Form.Field>
    <Form.Field>
      <label>Request ID</label>
      <Form.Input name='requestID' value={data.requestID} onChange={handleChange} />
    </Form.Field>
    <Form.Field>
      <label></label>
      <Form.Input name='serviceID' value={data.serviceID} onChange={handleChange} />
    </Form.Field>
    <Form.Field>
      <label>Command Code</label>
      <Form.Input name='commandCode' value={data.commandCode} onChange={handleChange} />
    </Form.Field>
    <Form.Field>
      <label>Content Type</label>
      <Form.Input name='contentType' value={data.contentType} onChange={handleChange} />
    </Form.Field>
    <Form.Field>
      <Checkbox label='Active' name='active' checked={data.active} onChange={() => setData({...data, active: !data.active})} />
    </Form.Field>
  </Form></Segment>);
}
