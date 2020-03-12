import React, { useEffect, useState } from 'react';
import { Select, Form } from 'antd';
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

  return (<Form.Item label={props.label?props.label:'Messaging providers'}>
    <Select
      name={props.name}
      mode={props.multiple ? 'multiple' : undefined}
      value={value}
      placeholder={props.placeholder}
      onChange={handleChange}
      loading={isLoading}
    >
      {options.map(u => <Select.Option key={u.value}>{u.text}</Select.Option>)}
    </Select>
  </Form.Item>);
}
