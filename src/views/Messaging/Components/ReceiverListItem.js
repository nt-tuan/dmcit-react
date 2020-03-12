import React, { useEffect, useState } from 'react';
import { List, Button } from 'antd';
import {DeleteOutlined} from '@ant-design/icons';

export default function ReceiverListItem(props) {
  const [value, setValue] = useState();

  useEffect(() => {
    setValue(props.value);
  }, [props.value]);

  if (value == null)
    return null;

  const cate = value.customerId ? 'CUSTOMER' : (value.employeeId ? 'EMPLOYEE' : 'OTHER');
  const color = value.customerId ? 'green' : (value.employeeId ? 'blue' : 'yellow');

  return (
    <List.Item
      actions={[<Button icon={<DeleteOutlined />} 
        size="small" 
        onClick={u => { props.onDelete && props.onDelete(value); }} 
        color='red'></Button>]}
    >
      <List.Item.Meta
        title={value.displayname}
        description={cate}
      />
    </List.Item>
  );
}
