import React, { useEffect, useState, useRef } from 'react';
import { workflowService } from '../../_services'
import { LayoutContext } from '../../containers/DefaultLayout/LayoutContext';
import { List, Segment, Header } from 'semantic-ui-react';
import { Container, Row, Col } from 'reactstrap';
import WorkflowSummaryItem from './WorkflowSummaryItem'


function WorkflowList({ onItemClick }) {
  const [workflows, setWorkflows] = useState([]);
  const layout = React.useContext(LayoutContext);
  useEffect(() => {
    layout.showLoading();
    workflowService.getWorkflows()
      .then(setWorkflows)
      .then(layout.showClear)
      .catch(layout.showError);
  }, []);
  return (
    <Segment>
      <Header as="h4">Working workflows</Header>
      <List divided selection>
        {workflows && workflows.map(u => {
          return <List.Item key={u.id} onClick={() => {
            onItemClick && onItemClick(u.id);
            console.log(u.id);
          }
          }>
            <List.Content>
              <List.Header as='a'>{u.name}</List.Header>
              <List.Description>{u.description}</List.Description>
            </List.Content>
          </List.Item>
        })}
      </List>
    </Segment>
  );
}

export default function WorkflowSummaryLists() {
  const [selected, setSelected] = useState();
  return <Container>
    <Row>
      <Col sm={4}>
        <WorkflowList onItemClick={setSelected} />
      </Col>
      <Col sm={8}>
        {selected ? <WorkflowSummaryItem id={selected} /> : <Segment>No workflow selected</Segment>}
      </Col>
    </Row>
  </Container>
}
