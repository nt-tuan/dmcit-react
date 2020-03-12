import React, { useState, useEffect } from 'react';
import { DetailValue } from '../../Base'
import { userService } from '../../../_services';
import { useAlert } from 'react-alert';
import { List, Checkbox, Label } from 'semantic-ui-react';
export function UserRoles(props) {
  const [roles, setRoles] = useState();

  const alert = useAlert();
  useEffect(() => {
    userService.getRoles(props.userId)
      .then(json => {
        if (json) {
          setRoles(json);
        } else {
          return Promise.reject('NO DATA FOUND');
        }
      })
      .catch(err => {
        alert.error(err);
      });
  }, [props.userId]);

  if (roles) {
    return (
      <List divided>
        {roles.map(u =>
          <DetailValue key={u.name} title={u.name} value={u.description} />
        )}
      </List>
    );
  }
  return null;
}

export function EditUserRoles(props) {
  const [roles, setRoles] = useState();
  const alert = useAlert();

  function handleChange(e, { name, checked }) {
    if (roles) {
      const newRoles = roles.map(value => {
        if (value.name == name) {
          return { ...value, selected: !value.selected };
        } else {
          return value;
        }
      });
      setRoles(newRoles);
      props.onChange && props.onChange(e, { name: props.name, value: newRoles.filter(u => u.selected)});
    }
    console.log(name, checked);
  }

  useEffect(() => {
    if (props.userId == null) {
      return;
      setRoles([]);
    }
      
    var p1 = userService.getAllRoles()
      .then(json => {
        if (json) {
          return Promise.resolve(json)
        } else {
          return Promise.resolve([]);
        }
      })
      .catch(err => {
        return Promise.resolve([]);
      });
    var p2 = props.userId?userService
      .getRoles(props.userId)
      .then(json => {
        if (json) {
          return Promise.resolve(json);
        }
        return Promise.resolve([]);
      })
      .catch(err => {
        return Promise.resolve([]);
      }) : null;

    Promise.all([p1,p2]).then(json => {
      if (json.length==2) {
        const roles = json[0];
        const selected = json[1] ? json[1] : [];
        var data = roles.map(u => {
          return { ...u, selected: selected.filter(v => v.id == u.id).length > 0 };
        });
        setRoles(data);
        console.log(data);
      }
    });
  }, [props.userId]);

  if (roles) {
    return (
      <List divided>
        {roles.map(u => <List.Item key={u.name}>
          <List.Header>
            <Checkbox checked={u.selected} name={u.name} onChange={handleChange} /> <Label color='blue'>{u.name}</Label> {u.description}
          </List.Header>
        </List.Item>)}
      </List>
    );
  }
  return null;
}
