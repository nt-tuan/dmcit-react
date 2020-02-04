import React, { useState } from 'react';
import { Dropdown, Segment, Form } from 'semantic-ui-react';
import Liability from './Components/ARMessageTemplate';
import Payment from './Components/PaymentMessageTemplate';

export default function TemplateCompose(props) {
  const [form, setForm] = useState();

  function chooseTemplate(e, { value, index}) {
    if (value == 'Liability') {
  //    setForm(<Liability />);
    } else if (value == 'Payment') {
      setForm(<Payment />);
    }
  }

  return (<div>
    <Form>
    <Form.Field>
    <label>Gửi tin nhắn theo mẫu</label>
    <Dropdown
      fluid
      placeholder="Select template"
      selection
      onChange={chooseTemplate}
      options={[
        {
          value: 'Liability',
          text: 'Liability template'
        }, {
          value: 'Payment',
          text: 'Payment template'
        }
        ]} />
      </Form.Field>
      </Form>
    <hr />
    {form}
  </div>);
}
