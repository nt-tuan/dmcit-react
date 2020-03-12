import React, { useEffect, useState, useRef } from 'react';
import { workflowServices } from './services'
import { LayoutContext } from '../../containers/DefaultLayout/LayoutContext';
import { Layout, Menu, List } from 'antd'
import WorkflowSummaryItem from './WorkflowSummaryItem'
const { Content, Sider } = Layout;


function WorkflowList({ onItemClick }) {
  const [workflows, setWorkflows] = useState([]);
  const [selected, setSelected] = useState()
  const layout = React.useContext(LayoutContext);
  useEffect(() => {
    layout.showLoading();
    workflowServices.getWorkflows()
      .then(setWorkflows)
      .then(layout.showClear)
      .catch(layout.showError);
  }, []);

  const getBorderStyle = (u) => {
    return selected === u.id ? '6px solid #2196F3' : '6px solid #FFFFFFFF';
  }

  const renderItem = u => <List.Item onClick={() => {
    onItemClick && onItemClick(u.id);
    setSelected(u.id);
  }} key={u.id} style={{ cursor: 'pointer' }} style={{borderLeft: getBorderStyle(u), paddingLeft: '2px'}}>
    <List.Item.Meta
      title={`#${u.id} ${u.name}`}
      description={u.description}
    />
  </List.Item>


  return (
    <List
      itemLayout="horizontal"
      dataSource={workflows}
      renderItem={renderItem}
      style={{borderRight: '1px solid #2196F3'}}
    />
  );
}
/*<List divided selection>
        {workflows && workflows.map(u => {
          return <List.Item key={u.id} onClick={() => {
            onItemClick && onItemClick(u.id);
          }
          }>
            <List.Content>
              <List.Header as='a'>#{u.id} {u.name}</List.Header>
              <List.Description>{u.description}</List.Description>
            </List.Content>
          </List.Item>
        })}
      </List>*/

export default function WorkflowSummaryLists() {
  const [selected, setSelected] = useState();
  return <Layout style={{ background: '#fff', padding: '5px' }}>
    <Sider style={{ background: '#fff' }}>
      <WorkflowList onItemClick={setSelected} />
    </Sider>
    <Content style={{ margin: '0px 16px 0', background: '#fff' }}>
      {selected ? <WorkflowSummaryItem id={selected} /> : <div>No workflow selected</div>}
    </Content>
  </Layout>

}
