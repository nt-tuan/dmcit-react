import React from 'react';
import { List, Card, Tab } from 'semantic-ui-react';
import { GeneralSetting, MessagingSetting, ServersSetting, AccountingPeriodsSetting } from './';

const panes = [
  { menuItem: 'General setting', render: () => <GeneralSetting fluid /> },
  { menuItem: 'Servers setting', render: () => <ServersSetting fluid /> },
  { menuItem: 'Message setting', render: () => <MessagingSetting fluid /> },
  { menuItem: 'Accounting', render: () =>
    <AccountingPeriodsSetting fluid />},
  {
    menuItem: 'To-do list', render: () => <Card fluid>
      <Card.Content>
        <Card.Header>
          Kế hoạch phát triển tương lai
        </Card.Header>
      </Card.Content>
      <Card.Content>
        <List divided relaxed selection>
          <List.Item>
            <List.Content>
              <List.Header><del>Sửa lỗi cập nhật thông tin user</del></List.Header>
            </List.Content>
          </List.Item>
          <List.Item>
            <List.Content>
              <List.Header><del>Sửa lỗi thay đổi mật khẩu user</del></List.Header>
            </List.Content>
          </List.Item>

          <List.Item>
            <List.Content>
              <List.Header>Sửa lỗi khóa tài khoản user</List.Header>
            </List.Content>
          </List.Item>

          <List.Item>
            <List.Content>
              <List.Header>Sửa lỗi liên kết user với thông tin cá nhân, phân biệt user là Nhân viên hoặc khách hàng</List.Header>
            </List.Content>
          </List.Item>

          <List.Item>
            <List.Content>
              <List.Header><del>Phân quyền cụ thể cho từng chức năng</del></List.Header>
            </List.Content>
          </List.Item>

          <List.Item>
            <List.Content>
              <List.Header>Ẩn các chức năng không có quyền truy cập</List.Header>
            </List.Content>
          </List.Item>

          <List.Item>
            <List.Content>
              <List.Header>Thêm cấu hình Settings cho hệ thống</List.Header>
            </List.Content>
          </List.Item>

          <List.Item>
            <List.Content>
              <List.Header>Di chuyển module quản trị thiết bị vào hệ thống</List.Header>
            </List.Content>
          </List.Item>

          <List.Item>
            <List.Content>
              <List.Header>Di chuyển module quản lí công việc I.T vào hệ thống</List.Header>
            </List.Content>
          </List.Item>

          <List.Item>
            <List.Content>
              <List.Header>Di chuyển module B.I Report vào hệ thống</List.Header>
            </List.Content>
          </List.Item>

          <List.Item>
            <List.Content>
              <List.Header>Dashboard IT - Asset, IT - Support, Sales</List.Header>
            </List.Content>
          </List.Item>

          <List.Item>
            <List.Content>
              <List.Header>Module forum nội bộ</List.Header>
            </List.Content>
          </List.Item>
        </List>
      </Card.Content>
    </Card>}
]

export default function Settings(props) {
  return (<div className="animated fadeIn">
    <Tab panes={panes} />
  </div>);
}
