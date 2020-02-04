import React, { useState, useEffect } from 'react';
import { List, Form, TextArea, Loader, Button, ButtonGroup, Placeholder, Card } from 'semantic-ui-react';
import { collectingService } from '../../../_services';

function ServerTableItemDetail(props) {
  return <List.Item>
    <List.Content>
      <List.Header>
        {props.tableName}
      </List.Header>
      <List.Description>
        {props.query}
      </List.Description>
    </List.Content>
  </List.Item>
}

function ServerUpdate(props) {
  const [data, setData] = useState();
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    if (props.data) {
      setData(props.data);
      setLoading(false);
      return;
    }
    collectingService
      .getServerDetail(props.id)
      .then(json => {
        setData(json);
        setLoading(false);
      })
      .catch(err => {
        setLoading(false);
      });
  }, [props]);

  function handleChange(e, { value, name }) {
    setData({ ...data, [name]: value });
  }

  function handleSave(e, { value, name }) {
    collectingService.updateServer(data)
      .then(json => {
        if (json) {
          props.onCancel && props.onCancel();
        }
      })
      .catch(err => { });
  }

  return (
    <div>
      <Loader inverted content='Loading' inline='centered' />
      {data &&
        <Form>
          <Form.Field>
            <strong><i>#{data.distributorCode}</i></strong>
            <ButtonGroup basic compact floated="right">
              <Button icon="save" onClick={handleSave} />
              <Button icon="close" onClick={() => props.onCancel && props.onCancel()} />

            </ButtonGroup>
          </Form.Field>
          <Form.Field>
            <label>SERVER NAME</label>
            <Form.Input name="servername" value={data.servername} onChange={handleChange} />
          </Form.Field>
          <Form.Field>
            <label>DESCRIPTION</label>
            <Form.Input name="description" value={data.description} onChange={handleChange} />
          </Form.Field>
          <Form.Field>
            <label>CONNECTION STRING</label>
            <TextArea name="connectionString" value={data.connectionString} />
          </Form.Field >
        </Form>
      }
    </div>
  );
}

function ServerDetail(props) {
  const [data, setData] = useState();
  const [hide, setHide] = useState(true);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    if (props.data) {
      setData(props.data);
      setLoading(false);
    } else {
      collectingService.getServerDetail(props.id)
        .then(json => {
          setData(json);
          setLoading(false);
        })
        .catch(err => {
          setLoading(true);
        });
    }
  }, [props.data]);

  return (
    data ?
      <Card.Content>
        <Card.Header>
          #{data.distributorCode}
          <ButtonGroup basic compact size="mini" floated="right">
            <Button icon={hide ? "eye" : "eye slash"} onClick={() => { setHide(!hide) }} />
            <Button icon="edit" onClick={() => props.onUpdate && props.onUpdate()} />
            <Button icon="trash" />
          </ButtonGroup>
        </Card.Header>
        <Card.Description>
          <h5>CONNECTION STRING</h5>
          {hide ? <Placeholder>
            <Placeholder.Paragraph>
              <Placeholder.Line />
              <Placeholder.Line />
            </Placeholder.Paragraph>
          </Placeholder> :
            data.connectionString}
          <h5>DOWNLOAD DATATABLE</h5>
          {data.distributedServerTableDefineds && data.distributedServerTableDefineds.length > 0 ? <List>
            {data.distributedServerTableDefineds.map((value, index) =>
              <ServerTableItemDetail key={index} {...value} />)}
          </List> : <p><i>None</i></p>}


        </Card.Description>
      </Card.Content> : null);
}


function ServerView(props) {
  const [mode, setMode] = useState('detail');
  function getContent() {
    if (mode == 'detail')
      return <ServerDetail id={props.id} onUpdate={() => setMode('update')} />
    if (mode == 'update')
      return <ServerUpdate id={props.id} onCancel={() => setMode('detail')} />
  }
  return (<Card>
    {getContent()}
  </Card>);
}

export { ServerUpdate, ServerDetail, ServerView };
