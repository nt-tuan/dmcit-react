import React, { useState, useEffect, useRef } from 'react';
import EmployeeDetail from '../../Employees/Components/Details';
import CustomerDetail from '../../Sales/Customers/CustomerDetail';
import ReceiverProviders from './ReceiverProviders';
import { Form, Label, Button } from 'semantic-ui-react';
import ProviderSelection from './ProviderSelection';
import { RecipientServiceApi } from '../../../_services';
import { useAlert } from 'react-alert';
export default function EditReceiver(props) {
  const [form, setForm] = useState({ provider: null, address: '' });
  const [validation, setValidation] = useState();
  const id = props.id ? props.id : props.match.param.id;
  const tableRef = useRef();
  useEffect(() => {
  }, [props]);
  const alert = useAlert();

  const handleChange = (e, { value, name }) => {
    setForm({ ...form, [name]: value });
  }

  function addAddress() {
    RecipientServiceApi.addAddress({
      receiverId: id,
      receiverAddress: form.address,
      provider: { id: form.provider }
    })
      .then(json => {
        if (json && json.data) {
          tableRef.current.onQueryChange();
          setForm({ provider: null, address: '' });
          alert.info("ADD MESSAGE PROVIDER ADDRESSEE SUCCESS");
        } else if (json.validation) {
          alert.error(json.validation[""].errors[0]);
        }
      }).catch(error => {
        alert.error(error);
      });
  }

  let receiverInfo = null;

  if (props.employee) {
    receiverInfo = <EmployeeDetail id={props.employee} />
  } else if (props.customer) {
    receiverInfo = <CustomerDetail id={props.customer} />
  }

  return (
    <div>
      {receiverInfo}
      <hr />
      <Form>
        <Form.Group>
          <ProviderSelection name='provider' placeholder='PROVIDER' width={6} onChange={handleChange} value={form.provider} />
          <Form.Input fluid label='ADDRESS' name='address' error={validation ? validation.code : null} width={10} onChange={handleChange} value={form.address} id='address' />
        </Form.Group>
        <Button primary onClick={addAddress}>ADD ADDRESS</Button>
      </Form>
      <hr />
      <h6>ADDRESS INFOMATION</h6>
      <ReceiverProviders id={id} tableRef={tableRef} />
    </div>
  );

}
