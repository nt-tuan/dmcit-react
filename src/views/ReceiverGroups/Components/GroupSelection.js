import React, { useState, useEffect, useRef } from 'react';
import { Dropdown, Form, Label } from 'semantic-ui-react';
import { RecipientServiceApi } from '../../../_services';

export default function GroupSelection(props) {
  const [options, setOptions] = useState([]);
  const [rawValue, setRawValue] = useState();
  const [isLoading, setIsLoading] = useState(false);
  const [search, setSearch] = useState();
  function handleChange(e, { value, name }) {
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
    <Form.Field>
      {props.label && <label>{props.label}</label>}
      <Dropdown
        name={props.name}
        button={props.button}
        icon={props.button ? 'group' : null}
        labeled={props.button ? true : null}
        floating={props.button ? true : null}
        className={props.button ? 'icon' : null}
        selection
        fluid={props.button ? null : true}
        multiple={props.multiple}
        search={props.search}
        options={selectItems}
        placeholder={props.button ? null : 'RECEIVER NAME|CODE'}
        text={props.button ? 'SELECT GROUP' : null}
        onChange={handleChange}
        onSearchChange={handleSearchChange}
        loading={isLoading}
        value={dropDownValue}
      />
    </Form.Field>
  );
}
