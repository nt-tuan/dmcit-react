import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { HRApiService } from '../../../_services/hr';

export function DepartmentLink(props) {
  const [data, setData] = useState();
  useEffect(() => {
    HRApiService.departmentDetail(props.id)
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
    return <Link to={`/hr/departments/detail/${data.id}`}>{data.name}</Link>;
  }
  return null;
}
