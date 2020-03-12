import React, { useState, useEffect } from 'react';

import { Dropdown, Form } from 'semantic-ui-react';
import { HRApiService } from '../../../_services';

export function DepartmentSelection(props) {
  const [state, setState] = useState({
    isFetching: false,
    multiple: true,
    search: true,
    searchQuery: null,
    placeholder: 'SELECT DEPARTMENT'
  });

  const [options, setOptions] = useState([]);
  const [value, setValue] = useState();

  const handleChange = (e, { value, name }) => {
    setValue(value);
    if (props.onChange)
      props.onChange(e, { value, name });
  };

  const handleSearchChange = (e, { searchQuery }) => {
    setState({ ...state, searchQuery });
    loadData();
  };

  const loadData = () => {
    setState({
      ...state,
      isFetching: true
    });

    HRApiService.departmentList({
      pageSize: 200,
      page: 0,
      search: state.searchQuery,
      orderBy: 'code',
      orderDirection: 1
    })
      .then(json => {
        if (json && json.data) {
          const {data} = json;
          const options = [];
          json.data.forEach(u => {
            const filter = options.filter(v => u.id == v.id);
            if (filter.length > 0)
              return;
            
          })
          
          setOptions(options);
          setState({
            ...state,
            isFetching: false
          });
        } else {
          if (json && json.message)
            throw new Error(json.message);
          else
            throw new Error("UNKNOWN ERROR");
        }
      })
      .catch(error => {
        setOptions([]);
        this.setState({
          ...state,
          isFetching: false,
          error: error.message
        });
      });
  }

  useEffect(() => {
    loadData();
  }, []);

  useEffect(() => {
    setValue(props.value);
  }, [props.value]);


  const { isFetching, search, placeholder } = state;

  return (
    <Form.Field>
      <label>DEPARTMENT</label>
      <Dropdown
        name={props.name}
        fluid
        selection
        clearable={props.clearable}
        search={search}
        options={options}
        value={value}
        placeholder={placeholder}
        onChange={handleChange}
        onSearchChange={handleSearchChange}
        loading={isFetching}
        noResultsMessage={state.error}
      />
    </Form.Field>
  );

};
