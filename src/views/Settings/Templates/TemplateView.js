import React, { useState, useEffect } from 'react';
import { templateService } from '../../../_services';
import { alertActions } from '../../../_actions';
import { TextArea, Form, Header, Button, Icon, Loader, Message } from 'semantic-ui-react';
import AceEditor from 'react-ace';
import "ace-builds/src-noconflict/mode-json";
import "ace-builds/src-noconflict/theme-monokai";

import { LayoutContext } from '../../../containers/DefaultLayout/LayoutContext'
import { setTimeout } from 'timers';

const download = require('downloadjs');

function TemplateReview(props) {
  const [parameters, setParameters] = useState();
  const [result, setResult] = useState();
  const [loading, setLoading] = useState(false);
  const context = React.useContext(TemplateItemContext);
  function handleReview() {
    setLoading(true);
    templateService.testReviewTemplate(props.id, parameters)
      .then(result => setResult(result))
      .catch(error => {
        context.error(error);
      })
      .then(() => setLoading(false));
  }

  function handleDownload() {
    setLoading(true);
    templateService.testDownloadTemplate(props.id, parameters)
      .then(blob => download(blob, 'test.xlsx'))
      .catch(error => {
        context.error(error);
      })
      .then(() => setLoading(false));
  }

  if (!props.reviewable && !props.downloadable) {
    return <p><i>This template can not be tested</i></p>
  }

  return <div>
    <Header as='h5' floated='left'>Test template</Header>
    {props.reviewable && <Button compact icon size="mini" floated='right' onClick={handleReview} labelPosition='left' primary>
      <Icon name="bug" />
      Test review
      </Button>
    }
    {props.downloadable && <Button compact icon size="mini" floated='right' onClick={handleDownload} labelPosition='left' primary>
      <Icon name="bug" />
      Test download
      </Button>
    }
    <Form.Field>
      <label>Parameters</label>
      <AceEditor name="parameters" mode="json" theme="monokai" value={parameters} onChange={(e, { value }) => setParameters(value)} wrapEnabled={true} height="300px" setOptions={{ useWorker: false }} />
      {loading && <Loader active inline='centered' />}
      {result && <Message content={result} />}
    </Form.Field>
  </div>
}

function TemplateEdit(props) {
  const [data, setData] = useState({});
  const context = React.useContext(TemplateItemContext);

  useEffect(() => {
    if (props.id == null) {
      setData();
      return;
    }
    context.reload(true);
    templateService.getTemplate(props.id)
      .then(u => {
        const value = JSON.stringify(u.value, null, '\t');
        setData({ ...u, value });
      })
      .catch(e => { })
      .then(() => context.reload(false));
  }, [props.id]);

  function handleChange(e, { name, value }) {
    setData({ ...data, [name]: value });
  }

  function handleValueChange(value) {
    setData({ ...data, value});
  }

  return <div>
    <Form>
      <Header as='h5' floated='left'>{data.name}
        <Header.Subheader>
          {data.description}
        </Header.Subheader>
      </Header>
      <Button compact icon size="mini" floated='right' onClick={context.view} labelPosition='left' color='red'>
        <Icon name="close" />
        Cancel
      </Button>
      <Button compact icon size="mini" floated='right' onClick={() => context.save(props.id, data)} labelPosition='left' color='green'>
        <Icon name="disk" />
        Save
      </Button>
      <Form.Field>
        <label>Name</label>
        <Form.Input name='name' value={data.name ? data.name : ''} onChange={handleChange} />
      </Form.Field>
      <Form.Field size='mini'>
        <label>Description</label>
        <TextArea name='description' value={data.description ? data.description : ''} onChange={handleChange} />
      </Form.Field>
      <Form.Field>
        <AceEditor name="value" mode="json" theme="monokai" value={data.value} onChange={handleValueChange} wrapEnabled={true} height="300px" setOptions={{ useWorker: false }} />
      </Form.Field>
    </Form>
  </div>
}

function TemplateView(props) {
  const context = React.useContext(TemplateItemContext);
  const [data, setData] = useState();
  const [parameters, setParameters] = useState();
  const [review, setReview] = useState({});
  useEffect(() => {
    if (props.id == null) {
      setData();
      return;
    }
    context.reload(true);
    templateService.getTemplate(props.id)
      .then(u => setData(u))
      .catch(e => { })
      .then(() => context.reload(false));
  }, [props.id]);

  if (data == null) {
    return null;
  }
  
  return <Form>
    <div>
      <Header as='h5' floated='left'>{data.name}
        <Header.Subheader>
          {data.description}
        </Header.Subheader>
      </Header>
      <Button compact icon size="mini" floated='right' onClick={context.edit} labelPosition='left' primary>
        <Icon name="edit" />
        Edit
      </Button>

    </div>
    <AceEditor name="value" mode="json" theme="monokai" value={JSON.stringify(data.value, null, '\t')} wrapEnabled={true} height="300px" setOptions={{ useWorker: false }} readOnly />
    <hr />
    <TemplateReview id={props.id} reviewable={data.reviewable} downloadable={data.downloadable} />
  </Form>
}

const TemplateItemContext = React.createContext(null);

export default function TemplateItem(props) {
  const [mode, setMode] = useState('view');
  const [loading, setLoading] = useState(false);
  const layoutContext = React.useContext(LayoutContext);
  if (props.id == null) {
    return null;
  }

  function edit() {
    setMode('edit');
  }
  function view() {
    setMode('view')
  }
  function save(id, data) {
    const value = JSON.parse(data.value);
    //save
    templateService.updateTemplate(id, { ...data, value })
      .then(json => {
        setMode('view');
      })
      .catch(error => {
        console.log(error);
        error(error);
      });
  }
  function error(e) {
    layoutContext.alertDispatch(alertActions.error(e));
  }
  function reload(value) {
    setLoading(value);
  }


  function getComponent() {
    if (mode == 'edit')
      return <TemplateEdit id={props.id}></TemplateEdit>
    else
      return <TemplateView id={props.id}></TemplateView>
  }

  return <TemplateItemContext.Provider value={{ edit, view, save, error, reload }}>
    <Loader inline="centered" active={loading} />
    {getComponent()}
  </TemplateItemContext.Provider>
}
