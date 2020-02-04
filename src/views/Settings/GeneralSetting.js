import React, { useState, useEffect } from 'react';
import { Form, Card, Button } from 'semantic-ui-react';
import { coreServices } from '../../_services';

function GeneralSetting(props) {
  const [data, setData] = useState({});

  useEffect(() => {
    coreServices.getSetting()
      .then(json => {
        console.log(json);
        setData(json);
      })
      .catch(err => {

      });
  }, []);

  return (
    <Card fluid>
      <Card.Content>
        <Card.Header>
          General setting &emsp;
          <Button color="green" compact size="mini" disabled>Save</Button>
          <Button primary compact size="mini" disabled>Restore default</Button>
        </Card.Header>
      </Card.Content>
      <Card.Content>
        <Form>
          <Form.Field>
            <label>Culture Info</label>
            <Form.Input value={data.cultureInfo} name="cultureInfo" />
          </Form.Field>
          <Form.Field>
            <label>Numeric money format</label>
            <Form.Input value={data.numbericMoneyFormat} name="numbericMoneyFormat" />
          </Form.Field>
          <Form.Field>
            <label>Short DateTime Format</label>
            <Form.Input value={data.shortDateTimeFormat} name="shortDateTimeFormat" />
          </Form.Field>
          <Form.Field>
            <label>Long DateTime Format</label>
            <Form.Input value={data.longDateTimeFormat} name="longDateTimeFormat" />
          </Form.Field>
          <Form.Field>
            <label>TimeOffset</label>
            <Form.Input value={data.timeOffset} name="timeOffset" />
          </Form.Field>
        </Form>
      </Card.Content>
    </Card>
  )
}

export { GeneralSetting };
