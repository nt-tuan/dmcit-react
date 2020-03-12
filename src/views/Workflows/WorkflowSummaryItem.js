import React from 'react';
import { Button, Icon, Segment } from 'semantic-ui-react';
import {history} from '../../_helpers/history';
import WorkflowItemContent from './WorkflowItemContent';

export default function WorkflowSummaryItem({ id, name }) {
  return (<div>
    <WorkflowItemContent summary={true} id={id} />
  </div>);
}