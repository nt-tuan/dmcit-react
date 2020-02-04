import React from 'react';
import MaterialTable from 'material-table';
import { Link } from 'react-router-dom'
import Button from '@material-ui/core/Button'
class Customers extends React.Component {
  render() {
    return (
      <div>
      <div>
        <Button component={Link} to=''>
          Thêm
        </Button>
      </div>
      <MaterialTable
        title="Danh sách khách hàng"
        columns={[
          { title: 'Mã khách hàng', field: 'code' },
          { title: 'Tên đầy đủ', field: 'fullname' },
          { title: 'Tên rút gọn', field: 'shortname' },
          { title: 'Chi nhánh', field: 'distributor' }
        ]}
        data={query =>
          new Promise((resolve, reject) => {
            let url = '/api/message/customers';
            fetch(url)
              .then(response => response.json())
              .then(result => {                
                resolve({
                  data: result,
                  page: 0,
                  totalCount: result.length,
                });
              })
          })
        }
        />
        </div>
    )
  }
}

export default Customers;
