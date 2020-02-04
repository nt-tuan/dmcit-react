import React, { Component } from 'react';
import MaterialTable from 'material-table';
import { Message } from 'semantic-ui-react';
import Moment from 'react-moment';

export default class ReviewEmployee extends Component {
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
        title="Danh sách nhân viên"
        tableRef={this.props.tableRef}
        columns={[
          {
            title: 'Mã',
            field: 'code'
          },
          {
            title: 'Họ',
            render: rowData => rowData.person?rowData.person.firstname:null
          },
          {
            title: 'Tên',
            render: rowData => rowData.person?rowData.person.lastname:null
          },
          {
            title: 'Tên nhân viên',
            render: rowData => rowData.person ? rowData.person.fullname:null
          },
          {
            title: 'Tên thường gọi',
            render: rowData => rowData.person ? rowData.person.displayname:null
          },
          {
            'title': 'Trực thuộc', render: rowData => {
              if (rowData.dept) {
                return <strong>{rowData.dept.name}({rowData.dept.code})</strong>;
              }
              return null;
            }
          }, {
            title: 'Ngày sinh', render: rowData => {
              if (rowData.person && rowData.person.birthday) {
                return <Moment date={rowData.person.birthday} format="DD/MM/YYYY" />
              }
            }
          },
          {
            title: 'Email', render: rowData => rowData.person ? rowData.person.email:null
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
