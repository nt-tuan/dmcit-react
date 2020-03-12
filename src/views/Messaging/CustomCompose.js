import React, { useState } from 'react';
import { Button, Label } from 'semantic-ui-react';
import ProviderSelection from '../Receivers/Components/ProviderSelection';
import ReceiverSelection from '../Receivers/Components/ReceiverSelection';
import GroupSelection from '../ReceiverGroups/Components/GroupSelection';
import ReceiverList from './Components/ReceiverList';
import MyModal from '../Modals/MyModal';
import MaterialTable from 'material-table';
import { MyProgress } from '../Base/Progress/Progress';
import { MessagingServiceApi } from '../../_services/messaging';
import { LayoutContext } from '../../containers/DefaultLayout/LayoutContext';
import { alertActions } from '../../_actions';
import { Col, Row, Form, Input } from 'antd';

export default function CustomCompose(props) {
  const [content, setContent] = useState();
  const [providers, setProviders] = useState([]);
  const [receivers, setReceivers] = useState([]);
  const [modal, setModal] = useState({ open: false });
  const [lockSend, setLockSend] = useState(false);
  const [process, setProcess] = useState();
  const layoutContext = React.useContext(LayoutContext);

  function handleContentChange(e) {
    setContent(e.target.value);
  }
  function handleProvidersChange(e, { value, name }) {
    setProviders(value);
  }
  function handleDataChange(value) {
    if (value)
      setReceivers(value);
    else
      setReceivers([]);
  }
  function onReceiverChange(value) {
    if (value == null)
      return;
    const newValue = receivers.filter(v => v.id == value.id && v.type == 'receiver');

    if (newValue.length == 0) {
      const rs = [...receivers, { ...value, type: 'receiver' }];
      console.log(rs);
      setReceivers(rs);
    }
  }
  function onGroupChange(value) {
    if (value == null)
      return;
    const newValue = value.filter(u => receivers.filter(v => v.id == u.id && v.type == 'group').length == 0);

    setReceivers([...receivers, ...newValue.map(u => { return { ...u, type: 'group' }; })]);
  }

  function onCloseModal() {
    setModal({ open: false });
  }

  function getMyReceiver(type) {
    return receivers.filter(u => u.type == type).map(u => u.id);
  }

  function handleReviewReceiver() {
    if (receivers == null || receivers.length == 0) {
      layoutContext.alertDispatch(alertActions.error('NO RECEIVERS'));
      return;
    }

    if (providers == null || providers.length == 0) {
      layoutContext.alertDispatch(alertActions.error('NO PROVIDERS'));
      return;
    }

    let myReceiver = getMyReceiver('receiver');
    let myGroup = getMyReceiver('group');

    MessagingServiceApi.reviewReceivers({ receivers: myReceiver, groups: myGroup, providers })
      .then(json => {
        if (json && json.data) {
          const com = <MaterialTable
            columns={[{
              title: 'RECEIVER',
              render: (rowData) => {
                if (rowData && rowData.receiver) {
                  const u = rowData.receiver;
                  const cate = u.customerId ? 'CUSTOMER' : (u.employeeId ? 'EMPLOYEE' : 'OTHER');
                  const color = u.customerId ? 'green' : (u.employeeId ? 'blue' : 'yellow');
                  return (<div>{u.displayname}&emsp;<Label color={color} tag size="mini">{cate}</Label></div>);
                }
              }
            },
            {
              title: 'ADDRESS',
              field: 'receiverAddress'
            },
            {
              title: 'Providers',
              render: rowData => {
                return rowData.provider.name;
              }
            }
            ]}
            data={json.data}
            options={{
              search: false,
              paging: false,
              toolbar: false,
              showTitle: false
            }}
          />
          setModal({
            open: true,
            com,
            header: 'REVIEW RECEIVERS ADDRESS'
          });
        }
      })
      .catch(error => {
        layoutContext.alertDispatch(alertActions.error(error));
      });
  }

  function onSendMessage() {
    setLockSend(true);
    var postdata = {
      content,
      receivers: getMyReceiver('receiver'),
      providers: providers,
      groups: getMyReceiver('group')
    };

    MessagingServiceApi.sendCustomMessage(postdata)
      .then(json => {
        setProcess(<MyProgress id={json} />);
      })
      .catch(error => {
        layoutContext.alertDispatch(alertActions.error(error));
      });
  }

  return (
    <div>
      <MyModal open={modal.open} component={modal.com} onClose={onCloseModal} header={modal.header} />
      <Row>
        <Col flex="auto">
          <Form
            layout="vertical"
            size='small'
          >
            <ProviderSelection value={providers} multiple={true} onChange={handleProvidersChange} />
            <GroupSelection
              label='Nhóm người nhận'
              name='groups'
              search
              onRawChange={onGroupChange}
              multiple />
            <ReceiverSelection
              label='Người nhận'
              onRawChange={onReceiverChange} />
            <Form.Item label='Content'>
              <Input.TextArea onChange={handleContentChange} />
            </Form.Item>
            <Button primary onClick={handleReviewReceiver}>Preview</Button>
            <Button color='green' disabled={lockSend} onClick={onSendMessage}>SEND MESSAGE</Button>
            {process}
          </Form>
        </Col>
        <Col flex="300px" style={{ overflow: 'auto' }}>
          <div style={{ position: "absolute", left: '10px', right: 0, bottom: 0, top: 0 }}>
            <ReceiverList data={receivers} onDataChange={handleDataChange} />
          </div>
        </Col>
      </Row>
    </div>
  );
}
