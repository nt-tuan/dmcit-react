import React, { useState, useContext, useEffect } from 'react';
import { List, Button, Icon, Segment, Header } from 'semantic-ui-react';
import { Container, Row, Col } from 'reactstrap';
import AceEditor from 'react-ace';
import "ace-builds/src-noconflict/mode-json";
import "ace-builds/src-noconflict/theme-monokai";
import { workflowService } from '../../../_services';
import { alertActions } from '../../../_actions';
import { LayoutContext } from '../../../containers/DefaultLayout/LayoutContext';
const WorkflowContext = React.createContext(null);

const workflowReducer = (state = { creating: false, selected: null }, action) => {
  switch (action.type) {
    case 'BEGIN_ADD':
      return { ...state, creating: true, selected: null, wfValue: '' }
    case 'SELECTED':
      return { ...state, creating: false, selected: action.id, wfValue: action.value };
    case 'LOAD_LIST':
      return { ...state, workflows: action.data };
    case 'ADD':
      return { ...state, selected: action.id, creating: false };
    case 'EDIT':
      return { ...state };
    case 'CHANGE_EDITING_VALUE':
      return {
        ...state, wfValue: action.value
      };
    case 'LOAD_WORKFLOW':
      return { ...state, wfValue: action.value };
  }
}

function WorkflowEditor() {
  const context = useContext(WorkflowContext);
  return <AceEditor name="value" mode="json" theme="monokai" value={context.state.wfValue} wrapEnabled={true} height="300px" width="100%" setOptions={{ useWorker: false }} onChange={(value) => context.dispatch({ type: 'CHANGE_EDITING_VALUE', value})} />
}


function WorkflowList() {
  const context = useContext(WorkflowContext);
  return (
    <List selection>
      {context.state.workflows.map(u => {
        return <List.Item key={u.id} onClick={() => context.select(u.id)}>
          <List.Content>
            <List.Header as='a'>{u.name}</List.Header>
            <List.Description>{u.description}</List.Description>
          </List.Content>
        </List.Item>
      })}
    </List>
  );
}

const WorkflowView = () => {
  const [state, dispatch] = React.useReducer(workflowReducer, {selected: null, creating: false, workflows: []});
  const { selected, creating } = state;
  const layoutContext = useContext(LayoutContext);
  const alertDispatch = layoutContext.alertDispatch;
  const alertError = (error) => alertDispatch(alertActions.error(error));
  const alertSuccess = (message) => alertDispatch(alertActions.success(message));
  const select = (id) => {
    
    workflowService.getWorkflow(id)
      .then(json => {
        dispatch({ type: "SELECTED", id, value: JSON.stringify(json, null, 4) });
      })
      .catch(alertError);
  }
  
  const edit = (id, value) => {
    workflowService.editWorkflow(id, JSON.parse(value))
      .then(json => {
        if (json)
          alertSuccess('Updated this workflow!');
        else
          alertError('Can not update this workflow!');
      })
      .catch(error => alertError(error));
  }
  const add = (value) => {
    workflowService.addWorkflow(JSON.parse(value))
      .then(json => {
        if (json)
          alertSuccess('Created a new workflow!');
        else
          alertError('Can not create this workflow!');
      })
      .catch(error => alertError(error));
  }

  const onAddHandle = () => {
    dispatch({ type: "BEGIN_ADD" });
  }

  const onSaveHandle = () => {
    if (state.creating) {
      add(state.wfValue);
    }
    else if (state.selected) {
      edit(state.selected, state.wfValue);
    }
  }

  useEffect(() => {
    workflowService.getWorkflows()
      .then(data => {
        dispatch({ type: 'LOAD_LIST', data });
      })
      .catch(error => alertError(error));
  }, []);

  return <WorkflowContext.Provider value={{ select, edit, add, alert: { error: alertError, success: alertSuccess }, state, dispatch }}>
    <Header>Workflow design</Header>
    <Segment>
      <Button icon labelPosition='left' size='mini' compact color='green' onClick={onAddHandle}>
        <Icon name='plus' /> Add workflow
      </Button>
      {(selected || creating) && <Button icon labelPosition='left' size='mini' compact primary onClick={onSaveHandle}>
        <Icon name='disk' /> Save workflow
      </Button>
      }
      {selected && <Button icon labelPosition='left' size='mini' compact negative>
        <Icon name='disk' /> Delete workflow
      </Button>
      }
      <hr />
      <Container>
        <Row>
          <Col sm={4}>
            <WorkflowList />
          </Col>
          <Col sm={8}>
            {creating && <WorkflowEditor />}
            {!creating && selected && <WorkflowEditor id={selected} />}
            {!creating && selected == null && <div><Icon name='info' /><i> You have not neither selected a workflow nor created a new one yet!</i></div>}
          </Col>
        </Row>
      </Container>
    </Segment>
  </WorkflowContext.Provider>
}

export default WorkflowView;
