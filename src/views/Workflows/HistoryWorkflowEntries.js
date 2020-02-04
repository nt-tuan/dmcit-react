import React, { useState } from 'react';
import { LayoutContext } from '../../containers/DefaultLayout/LayoutContext';
import { workflowService } from '../../_services';
import { List, Button, Segment, Icon, Label } from 'semantic-ui-react'
import { history } from '../../_helpers/history';

const StatusLabel = ({ value }) => {
    const colorMap = () => {
        const t = value.toLowerCase();
        if (t == "done") return "green";
        if (t == "warning") return "yellow";
        if (t == "error") return "red";
        return "blue";
    };

    return <Label size="mini" color={colorMap()}>{value}</Label>
}

const HistoryEntryDetail = ({ logs, files }) => {
    return <div>
        {logs && logs.length > 0 && <div>
            <strong>Logs</strong>
            <List>
                {logs && logs.map(u => <List.Item>{u}</List.Item>)}
            </List>
        </div>}
        {files && files.length > 0 && <div>
            <strong>Files</strong>
            <List>
                {files && files.map(u => <List.Item>{u}</List.Item>)}
            </List>
            }
            </div>}
    </div>
}

export function HistoryWorkflowEntry({ id }) {
    if (id == null)
        return <p>No history entries selected</p>
}

export function HistoryWorkflowEntriesList() {
    const [data, setData] = useState([]);
    const [page, setPage] = useState(0);
    const [total, setTotal] = useState();
    const [selected, setSelected] = useState();
    const pageSize = 30;

    const layout = React.useContext(LayoutContext);
    function loadData(value) {
        layout.showLoading();
        workflowService.getHistoryWorkflowEntrys({ page: value, pageSize })
            .then(_ => {
                setData(_.data);
                setPage(_.page);
                setTotal(_.totalCount);
            })
            .then(layout.showClear)
            .catch(layout.showError);
    }
    function loadEntryDetail(id) {
        layout.showLoading();
        workflowService.getHistoryWorkflowEntry(id)
            .then(_ => {
                setSelected({ ..._, id });
            })
            .then(layout.showClear)
            .catch(layout.showError);
    }
    React.useEffect(() => {
        loadData();
    }, []);

    function inscreasePage() {
        loadData(page + 1);
    }
    function descreasePage() {
        if (page <= 0)
            return;
        loadData(page - 1);
    }

    if (data == null || data.length == 0 || total == 0)
        return <p>No history entries</p>

    const maxPage = Math.ceil(total / pageSize);
    const minPage = 1;
    console.log(maxPage);

    return <Segment>
        <List divided selection>
            {data.map(u => <List.Item key={u.id} onClick={() => loadEntryDetail(u.id)}>
                <List.Content>
                    <List.Header>{u.name}</List.Header>
                    {u.description}
                    <List.Description><StatusLabel value={u.status} /> - From: {u.startTime.toString()}, to: {u.statusTime.toString()}</List.Description>
                </List.Content>
                {selected && u.id === selected.id && <List.Content>
                    <HistoryEntryDetail logs={selected.logs} files={selected.files} />
                </List.Content>}
            </List.Item>)}
        </List>
        <Button.Group primary>
            <Button readOnly={minPage >= page + 1} onClick={descreasePage}>
                <Icon name="arrow left" />
            </Button>
            <Button>
                {page + 1}
            </Button>
            <Button disabled={maxPage <= page + 1} onClick={inscreasePage}>
                <Icon name='arrow right' />
            </Button>
        </Button.Group>
    </Segment>
}