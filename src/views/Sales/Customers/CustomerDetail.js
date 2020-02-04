import React, { useState, useEffect } from 'react';
import Message from '../../Base/Messages/Message';
import { saleServices } from '../../../_services';
import { List } from 'semantic-ui-react';
import { BusinessDetail, DetailValue, PersonDetail } from '../../Base';

export default function CustomerDetail(props) {
  const [isLoading, setIsLoading] = useState(true);
  const [message, setMessage] = useState();
  const [customer, setCustomer] = useState();
  useEffect(() => {
    let id = props.id ? props.id : props.match.params.id;
    saleServices.getCustomerDetail(id)
      .then(json => {
        if (json && json.data) {
          setCustomer(json.data);
        } else {
          setMessage('NOT FOUND');
        }
        setIsLoading(false);
      })
      .catch(error => {
        setMessage(error);
        setIsLoading(false);
      });
  }, [props.id, props.match]);

  if (isLoading || !customer) {
    return <div>Loading...</div>
  } else {
    return (<div>
      <Message message={message} error />
      <h4>CUSTOMER INFORMATION</h4>
      <hr />
      <List divided>
        <DetailValue title='CUSTOMER CODE' value={customer.code} />
        <DetailValue title='DISTRIBUTOR' value={customer.distributor && <div>
          <h6>BELONG TO DISTRIBUTOR</h6>
          <h4><strong>{customer.distributor.name}</strong></h4></div>} />
      </List>
      <hr />
      <BusinessDetail data={customer.business} />
      <PersonDetail isLoading={isLoading} person={customer.person} />
    </div >);
  }
}
