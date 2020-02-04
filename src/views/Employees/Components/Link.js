import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { HRApiService } from '../../../_services/hr';

export function EmployeeLink(props) {
  const [data, setData] = useState();
  useEffect(() => {
    HRApiService.employeeDetail(props.id)
      .then(json => {
        if (json.data)
          setData(json.data);
        else
          setData(null);
      }).catch(error => {
        setData(null);
      });
  }, [props.id]);

  if (data) {
    return <Link to={`/hr/employees/detail/${data.id}`}>{data.person.displayname}</Link>;
  }
  return null;
}
