import React, { useState, useEffect } from 'react';
import { Dropdown, Form, Label } from 'semantic-ui-react';
import { saleServices } from '../../../_services';

function DistributorSelection(props) {
  const [isFetching, setIsFetching] = useState(false);
  const [value, setValue] = useState(props.value);
  const [options, setOptions] = useState([]);
  const [error, setError] = useState();

  const loadData = () => {
    setIsFetching(true);
    saleServices.getDistributors()
      .then(json => {
        if (json.data) {
          let ops = json.data.map(value => {
            return {
              text: value.name,
              value: value.id
            }
          });
          setOptions(ops);
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
    props.handleChange && props.handleChange(e, { value, name });
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
        selection
        search={false}
        options={options}
        value={value}
        placeholder="DISTRIBUTOR"
        onChange={handleChange}
        loading={isFetching}
        noResultsMessage={error}
      />
    </Form.Field>
  );
}

export default DistributorSelection;
