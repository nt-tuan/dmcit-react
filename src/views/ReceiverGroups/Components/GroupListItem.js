import React from 'react';
import { List, Button } from 'antd';
import {DeleteOutlined} from '@ant-design/icons';
export default function GroupListItem(props) {
  return (
    <List.Item
      actions={[
        <Button icon={<DeleteOutlined />} onClick={u => {
          props.onDelete && props.onDelete(props.value);
        }} size='small' />
      ]}
    >
      <List.Item.Meta
        title={props.value.name}
        description="group"
       />
    </List.Item>
  );
}
