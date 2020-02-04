import React, { useState, useEffect } from 'react';
import { Form, Checkbox, Icon, Button, Segment, Header } from 'semantic-ui-react';
import { MessagingServiceApi } from '../../../_services';
import { alertActions } from '../../../_actions';
import { LayoutContext } from '../../../containers/DefaultLayout/LayoutContext';
export function SMTPSetting() {
    const [data, setData] = useState({});
    const handleChange = (e, { value, name }) => {
        setData({ ...data, [name]: value });
    }
    const layout = React.useContext(LayoutContext);
    useEffect(() => {
        MessagingServiceApi
            .getSMTPSetting()
            .then(_ => {
                setData(_);
            })
            .catch(error =>
                layout.alertDispatch(alertActions.error(error))
            );
    }, []);
    const save = () => {
        MessagingServiceApi.updateSMTPSetting(data)
            .then(_ => layout.alertDispatch(alertActions.success("Saved")))
            .catch(error => layout.alertDispatch(alertActions.error(error)));
    }
    const loadDefault = () => {
        MessagingServiceApi.getDefaultSMTPSetting()
            .then(_ => setData(_))
            .catch(error => layout.alertDispatch(alertActions.error(error)));
    }

    return (
        <Segment>
            <Header as="h4">SMTP Setting</Header>
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
                    <Form.Input name='host' value={data.host} onChange={handleChange} />
                </Form.Field>
                <Form.Field>
                    <label>Password</label>
                    <Form.Input name='port' type='number' value={data.port} onChange={handleChange} />
                </Form.Field>
                <Form.Field>
                    <label>Username</label>
                    <Form.Input type='email' name='user' value={data.user} onChange={handleChange} />
                </Form.Field>
                <Form.Field>
                    <label>Password</label>
                    <Form.Input name='password' value={data.password} onChange={handleChange} />
                </Form.Field>
                <Form.Field>
                    <Checkbox label='Enable SSL' checked={data.enableSsl} onChange={() => setData({...data, enableSsl: !data.enableSsl})} />
                </Form.Field>
                <Form.Field>
                    <Checkbox label='isBodyHtml' checked={data.isBodyHtml} onChange={() => setData({...data, isBodyHtml: !data.isBodyHtml})} />
                </Form.Field>
            </Form>
        </Segment>);
}
