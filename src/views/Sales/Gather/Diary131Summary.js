import React, { useState, useEffect } from 'react';
import { Table, Loader, Segment, Dimmer, Popup, Header } from 'semantic-ui-react';
import { customerARService } from '../../../_services';
import Moment from 'react-moment';
import 'moment/locale/vi';
export function Diary131Summary(props) {
  const [loading, setLoading] = useState(true);
  const [states, setStates] = useState();


  useEffect(() => {
    setLoading(true);
    customerARService.getDiary131State()
      .then(json => {
        setStates(json.data);
        setLoading(false);
      })
      .catch(error => {
        setLoading(false);
      });
  }, [props.key]);

  const list = states && states.length > 0 ? states.map(u => (
    <Table.Row key={u.code}>
      <Table.Cell>
        <Popup trigger={<a>{u.code}: </a>} content={u.distributor} />
      </Table.Cell>
      <Table.Cell>
        <span>{u.lastRecord ? <Moment fromNow>{u.lastRecord}</Moment> : '-'}</span>
      </Table.Cell>
      <Table.Cell>
        <span>{u.lastPayment ? <Moment fromNow>{u.lastPayment}</Moment> : '-'}</span>
      </Table.Cell>
    </Table.Row>
  )) : null;

  return (
    <div>
      <Header as='h4' attached='top'>
        Dữ liệu Nhật ký 131
      </Header>
      <Segment attached>
        <Dimmer active={loading}>
          <Loader />
        </Dimmer>
        <Table basic='very' singleLine compact>
          <Table.Header>
            <Table.Row>
              <Table.HeaderCell>CN</Table.HeaderCell>
              <Table.HeaderCell>DIARY131</Table.HeaderCell>
              <Table.HeaderCell>PAYMENT</Table.HeaderCell>
            </Table.Row>
          </Table.Header>
          <Table.Body>
            {list}
          </Table.Body>
        </Table>
      </Segment>
    </div>
  );
}
