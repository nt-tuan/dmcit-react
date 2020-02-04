import React from 'react';
import { Button, Icon, Segment } from 'semantic-ui-react';
import {history} from '../../_helpers/history';
import WorkflowItemContent from './WorkflowItemContent';

export default function WorkflowSummaryItem({ id }) {
  const openDetail = () => {
    history.push({pathname: `/workflows/${id}`});
  }
  return (<Segment>
    <Button icon compact size="mini" labelPosition="left" onClick={openDetail} primary>
      <Icon name="magnify" /> Detail
      </Button>
    <WorkflowItemContent summary={true} id={id} />
  </Segment>);
}