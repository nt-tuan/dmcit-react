import React, { useState, useEffect } from 'react';
import { List, Form } from 'semantic-ui-react';
import { DetailValue } from './';
import { coreServices } from '../../_services/core';
function BusinessDetail(props) {
  const [data, setData] = useState();

  useEffect(() => {
    if (props.id) {
      coreServices.getBusiness(props.id)
        .then(json => {
          if (json.data) {
            setData(json.data);
            props.onSuccess && props.onSuccess(json.data);
          } else if (json.messages) {
            return Promise.reject(json.messages);
          } else
            return Promise.reject('NO DATA FOUND');
        })
        .catch(err => {
          props.onError && props.onError(err);
        });
    } else {
      setData(props.data);
    }
  }, [props.id, props.data]);
  if (data)
    return (
      <div><h4>BUSINESS INFORMATION</h4>
      <List divided>
        <DetailValue title='BUSINESS IDENTITY NUMBER' value={data.code} />
        <DetailValue title='FULLNAME' value={data.fullname} />
        <DetailValue title='SHORTNAME' value={data.shortname} />
        <DetailValue title='EMAIL' value={data.email} />
        <DetailValue title='PHONE' value={data.phone} />
        <DetailValue title='ADDRESS' value={data.address} />
        <DetailValue title='MOBILE PHONE' value={data.mobilePhone} />
        <DetailValue title='TAX NUMBER' value={data.taxNumber} />
        </List>
      </div>
    );
  return null;
}

export { BusinessDetail };
