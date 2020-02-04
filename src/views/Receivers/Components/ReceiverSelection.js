import React, { useState, useEffect, useRef } from 'react';
import { Dropdown, Form, Label } from 'semantic-ui-react';
import { RecipientServiceApi } from '../../../_services';
import { Message } from '../../Base';

export default function ReceiverSelection(props) {
  const [options, setOptions] = useState([]);
  const [rawValue, setRawValue] = useState();
  const [isLoading, setIsLoading] = useState(true);
  const searchRef = React.useRef();
  function handleChange(e, { value, name }) {
    if (props.onRawChange) {
      const selectItem = options.filter(u => u.id == value);
      if (selectItem.length == 0) return;
      if (props.multiple)
        props.onRawChange(selectItem);
      else
        props.onRawChange(selectItem[0]);
    }
  }

  function handleSearchChange(e, { searchQuery }) {
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

  function handleOpen() {

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

  const selectItems = options.map(u => {
    const cate = u.customerId ? 'CUSTOMER' : (u.employeeId ? 'EMPLOYEE' : 'OTHER');
    const color = u.customerId ? 'green' : (u.employeeId ? 'blue' : 'yellow');
    return {
      text: u.displayname,
      value: u.id,
      content: (<div>{u.displayname}&emsp;<Label color={color} tag size="mini">{cate}</Label></div>)
    };
  });

  return (
    <Form.Field>
      {props.label && <label>{props.label}</label>}
      <Dropdown
        name={props.name}
        fluid={props.button ? null : true}
        selection
        search
        action={props.action}
        button={props.button}
        icon={props.button ? 'user' : null}
        labeled={props.button ? true : null}
        floating={props.button ? true : null}
        className={props.button ? 'icon' : null}
        placeholder={props.button ? null : 'RECEIVER NAME|CODE'}
        text={props.button ? 'ADD RECEIVER' : null}
        multiple={props.multiple}
        options={selectItems}
        onChange={handleChange}
        onSearchChange={handleSearchChange}
        onOpen={handleOpen}
        loading={isLoading}
        value={rawValue}
      />
    </Form.Field>
  );
}
