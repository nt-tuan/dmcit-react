import React, { useState, useEffect } from 'react';
import { Dropdown, Form, Label } from 'semantic-ui-react';
import { saleServices } from '../../../_services';

export default function MultipleDistributorSelection(props) {
  const [isFetching, setIsFetching] = useState(false);
  const [value, setValue] = useState(props.value);
  const [options, setOptions] = useState([]);
  const [error, setError] = useState();

  const loadData = () => {
    setIsFetching(true);
    saleServices.getDistributors()
      .then(json => {
        if (json.data) {
          setOptions(json.data);
          setValue(props.value);
        } else {
          setError("NOT FOUND");
        }
        setIsFetching(false);
      })
      .catch(error => {
        setError(error);
        setOptions([]);
        setIsFetching(false);
      });
  }
  const handleChange = (e, { value, name }) => {
    setValue(value);
    if (props.multiple) {
      let raw = options.filter(u => value.filter(v => v == u.id).length > 0);
      props.onSelectionChange && props.onSelectionChange(e, { value: raw, name });
    } else {
      let raw = options.filter(u => u.id == value);
      if (raw.length > 0) {
        props.onSelectionChange && props.onSelectionChange(e, { value: raw[0], name });
      } else {
        props.onSelectionChange && props.onSelectionChange(e, { value: null, name });
      }
    }
  }

  useEffect(() => {
    loadData();
    setValue(props.value)
  }, [props.value]);

  return (
    <Form.Field>
      <label>DISTRIBUTOR</label>
      <Dropdown
        clearable
        name={props.name && "DISTRIBUTOR"}
        fluid
        multiple
        selection
        search={false}
        options={options.map(value => {
          return {
            text: value.name,
            value: value.id
          }
        })}
        value={value ? value : props.multiple ? [] : value}
        placeholder="DISTRIBUTOR"
        onChange={handleChange}
        loading={isFetching}
        noResultsMessage={error}
      />
    </Form.Field>
  );
}

