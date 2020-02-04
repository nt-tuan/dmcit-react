import React, { useEffect, useState } from 'react';
import { Dropdown, Form, Label } from 'semantic-ui-react';
import { RecipientServiceApi } from '../../../_services';

export default function ProviderSelection(props) {
  const [isLoading, setIsLoading] = useState(true);
  const [options, setOptions] = useState([]);
  const [value, setValue] = useState(props.value);
  const handleChange = (e, { value, name }) => {
    if (props.onChange) {
      props.onChange(e, { value, name });
    } else {
      setValue(value);
    }
  }

  useEffect(() => {
    RecipientServiceApi.getProviders()
      .then(json => {
        if (json && json.data) {
          setOptions(json.data.map(u => { return { text: u.name, value: u.id } }));
        } else {
          setOptions([]);
        }
        setIsLoading(false);
      })
      .catch(error => {
        setIsLoading(false);
        setOptions([]);
        console.log(error);
      }
      );
  }, []);

  useEffect(() => {
    setValue(props.value);
  }, [props.value]);

  return (<Form.Field width={props.width}>
    <label>{!props.label && 'PROVIDERS'}</label>
    <Dropdown
      name={props.name}
      fluid
      multiple={props.multiple ? props.multiple : false}
      selection
      options={options}
      value={value}
      placeholder={props.placeholder}
      onChange={handleChange}
      loading={isLoading}
    />
  </Form.Field>);
}
