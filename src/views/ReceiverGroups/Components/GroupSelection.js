import React, { useState, useEffect, useRef } from 'react';
import {Form, Select} from 'antd';
import { RecipientServiceApi } from '../../../_services';

export default function GroupSelection(props) {
  const [options, setOptions] = useState([]);
  const [rawValue, setRawValue] = useState();
  const [isLoading, setIsLoading] = useState(false);
  const [search, setSearch] = useState();
  function handleChange(value) {
    if (props.onRawChange) {
      if (Array.isArray(value)) {
        setIsLoading(true);
        Promise.all(value.map(u => new Promise((resolve, reject) => loadValue(u, resolve, reject)))).then(values => {
          props.onRawChange(values);
          setIsLoading(false);
        }).catch(reason => {
          setIsLoading(false);
        });
      } else if (value != null) {
        loadValue(value)
      }
    } else {
      setRawValue(value);
    }
  }

  function handleSearchChange(e, { searchQuery }) {
    setSearch(searchQuery);
    loadOptions(() => { }, () => { });
  }

  function loadValue(value, resolve, reject) {
    if (value == null || value == undefined) {
      reject("NULL VALUE");
      return;
    }
    RecipientServiceApi.getGroup(value)
      .then(json => {
        if (json && json.data) {
          resolve(json.data);
        } else {
          throw new Error("NOT FOUND");
        }
      })
      .catch(error => {
        reject(error);
      });
  }
  function loadOptions() {
    let query = {
      search
    }
    RecipientServiceApi.getGroups(query)
      .then(json => {
        if (json && json.data) {
          setOptions(json.data);
        } else {
          throw new Error("NOT FOUND");
        }
      })
    .catch(error => {
        setOptions([]);
      });
  }
  function loadData(value) {
    let p1 = [];
    if (Array.isArray(value)) {
      p1.forEach(value => {
        p1.push(new Promise((resolve, reject) => { loadValue(value, resolve, reject) }));
      });
    } else if (value != null) {
      p1.push(new Promise((resolve, reject) => { loadValue(value, resolve, reject) }));
    }
    Promise.all(p1).then(values => {
      setRawValue(values);
    }).catch(error => {
      setRawValue(props.multiple ? [] : null);
    });

    loadOptions();
  }
  useEffect(() => {
    loadData(props.value);
  }, [props.value]);

  let selectItems = options.map(u => {
    return {
      text: u.name,
      value: u.id
    };
  });

  let dropDownValue = Array.isArray(rawValue) ? rawValue.map(u => u.id) : (rawValue ? rawValue.id : null);

  return (
    <Form.Item label={props.label ? props.label:'Addressee groups'}>
      <Select
        mode={props.multiple ? 'multiple' : undefined}
        value={dropDownValue}
        placeholder={props.placeholder}
        onChange={handleChange}
        loading={isLoading}
        onSearch={handleSearchChange} >
        {selectItems.map(u => <Select.Option key={u.value}>{u.text}</Select.Option>)}
      </Select>
    </Form.Item>
  );
}
