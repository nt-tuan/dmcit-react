import React, { Component } from 'react';
import MaterialTable from 'material-table';
import { Message } from 'semantic-ui-react';

export default class ReviewDepartment extends Component {
  constructor(props) {
    super(props);
    this.state = {
      data: props.data
    };
  }

  componentWillReceiveProps(nextProps) {
    this.setState({
      data: nextProps.data
    });
  }

  render() {
    return <div>
      <MaterialTable
        title="Danh sách phòng ban"
        tableRef={this.props.tableRef}
        columns={[
          { title: 'Mã', field: 'code' },
          { title: 'Tên bộ phận/ phòng ban', field: 'name' },
          {
            'title': 'Trực thuộc', render: rowData => {
              if (rowData.parentCode) {
                return <strong>{rowData.parentName}({rowData.parentCode})</strong>;
              }
              return null;
            }
          },
          {
            title: 'Quản lí', render: rowData => {
              return rowData.managerId;
            }
          },
          {
            title: "Lỗi", render: rowData => {
              const rs = [];
              rowData.messages.forEach((value, index) => {
                let color = null;
                if (value.type == "danger")
                  color = "red";
                else if (value.type == "warning")
                  color = "yellow";
                if (value.key != null && value.key.length > 0) {
                  rs.push(<Message key={index} color={color}><strong>{value.key}</strong>: {value.content}</Message>);
                } else {
                  rs.push(<Message key={index} color={color}>{value.content}</Message>);
                }
              });
              return <div>{rs}</div>
            }
          }
        ]}
        data={this.state.data}
        options={this.props.options}
      />
      <Message>
        <Message.Header>FILE_SUMARY</Message.Header>
        <Message.Item>Có tổng cộng: {this.state.data.length} hàng</Message.Item>
        <Message.Item>Có {this.state.data.filter(item => item.messages.length > 0 && item.messages.filter(u => u.type == "danger").length).length} lỗi</Message.Item>
        <Message.Item>Có {this.state.data.filter(item => item.messages.length > 0 && item.messages.filter(u => u.type == "warning").length).length} cảnh báo</Message.Item>
      </Message>
      </div>
  }
}
