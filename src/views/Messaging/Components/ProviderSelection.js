import React, { useState, useEffect } from 'react';
import { Dropdown, Form } from 'semantic-ui-react';
import { RecipientServiceApi } from '../../../_services';
export default function ProviderSelection(props) {
  const [options, setOptions] = useState();
  const [isLoading, setIsLoading] = useState(true);

  function handleChange(e, { value, name }) {
    if (props.onChange) {
      props.onChange(e, { value, name });
    }
    console.log(value);
  }

  useEffect(() => {
    setIsLoading(true);
    RecipientServiceApi.getProviders()
      .then(json => {
        if (json && json.data) {
          setOptions(json.data.map(u => { return { value: u.id, text: u.name } }));
        }
        setIsLoading(false);
      })
      .catch(error => {
        setOptions();
        setIsLoading(false);
      });
  }, [props.value]);

  return (
    <Form.Field>
      <label>PROVIDERS</label>
      <Dropdown
        name={props.name}
        value={props.value}
        clearable
        fluid
        multiple={props.multiple ? props.multiple : true}
        selection
        options={options}
        placeholder='MESSAGE PROVIDERS'
        onChange={handleChange}
        loading={isLoading}
        noResultsMessage="NOT FOUND"
      />
    </Form.Field>
  );

}
