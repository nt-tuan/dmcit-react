import React, {useState} from 'react';
import {Button, Icon, Accordion, Segment} from 'semantic-ui-react';
import {workflowServices} from './services';
import WorkflowItemContent from './WorkflowItemContent';
import AceEditor from 'react-ace';
import "ace-builds/src-noconflict/mode-json";
import "ace-builds/src-noconflict/theme-monokai";

export default function WorkflowItemView({match}){
  const [parameters, setParameters] = useState('{}');
  const { id } = match.params;
  const handleExecute = () => {
    workflowServices.startWorkflow({id, parameters: JSON.parse(parameters)});
  }

  return <div>
    <Button icon compact size='mini' onClick={handleExecute} labelPosition='left' primary>
      <Icon name='play' /> Run
    </Button>
    <Accordion panels={[{
      key: 'parameters',
      title: 'Parameters',
      content: {
        content: <AceEditor
          name="value"
          mode="json"
          theme="monokai"
          value={parameters}
          wrapEnabled={true}
          height="300px"
          width="100%"
          setOptions={{ useWorker: false }}
          onChange={setParameters} />
      }
    }]} />
    <WorkflowItemContent id={id} />
  </div>
}
