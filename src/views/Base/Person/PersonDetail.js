import React, { useEffect, useState } from 'react';
import { DetailValue } from '../Utilities';
import { List, Form } from 'semantic-ui-react';

function PersonDetail(props) {
  const [isLoading, setIsLoading] = useState(props.isLoading);
  if (!props.person) {
    return null;
  }
  else {
    return (
      <div>
        <h4>PERSONAL INFORMATION</h4>
        <List divided>
          <DetailValue title="FULLNAME" value={props.person.fullname} />
          <DetailValue title="GENDER" value={props.person.gender} />
          <DetailValue title="DISPLAYNAME" value={props.person.displayname} />
          <DetailValue title="EMAIL" value={props.person.email} />
          <DetailValue title="BIRTHDAY" value={props.person.birthday} />
          <DetailValue title="ADDRESS" value={props.person.address} />
          <DetailValue title="PHONE NUMBER" value={props.person.phone} />
        </List>
      </div>
    );
  }
}

function PersonUpdate(props) {
  const [data, setData] = useState({});
  const [validationMessage, setValidationMessage] = useState({});

  const handleChange = (e, { name, value }) => {
    const temp = { ...data, [name]: value };
    setData(temp);
    props.onChange && props.onChange(e, { name: props.name, value: temp });
  };

  useEffect(() => {
    if (props.data)
      setData(props.data);
    else
      setData({});
  }, [props.data]);

  useEffect(() => {
    if (props.validation)
      setValidationMessage(props.validation);
    else
      setValidationMessage({});
  }, [props.validation]);

  return (<div>
    <Form.Field>
      <label>IDENTITYNUMBER</label>
      <Form.Input value={data.identityNumber}
        onChange={handleChange}
        id="input-identityNumber"
        name="identityNumber" error={validationMessage.identityNumber != null} />
    </Form.Field>
    <Form.Group widths="equal">
      <Form.Field>
        <label>FIRSTNAME</label>
        <Form.Input value={data.firstname}
          onChange={handleChange}
          id="input-firstname"
          name="firstname"
          error={validationMessage.firstname != null} />
      </Form.Field>
      <Form.Field>
        <label>LASTNAME</label>
        <Form.Input
          value={data.lastname}
          onChange={handleChange}
          id="input-lastname"
          name="lastname" error={validationMessage.lastname != null} />
      </Form.Field>
    </Form.Group>
    <Form.Field>
      <label>DISPLAYNAME</label>
      <Form.Input
        value={data.displayname}
        onChange={handleChange} id="input-displayname" name="person.displayname"
        error={validationMessage.displayname != null} />
    </Form.Field>
    <Form.Field>
      <label>EMAIL</label>
      <Form.Input
        value={data.email}
        onChange={handleChange}
        id="input-email"
        name="email"
        error={validationMessage.email != null} />
    </Form.Field>
    <Form.Field>
      <label>BIRTHDAY</label>
      <Form.Input
        value={data.birthday}
        onChange={handleChange}
        id="input-birthday"
        name="birthday"
        error={validationMessage.birthday != null} />
    </Form.Field>
    <Form.Field>
      <label>ADDRESS</label>
      <Form.Input
        value={data.address}
        onChange={handleChange}
        id="input-address"
        name="address"
        error={validationMessage.address} />
    </Form.Field>
    <Form.Field>
      <label>PHONE NUMBER</label>
      <Form.Input
        value={data.phone}
        onChange={handleChange}
        id="input-phone"
        name="phone"
        error={validationMessage.phone} />
    </Form.Field>
  </div>)
}

export { PersonDetail, PersonUpdate };
