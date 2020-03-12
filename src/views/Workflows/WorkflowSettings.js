import React from 'react';
import { Segment, List } from 'semantic-ui-react';
import { workflowServices } from './services';
import { LayoutContext } from '../../containers/DefaultLayout/LayoutContext'

export default function WorkflowSetting() {
    const [jValue, setJValue] = React.useState();
    const layout = React.useContext(LayoutContext);
    React.useEffect(() => {
        layout.showLoading();
        workflowServices.getSetting()
            .then(json => setJValue(json))
            .then(layout.showClear())
            .catch(layout.showError);
    }, []);
    return <Segment>
        {jValue && <List divided selection>
            {Object.keys(jValue).map(u => <List.Item>
                <List.Content>
                    <strong>{u}:</strong> {jValue[u]}
                </List.Content>
            </List.Item>)}
        </List>}
    </Segment>
}
