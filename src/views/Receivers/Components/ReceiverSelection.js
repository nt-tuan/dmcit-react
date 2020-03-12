import React, { useState, useEffect } from 'react';
import { Form, Select, Tag } from 'antd';
import { RecipientServiceApi } from '../../../_services';

export default function ReceiverSelection(props) {
  const [options, setOptions] = useState([]);
  const [rawValue, setRawValue] = useState();
  const [isLoading, setIsLoading] = useState(true);
  const searchRef = React.useRef();
  function handleChange(value) {
    if (props.onRawChange) {
      const selectItem = options.filter(u => u.id == value);
      console.log(selectItem);
      if (selectItem.length == 0) return;
      if (props.multiple)
        props.onRawChange(selectItem);
      else
        props.onRawChange(selectItem[0]);
    }
  }

  function handleSearchChange(searchQuery) {
    searchRef.current = searchQuery;
    setIsLoading(true);
    new Promise((resolve, reject) => loadOptions(resolve, reject))
      .then(values => {
        setOptions(values);
        console.log(values);
        setIsLoading(false);
      })
      .catch(error => {
        setOptions([]);
        console.log(error);
        setIsLoading(false);
      });

  }

  function loadValue(value, resolve, reject) {
    if (value == null || value == undefined) {
      reject('NOT FOUND');
      return;
    }
    RecipientServiceApi.getReceiver(value)
      .then(json => {
        if (json && json.result) {
          resolve(json.result);
        } else {
          reject("NOT FOUND");
        }
      }).catch(error => {
        reject(error);
      });
  }

  function loadOptions(resolve, reject) {
    let query = {
      search: searchRef.current
    }
    RecipientServiceApi.getReceivers(query)
      .then(json => {
        if (json && json.data && json.data.data) {
          resolve(json.data.data);
        } else {
          reject("NOT FOUND");
        }
      })
      .catch(error => {
        reject(error);
      });
  }
  function loadData(value) {
    setIsLoading(true);
    let p1 = [];
    if (Array.isArray(value)) {
      p1.forEach(value => {
        p1.push(new Promise((resolve, reject) => { loadValue(value, resolve, reject) }));
      });
    } else if (value != null) {
      p1.push(new Promise((resolve, reject) => { loadValue(value, resolve, reject) }));
    }
    const hp1 = new Promise((resolve, reject) =>
      Promise.all(p1)
        .then(values => {
          setRawValue(props.multiple ? values : values.first());
          resolve(values);
        })
        .catch(error => {
          setRawValue(props.multiple ? [] : null);
          reject(error);
        }));
    const hp2 = new Promise((pso, pje) => new Promise((resolve, reject) =>
      loadOptions(resolve, reject)
    ).then(values => {
      setOptions(values);
      pso();
    }).catch(error => {
      setOptions([]);
      pje(error);
    }));

    Promise.all([hp1, hp2]).then(values => {
      setIsLoading(false);
    }).catch(error => {
      setIsLoading(false);
    });
  }

  useEffect(() => {
    loadData(props.value);
  }, [props.value]);

  console.log(options);

  return (
    <Form.Item label={props.label ? props.label : 'Addressees'}>
      <Select
        multiple={props.multiple ? 'multiplte' : undefined}
        onChange={handleChange}
        showSearch={true}
        onSearch={handleSearchChange}
        loading={isLoading}
        value={rawValue}
        optionLabelProp='label'
      >
      {options.map(u => {
        const cate = u.customerId ? 'CUSTOMER' : (u.employeeId ? 'EMPLOYEE' : 'OTHER');
        const color = u.customerId ? 'green' : (u.employeeId ? 'blue' : 'yellow');
        return <Select.Option key={u.id} label={u.displayname} value={u.id}>
          <div>{u.displayname}&emsp;<Tag color={color}>{cate}</Tag></div>
        </Select.Option>
      })}
      </Select>
    </Form.Item>
  );
}
